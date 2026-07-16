-- Publish-gate + source-monitoring tests for the content backbone (SPEC §8.3,
-- §3.3, §42.2). Mirrors the M1 Definition of Done.
begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

-- Fixtures ------------------------------------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@example.test'),
  ('00000000-0000-0000-0000-0000000000b2', 'reviewer@example.test');
insert into public.admin_users (user_id, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin'),
  ('00000000-0000-0000-0000-0000000000b2', 'reviewer');

insert into public.certifications (id, name_sv, short_name_sv, description_sv, active)
values ('forarintyg', 'Förarintyg', 'Förar', 'Grundintyg', true);

insert into public.source_documents
  (id, source_key, title, issuer, canonical_url, retrieved_at, last_checked_at)
values
  ('10000000-0000-0000-0000-000000000001', 'nfb-forar-krav',
   'NFB kunskapsfordringar Förarintyg', 'NFB', 'https://example.test/nfb',
   now(), now());

insert into public.syllabus_versions
  (id, certification_id, source_document_id, name, status)
values
  ('20000000-0000-0000-0000-000000000001', 'forarintyg',
   '10000000-0000-0000-0000-000000000001', 'Förar 2026', 'active');

insert into public.objectives
  (id, syllabus_version_id, section_key, order_index, title_sv, outcome_sv,
   objective_type, criticality, status)
values
  ('forar.f7.std-berakning', '20000000-0000-0000-0000-000000000001', 'F7', 1,
   'Fart, tid, distans', 'Beräkna gångtid från distans och fart.',
   'procedure', 'important', 'active');

insert into public.item_templates (id, stable_key, certification_id, item_kind)
values ('30000000-0000-0000-0000-000000000001', 'f7-std-001', 'forarintyg', 'numeric');

insert into public.item_versions
  (id, template_id, version, syllabus_version_id, stem_sv, interaction,
   answer_key, grading_policy, explanation_sv, criticality, status)
values
  ('40000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001', 1,
   '20000000-0000-0000-0000-000000000001',
   'Du ska gå 6,0 M i 5 knop. Hur lång blir gångtiden i minuter?',
   '{"kind":"numeric","unit":"minuter"}',
   '{"value":72,"tolerance":0}',
   '{"mode":"exact_with_tolerance"}',
   'Tid = distans/fart = 6,0/5 = 1,2 h = 72 minuter.',
   'important', 'review');

-- 1–2: publishing is blocked without source, then without approvals ---------

select throws_like(
  $$ update public.item_versions set status = 'live'
      where id = '40000000-0000-0000-0000-000000000001' $$,
  '%saknar källa%',
  'publish blocked without a source'
);

insert into public.item_sources (item_version_id, source_document_id, locator)
values ('40000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001', 'avsnitt 7');

select throws_like(
  $$ update public.item_versions set status = 'live'
      where id = '40000000-0000-0000-0000-000000000001' $$,
  '%saknar godkänd domängranskning%',
  'publish blocked without domain approval'
);

-- 3: publish succeeds with source + domain + editorial ----------------------

insert into public.review_decisions
  (entity_type, entity_version_id, review_type, reviewer_user_id, decision)
values
  ('item', '40000000-0000-0000-0000-000000000001', 'domain',
   '00000000-0000-0000-0000-0000000000b2', 'approve'),
  ('item', '40000000-0000-0000-0000-000000000001', 'editorial',
   '00000000-0000-0000-0000-0000000000a1', 'approve');

select lives_ok(
  $$ update public.item_versions set status = 'live'
      where id = '40000000-0000-0000-0000-000000000001' $$,
  'publish succeeds with source + approvals'
);

select is(
  (select status from public.item_versions
    where id = '40000000-0000-0000-0000-000000000001'),
  'live',
  'item version is live'
);

-- 5: live content is immutable ----------------------------------------------

select throws_like(
  $$ update public.item_versions set stem_sv = 'Manipulerad'
      where id = '40000000-0000-0000-0000-000000000001' $$,
  '%immutable_live_version%',
  'live version content is immutable'
);

-- 6–8: source change flags objectives, opens issue, never auto-unpublishes --

insert into public.objective_sources (objective_id, source_document_id, locator)
values ('forar.f7.std-berakning', '10000000-0000-0000-0000-000000000001', 'avsnitt 7');

update public.source_documents
   set content_sha256 = 'nyhash', last_checked_at = now()
 where id = '10000000-0000-0000-0000-000000000001';

select is(
  (select status from public.objectives where id = 'forar.f7.std-berakning'),
  'review_required',
  'source change marks dependent objective review_required'
);

select cmp_ok(
  (select count(*)::int from public.content_issues where category = 'source_change'),
  '>=', 1,
  'source change opens an admin issue'
);

select is(
  (select status from public.item_versions
    where id = '40000000-0000-0000-0000-000000000001'),
  'live',
  'source change does NOT auto-unpublish live content (§3.3)'
);

select * from finish();
rollback;
