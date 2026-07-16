-- Table-level privileges for the Supabase API roles (anon, authenticated).
--
-- Why this migration exists
-- --------------------------
-- Row Level Security is the row-level authority in this schema: every table
-- has RLS enabled with default-deny, and the policies in migrations 0001–0004
-- decide which rows each caller may see or change. But Postgres still requires
-- a *table-level* GRANT before a role may touch a table at all — without it the
-- caller gets "permission denied for table …" BEFORE any policy is evaluated.
--
-- On a hosted Supabase project the platform's default privileges grant these
-- implicitly, so it is easy to forget them. `supabase db start` / `supabase
-- test db` (and a plain Postgres) do NOT, which makes the RLS suites fail with
-- "permission denied" the moment they switch to the authenticated/anon role.
-- Declaring the grants here makes behaviour identical across a local Postgres,
-- CI, and a real Supabase project instead of depending on platform defaults.
--
-- Security model
-- --------------
-- * `authenticated` receives full DML and RLS decides the rows. This is
--   required because BOTH learner writes and the admin studio run as the
--   signed-in user (the admin actions use the anon/authenticated key with the
--   user's session, not the service role) and are gated by the `*_admin_write`
--   / ownership policies. Privileged atomic writes (apply_attempt, log_audit,
--   create_learner) go through SECURITY DEFINER functions whose EXECUTE is
--   revoked from these roles — a table GRANT here never widens that.
-- * `anon` receives SELECT only. On protected tables (learners, attempts,
--   item_versions answer keys, …) RLS returns zero rows; only the tables with a
--   public-read policy (certifications, official_facts, public item pools, …)
--   actually return anything. Answer keys stay unreadable via the staff-only
--   `item_versions` policy and the answer-key-stripping get_challenge RPC.
--
-- INVARIANT: every table created in `public` MUST enable RLS in the same
-- migration (see AGENTS.md). These broad grants are only safe under that rule.

grant usage on schema public to anon, authenticated;

-- Existing tables (migrations 0001–0004).
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Future tables (later migrations) inherit the same posture automatically, so
-- new tables never silently regress to "permission denied".
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
