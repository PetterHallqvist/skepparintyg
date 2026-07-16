-- Commerce + guardian permission matrix (SPEC §55.3, §52, §69).
-- Proves the entitlement gate, seat cap, purchaser/guardian isolation, the
-- "success redirect grants nothing" invariant, and that the minor-access token
-- table is unreadable by any client. Run with: supabase test db (CI Docker).
begin;

create extension if not exists pgtap with schema extensions;

select plan(16);

-- --------------------------------------------------------------------------
-- Impersonation helpers (same idiom as 0001).
-- --------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------
-- Fixtures (as owner). P = purchaser, S = stranger, G2 = guardian-not-buyer.
-- --------------------------------------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'buyer@test'),
  ('00000000-0000-0000-0000-0000000000f2', 'stranger@test'),
  ('00000000-0000-0000-0000-0000000000f3', 'guardian2@test');

insert into public.certifications (id, name_sv, short_name_sv, description_sv, active)
  values ('forarintyg', 'Förarintyg', 'Förar', 'd', true);
insert into public.products (id, name_sv, description_sv, certification_id, access_months, seat_count, status)
  values ('p1', 'Digital', 'd', 'forarintyg', 12, 1, 'active');
insert into public.product_prices (product_id, amount_ore_inc_vat, vat_rate_basis_points)
  values ('p1', 89500, 2500);

-- P creates two learners through the RPC (transactional guardian link).
select test_login('00000000-0000-0000-0000-0000000000f1');
select public.create_learner('Elev 1', '13_15', false);
select public.create_learner('Elev 2', '13_15', false);
reset role;

-- Link G2 as an additional active guardian of Elev 1 (not the purchaser).
insert into public.learner_guardians (learner_id, guardian_user_id, relationship, status)
select id, '00000000-0000-0000-0000-0000000000f3', 'guardian', 'active'
from public.learners where display_name = 'Elev 1';

-- P's pending order (as if the checkout action created it), one line.
insert into public.orders
  (id, purchaser_user_id, status, total_ore, subtotal_ore, vat_ore,
   terms_version, stripe_checkout_session_id)
values
  ('00000000-0000-0000-0000-0000000000e1',
   '00000000-0000-0000-0000-0000000000f1', 'pending', 89500, 71600, 17900,
   'terms-v1', 'cs1');
insert into public.order_items
  (order_id, product_id, product_name_snapshot, unit_amount_ore_inc_vat,
   vat_rate_basis_points, access_months_snapshot, seat_count_snapshot)
values
  ('00000000-0000-0000-0000-0000000000e1', 'p1', 'Digital', 89500, 2500, 12, 1);

-- --------------------------------------------------------------------------
-- 1. Success redirect grants nothing: pre-webhook, no entitlement exists.
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f1');
select is(public.has_active_entitlement('forarintyg'), false,
  'pending order (no webhook) grants no entitlement');
reset role;

-- The webhook path: provision_entitlement (service role only → run as owner).
select public.provision_entitlement(jsonb_build_object(
  'provider','stripe','event_id','evt1','event_type','checkout.session.completed',
  'payload_hash','h','checkout_session_id','cs1','amount_total_ore',89500,
  'payment_intent_id','pi1','paid_at', now()::text
));

-- --------------------------------------------------------------------------
-- 2–3. The entitlement gate: purchaser yes, stranger no.
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f1');
select is(public.has_active_entitlement('forarintyg'), true,
  'purchaser has access after provisioning');
select test_login('00000000-0000-0000-0000-0000000000f2');
select is(public.has_active_entitlement('forarintyg'), false,
  'stranger has no access');
reset role;

-- --------------------------------------------------------------------------
-- 4–6. Order visibility: purchaser sees own; stranger and guardian-not-buyer
-- see no billing.
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f1');
select is((select count(*)::int from public.orders), 1,
  'purchaser sees their own order');
select test_login('00000000-0000-0000-0000-0000000000f2');
select is((select count(*)::int from public.orders), 0,
  'stranger sees no orders');
select test_login('00000000-0000-0000-0000-0000000000f3');
select is((select count(*)::int from public.orders), 0,
  'guardian-not-buyer sees no billing');
reset role;

-- --------------------------------------------------------------------------
-- 7–9. Learner visibility: purchaser sees both, G2 sees only Elev 1, S sees none.
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f1');
select is((select count(*)::int from public.learners), 2,
  'purchaser (guardian) sees both learners');
select test_login('00000000-0000-0000-0000-0000000000f3');
select is((select count(*)::int from public.learners), 1,
  'G2 sees only the learner they guard');
select test_login('00000000-0000-0000-0000-0000000000f2');
select is((select count(*)::int from public.learners), 0,
  'stranger sees no learners');
reset role;

-- --------------------------------------------------------------------------
-- 10–11. Seat cap (seat_count = 1): first assign succeeds, second is rejected.
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f1');
select lives_ok(
  $$ select public.assign_entitlement_seat(
       (select id from public.entitlements limit 1),
       (select id from public.learners where display_name = 'Elev 1')) $$,
  'first seat assignment succeeds');
select throws_like(
  $$ select public.assign_entitlement_seat(
       (select id from public.entitlements limit 1),
       (select id from public.learners where display_name = 'Elev 2')) $$,
  '%no_seats_left%',
  'second assignment is rejected by the seat cap');
reset role;

-- --------------------------------------------------------------------------
-- 12. Seated learner's guardian gains access via the seat (not as purchaser).
-- --------------------------------------------------------------------------
select test_login('00000000-0000-0000-0000-0000000000f3');
select is(public.has_active_entitlement('forarintyg'), true,
  'guardian of a seated learner gains access via the seat');
reset role;

-- --------------------------------------------------------------------------
-- 13–14. learner_access_tokens is unreadable by any client (no select policy).
-- --------------------------------------------------------------------------
insert into public.learner_access_tokens (learner_id, token_hash)
select id, 'scrypt$aa$bb' from public.learners where display_name = 'Elev 1';

select test_login('00000000-0000-0000-0000-0000000000f1');
select is((select count(*)::int from public.learner_access_tokens), 0,
  'purchaser cannot read minor-access tokens');
select test_login('00000000-0000-0000-0000-0000000000f2');
select is((select count(*)::int from public.learner_access_tokens), 0,
  'stranger cannot read minor-access tokens');
reset role;

-- --------------------------------------------------------------------------
-- 15–16. Revoked guardian loses access immediately.
-- --------------------------------------------------------------------------
update public.learner_guardians set status = 'revoked'
 where guardian_user_id = '00000000-0000-0000-0000-0000000000f3';

select test_login('00000000-0000-0000-0000-0000000000f3');
select is((select count(*)::int from public.learners), 0,
  'revoked guardian loses learner visibility immediately');
select is(public.has_active_entitlement('forarintyg'), false,
  'revoked guardian loses entitlement access immediately');
reset role;

select * from finish();
rollback;
