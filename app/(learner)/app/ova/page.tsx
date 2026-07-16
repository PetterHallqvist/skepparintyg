import type { Metadata } from "next";
import { StatusChip } from "@/components/design-system/status-chip";
import { SessionPlayer } from "@/components/learning/session-player";
import { isSupabaseConfigured } from "@/lib/env";
import { getDemoChallenge } from "@/lib/learning/actions";

export const metadata: Metadata = { title: "Öva" };

export default async function OvaPage() {
  const initialChallenge = await getDemoChallenge(0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dagens pass</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fem blandade uppgifter. Varje svar rättas på servern och förklaras
            steg för steg.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demopass</StatusChip>
        ) : null}
      </header>
      <SessionPlayer initialChallenge={initialChallenge} />
    </div>
  );
}
