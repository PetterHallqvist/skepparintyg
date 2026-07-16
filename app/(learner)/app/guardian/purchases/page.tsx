import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/design-system/status-chip";
import { SeatManager } from "@/components/guardian/seat-manager";
import {
  getGuardianEntitlements,
  getGuardianLearners,
} from "@/lib/guardian/data";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Köp och platser" };

export default async function GuardianPurchasesPage() {
  const [entitlements, learners] = await Promise.all([
    getGuardianEntitlements(),
    getGuardianLearners(),
  ]);
  const accessible = learners.map((l) => ({ id: l.id, displayName: l.displayName }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Köp och platser
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tilldela elevplatser till dina elevprofiler.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>

      {entitlements.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Du har inga aktiva köp ännu.
          </p>
          <Button className="mt-4" render={<Link href="/priser" />}>
            Se priser
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {entitlements.map((e) => (
            <li key={e.id} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{e.productId}</h2>
                <StatusChip tone="success">Aktiv</StatusChip>
              </div>
              <SeatManager
                entitlementId={e.id}
                seatCount={e.seatCount}
                assigned={e.assignedLearners.map((a) => ({
                  id: a.learnerId,
                  displayName: a.displayName,
                }))}
                accessibleLearners={accessible}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
