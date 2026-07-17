import type { Metadata } from "next";
import { StatusChip } from "@/components/design-system/status-chip";
import { TrainerDirectory } from "@/components/learning/trainer-directory";
import { requireActiveCertification } from "@/lib/certifications/active";
import { trackCount } from "@/lib/learning/tracks";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Öva" };

/**
 * Trainer directory for the ACTIVE certification: only its tracks render, so
 * an SRC learner never sees chart or light trainers. Counts come from the
 * strict (certification, track) registry; the open felbok total (DB mode)
 * surfaces the "Träna på dina fel" remediation card.
 */
export default async function OvaPage() {
  const def = await requireActiveCertification("/app/ova");
  const counts = Object.fromEntries(
    def.tracks.map((t) => [t.id, trackCount(def.id, t.id)]),
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
          <p className="text-label text-muted-foreground">{def.nameSv}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Öva</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Välj ett pass. Varje svar rättas på servern och förklaras steg för
            steg.
          </p>
        </div>
        <div className="flex gap-2">
          {def.status === "preview" ? (
            <StatusChip tone="warning">Förhandsversion</StatusChip>
          ) : null}
          {!isSupabaseConfigured ? (
            <StatusChip tone="warning">Demoläge</StatusChip>
          ) : null}
        </div>
      </header>
      <TrainerDirectory
        tracks={[...def.tracks]}
        counts={counts}
        chartLab={def.chartLab}
        felbokOpen={felbokOpen}
      />
    </div>
  );
}
