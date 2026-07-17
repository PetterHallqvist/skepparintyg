-- Editorial content: kunskapsbank articles + ordlista glossary (SPEC §11.1).
-- Public read for published rows; staff write. RLS enabled in this migration;
-- table grants inherit from 0005's default privileges. Immutable-when-live is
-- enforced app-side (like lessons); the status gate is the RLS authority.

-- ---------------------------------------------------------------------------
-- articles (kunskapsbank)
-- ---------------------------------------------------------------------------

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_sv text not null,
  summary_sv text,
  -- §38 block shape (markdown/callout/worked_example), rendered by BlockRenderer.
  body_blocks jsonb not null default '[]'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'live')),
  source_short text,
  source_url text,
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_status_idx on public.articles (status);

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

create policy articles_public_read on public.articles
  for select using (
    status = 'live'
    or public.has_role(array['admin', 'editor', 'reviewer', 'support'])
  );

create policy articles_staff_write on public.articles
  for all using (public.has_role(array['admin', 'editor']))
  with check (public.has_role(array['admin', 'editor']));

-- ---------------------------------------------------------------------------
-- glossary_terms (ordlista)
-- ---------------------------------------------------------------------------

create table public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  term text not null unique,
  definition_sv text not null,
  see_also text[] not null default '{}',
  source_short text,
  verified_at date,
  status text not null default 'draft'
    check (status in ('draft', 'live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index glossary_status_idx on public.glossary_terms (status);

create trigger glossary_set_updated_at
  before update on public.glossary_terms
  for each row execute function public.set_updated_at();

alter table public.glossary_terms enable row level security;

create policy glossary_public_read on public.glossary_terms
  for select using (
    status = 'live'
    or public.has_role(array['admin', 'editor', 'reviewer', 'support'])
  );

create policy glossary_staff_write on public.glossary_terms
  for all using (public.has_role(array['admin', 'editor']))
  with check (public.has_role(array['admin', 'editor']));
