-- Transactional attempt application (SPEC §60.3): grading happens in the
-- trusted server (TypeScript, pure); this function applies the prepared
-- results atomically — attempt + SRS + skill/objective state + felbok — so a
-- crash can never leave half-updated learning state. Idempotent on
-- (learner_id, idempotency_key): a retry returns the original attempt id.
--
-- SECURITY: only the service role may execute. The server action verifies
-- the caller's learner access BEFORE calling (using the caller's own
-- RLS-checked client).

create or replace function public.apply_attempt(p jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_id uuid;
  v_existing uuid;
begin
  -- Idempotency (§60.2)
  select id into v_existing
  from public.attempts
  where learner_id = (p->>'learner_id')::uuid
    and idempotency_key = p->>'idempotency_key';
  if v_existing is not null then
    return v_existing;
  end if;

  insert into public.attempts
    (learner_id, session_id, item_version_id, context, variant_seed,
     item_snapshot, response, grade_result, correct, score01, independent,
     hint_level, confidence, active_latency_ms, device_class, idempotency_key)
  values
    ((p->>'learner_id')::uuid,
     nullif(p->>'session_id','')::uuid,
     (p->>'item_version_id')::uuid,
     p->>'context',
     p->>'variant_seed',
     p->'item_snapshot',
     p->'response',
     p->'grade_result',
     (p->>'correct')::boolean,
     (p->>'score01')::numeric,
     (p->>'independent')::boolean,
     coalesce((p->>'hint_level')::int, 0),
     nullif(p->>'confidence',''),
     nullif(p->>'active_latency_ms','')::int,
     nullif(p->>'device_class',''),
     p->>'idempotency_key')
  returning id into v_attempt_id;

  -- SRS state (template level, §48.4)
  if p ? 'srs' then
    insert into public.srs_state
      (learner_id, item_template_id, fsrs_card, due_at, last_attempt_id, updated_at)
    values
      ((p->>'learner_id')::uuid,
       (p->'srs'->>'item_template_id')::uuid,
       p->'srs'->'fsrs_card',
       (p->'srs'->>'due_at')::timestamptz,
       v_attempt_id,
       now())
    on conflict (learner_id, item_template_id) do update
      set fsrs_card = excluded.fsrs_card,
          due_at = excluded.due_at,
          last_attempt_id = excluded.last_attempt_id,
          updated_at = now();
  end if;

  -- Skill state (§48.5)
  if p ? 'skill' then
    insert into public.learner_skill_state
      (learner_id, objective_id, stage, evidence,
       last_independent_success_at, due_at, updated_at)
    values
      ((p->>'learner_id')::uuid,
       p->'skill'->>'objective_id',
       p->'skill'->>'stage',
       p->'skill'->'evidence',
       nullif(p->'skill'->>'last_independent_success_at','')::timestamptz,
       nullif(p->'skill'->>'due_at','')::timestamptz,
       now())
    on conflict (learner_id, objective_id) do update
      set stage = excluded.stage,
          evidence = excluded.evidence,
          last_independent_success_at = excluded.last_independent_success_at,
          due_at = excluded.due_at,
          updated_at = now();
  end if;

  -- Objective state (§48.6)
  if p ? 'objective' then
    insert into public.learner_objective_state
      (learner_id, objective_id, readiness_status, score01,
       evidence_summary, current_misconceptions, last_evaluated_at)
    values
      ((p->>'learner_id')::uuid,
       p->'objective'->>'objective_id',
       p->'objective'->>'readiness_status',
       (p->'objective'->>'score01')::numeric,
       p->'objective'->'evidence_summary',
       coalesce(
         (select array_agg(x) from jsonb_array_elements_text(p->'objective'->'current_misconceptions') x),
         '{}'
       ),
       now())
    on conflict (learner_id, objective_id) do update
      set readiness_status = excluded.readiness_status,
          score01 = excluded.score01,
          evidence_summary = excluded.evidence_summary,
          current_misconceptions = excluded.current_misconceptions,
          last_evaluated_at = now();
  end if;

  -- Felbok (§13.6): errors open/refresh an entry; independent successes on
  -- separate dates accumulate toward resolution (two required).
  if p ? 'felbok_error' then
    insert into public.felbok_entries
      (learner_id, objective_id, misconception_id, error_tags,
       status, occurrences, last_attempt_id, last_seen_at)
    values
      ((p->>'learner_id')::uuid,
       p->'felbok_error'->>'objective_id',
       nullif(p->'felbok_error'->>'misconception_id',''),
       coalesce(
         (select array_agg(x) from jsonb_array_elements_text(p->'felbok_error'->'error_tags') x),
         '{}'
       ),
       'open', 1, v_attempt_id, now())
    on conflict (learner_id, objective_id, misconception_id) do update
      set occurrences = felbok_entries.occurrences + 1,
          status = 'open',
          independent_successes_after = '[]'::jsonb,
          last_attempt_id = v_attempt_id,
          last_seen_at = now(),
          resolved_at = null;
  end if;

  if p ? 'felbok_success' then
    update public.felbok_entries fe
       set independent_successes_after =
             case
               -- Only count one success per calendar date (§13.6).
               when fe.independent_successes_after @> to_jsonb(array[p->'felbok_success'->>'date'])
                 then fe.independent_successes_after
               else fe.independent_successes_after || to_jsonb(array[p->'felbok_success'->>'date'])
             end
     where fe.learner_id = (p->>'learner_id')::uuid
       and fe.objective_id = p->'felbok_success'->>'objective_id'
       and fe.status <> 'resolved';

    update public.felbok_entries fe
       set status = 'resolved', resolved_at = now()
     where fe.learner_id = (p->>'learner_id')::uuid
       and fe.objective_id = p->'felbok_success'->>'objective_id'
       and fe.status <> 'resolved'
       and jsonb_array_length(fe.independent_successes_after) >= 2;

    update public.felbok_entries fe
       set status = 'improving'
     where fe.learner_id = (p->>'learner_id')::uuid
       and fe.objective_id = p->'felbok_success'->>'objective_id'
       and fe.status = 'open'
       and jsonb_array_length(fe.independent_successes_after) = 1;
  end if;

  return v_attempt_id;
end;
$$;

revoke execute on function public.apply_attempt(jsonb) from anon;
revoke execute on function public.apply_attempt(jsonb) from authenticated;
