-- Target certificate is learner-profile data (SPEC §12.2) — a guardian's two
-- learners can prepare for different certificates, so the column lives on
-- learners, NOT on profiles. Additive + nullable: no backfill needed; the
-- existing learners RLS (select/update via active guardian link or self)
-- already covers the new column. The httpOnly cookie remains the runtime
-- truth; this column is durability across devices.

alter table public.learners
  add column target_certification_id text references public.certifications(id);

comment on column public.learners.target_certification_id is
  'Chosen preparation target (SPEC §12.2). Null until the first-run picker; mirrored from the sjoklart_intyg cookie.';
