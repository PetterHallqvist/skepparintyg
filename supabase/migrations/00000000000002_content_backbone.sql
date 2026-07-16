-- Content backbone: certifications, sources, syllabus, objectives, lessons,
-- items, misconceptions, media, review/audit/issues (SPEC §44–47, §39, §3.3).
-- RLS inline (SPEC §42.8). Learners NEVER select item_versions directly —
-- answer_key stays server-side (SPEC §58.3); challenges are served by
-- security-definer RPCs added in Phase 2.

-- ---------------------------------------------------------------------------
-- Role helper (staff roles live in admin_users, never in profiles — §61.3)
-- ---------------------------------------------------------------------------

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
      and au.role = any(roles)
  );
$$;

revoke execute on function public.has_role(text[]) from anon;

-- ---------------------------------------------------------------------------
-- certifications (§44.1) — public reference data
-- ---------------------------------------------------------------------------

create table public.certifications (
  id text primary key,
  name_sv text not null,
  short_name_sv text not null,
  description_sv text not null,
  issuing_body text,
  active boolean not null default false,
  practical_component boolean not null default false,
  official_url text,
  created_at timestamptz not null default now()
);

alter table public.certifications enable row level security;

create policy certifications_public_read on public.certifications
  for select using (true);

create policy certifications_admin_write on public.certifications
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- certification_prerequisites (§44.2) — uuid PK + rule hash (jsonb PK awkward)
-- ---------------------------------------------------------------------------

create table public.certification_prerequisites (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id),
  prerequisite_certification_id text references public.certifications(id),
  prerequisite_type text not null
    check (prerequisite_type in ('certificate','age','practical','simulator','other')),
  rule jsonb not null,
  rule_hash text generated always as (md5(rule::text)) stored,
  source_document_id uuid,
  valid_from date,
  valid_to date,
  unique (certification_id, prerequisite_type, rule_hash)
);

alter table public.certification_prerequisites enable row level security;

create policy cert_prereq_public_read on public.certification_prerequisites
  for select using (true);

create policy cert_prereq_admin_write on public.certification_prerequisites
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- source_documents (§44.3) — internal; respect copyright (§44.3 note)
-- ---------------------------------------------------------------------------

create table public.source_documents (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  title text not null,
  issuer text not null,
  canonical_url text not null,
  document_version text,
  effective_from date,
  effective_to date,
  retrieved_at timestamptz not null,
  content_sha256 text,
  local_storage_path text,
  copyright_notes text,
  permitted_uses text,
  status text not null default 'active'
    check (status in ('active','superseded','unavailable','review_required')),
  last_checked_at timestamptz not null,
  next_review_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.source_documents enable row level security;

create policy sources_staff_read on public.source_documents
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy sources_admin_write on public.source_documents
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- syllabus_versions (§44.4)
-- ---------------------------------------------------------------------------

create table public.syllabus_versions (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id),
  source_document_id uuid not null references public.source_documents(id),
  name text not null,
  effective_from date,
  effective_to date,
  status text not null default 'draft'
    check (status in ('draft','review','active','superseded')),
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  change_summary text,
  created_at timestamptz not null default now()
);

create unique index one_active_syllabus_per_certification
  on public.syllabus_versions (certification_id)
  where status = 'active';

alter table public.syllabus_versions enable row level security;

create policy syllabus_staff_read on public.syllabus_versions
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy syllabus_admin_write on public.syllabus_versions
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- official_facts (§44.5) — active facts are public, date-stamped
-- ---------------------------------------------------------------------------

create table public.official_facts (
  id uuid primary key default gen_random_uuid(),
  certification_id text references public.certifications(id),
  fact_key text not null,
  value jsonb not null,
  public_copy_sv text,
  source_document_id uuid not null references public.source_documents(id),
  valid_from date,
  valid_to date,
  verified_at timestamptz not null,
  verified_by uuid references public.profiles(id),
  status text not null default 'active'
    check (status in ('draft','active','superseded','review_required')),
  unique nulls not distinct (certification_id, fact_key, valid_from)
);

alter table public.official_facts enable row level security;

