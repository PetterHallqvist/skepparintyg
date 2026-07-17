-- Commerce: products, orders, entitlements, external events, leads, consent,
-- guarantee claims, minor-access tokens (SPEC §52, §53, §60.2, §43.5, §9.5).
-- RLS is enabled in the SAME migration as each table (SPEC §42.8); table-level
-- grants are inherited from migration 0005's default privileges — RLS
-- default-deny is what keeps closed tables closed.
--
-- Money is ALWAYS integer öre; VAT rates are basis points stored as data on
-- both the price and the order lines (§52.1, §69.4). The Stripe webhook is the
-- ONLY authority that marks an order paid and provisions an entitlement — a
-- browser success redirect grants nothing (§60.2).

-- ---------------------------------------------------------------------------
-- products + product_prices (§52.1) — public catalog, admin-managed
-- ---------------------------------------------------------------------------

create table public.products (
  id text primary key,
  name_sv text not null,
  description_sv text not null,
  -- Entitlements gate content per certification (lessons, items, decks).
  -- Null for products that do not unlock certification content.
  certification_id text references public.certifications(id),
  access_months int not null check (access_months >= 1),
  seat_count int not null default 1 check (seat_count >= 1),
  status text not null default 'draft'
    check (status in ('draft','active','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy products_public_read on public.products
  for select using (
    status = 'active' or public.has_role(array['admin','editor','support'])
  );

create policy products_admin_write on public.products
  for all using (public.has_role(array['admin']))
  with check (public.has_role(array['admin']));

create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  currency char(3) not null default 'SEK',
  amount_ore_inc_vat int not null check (amount_ore_inc_vat >= 0),
  -- 2500 = 25 %. The exact rate is an accountant decision (§69.4); it is data.
  vat_rate_basis_points int not null check (vat_rate_basis_points >= 0),
  stripe_price_id text unique,
  active_from timestamptz not null default now(),
  active_to timestamptz,
  created_at timestamptz not null default now(),
  check (active_to is null or active_to > active_from)
);

create index product_prices_product_idx on public.product_prices (product_id);

alter table public.product_prices enable row level security;

create policy product_prices_public_read on public.product_prices
  for select using (
    (
      now() >= active_from
      and (active_to is null or now() < active_to)
      and exists (
        select 1 from public.products p
        where p.id = product_id and p.status = 'active'
      )
    )
    or public.has_role(array['admin','editor','support'])
  );

create policy product_prices_admin_write on public.product_prices
  for all using (public.has_role(array['admin']))
  with check (public.has_role(array['admin']));

-- ---------------------------------------------------------------------------
-- orders + order_items (§52.2) — created 'pending' by the checkout action
-- (caller's RLS client); paid ONLY by the webhook via provision_entitlement.
-- VAT facts live on the order lines, not just the product table (§69.4).
-- ---------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid not null references public.profiles(id),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded')),
  failure_reason text,
  currency char(3) not null default 'SEK',
  customer_country char(2),
  subtotal_ore int not null default 0,
  vat_ore int not null default 0,
  total_ore int not null default 0,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  -- §69.1/§69.2: which terms were shown and the deliberate withdrawal-consent
  -- action, snapshotted at purchase time.
  terms_version text not null,
  withdrawal_consent_snapshot jsonb not null default '{}'::jsonb,
  -- §60.2: double submits from the checkout form reuse the same pending order.
  idempotency_key text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subtotal_ore + vat_ore = total_ore)
);

create unique index orders_purchaser_idem_key
  on public.orders (purchaser_user_id, idempotency_key)
  where idempotency_key is not null;

create index orders_purchaser_idx on public.orders (purchaser_user_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy orders_select_own on public.orders
  for select using (
    purchaser_user_id = auth.uid()
    or public.has_role(array['admin','support'])
  );

create policy orders_insert_own_pending on public.orders
  for insert with check (
    purchaser_user_id = auth.uid() and status = 'pending'
  );

-- The purchaser may attach Stripe ids to their own PENDING order (the checkout
-- action creates the session after the order row). `with check` pins the
-- status: a client can never flip pending→paid — only the service role can.
-- Totals tampering is caught by provision_entitlement's amount verification.
create policy orders_update_own_pending on public.orders
  for update using (purchaser_user_id = auth.uid() and status = 'pending')
  with check (purchaser_user_id = auth.uid() and status = 'pending');

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  quantity int not null default 1 check (quantity >= 1),
  -- Snapshots (§52.2): the receipt must survive later product/price edits.
  product_name_snapshot text not null,
  unit_amount_ore_inc_vat int not null check (unit_amount_ore_inc_vat >= 0),
  vat_rate_basis_points int not null check (vat_rate_basis_points >= 0),
  access_months_snapshot int not null,
  seat_count_snapshot int not null,
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy order_items_select_own on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.purchaser_user_id = auth.uid()
             or public.has_role(array['admin','support']))
    )
  );

