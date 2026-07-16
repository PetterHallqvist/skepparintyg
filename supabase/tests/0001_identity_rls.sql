-- RLS matrix tests for identity tables (SPEC §55.3).
-- Run with: supabase test db   (requires the local stack / CI Docker)
begin;

create extension if not exists pgtap with schema extensions;

select plan(12);

-- ---------------------------------------------------------------------------
-- Fixtures: two auth users. Profiles are created by the on_auth_user_created
-- trigger.
-- ---------------------------------------------------------------------------

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-00000000000a', 'user-a@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'user-b@example.test');

select is(
  (select count(*)::int from public.profiles
    where id in ('00000000-0000-0000-0000-00000000000a',
                 '00000000-0000-0000-0000-00000000000b')),
  2,
  'trigger provisions one profile per auth user'
);

-- ---------------------------------------------------------------------------
-- Impersonation helpers
-- ---------------------------------------------------------------------------

create or replace function test_login(user_id uuid) returns void
language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', user_id::text, 'role', 'authenticated')::text,
    true
  );
end;
$$;

create or replace function test_anon() returns void
language plpgsql as $$
begin
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
end;
$$;

-- Attempts an unrestricted UPDATE and returns the affected row count. Defined
-- here as the owner (before any role switch) — an authenticated user has no
-- CREATE on schema public — but SECURITY INVOKER means the UPDATE inside runs
-- as whatever role calls it, so RLS still applies to the caller.
create or replace function test_b_update_attempt() returns int
language plpgsql as $$
declare v int;
begin
  update public.learners set display_name = 'Kapad' where true;
  get diagnostics v = row_count;
  return v;
end;
$$;

-- ---------------------------------------------------------------------------
-- User A creates a learner through the RPC
-- ---------------------------------------------------------------------------

select test_login('00000000-0000-0000-0000-00000000000a');

select lives_ok(
  $$ select public.create_learner('Elev A', '13_15', false) $$,
  'user A can create a learner via create_learner()'
);

reset role;
select is(
  (select count(*)::int from public.learner_guardians
    where guardian_user_id = '00000000-0000-0000-0000-00000000000a'),
  1,
  'create_learner links the creating guardian transactionally'
);

-- Learner id for later assertions
create temporary table t_ctx as
select lg.learner_id
from public.learner_guardians lg
where lg.guardian_user_id = '00000000-0000-0000-0000-00000000000a';

-- ---------------------------------------------------------------------------
-- Owner access
-- ---------------------------------------------------------------------------

select test_login('00000000-0000-0000-0000-00000000000a');

select is(
  (select count(*)::int from public.learners),
  1,
  'guardian A sees exactly their linked learner'
);

select is(
  (select count(*)::int from public.profiles),
  1,
  'A sees only their own profile'
);

-- ---------------------------------------------------------------------------
-- Cross-user isolation: B sees nothing of A (SPEC §55.3 case 1)
-- ---------------------------------------------------------------------------

select test_login('00000000-0000-0000-0000-00000000000b');

select is(
  (select count(*)::int from public.learners),
  0,
  'user B cannot read user A''s learner'
);

select is(
  (select count(*)::int from public.learner_guardians),
  0,
  'user B cannot read A''s guardian links'
);

select is(
  (select count(*)::int from public.profiles
    where id = '00000000-0000-0000-0000-00000000000a'),
  0,
  'user B cannot read A''s profile'
);

select is(
  (select count(*)::int
     from public.learners
    where public.can_access_learner(id)),
  0,
  'can_access_learner denies B regardless of client-sent ids'
);

-- B cannot update A's learner (0 rows affected through RLS). The helper is
-- defined up top as the owner; here we only call it while impersonating B.
select is(test_b_update_attempt(), 0, 'user B cannot update A''s learner');

-- ---------------------------------------------------------------------------
-- Anonymous sees nothing (SPEC §55.3 case 5)
-- ---------------------------------------------------------------------------

select test_anon();

select is(
  (select count(*)::int from public.learners),
  0,
  'anonymous user sees no learners'
);

-- ---------------------------------------------------------------------------
-- Revoked guardian loses access immediately (SPEC §55.3 case 3)
-- ---------------------------------------------------------------------------

reset role;
update public.learner_guardians
   set status = 'revoked'
 where guardian_user_id = '00000000-0000-0000-0000-00000000000a';

select test_login('00000000-0000-0000-0000-00000000000a');

select is(
  (select count(*)::int from public.learners),
  0,
  'revoked guardian loses learner access immediately'
);

select * from finish();
rollback;
