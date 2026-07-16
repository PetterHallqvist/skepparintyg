import type { Metadata } from "next";
import { StatusChip } from "@/components/design-system/status-chip";
import { TrainerDirectory } from "@/components/learning/trainer-directory";
import { TRACK_META } from "@/lib/learning/track-meta";
import { trackCount } from "@/lib/learning/tracks";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Öva" };

/**
 * Trainer directory. Counts come from the server-only track registry; the open
 * felbok total (DB mode only) surfaces the "Träna på dina fel" remediation card.
 */
export default async function OvaPage() {
  const counts = Object.fromEntries(
    TRACK_META.map((t) => [t.id, trackCount(t.id)]),
  );

  let felbokOpen = 0;
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from("felbok_entries")
      .select("id", { count: "exact", head: true })
      .neq("status", "resolved");
    felbokOpen = count ?? 0;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Öva</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Välj ett pass. Varje svar rättas på servern och förklaras steg för
            steg.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>
      <TrainerDirectory counts={counts} felbokOpen={felbokOpen} />
    </div>
  );
}
