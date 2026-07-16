-- Training simulations (SPEC §35, §50). Normalized exam sessions + per-item
-- rows. The SERVER is authoritative for the timer (started_at set by the DB) and
-- for one-final-submission (a pending→submitted transition guarded by a row
-- lock). Assembly and grading run in trusted server code (TS); the RPCs here
-- persist the session and finalize the result. RLS inline; grants inherit 0005.

-- ---------------------------------------------------------------------------
-- exam_blueprints (§35.2) — admin-authored; section quotas live in jsonb.
-- ---------------------------------------------------------------------------

create table public.exam_blueprints (
  id text primary key,
  title_sv text not null,
  certification_id text references public.certifications(id),
  duration_seconds int not null check (duration_seconds > 0),
  pass_threshold_bp int not null default 7500 check (pass_threshold_bp between 0 and 10000),
  -- [{id,title,objectiveTags[],count,isDiagnostic}] — validated in app code.
  sections jsonb not null default '[]'::jsonb,
  exposure_limit int not null default 5 check (exposure_limit >= 1),
  status text not null default 'draft' check (status in ('draft','active','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger exam_blueprints_set_updated_at
  before update on public.exam_blueprints
  for each row execute function public.set_updated_at();

alter table public.exam_blueprints enable row level security;

create policy exam_blueprints_read on public.exam_blueprints
  for select using (
    status = 'active' or public.has_role(array['admin','editor','support'])
  );
create policy exam_blueprints_admin_write on public.exam_blueprints
  for all using (public.has_role(array['admin','editor']))
  with check (public.has_role(array['admin','editor']));

-- ---------------------------------------------------------------------------
-- exam_sessions (§50) — one per attempt; timer + result are server-owned.
-- ---------------------------------------------------------------------------

create table public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  blueprint_id text not null references public.exam_blueprints(id),
  seed text not null,
  -- started_at is set by the RPC (now()) — the authoritative clock (§35.5).
  started_at timestamptz not null default now(),
  duration_seconds int not null,
  pass_threshold_bp int not null,
  status text not null default 'in_progress'
    check (status in ('in_progress','submitted','expired')),
  score_bp int,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index exam_sessions_learner_idx on public.exam_sessions (learner_id);

alter table public.exam_sessions enable row level security;

create policy exam_sessions_select on public.exam_sessions
  for select using (
    public.can_access_learner(learner_id) or public.has_role(array['admin','support'])
  );
-- No client insert/update: creation via start_exam_session, finalize via
-- finalize_exam_session (both SECURITY DEFINER).

create table public.exam_session_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  position int not null,
  section_id text not null,
  is_diagnostic boolean not null default false,
  item_ref text not null,
  response jsonb,
  flagged boolean not null default false,
  correct boolean,
  created_at timestamptz not null default now(),
  unique (session_id, position)
);

create index exam_session_items_session_idx
  on public.exam_session_items (session_id);

alter table public.exam_session_items enable row level security;

create policy exam_session_items_select on public.exam_session_items
  for select using (
    exists (
      select 1 from public.exam_sessions s
      where s.id = session_id
        and (public.can_access_learner(s.learner_id)
             or public.has_role(array['admin','support']))
    )
  );

-- Autosave: the learner may update their OWN answer/flag while the session is
-- still in progress. `with check` pins it so a submitted session is frozen.
create policy exam_session_items_autosave on public.exam_session_items
  for update using (
    exists (
      select 1 from public.exam_sessions s
      where s.id = session_id
        and public.can_access_learner(s.learner_id)
        and s.status = 'in_progress'
    )
  )
  with check (
    exists (
      select 1 from public.exam_sessions s
      where s.id = session_id
        and public.can_access_learner(s.learner_id)
        and s.status = 'in_progress'
    )
  );

-- ---------------------------------------------------------------------------
-- start_exam_session — creates the session + item rows transactionally. The
-- caller (server action) assembled the items; started_at is the DB clock.
-- ---------------------------------------------------------------------------

create or replace function public.start_exam_session(
  p_learner_id uuid,
  p_blueprint_id text,
  p_seed text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bp public.exam_blueprints%rowtype;
  v_session_id uuid;
  v_item jsonb;
  v_pos int := 0;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not public.can_access_learner(p_learner_id) then
    raise exception 'learner_not_accessible';
  end if;

  select * into v_bp from public.exam_blueprints where id = p_blueprint_id;
  if v_bp.id is null or v_bp.status <> 'active' then
    raise exception 'blueprint_not_available';
  end if;

  insert into public.exam_sessions
    (learner_id, blueprint_id, seed, duration_seconds, pass_threshold_bp)
  values
    (p_learner_id, p_blueprint_id, p_seed, v_bp.duration_seconds, v_bp.pass_threshold_bp)
  returning id into v_session_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into public.exam_session_items
      (session_id, position, section_id, is_diagnostic, item_ref)
    values
      (v_session_id, v_pos, v_item->>'sectionId',
       coalesce((v_item->>'isDiagnostic')::boolean, false), v_item->>'itemRef');
    v_pos := v_pos + 1;
  end loop;

  return v_session_id;
end;
$$;

revoke execute on function public.start_exam_session(uuid, text, text, jsonb) from anon;

-- ---------------------------------------------------------------------------
-- finalize_exam_session — records the graded result ONCE. The status lock is
-- the one-final-submission guard: a second call raises already_submitted.
-- Grading itself happens in trusted server code (answer keys never touch SQL).
-- ---------------------------------------------------------------------------

create or replace function public.finalize_exam_session(
  p_session_id uuid,
  p_scored jsonb,
  p_score_bp int,
  p_expired boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.exam_sessions%rowtype;
  v_row jsonb;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;

  select * into v_session from public.exam_sessions
  where id = p_session_id for update;
  if v_session.id is null or not public.can_access_learner(v_session.learner_id) then
    raise exception 'session_not_found';
  end if;
  if v_session.status <> 'in_progress' then
    raise exception 'already_submitted';
  end if;

  update public.exam_sessions
     set status = case when p_expired then 'expired' else 'submitted' end,
         score_bp = p_score_bp,
         submitted_at = now()
   where id = p_session_id;

  for v_row in select * from jsonb_array_elements(p_scored) loop
    update public.exam_session_items
       set correct = (v_row->>'correct')::boolean,
           response = v_row->'response'
     where session_id = p_session_id
       and position = (v_row->>'position')::int;
  end loop;

  return jsonb_build_object('status', 'finalized', 'score_bp', p_score_bp);
end;
$$;

revoke execute on function public.finalize_exam_session(uuid, jsonb, int, boolean) from anon;
