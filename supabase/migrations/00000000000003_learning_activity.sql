-- Learning activity: sessions, attempts, SRS/skill/objective state, felbok
-- (SPEC §48, §13.6). RLS inline.
--
-- WRITE MODEL (SPEC §58.2 server authority): learners/guardians can READ
-- their rows via can_access_learner(); there are NO client write policies.
-- All writes go through trusted server actions using the service role after
-- the caller's learner access has been verified with the caller's own client.

-- ---------------------------------------------------------------------------
-- study_sessions + session_activities (§48.1)
-- ---------------------------------------------------------------------------

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  certification_id text not null references public.certifications(id),
  mode text not null
    check (mode in ('daily','lesson','guided','practice','mastery','diagnostic','remediation','free')),
  plan_snapshot jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  device_class text,
  interruption_ms int not null default 0
);

create index study_sessions_learner_idx
  on public.study_sessions (learner_id, started_at desc);

create table public.session_activities (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  order_index int not null,
  activity_type text not null
    check (activity_type in ('review','lesson','worked_example','guided_task','independent_task','reflection')),
  entity_id uuid,
  objective_id text references public.objectives(id),
  status text not null default 'planned'
    check (status in ('planned','active','completed','skipped')),
  started_at timestamptz,
  finished_at timestamptz,
  unique (session_id, order_index)
);

alter table public.study_sessions enable row level security;
alter table public.session_activities enable row level security;

create policy study_sessions_read on public.study_sessions
  for select using (public.can_access_learner(learner_id));

create policy session_activities_read on public.session_activities
  for select using (
    exists (
      select 1 from public.study_sessions s
      where s.id = session_id and public.can_access_learner(s.learner_id)
    )
  );

-- ---------------------------------------------------------------------------
-- attempts + attempt_steps (§48.2–48.3)
-- ---------------------------------------------------------------------------

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null,
  item_version_id uuid not null references public.item_versions(id),
  context text not null
    check (context in ('lesson','guided','practice','mastery','diagnostic','simulation','free')),
  variant_seed text,
  item_snapshot jsonb not null,
  response jsonb not null,
  grade_result jsonb not null,
  correct boolean not null,
  score01 numeric(5,4) not null,
  independent boolean not null,
  hint_level int not null default 0,
  confidence text
    check (confidence is null or confidence in ('guessed','fairly_sure','very_sure')),
  active_latency_ms int,
  device_class text,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (learner_id, idempotency_key)
);

create index attempts_learner_created_idx
  on public.attempts (learner_id, created_at desc);
create index attempts_item_version_idx
  on public.attempts (item_version_id);

create table public.attempt_steps (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  step_index int not null,
  step_key text not null,
  response jsonb,
  correct boolean,
  hint_level int not null default 0,
  created_at timestamptz not null default now(),
  unique (attempt_id, step_index)
);

alter table public.attempts enable row level security;
alter table public.attempt_steps enable row level security;

create policy attempts_read on public.attempts
  for select using (public.can_access_learner(learner_id));

create policy attempt_steps_read on public.attempt_steps
  for select using (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and public.can_access_learner(a.learner_id)
    )
  );

-- ---------------------------------------------------------------------------
-- srs_state (§48.4) — template level so variants share memory state
-- ---------------------------------------------------------------------------

create table public.srs_state (
  learner_id uuid not null references public.learners(id) on delete cascade,
  item_template_id uuid not null references public.item_templates(id),
  fsrs_card jsonb not null,
  due_at timestamptz not null,
  last_attempt_id uuid references public.attempts(id),
  updated_at timestamptz not null default now(),
  primary key (learner_id, item_template_id)
);

create index srs_due_idx on public.srs_state (learner_id, due_at);

alter table public.srs_state enable row level security;

create policy srs_state_read on public.srs_state
  for select using (public.can_access_learner(learner_id));

-- ---------------------------------------------------------------------------
-- learner_skill_state (§48.5) + learner_objective_state / snapshots (§48.6)
-- ---------------------------------------------------------------------------

create table public.learner_skill_state (
  learner_id uuid not null references public.learners(id) on delete cascade,
  objective_id text not null references public.objectives(id),
  stage text not null
    check (stage in ('unseen','introduced','supported','independent','stable','needs_refresh')),
  evidence jsonb not null,
  last_independent_success_at timestamptz,
  due_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, objective_id)
);

alter table public.learner_skill_state enable row level security;

create policy skill_state_read on public.learner_skill_state
  for select using (public.can_access_learner(learner_id));

create table public.learner_objective_state (
  learner_id uuid not null references public.learners(id) on delete cascade,
  objective_id text not null references public.objectives(id),
  readiness_status text not null
    check (readiness_status in ('not_started','in_progress','ready','decayed')),
  score01 numeric(5,4) not null,
  evidence_summary jsonb not null,
  current_misconceptions text[] not null default '{}',
  last_evaluated_at timestamptz not null,
  primary key (learner_id, objective_id)
);

alter table public.learner_objective_state enable row level security;

create policy objective_state_read on public.learner_objective_state
  for select using (public.can_access_learner(learner_id));

create table public.readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  certification_id text not null references public.certifications(id),
  syllabus_version_id uuid not null references public.syllabus_versions(id),
  score int not null check (score between 0 and 100),
  label text not null,
  components jsonb not null,
  caps jsonb not null,
  algorithm_version text not null,
  created_at timestamptz not null default now()
);

create index readiness_snapshots_learner_idx
  on public.readiness_snapshots (learner_id, created_at desc);

alter table public.readiness_snapshots enable row level security;

create policy readiness_snapshots_read on public.readiness_snapshots
  for select using (public.can_access_learner(learner_id));

-- ---------------------------------------------------------------------------
-- felbok_entries (§13.6) — misconception-grouped error notebook.
-- Resolved only after two independent correct attempts on separate dates.
-- ---------------------------------------------------------------------------

create table public.felbok_entries (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  objective_id text not null references public.objectives(id),
  misconception_id text references public.misconceptions(id),
  error_tags text[] not null default '{}',
  status text not null default 'open'
    check (status in ('open','improving','resolved')),
  occurrences int not null default 1,
  last_attempt_id uuid references public.attempts(id),
  independent_successes_after jsonb not null default '[]'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique nulls not distinct (learner_id, objective_id, misconception_id)
);

alter table public.felbok_entries enable row level security;

create policy felbok_read on public.felbok_entries
  for select using (public.can_access_learner(learner_id));

-- ---------------------------------------------------------------------------
-- Sanitised challenge delivery (SPEC §58.3): learners fetch item payloads
-- WITHOUT answer keys through this definer function. Only live versions are
-- served here; staff use the studio.
-- ---------------------------------------------------------------------------

create or replace function public.get_challenge(p_item_version_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'itemVersionId', iv.id,
    'templateId', iv.template_id,
    'itemKind', it.item_kind,
    'stemSv', iv.stem_sv,
    'interaction', iv.interaction,
    'criticality', iv.criticality
  )
  from public.item_versions iv
  join public.item_templates it on it.id = iv.template_id
  where iv.id = p_item_version_id
    and iv.status = 'live'
    and auth.uid() is not null;
$$;

revoke execute on function public.get_challenge(uuid) from anon;
