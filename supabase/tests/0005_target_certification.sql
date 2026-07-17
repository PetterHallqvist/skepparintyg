-- Learner target certification (SPEC §12.2, phase 9). Proves the column
-- exists with its FK and that the existing learners RLS covers it: a linked
-- guardian can set the target, a stranger cannot see or change it.
begin;

create extension if not exists pgtap with schema extensions;

select plan(6);

-- Impersonation helpers (same idiom as 0001/0004).
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

-- Fixtures (as owner). G = guardian, S = stranger.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'guardian-tc@test'),
  ('00000000-0000-0000-0000-0000000000e2', 'stranger-tc@test');

-- Reuse the seeded certification if present (supabase test db loads the
-- content seed first — the 0004 lesson).
insert into public.certifications (id, name_sv, short_name_sv, description_sv, active)
  values ('forarintyg', 'Förarintyg', 'Förar', 'd', true)
  on conflict (id) do nothing;
insert into public.certifications (id, name_sv, short_name_sv, description_sv, active)
  values ('src', 'SRC', 'SRC', 'd', false)
  on conflict (id) do nothing;

select test_login('00000000-0000-0000-0000-0000000000e1');
select public.create_learner('Elev TC', '13_15', false);
reset role;

-- 1–2. Schema: column exists and is FK-guarded.
select has_column('public', 'learners', 'target_certification_id',
  'learners.target_certification_id exists');
select throws_ok(
  $$ update public.learners set target_certification_id = 'finns-inte'
     where display_name = 'Elev TC' $$,
  '23503', null,
  'invalid certification id is rejected by the FK');

-- 3–4. Linked guardian can set and read the target.
select test_login('00000000-0000-0000-0000-0000000000e1');
update public.learners set target_certification_id = 'src'
  where display_name = 'Elev TC';
select is(
  (select target_certification_id from public.learners
   where display_name = 'Elev TC'),
  'src',
  'guardian sets and reads the learner target certification');
update public.learners set target_certification_id = 'forarintyg'
  where display_name = 'Elev TC';
select is(
  (select target_certification_id from public.learners
   where display_name = 'Elev TC'),
  'forarintyg',
  'guardian can change the target certification');
reset role;

-- 5–6. A stranger neither sees the learner nor changes the target.
select test_login('00000000-0000-0000-0000-0000000000e2');
select is(
  (select count(*) from public.learners where display_name = 'Elev TC'),
  0::bigint,
  'stranger cannot see the learner row');
update public.learners set target_certification_id = 'src'
  where display_name = 'Elev TC';
reset role;
select is(
  (select target_certification_id from public.learners
   where display_name = 'Elev TC'),
  'forarintyg',
  'stranger update is a no-op under RLS');

select * from finish();
rollback;
