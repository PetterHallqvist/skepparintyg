import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusChip } from "@/components/design-system/status-chip";
import { CreateLearnerForm } from "@/components/guardian/create-learner-form";
import { getGuardianLearners } from "@/lib/guardian/data";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Elevprofiler" };

const AGE_BAND_LABELS: Record<string, string> = {
  under_13: "Under 13 år",
  "13_15": "13–15 år",
  "16_17": "16–17 år",
  "18_plus": "18+ år",
  unknown: "Okänd ålder",
};

export default async function GuardianLearnersPage() {
  const learners = await getGuardianLearners();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Elevprofiler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Varje elev studerar under sin egen profil. Studiedata tillhör eleven.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>

      {learners.length > 0 && (
        <ul className="mb-8 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {learners.map((l) => (
            <li key={l.id}>
              <Link
                href={`/app/guardian/learners/${l.id}`}
                className="flex items-center justify-between gap-3 bg-card px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <span>
                  <span className="font-medium">{l.displayName}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {AGE_BAND_LABELS[l.ageBand] ?? l.ageBand}
                    {l.isSelf ? " · egen profil" : ""}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-semibold">Lägg till elevprofil</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          {isSupabaseConfigured
            ? "Vi samlar bara in visningsnamn och åldersspann."
            : "Formuläret är aktivt först när inloggning är konfigurerad."}
        </p>
        <CreateLearnerForm />
      </div>
    </div>
  );
}
