"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignSeatAction, removeSeatAction } from "@/lib/guardian/actions";

interface Learner {
  id: string;
  displayName: string;
}

/**
 * Seat assignment for one entitlement (SPEC §52.3). The seat cap is enforced
 * transactionally in the DB; the UI just reflects it and surfaces the reason on
 * refusal (e.g. "Alla elevplatser är upptagna").
 */
export function SeatManager({
  entitlementId,
  seatCount,
  assigned,
  accessibleLearners,
}: {
  entitlementId: string;
  seatCount: number;
  assigned: Learner[];
  accessibleLearners: Learner[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [pending, start] = useTransition();

  const assignedIds = new Set(assigned.map((a) => a.id));
  const available = accessibleLearners.filter((l) => !assignedIds.has(l.id));
  const seatsLeft = seatCount - assigned.length;

  function assign() {
    if (!selected) return;
    setError(null);
    start(async () => {
      const r = await assignSeatAction({ entitlementId, learnerId: selected });
      if (r.ok) {
        setSelected("");
        router.refresh();
      } else {
        setError(r.message);
      }
    });
  }

  function remove(learnerId: string) {
    setError(null);
    start(async () => {
      const r = await removeSeatAction({ entitlementId, learnerId });
      if (r.ok) router.refresh();
      else setError(r.message);
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-label text-muted-foreground">
        {assigned.length} av {seatCount} platser använda
      </p>

      <ul className="space-y-1.5">
        {assigned.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
          >
            <span>{a.displayName}</span>
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => remove(a.id)}
              aria-label={`Ta bort ${a.displayName}`}
            >
              <UserMinus aria-hidden="true" className="size-4" />
            </Button>
          </li>
        ))}
        {assigned.length === 0 && (
          <li className="text-sm text-muted-foreground">
            Ingen elev är tilldelad ännu.
          </li>
        )}
      </ul>

      {seatsLeft > 0 && available.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-label="Välj elev att tilldela"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Välj elev …</option>
            {available.map((l) => (
              <option key={l.id} value={l.id}>
                {l.displayName}
              </option>
            ))}
          </select>
          <Button size="sm" disabled={!selected || pending} onClick={assign}>
            Tilldela plats
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
