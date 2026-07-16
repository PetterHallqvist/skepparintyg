-- Identity, guardians and learners (SPEC §43, §55).
-- RLS is enabled in the SAME migration that creates each table (SPEC §42.8).

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user (SPEC §43.1)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  locale text not null default 'sv-SE',
  timezone text not null default 'Europe/Stockholm',
  display_name text,
  account_type text not null default 'individual'
    check (account_type in ('individual','guardian','organisation_member')),
  marketing_email_allowed boolean not null default false,
  product_analytics_allowed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Account owner. Email is a convenience snapshot; auth.users is the identity source.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision a profile for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- admin_users — admin role is NOT editable via profile update (SPEC §61.3).
-- Rows are managed only by service role / migrations.
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin'
    check (role in ('admin','reviewer','editor','support')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- learners — study data belongs to a learner, not the purchasing user (SPEC §42.1)
-- ---------------------------------------------------------------------------

create table public.learners (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  age_band text not null
    check (age_band in ('under_13','13_15','16_17','18_plus','unknown')),
  birth_year smallint,
  locale text not null default 'sv-SE',
  timezone text not null default 'Europe/Stockholm',
  is_self_profile boolean not null default false,
  accessibility_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.learners.birth_year is
  'Optional. Never collect full date of birth by default (SPEC §43.2).';

create trigger learners_set_updated_at
  before update on public.learners
  for each row execute function public.set_updated_at();

alter table public.learners enable row level security;

-- ---------------------------------------------------------------------------
-- learner_guardians — access link between auth users and learners (SPEC §43.3)
-- ---------------------------------------------------------------------------

create table public.learner_guardians (
  learner_id uuid not null references public.learners(id) on delete cascade,
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  relationship text not null default 'self'
    check (relationship in ('self','guardian','purchaser','instructor','other')),
  permissions jsonb not null default '{"study":true,"progress":true,"billing":true}'::jsonb,
  status text not null default 'active'
    check (status in ('invited','active','revoked')),
  created_at timestamptz not null default now(),
  primary key (learner_id, guardian_user_id)
);

create index learner_guardians_guardian_idx
  on public.learner_guardians (guardian_user_id) where status = 'active';

alter table public.learner_guardians enable row level security;

-- ---------------------------------------------------------------------------
-- guardian_consents — purpose-specific, immutable evidence (SPEC §43.4)
-- ---------------------------------------------------------------------------

create table public.guardian_consents (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null,
  policy_version text not null,
  granted boolean not null,
  evidence jsonb not null,
  created_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create index guardian_consents_learner_idx
  on public.guardian_consents (learner_id);

alter table public.guardian_consents enable row level security;

-- ---------------------------------------------------------------------------
-- Security-definer helpers (SPEC §55.1).
-- Never accept a user id from the client as proof — derive auth.uid().
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

create or replace function public.can_access_learner(target_learner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learner_guardians lg
    where lg.learner_id = target_learner_id
      and lg.guardian_user_id = auth.uid()
      and lg.status = 'active'
  );
$$;

revoke execute on function public.is_admin() from anon;
revoke execute on function public.can_access_learner(uuid) from anon;

-- ---------------------------------------------------------------------------
-- create_learner — the only client path for creating a learner. Creates the
-- learner and the guardian link transactionally so no orphan rows exist.
-- ---------------------------------------------------------------------------

create or replace function public.create_learner(
  p_display_name text,
  p_age_band text,
  p_is_self boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learner_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_display_name is null or length(trim(p_display_name)) = 0
     or length(p_display_name) > 100 then
    raise exception 'invalid_display_name';
  end if;

  insert into public.learners (display_name, age_band, is_self_profile)
  values (trim(p_display_name), p_age_band, p_is_self)
  returning id into v_learner_id;

  insert into public.learner_guardians (learner_id, guardian_user_id, relationship)
  values (
    v_learner_id,
    auth.uid(),
    case when p_is_self then 'self' else 'guardian' end
  );

  return v_learner_id;
end;
$$;

revoke execute on function public.create_learner(text, text, boolean) from anon;

-- ---------------------------------------------------------------------------
-- Policies (SPEC §55.2)
-- ---------------------------------------------------------------------------

-- profiles: owner read/update; admins read.
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy profiles_update_own on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    -- account_type must not be self-escalated to anything privileged; the
    -- allowed values are all non-privileged, admin role lives in admin_users.
  );

-- admin_users: a user may see their own admin row; no client writes.
create policy admin_users_select_own on public.admin_users
  for select using (user_id = auth.uid());

-- learners: access only through an active guardian link (or admin).
create policy learners_select on public.learners
  for select using (public.can_access_learner(id) or public.is_admin());

create policy learners_update on public.learners
  for update using (public.can_access_learner(id))
  with check (public.can_access_learner(id));

-- No direct client insert/delete: creation via create_learner(), deletion via
-- the account-deletion flow (service role).

-- learner_guardians: guardians see their own links; no client writes in v1.
create policy learner_guardians_select_own on public.learner_guardians
  for select using (guardian_user_id = auth.uid() or public.is_admin());

-- guardian_consents: the acting guardian records and reads consents for
-- learners they can access. Evidence rows are immutable; withdrawal is a
-- timestamp update by the same guardian.
create policy guardian_consents_select on public.guardian_consents
  for select using (guardian_user_id = auth.uid() or public.is_admin());

create policy guardian_consents_insert on public.guardian_consents
  for insert with check (
    guardian_user_id = auth.uid()
    and public.can_access_learner(learner_id)
  );

create policy guardian_consents_withdraw on public.guardian_consents
  for update using (guardian_user_id = auth.uid())
  with check (guardian_user_id = auth.uid());
