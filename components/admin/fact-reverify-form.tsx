"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { reverifyOfficialFact, type ActionResult } from "@/lib/admin/actions";

const initial: ActionResult = { ok: true, message: "" };

export function FactReverifyForm({
  factId,
  publicCopy,
}: {
  factId: string;
  publicCopy: string;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) =>
      reverifyOfficialFact(formData),
    initial,
  );

  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="factId" value={factId} />
      <label className="grid gap-1 text-xs text-muted-foreground">
        Publik text (visas med dagens datum som verifieringsdatum)
        <textarea
          name="publicCopy"
          defaultValue={publicCopy}
          rows={2}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
        />
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="secondary" disabled={pending}>
          {pending ? "Verifierar…" : "Verifiera med dagens datum"}
        </Button>
        {state.message ? (
          <p
            role="status"
            className={
              state.ok ? "text-xs text-success" : "text-xs text-destructive"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
