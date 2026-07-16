import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, NotebookPen, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/design-system/status-chip";
import {
  planRemediation,
  type FelbokEntry,
} from "@/lib/domain/session-planner";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Repetition" };

/**
 * Remediation session (SPEC §13.6). The plan is built server-side from the
 * learner's open felbok entries — misconception-grouped, each repair followed by
 * a fresh independent item on the same objective (needed for a resolution on a
 * separate date). Demo mode has no felbok, so it shows the empty state.
 */
export default async function RepetitionPage() {
  let entries: FelbokEntry[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("felbok_entries")
      .select("id, objective_id, misconception_id, status, occurrences")
      .neq("status", "resolved")
      .limit(50);
    entries = (data ?? []).map((e) => ({
      id: e.id as string,
      objectiveId: e.objective_id as string,
      misconceptionId: (e.misconception_id as string | null) ?? null,
      status: e.status as FelbokEntry["status"],
      occurrences: (e.occurrences as number) ?? 1,
    }));
  }

  const plan = planRemediation(entries);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/app/ova" />}
          className="-ml-2 text-muted-foreground"
        >
          <ArrowLeft aria-hidden="true" />
          Alla övningar
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Repetitionspass</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Ett riktat pass byggt från dina öppna felmönster — varje
              missuppfattning repareras och följs av en ny, självständig uppgift.
            </p>
          </div>
          {!isSupabaseConfigured ? (
            <StatusChip tone="warning">Demoläge</StatusChip>
          ) : null}
        </div>
      </header>

      {plan.length === 0 ? (
        <Card className="bezel flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
          <NotebookPen aria-hidden="true" className="size-6 text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">
            Inga öppna felmönster att träna på just nu. När du svarar fel i
            övningarna byggs ett riktat repetitionspass här.
          </p>
          <Button variant="outline" render={<Link href="/app/ova" />}>
            Till övningarna
          </Button>
        </Card>
      ) : (
        <ol className="space-y-3">
          {plan.map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
            >
              <span
                className={
                  step.mode === "repair"
                    ? "flex size-8 items-center justify-center rounded-md border border-warning/40 bg-warning/10"
                    : "flex size-8 items-center justify-center rounded-md border border-primary/40 bg-accent/40"
                }
              >
                {step.mode === "repair" ? (
                  <RefreshCw aria-hidden="true" className="size-4 text-warning" />
                ) : (
                  <Sparkles aria-hidden="true" className="size-4 text-primary" />
                )}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {step.mode === "repair" ? "Reparera" : "Ny uppgift"} ·{" "}
                  {step.objectiveId}
                </p>
                {step.misconceptionId ? (
                  <p className="text-xs text-muted-foreground">
                    Missuppfattning: {step.misconceptionId}
                  </p>
                ) : null}
              </div>
              <StatusChip tone={step.mode === "repair" ? "warning" : "info"}>
                {step.mode === "repair" ? "Repair" : "Fresh"}
              </StatusChip>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Ett felmönster räknas som löst först efter två självständiga rätt vid
        olika tillfällen (§13.6).
      </p>
    </div>
  );
}
