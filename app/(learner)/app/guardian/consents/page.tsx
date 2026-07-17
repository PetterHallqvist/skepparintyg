import type { Metadata } from "next";
import { StatusChip } from "@/components/design-system/status-chip";
import { ConsentToggles } from "@/components/guardian/consent-toggles";
import { getGuardianLearners, getLatestConsents } from "@/lib/guardian/data";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Samtycken" };

export default async function GuardianConsentsPage() {
  const learners = await getGuardianLearners();
  const consents = await Promise.all(
    learners.map((l) => getLatestConsents(l.id)),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Samtycken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Varje ändamål styrs för sig. Analys och påminnelser är avstängda som
            standard.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>

      {learners.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Lägg till en elevprofil för att hantera samtycken.
        </p>
      ) : (
        <ul className="space-y-6">
          {learners.map((l, i) => (
            <li key={l.id} className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-semibold">{l.displayName}</h2>
              <div className="mt-2">
                <ConsentToggles learnerId={l.id} initial={consents[i]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