create policy order_items_insert_own_pending on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.purchaser_user_id = auth.uid()
        and o.status = 'pending'
    )
  );

-- ---------------------------------------------------------------------------
-- entitlements + seat assignments (§52.3)
-- ---------------------------------------------------------------------------

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid not null references public.profiles(id),
  order_item_id uuid not null references public.order_items(id),
  product_id text not null references public.products(id),
  starts_at timestamptz not null,
  expires_at timestamptz,
  seat_count int not null default 1 check (seat_count >= 1),
  status text not null default 'active'
    check (status in ('active','refunded','revoked')),
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create index entitlements_purchaser_idx
  on public.entitlements (purchaser_user_id) where status = 'active';

alter table public.entitlements enable row level security;

create policy entitlements_select_own on public.entitlements
  for select using (
    purchaser_user_id = auth.uid()
    or public.has_role(array['admin','support'])
  );

-- No client writes: creation via provision_entitlement (service role),
-- refund/revoke via apply_refund (service role).

create table public.entitlement_learners (
  entitlement_id uuid not null references public.entitlements(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  removed_at timestamptz,
  id uuid primary key default gen_random_uuid()
);

-- Duplicate prevention: one ACTIVE seat per learner per entitlement. The
-- seat-count cap itself is enforced transactionally in assign_entitlement_seat
-- (§52: "a partial unique index or transaction must enforce assignments ≤
-- seat count" — the cap needs the row lock, the index kills duplicates).
create unique index entitlement_learners_active_key
  on public.entitlement_learners (entitlement_id, learner_id)
  where removed_at is null;

create index entitlement_learners_learner_idx
  on public.entitlement_learners (learner_id) where removed_at is null;

alter table public.entitlement_learners enable row level security;

create policy entitlement_learners_select on public.entitlement_learners
  for select using (
    exists (
      select 1 from public.entitlements e
      where e.id = entitlement_id and e.purchaser_user_id = auth.uid()
    )
    or public.can_access_learner(learner_id)
    or public.has_role(array['admin','support'])
  );

-- Writes only via assign/remove RPCs below.

-- ---------------------------------------------------------------------------
-- external_events (§60.2) — processed-event dedupe for ALL providers.
-- Service-role only: RLS enabled with no policies (default deny); admins get
-- read for support debugging.
-- ---------------------------------------------------------------------------

create table public.external_events (
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload_hash text not null,
  processed_at timestamptz,
  result jsonb,
  received_at timestamptz not null default now(),
  primary key (provider, event_id)
);

alter table public.external_events enable row level security;

create policy external_events_admin_read on public.external_events
  for select using (public.has_role(array['admin','support']));

-- ---------------------------------------------------------------------------
-- leads + consent_events + communication_log (§53)
-- ---------------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text,
  age_band text
    check (age_band in ('under_13','13_15','16_17','18_plus','unknown')),
  source text not null,
  diagnostic_result jsonb,
  account_created boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.leads enable row level security;

-- Lead capture happens in server actions via the service client (validated
-- input, no anon write surface). Clients never read the lead table.
create policy leads_admin_read on public.leads
  for select using (public.has_role(array['admin','support']));

create table public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  purpose text not null,
  action text not null check (action in ('grant','withdraw')),
  policy_version text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (user_id is not null or lead_id is not null)
);

create index consent_events_user_idx on public.consent_events (user_id);

alter table public.consent_events enable row level security;

create policy consent_events_select_own on public.consent_events
  for select using (
    user_id = auth.uid() or public.has_role(array['admin','support'])
  );

create policy consent_events_insert_own on public.consent_events
  for insert with check (user_id = auth.uid());

-- Append-only: no update/delete policies. Withdrawal is a NEW event (§53).

create table public.communication_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  learner_id uuid references public.learners(id) on delete set null,
  -- Purpose separation (§53): transactional vs reminder vs marketing must
  -- never blur — marketing to a minor learner address is forbidden (§70.3).
  message_type text not null,
  provider_message_id text,
  status text not null default 'queued'
    check (status in ('queued','sent','failed','suppressed')),
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.communication_log enable row level security;

create policy communication_log_admin_read on public.communication_log
  for select using (public.has_role(array['admin','support']));

-- ---------------------------------------------------------------------------
-- guarantee_claims (§9.5, §52.5) — eligibility is code, the DECISION is human.
-- ---------------------------------------------------------------------------

create table public.guarantee_claims (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid not null references public.profiles(id),
  entitlement_id uuid not null references public.entitlements(id),
  guarantee_version text not null,
  eligibility_snapshot jsonb not null,
  requested_benefit text not null default 'access_extension'
    check (requested_benefit in ('access_extension')),
  status text not null default 'submitted'
    check (status in ('submitted','under_review','approved','declined')),
  reviewer_user_id uuid references public.profiles(id),
  decision_reason text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.guarantee_claims enable row level security;

create policy guarantee_claims_select_own on public.guarantee_claims
  for select using (
    purchaser_user_id = auth.uid()
    or public.has_role(array['admin','support'])
  );

create policy guarantee_claims_insert_own on public.guarantee_claims
  for insert with check (
    purchaser_user_id = auth.uid() and status = 'submitted'
  );

-- Only staff decide. No automatic financial benefit exists anywhere (§52.5).
create policy guarantee_claims_staff_decide on public.guarantee_claims
  for update using (public.has_role(array['admin','support']))
  with check (public.has_role(array['admin','support']));

-- ---------------------------------------------------------------------------
-- learner_access_tokens (§43.5) — slow-hashed minor-access PIN, one per
-- learner. NEVER readable by clients (RLS: no select policy at all); the
-- server action layer verifies via the service client and enforces
-- rate limits with failed_attempts/locked_until.
-- ---------------------------------------------------------------------------

create table public.learner_access_tokens (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  token_hash text not null,
  algo text not null default 'scrypt',
  failed_attempts int not null default 0,
  locked_until timestamptz,
  expires_at timestamptz,
  rotated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.learner_access_tokens enable row level security;
-- No policies: default deny for every client role. Service role only.

-- ---------------------------------------------------------------------------
-- has_active_entitlement (§52.3) — THE gate for paid certification content.
-- True when the caller is the purchaser of, or can access a learner seated
-- on, an active entitlement whose product covers the certification.
-- ---------------------------------------------------------------------------

create or replace function public.has_active_entitlement(p_certification_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entitlements e
    join public.products p on p.id = e.product_id
    where p.certification_id = p_certification_id
      and e.status = 'active'
      and e.refunded_at is null
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
      and (
        e.purchaser_user_id = auth.uid()
        or exists (
          select 1
          from public.entitlement_learners el
          where el.entitlement_id = e.id
            and el.removed_at is null
            and public.can_access_learner(el.learner_id)
        )
      )
  );
$$;

revoke execute on function public.has_active_entitlement(text) from anon;

-- Fold the entitlement predicate into the Phase-1 placeholder policy
-- (00000000000002 documented exactly this hand-off). Lesson CATALOG rows stay
-- listable for signed-in users (lessons_learner_read is unchanged) — it is the
-- CONTENT (lesson_versions.content_blocks) that now requires an entitlement.
drop policy lesson_versions_learner_read_live on public.lesson_versions;

create policy lesson_versions_learner_read_live on public.lesson_versions
  for select using (
    (
      status = 'live'
      and auth.uid() is not null
      and exists (
        select 1 from public.lessons l
        where l.id = lesson_id
          and public.has_active_entitlement(l.certification_id)
      )
    )
    or public.has_role(array['admin','editor','reviewer','support'])
  );

-- ---------------------------------------------------------------------------
-- provision_entitlement (§60.2/§60.3) — SERVICE ROLE ONLY. Called by the
-- Stripe webhook after signature verification. Idempotent via external_events:
-- the PK insert is the lock; a replay returns the stored result. Verifies the
-- paid amount against the order before granting anything.
-- ---------------------------------------------------------------------------

create or replace function public.provision_entitlement(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item public.order_items%rowtype;
  v_entitlement_id uuid;
  v_paid_at timestamptz;
  v_result jsonb;
  v_stored jsonb;
begin
  -- Idempotency lock (§60.2): first processor wins the PK; every replay gets
  -- the stored result. A failed run rolls this insert back, so Stripe's retry
  -- reprocesses cleanly.
  insert into public.external_events (provider, event_id, event_type, payload_hash)
  values (p->>'provider', p->>'event_id', p->>'event_type', p->>'payload_hash')
  on conflict (provider, event_id) do nothing;
  if not found then
    select result into v_stored
    from public.external_events
    where provider = p->>'provider' and event_id = p->>'event_id';
    return coalesce(v_stored, jsonb_build_object('status', 'duplicate'));
  end if;

  select * into v_order
  from public.orders
  where stripe_checkout_session_id = p->>'checkout_session_id'
  for update;
  if v_order.id is null then
    raise exception 'order_not_found_for_session';
  end if;

  if v_order.status = 'paid' then
    v_result := jsonb_build_object('status', 'already_paid', 'order_id', v_order.id);
    update public.external_events
       set processed_at = now(), result = v_result
     where provider = p->>'provider' and event_id = p->>'event_id';
    return v_result;
  end if;

  -- Amount verification: the client could only ever edit its own pending row;
  -- Stripe's amount is authoritative. Mismatch → no access, flagged for support.
  if (p->>'amount_total_ore')::int is distinct from v_order.total_ore then
    update public.orders
       set status = 'failed',
           failure_reason = format(
             'amount_mismatch: stripe=%s order=%s',
             p->>'amount_total_ore', v_order.total_ore)
     where id = v_order.id;
    v_result := jsonb_build_object('status', 'amount_mismatch', 'order_id', v_order.id);
    update public.external_events
       set processed_at = now(), result = v_result
     where provider = p->>'provider' and event_id = p->>'event_id';
    return v_result;
  end if;

  select * into v_item
  from public.order_items
  where order_id = v_order.id
  order by created_at
  limit 1;
  if v_item.id is null then
    raise exception 'order_has_no_items';
  end if;

  v_paid_at := coalesce(nullif(p->>'paid_at','')::timestamptz, now());

  update public.orders
     set status = 'paid',
         paid_at = v_paid_at,
         stripe_payment_intent_id = nullif(p->>'payment_intent_id',''),
         customer_country = nullif(upper(p->>'customer_country'),''),
         failure_reason = null
   where id = v_order.id;

  insert into public.entitlements
    (purchaser_user_id, order_item_id, product_id,
     starts_at, expires_at, seat_count)
  values
    (v_order.purchaser_user_id,
     v_item.id,
     v_item.product_id,
     v_paid_at,
     v_paid_at + make_interval(months => v_item.access_months_snapshot),
     v_item.seat_count_snapshot)
  returning id into v_entitlement_id;

  -- Optional immediate seat: the checkout action passes the learner the buyer
  -- chose. Validated against the purchaser's own guardian links.
  if nullif(p->>'learner_id','') is not null then
    if exists (
      select 1 from public.learner_guardians lg
      where lg.learner_id = (p->>'learner_id')::uuid
        and lg.guardian_user_id = v_order.purchaser_user_id
        and lg.status = 'active'
    ) then
      insert into public.entitlement_learners (entitlement_id, learner_id)
      values (v_entitlement_id, (p->>'learner_id')::uuid)
      on conflict do nothing;
    end if;
  end if;

  v_result := jsonb_build_object(
    'status', 'provisioned',
    'order_id', v_order.id,
    'entitlement_id', v_entitlement_id
  );
  update public.external_events
     set processed_at = now(), result = v_result
   where provider = p->>'provider' and event_id = p->>'event_id';
  return v_result;
end;
$$;

revoke execute on function public.provision_entitlement(jsonb) from anon;
revoke execute on function public.provision_entitlement(jsonb) from authenticated;

-- ---------------------------------------------------------------------------
-- apply_refund — SERVICE ROLE ONLY. Marks the order refunded and closes its
-- entitlements. Idempotent via external_events like provision_entitlement.
-- ---------------------------------------------------------------------------

create or replace function public.apply_refund(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_result jsonb;
  v_stored jsonb;
begin
  insert into public.external_events (provider, event_id, event_type, payload_hash)
  values (p->>'provider', p->>'event_id', p->>'event_type', p->>'payload_hash')
  on conflict (provider, event_id) do nothing;
  if not found then
    select result into v_stored
    from public.external_events
    where provider = p->>'provider' and event_id = p->>'event_id';
    return coalesce(v_stored, jsonb_build_object('status', 'duplicate'));
  end if;

  select id into v_order_id
  from public.orders
  where stripe_payment_intent_id = p->>'payment_intent_id'
  for update;
  if v_order_id is null then
    raise exception 'order_not_found_for_payment_intent';
  end if;

  update public.orders
     set status = 'refunded'
   where id = v_order_id;

  update public.entitlements e
     set status = 'refunded',
         refunded_at = now()
   from public.order_items oi
   where oi.id = e.order_item_id
     and oi.order_id = v_order_id
     and e.status = 'active';

  v_result := jsonb_build_object('status', 'refunded', 'order_id', v_order_id);
  update public.external_events
     set processed_at = now(), result = v_result
   where provider = p->>'provider' and event_id = p->>'event_id';
  return v_result;
end;
$$;

revoke execute on function public.apply_refund(jsonb) from anon;
revoke execute on function public.apply_refund(jsonb) from authenticated;

-- ---------------------------------------------------------------------------
-- assign_entitlement_seat / remove_entitlement_seat — the ONLY client paths
-- for seat management. The row lock + count enforce the seat cap
-- transactionally (§52, §60.3).
-- ---------------------------------------------------------------------------

create or replace function public.assign_entitlement_seat(
  p_entitlement_id uuid,
  p_learner_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ent public.entitlements%rowtype;
  v_active_seats int;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  -- Lock the entitlement so two concurrent assignments cannot both pass the
  -- count check (§60.3).
  select * into v_ent
  from public.entitlements
  where id = p_entitlement_id
  for update;

  if v_ent.id is null or v_ent.purchaser_user_id <> auth.uid() then
    raise exception 'entitlement_not_found';
  end if;
  if v_ent.status <> 'active'
     or v_ent.refunded_at is not null
     or v_ent.starts_at > now()
     or (v_ent.expires_at is not null and v_ent.expires_at <= now()) then
    raise exception 'entitlement_inactive';
  end if;
  if not public.can_access_learner(p_learner_id) then
    raise exception 'learner_not_accessible';
  end if;

  select count(*) into v_active_seats
  from public.entitlement_learners
  where entitlement_id = p_entitlement_id and removed_at is null;

  if exists (
    select 1 from public.entitlement_learners
    where entitlement_id = p_entitlement_id
      and learner_id = p_learner_id
      and removed_at is null
  ) then
    raise exception 'already_assigned';
  end if;

  if v_active_seats >= v_ent.seat_count then
    raise exception 'no_seats_left';
  end if;

  insert into public.entitlement_learners (entitlement_id, learner_id)
  values (p_entitlement_id, p_learner_id);
end;
$$;

revoke execute on function public.assign_entitlement_seat(uuid, uuid) from anon;

create or replace function public.remove_entitlement_seat(
  p_entitlement_id uuid,
  p_learner_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_purchaser uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select purchaser_user_id into v_purchaser
  from public.entitlements
  where id = p_entitlement_id
  for update;

  if v_purchaser is null or v_purchaser <> auth.uid() then
    raise exception 'entitlement_not_found';
  end if;

  update public.entitlement_learners
     set removed_at = now()
   where entitlement_id = p_entitlement_id
     and learner_id = p_learner_id
     and removed_at is null;
end;
$$;

revoke execute on function public.remove_entitlement_seat(uuid, uuid) from anon;
