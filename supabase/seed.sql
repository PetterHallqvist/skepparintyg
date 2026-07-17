-- Development seed data. Applied by `supabase db reset`.
-- Phase 1 adds certifications, sample objectives, lessons and items here.
-- Never seed production through this file.

-- ---------------------------------------------------------------------------
-- Commerce (Phase 6): one purchasable dev product so checkout, entitlements
-- and the deck gate can be exercised locally. Mirrors DEMO_CATALOG in
-- lib/commerce/catalog.ts. The REAL launch price is an operator decision
-- inside the SPEC §9.4 range and is set in the admin, not here. The 25 % VAT
-- rate is the §69.4 working assumption pending the accountant's confirmation.
-- ---------------------------------------------------------------------------

insert into public.certifications
  (id, name_sv, short_name_sv, description_sv, active, practical_component)
values
  ('forarintyg', 'Förarintyg för fritidsbåt', 'Förarintyg',
   'Grundläggande intyg för fritidsbåt.', true, false)
on conflict (id) do nothing;

insert into public.products
  (id, name_sv, description_sv, certification_id, access_months, seat_count, status)
values
  ('forarintyg-digital',
   'Förarintyg Digital',
   'Full tillgång till kurs, övningar, sjökortslabb och kortlekar för Förarintyget i 12 månader.',
   'forarintyg', 12, 1, 'active')
on conflict (id) do nothing;

insert into public.product_prices
  (product_id, currency, amount_ore_inc_vat, vat_rate_basis_points)
select 'forarintyg-digital', 'SEK', 89500, 2500
where not exists (
  select 1 from public.product_prices where product_id = 'forarintyg-digital'
);

-- ---------------------------------------------------------------------------
-- Editorial (Phase 7): kunskapsbank + ordlista. Ships status='review'/'draft'
-- with unverified-source flags (M1 policy) — an editor publishes to 'live'
-- before anything shows on the public pages. The demo-shell fallback in
-- lib/content/editorial.ts showcases these before a database exists.
-- ---------------------------------------------------------------------------

insert into public.articles (slug, title_sv, summary_sv, body_blocks, status, source_short, verified_at)
values
  ('sa-laser-du-ett-sjokort', 'Så läser du ett sjökort',
   'Djupsiffror, sjömärken och latitudskalan — grunderna.',
   jsonb_build_array(
     jsonb_build_object('type','markdown','body_sv','## Vad sjökortet visar' || E'\n\n' || 'Ett sjökort visar **djup**, **grund**, **farleder** och **sjömärken**.'),
     jsonb_build_object('type','callout','tone','info','body_sv','Mät distanser mot **latitudskalan** i kortets kant.')
   ),
   'review', 'Sjöklart (utkast, ej källgranskad)', '2026-07-16'),
  ('vajningsreglerna-i-korthet', 'Väjningsreglerna i korthet',
   'Möte, korsande och upphinnande — en översikt.',
   jsonb_build_array(
     jsonb_build_object('type','markdown','body_sv','## Grundprinciperna' || E'\n\n' || '- **Möte**: båda viker åt styrbord.' || E'\n' || '- **Korsande**: den som har den andra om styrbord viker.'),
     jsonb_build_object('type','callout','tone','warning','body_sv','Alla ombord är skyldiga att undvika kollision — ta aldrig för givet att den andre väjer.')
   ),
   'review', 'Sjöklart (utkast, ej källgranskad)', '2026-07-16')
on conflict (slug) do nothing;

insert into public.glossary_terms (slug, term, definition_sv, see_also, source_short, verified_at, status)
values
  ('styrbord', 'Styrbord', 'Höger sida av båten sett föröver.', array['babord'], 'Sjöklart (utkast)', '2026-07-16', 'draft'),
  ('babord', 'Babord', 'Vänster sida av båten sett föröver.', array['styrbord'], 'Sjöklart (utkast)', '2026-07-16', 'draft'),
  ('knop', 'Knop', 'Fartenhet: en nautisk mil per timme.', array['nautisk-mil'], 'Sjöklart (utkast)', '2026-07-16', 'draft'),
  ('nautisk-mil', 'Nautisk mil (M)', '1 852 meter, motsvarar en latitudminut.', array['knop'], 'Sjöklart (utkast)', '2026-07-16', 'draft'),
  ('missvisning', 'Missvisning', 'Skillnaden mellan rättvisande och magnetisk nord.', array['deviation'], 'Sjöklart (utkast)', '2026-07-16', 'draft'),
  ('deviation', 'Deviation', 'Kompassfel orsakat av båtens eget magnetfält.', array['missvisning'], 'Sjöklart (utkast)', '2026-07-16', 'draft')
on conflict (slug) do nothing;
