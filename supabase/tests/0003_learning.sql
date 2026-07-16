-- Learning-state tests: apply_attempt idempotency, felbok resolution (§13.6),
-- and RLS isolation on learning tables (§55.3).
begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'l@example.test'),
  ('00000000-0000-0000-0000-0000000000c2', 'other@example.test');
insert into public.learners (id, display_name, age_band)
values ('90000000-0000-0000-0000-000000000001', 'Elev', '18_plus');
insert into public.learner_guardians (learner_id, guardian_user_id, relationship)
values ('90000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-0000000000c1', 'self');

-- content fixture
insert into public.certifications (id, name_sv, short_name_sv, description_sv)
values ('forarintyg', 'Förarintyg', 'Förar', 'x')
on conflict (id) do nothing;
insert into public.source_documents (id, source_key, title, issuer, canonical_url, retrieved_at, last_checked_at)
values ('10000000-0000-0000-0000-0000000000aa', 'src-l', 't', 'NFB', 'https://x.test', now(), now());
insert into public.syllabus_versions (id, certification_id, source_document_id, name, status)
values ('20000000-0000-0000-0000-0000000000aa', 'forarintyg', '10000000-0000-0000-0000-0000000000aa', 'S', 'active');
insert into public.objectives (id, syllabus_version_id, section_key, order_index, title_sv, outcome_sv, objective_type, criticality, status)
values ('obj.l1', '20000000-0000-0000-0000-0000000000aa', 'F4', 1, 't', 'o', 'rule', 'important', 'active');
insert into public.item_templates (id, stable_key, certification_id, item_kind)
values ('60000000-0000-0000-0000-0000000000aa', 'l-001', 'forarintyg', 'single_choice');
insert into public.item_versions (id, template_id, version, syllabus_version_id, stem_sv, interaction, answer_key, grading_policy, explanation_sv, criticality, status)
values ('61000000-0000-0000-0000-0000000000aa', '60000000-0000-0000-0000-0000000000aa', 1,
        '20000000-0000-0000-0000-0000000000aa', 'q', '{"kind":"single_choice"}', '{"correct":"a"}',
        '{"mode":"single_choice"}', 'e', 'important', 'review');

-- apply_attempt payload
create temporary table t_payload as select jsonb_build_object(
  'learner_id', '90000000-0000-0000-0000-000000000001',
  'item_version_id', '61000000-0000-0000-0000-0000000000aa',
  'context', 'practice',
  'item_snapshot', '{"kind":"single_choice"}'::jsonb,
  'response', '{"selected":"b"}'::jsonb,
  'grade_result', '{"correct":false}'::jsonb,
  'correct', 'false', 'score01', '0', 'independent', 'true',
  'idempotency_key', 'k-1',
  'felbok_error', jsonb_build_object(
    'objective_id', 'obj.l1', 'misconception_id', null,
    'error_tags', '["rule_confusion"]'::jsonb)
) as p;

select is(
  public.apply_attempt((select p from t_payload)),
  public.apply_attempt((select p from t_payload)),
  'apply_attempt is idempotent on (learner, idempotency_key)'
);

select is(
  (select count(*)::int from public.attempts),
  1,
  'retry does not duplicate the attempt'
);

select is(
  (select status from public.felbok_entries where objective_id = 'obj.l1'),
  'open',
  'error opens a felbok entry'
);

-- two successes on separate dates resolve the entry
select lives_ok($$
  select public.apply_attempt(((select p from t_payload) - 'felbok_error')
    || jsonb_build_object('idempotency_key','k-2','correct','true','score01','1',
         'felbok_success', jsonb_build_object('objective_id','obj.l1','date','2026-07-16')))
$$, 'first success applies');

select is(
  (select status from public.felbok_entries where objective_id = 'obj.l1'),
  'improving', 'one success on one date → improving');

select lives_ok($$
  select public.apply_attempt(((select p from t_payload) - 'felbok_error')
    || jsonb_build_object('idempotency_key','k-3','correct','true','score01','1',
         'felbok_success', jsonb_build_object('objective_id','obj.l1','date','2026-07-18')))
$$, 'second-date success applies');

select is(
  (select status from public.felbok_entries where objective_id = 'obj.l1'),
  'resolved',
  'felbok resolves after two independent successes on separate dates (§13.6)');

-- RLS: another user sees nothing
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c2","role":"authenticated"}';

select is(
  (select count(*)::int from public.attempts)
  + (select count(*)::int from public.srs_state)
  + (select count(*)::int from public.felbok_entries),
  0,
  'another user cannot read attempts/SRS/felbok (§55.3)');

select * from finish();
rollback;
