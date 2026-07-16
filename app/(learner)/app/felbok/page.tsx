import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import { StatusChip } from "@/components/design-system/status-chip";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Felboken" };

type Entry = {
  id: string;
  objective_id: string;
  misconception_id: string | null;
  status: string;
  occurrences: number;
  last_seen_at: string;
};

/**
 * Felboken (SPEC §13.6): grouped by misconception/objective, resolved only
 * after two independent correct attempts on separate dates.
 */
export default async function FelbokPage() {
  let entries: Entry[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("felbok_entries")
      .select(
        "id, objective_id, misconception_id, status, occurrences, last_seen_at",
      )
      .neq("status", "resolved")
      .order("last_seen_at", { ascending: false })
      .limit(50);
    entries = (data ?? []) as Entry[];
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Felboken</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Dina fel grupperade per missuppfattning — inte bara per fråga. En post
          markeras löst först efter två självständiga rätt vid olika tillfällen.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="bezel flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card/50 p-8 text-center">
          <NotebookPen
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
          <p className="max-w-sm text-sm text-muted-foreground">
            Inga öppna felmönster. När du svarar fel i övningarna samlas
            mönstren här tillsammans med en reparationsväg.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4"
            >
              <span className="flex-1 text-sm font-medium">
                {e.misconception_id ?? e.objective_id}
              </span>
              <span className="font-readout text-xs text-muted-foreground">
                ×{e.occurrences}
              </span>
              <StatusChip tone={e.status === "improving" ? "info" : "warning"}>
                {e.status === "improving" ? "På väg" : "Öppet"}
              </StatusChip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