create policy facts_public_read_active on public.official_facts
  for select using (
    status in ('active','review_required')
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy facts_admin_write on public.official_facts
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- objectives (§45.1; types §14.2; criticality §14.4)
-- Deviation from §45.1 status list: adds 'review_required' — required by the
-- §3.3 change-monitoring workflow ("mark affected objectives review_required").
-- ---------------------------------------------------------------------------

create table public.objectives (
  id text primary key,
  syllabus_version_id uuid not null references public.syllabus_versions(id),
  parent_id text references public.objectives(id),
  section_key text not null,
  order_index int not null,
  title_sv text not null,
  outcome_sv text not null,
  objective_type text not null
    check (objective_type in
      ('fact','concept','rule','procedure','perceptual','scenario','practical_prep')),
  criticality text not null
    check (criticality in ('informational','standard','important','safety_critical')),
  weight numeric(6,3) not null default 1,
  required boolean not null default true,
  status text not null default 'draft'
    check (status in ('draft','review','active','review_required','retired')),
  created_at timestamptz not null default now()
);

create index objectives_syllabus_idx on public.objectives (syllabus_version_id, section_key, order_index);

alter table public.objectives enable row level security;

create policy objectives_learner_read_active on public.objectives
  for select using (
    (status in ('active','review_required') and auth.uid() is not null)
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy objectives_admin_write on public.objectives
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- objective_prerequisites (§45.2) + DAG cycle guard (§45.2 note)
-- ---------------------------------------------------------------------------

create table public.objective_prerequisites (
  objective_id text not null references public.objectives(id) on delete cascade,
  prerequisite_objective_id text not null references public.objectives(id),
  strength text not null default 'required'
    check (strength in ('recommended','required')),
  primary key (objective_id, prerequisite_objective_id),
  check (objective_id <> prerequisite_objective_id)
);

alter table public.objective_prerequisites enable row level security;

create policy obj_prereq_learner_read on public.objective_prerequisites
  for select using (auth.uid() is not null);

create policy obj_prereq_admin_write on public.objective_prerequisites
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

create or replace function public.check_objective_prerequisite_cycle()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if exists (
    with recursive chain as (
      select new.prerequisite_objective_id as node
      union
      select op.prerequisite_objective_id
      from public.objective_prerequisites op
      join chain c on op.objective_id = c.node
    )
    select 1 from chain where node = new.objective_id
  ) then
    raise exception 'objective_prerequisite_cycle: % -> %',
      new.objective_id, new.prerequisite_objective_id;
  end if;
  return new;
end;
$$;

create trigger objective_prerequisites_no_cycles
  before insert or update on public.objective_prerequisites
  for each row execute function public.check_objective_prerequisite_cycle();

-- ---------------------------------------------------------------------------
-- objective_sources (§45.3)
-- ---------------------------------------------------------------------------

create table public.objective_sources (
  objective_id text not null references public.objectives(id) on delete cascade,
  source_document_id uuid not null references public.source_documents(id),
  locator text not null,
  source_excerpt_internal text,
  primary key (objective_id, source_document_id, locator)
);

alter table public.objective_sources enable row level security;

create policy obj_sources_staff_read on public.objective_sources
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy obj_sources_admin_write on public.objective_sources
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- lessons + lesson_versions (§45.4) — live versions immutable
-- ---------------------------------------------------------------------------

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id),
  slug text not null,
  status text not null default 'draft'
    check (status in ('draft','review','approved','live','review_required','retired')),
  current_version_id uuid,
  created_at timestamptz not null default now(),
  unique (certification_id, slug)
);

create table public.lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  version int not null,
  title_sv text not null,
  lead_sv text,
  estimated_minutes int,
  content_blocks jsonb not null,
  accessibility_summary text,
  status text not null default 'draft'
    check (status in ('draft','review','approved','live','review_required','retired')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (lesson_id, version)
);

alter table public.lessons
  add constraint lessons_current_version_fk
  foreign key (current_version_id) references public.lesson_versions(id);

alter table public.lessons enable row level security;
alter table public.lesson_versions enable row level security;

create policy lessons_learner_read on public.lessons
  for select using (
    (status = 'live' and auth.uid() is not null)
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy lessons_admin_write on public.lessons
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- Learners read only live lesson versions. Entitlement predicate is added in
-- Phase 6 (has_active_entitlement); until commerce exists, auth-gating is the
-- v0 boundary and free content flows through public pools.
create policy lesson_versions_learner_read_live on public.lesson_versions
  for select using (
    (status = 'live' and auth.uid() is not null)
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy lesson_versions_admin_write on public.lesson_versions
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

create table public.lesson_objectives (
  lesson_version_id uuid not null references public.lesson_versions(id) on delete cascade,
  objective_id text not null references public.objectives(id),
  role text not null check (role in ('primary','secondary','prerequisite')),
  primary key (lesson_version_id, objective_id, role)
);

alter table public.lesson_objectives enable row level security;

create policy lesson_objectives_read on public.lesson_objectives
  for select using (auth.uid() is not null);

create policy lesson_objectives_admin_write on public.lesson_objectives
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

create table public.lesson_sources (
  lesson_version_id uuid not null references public.lesson_versions(id) on delete cascade,
  source_document_id uuid not null references public.source_documents(id),
  locator text not null,
  primary key (lesson_version_id, source_document_id, locator)
);

alter table public.lesson_sources enable row level security;

create policy lesson_sources_staff_read on public.lesson_sources
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy lesson_sources_admin_write on public.lesson_sources
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- item_templates + item_versions (§46.1; kinds §19.1)
-- item_versions carry answer keys: staff-only RLS, no learner policy at all.
-- ---------------------------------------------------------------------------

create table public.item_templates (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  certification_id text not null references public.certifications(id),
  item_kind text not null
    check (item_kind in (
      'single_choice','multiple_select','true_false','numeric',
      'short_text_normalised','ordering','matching','image_hotspot',
      'chart_interaction','scenario_choice','sequence_builder',
      'audio_identification','spoken_sequence','calculation_steps'
    )),
  status text not null default 'draft'
    check (status in ('draft','review','approved','live','review_required','retired')),
  current_version_id uuid,
  created_at timestamptz not null default now()
);

create table public.item_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.item_templates(id) on delete cascade,
  version int not null,
  syllabus_version_id uuid not null references public.syllabus_versions(id),
  stem_sv text,
  interaction jsonb not null,
  answer_key jsonb not null,
  grading_policy jsonb not null,
  explanation_sv text not null,
  worked_solution jsonb,
  difficulty_estimate numeric(7,2) not null default 1500,
  criticality text not null
    check (criticality in ('informational','standard','important','safety_critical')),
  accessibility_alternative jsonb,
  generation_provenance jsonb,
  status text not null default 'draft'
    check (status in ('draft','review','approved','live','review_required','retired')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (template_id, version)
);

alter table public.item_templates
  add constraint item_templates_current_version_fk
  foreign key (current_version_id) references public.item_versions(id);

create index item_versions_status_idx on public.item_versions (status);
create index item_versions_template_idx on public.item_versions (template_id, version desc);

alter table public.item_templates enable row level security;
alter table public.item_versions enable row level security;

create policy item_templates_staff_read on public.item_templates
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy item_templates_admin_write on public.item_templates
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- STAFF ONLY. Learner challenge delivery happens via sanitising RPCs (Phase 2).
create policy item_versions_staff_read on public.item_versions
  for select using (public.has_role(array['admin','editor','reviewer','support']));

create policy item_versions_admin_write on public.item_versions
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- item relations (§46.2)
-- ---------------------------------------------------------------------------

create table public.item_objectives (
  item_version_id uuid not null references public.item_versions(id) on delete cascade,
  objective_id text not null references public.objectives(id),
  role text not null check (role in ('primary','secondary')),
  primary key (item_version_id, objective_id)
);

create table public.item_sources (
  item_version_id uuid not null references public.item_versions(id) on delete cascade,
  source_document_id uuid not null references public.source_documents(id),
  locator text not null,
  primary key (item_version_id, source_document_id, locator)
);

create table public.misconceptions (
  id text primary key,
  certification_id text references public.certifications(id),
  title_sv text not null,
  explanation_sv text not null,
  remediation_lesson_id uuid references public.lessons(id),
  severity text not null default 'standard'
    check (severity in ('standard','high_risk','safety_critical'))
);

create table public.item_misconceptions (
  item_version_id uuid not null references public.item_versions(id) on delete cascade,
  answer_key text not null,
  misconception_id text not null references public.misconceptions(id),
  primary key (item_version_id, answer_key, misconception_id)
);

alter table public.item_objectives enable row level security;
alter table public.item_sources enable row level security;
alter table public.misconceptions enable row level security;
alter table public.item_misconceptions enable row level security;

create policy item_objectives_staff on public.item_objectives
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

create policy item_sources_staff on public.item_sources
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

create policy misconceptions_staff on public.misconceptions
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

create policy item_misconceptions_staff on public.item_misconceptions
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- media (§46.3)
-- ---------------------------------------------------------------------------

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type text not null,
  title text,
  alt_sv text,
  transcript_sv text,
  creator text,
  licence text not null,
  licence_proof_path text,
  export_allowed boolean not null default false,
  public_allowed boolean not null default false,
  sha256 text not null,
  status text not null default 'review'
    check (status in ('review','approved','retired')),
  created_at timestamptz not null default now()
);

create table public.item_media (
  item_version_id uuid not null references public.item_versions(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id),
  role text not null,
  primary key (item_version_id, media_asset_id, role)
);

alter table public.media_assets enable row level security;
alter table public.item_media enable row level security;

create policy media_staff on public.media_assets
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

create policy item_media_staff on public.item_media
  for all using (public.has_role(array['admin','editor','reviewer','support']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- free pools (§46.4) — join table, not a boolean on versions
-- ---------------------------------------------------------------------------

create table public.public_item_pools (
  id uuid primary key default gen_random_uuid(),
  pool_key text not null unique,
  status text not null default 'draft'
    check (status in ('draft','live','retired'))
);

create table public.public_item_pool_entries (
  pool_id uuid not null references public.public_item_pools(id) on delete cascade,
  item_version_id uuid not null references public.item_versions(id),
  order_index int,
  primary key (pool_id, item_version_id)
);

alter table public.public_item_pools enable row level security;
alter table public.public_item_pool_entries enable row level security;

create policy pools_public_read_live on public.public_item_pools
  for select using (
    status = 'live' or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy pools_admin_write on public.public_item_pools
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

create policy pool_entries_public_read on public.public_item_pool_entries
  for select using (
    exists (
      select 1 from public.public_item_pools p
      where p.id = pool_id and p.status = 'live'
    )
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy pool_entries_admin_write on public.public_item_pool_entries
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- review, issues, audit (§47)
-- ---------------------------------------------------------------------------

create table public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('item','lesson','objective','media','chart','fact')),
  entity_version_id uuid not null,
  review_type text not null
    check (review_type in ('domain','editorial','accessibility','media','legal')),
  reviewer_user_id uuid not null references public.profiles(id),
  decision text not null check (decision in ('approve','changes_requested','reject')),
  comments text,
  rubric jsonb,
  created_at timestamptz not null default now()
);

create index review_decisions_entity_idx
  on public.review_decisions (entity_type, entity_version_id);

alter table public.review_decisions enable row level security;

create policy reviews_staff_read on public.review_decisions
  for select using (public.has_role(array['admin','editor','reviewer','support']));

-- Reviewers insert decisions AS THEMSELVES only; decisions are immutable.
create policy reviews_insert_self on public.review_decisions
  for insert with check (
    reviewer_user_id = auth.uid()
    and public.has_role(array['admin','reviewer'])
  );

create table public.content_issues (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references public.profiles(id),
  learner_id uuid references public.learners(id) on delete set null,
  entity_type text not null,
  entity_version_id uuid,
  attempt_id uuid,
  category text not null,
  description text,
  severity text not null default 'untriaged'
    check (severity in ('untriaged','minor','major','blocker','safety')),
  status text not null default 'open'
    check (status in ('open','triaged','in_progress','resolved','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.content_issues enable row level security;

create policy issues_insert_authenticated on public.content_issues
  for insert with check (
    auth.uid() is not null and reporter_user_id = auth.uid()
  );

create policy issues_read_own_or_staff on public.content_issues
  for select using (
    reporter_user_id = auth.uid()
    or public.has_role(array['admin','editor','reviewer','support'])
  );

create policy issues_staff_update on public.content_issues
  for update using (public.has_role(array['admin','editor','support']))
  with check (public.has_role(array['admin','editor','support']));

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.profiles(id),
  actor_type text not null default 'user'
    check (actor_type in ('user','service','system')),
  action text not null,
  entity_type text,
  entity_id text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  request_id text,
  ip_hash text,
  created_at timestamptz not null default now()
);

alter table public.audit_events enable row level security;

create policy audit_admin_read on public.audit_events
  for select using (public.has_role(array['admin']));

-- No client insert policy: writes go through log_audit().

create or replace function public.log_audit(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_before jsonb default null,
  p_after jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_events
    (actor_user_id, actor_type, action, entity_type, entity_id, before_snapshot, after_snapshot)
  values
    (auth.uid(), case when auth.uid() is null then 'service' else 'user' end,
     p_action, p_entity_type, p_entity_id, p_before, p_after);
end;
$$;

revoke execute on function public.log_audit(text, text, text, jsonb, jsonb) from anon;

-- ---------------------------------------------------------------------------
-- Publish gates (M1 DoD: content cannot become live without approvals;
-- §8.3 safety-critical needs two reviewers; live versions immutable)
-- ---------------------------------------------------------------------------

create or replace function public.assert_publish_gate(
  p_entity_type text,
  p_version_id uuid,
  p_criticality text,
  p_has_source boolean
)
returns void
language plpgsql
set search_path = public
as $$
declare
  v_domain int;
  v_editorial int;
  v_reviewers int;
begin
  if not p_has_source then
    raise exception 'publish_gate: % % saknar källa (source + locator krävs)',
      p_entity_type, p_version_id;
  end if;

  select
    count(*) filter (where review_type = 'domain' and decision = 'approve'),
    count(*) filter (where review_type = 'editorial' and decision = 'approve'),
    count(distinct reviewer_user_id) filter (where decision = 'approve')
  into v_domain, v_editorial, v_reviewers
  from public.review_decisions
  where entity_type = p_entity_type
    and entity_version_id = p_version_id;

  if v_domain < 1 then
    raise exception 'publish_gate: % % saknar godkänd domängranskning',
      p_entity_type, p_version_id;
  end if;
  if v_editorial < 1 then
    raise exception 'publish_gate: % % saknar godkänd redaktionell granskning',
      p_entity_type, p_version_id;
  end if;
  if p_criticality = 'safety_critical' and v_reviewers < 2 then
    raise exception 'publish_gate: säkerhetskritiskt innehåll kräver två granskare (% %)',
      p_entity_type, p_version_id;
  end if;
end;
$$;

create or replace function public.item_versions_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Immutability: live content fields never change (§42.2).
  if old.status = 'live' then
    if new.stem_sv is distinct from old.stem_sv
       or new.interaction is distinct from old.interaction
       or new.answer_key is distinct from old.answer_key
       or new.grading_policy is distinct from old.grading_policy
       or new.explanation_sv is distinct from old.explanation_sv
       or new.worked_solution is distinct from old.worked_solution then
      raise exception 'immutable_live_version: skapa en ny version i stället';
    end if;
    if new.status not in ('live','review_required','retired') then
      raise exception 'invalid_transition: live kan endast bli review_required/retired';
    end if;
  end if;

  if new.status = 'live' and old.status is distinct from 'live' then
    perform public.assert_publish_gate(
      'item',
      new.id,
      new.criticality,
      exists (select 1 from public.item_sources s where s.item_version_id = new.id)
    );
    new.published_at := coalesce(new.published_at, now());
  end if;

  return new;
end;
$$;

create trigger item_versions_guard
  before update on public.item_versions
  for each row execute function public.item_versions_guard();

create or replace function public.lesson_versions_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.status = 'live' then
    if new.title_sv is distinct from old.title_sv
       or new.lead_sv is distinct from old.lead_sv
       or new.content_blocks is distinct from old.content_blocks then
      raise exception 'immutable_live_version: skapa en ny version i stället';
    end if;
    if new.status not in ('live','review_required','retired') then
      raise exception 'invalid_transition: live kan endast bli review_required/retired';
    end if;
  end if;

  if new.status = 'live' and old.status is distinct from 'live' then
    perform public.assert_publish_gate(
      'lesson',
      new.id,
      'standard',
      exists (select 1 from public.lesson_sources s where s.lesson_version_id = new.id)
    );
    new.published_at := coalesce(new.published_at, now());
  end if;

  return new;
end;
$$;

create trigger lesson_versions_guard
  before update on public.lesson_versions
  for each row execute function public.lesson_versions_guard();

-- ---------------------------------------------------------------------------
-- Source-change monitoring (§3.3): a changed/flagged source marks dependent
-- objectives review_required and opens an admin alert. Never auto-unpublishes.
-- ---------------------------------------------------------------------------

create or replace function public.source_documents_changed()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_objectives int;
begin
  if (new.content_sha256 is distinct from old.content_sha256)
     or (new.status = 'review_required' and old.status is distinct from 'review_required') then

    update public.objectives o
       set status = 'review_required'
     where o.status in ('active','review')
       and exists (
         select 1 from public.objective_sources os
         where os.objective_id = o.id
           and os.source_document_id = new.id
       );
    get diagnostics v_objectives = row_count;

    insert into public.content_issues
      (entity_type, entity_version_id, category, description, severity, status)
    values
      ('source', new.id, 'source_change',
       format('Källan "%s" har ändrats/flaggats. %s mål markerade review_required. Innehåll avpubliceras INTE automatiskt (§3.3).',
              new.source_key, v_objectives),
       'major', 'open');
  end if;
  return new;
end;
$$;

create trigger source_documents_changed
  after update on public.source_documents
  for each row execute function public.source_documents_changed();
