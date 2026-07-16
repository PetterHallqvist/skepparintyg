"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { triageIssue, type ActionResult } from "@/lib/admin/actions";

const initial: ActionResult = { ok: true, message: "" };

export function IssueTriage({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: string;
}) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => triageIssue(formData),
    initial,
  );

  return (
    <form action={action} className="mt-3 flex flex-wrap items-end gap-2">
      <input type="hidden" name="issueId" value={issueId} />
      <label className="grid gap-1 text-xs text-muted-foreground">
        Status
        <select
          name="status"
          defaultValue={currentStatus}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        >
          <option value="open">Öppet</option>
          <option value="triaged">Triagerat</option>
          <option value="in_progress">Pågår</option>
          <option value="resolved">Löst</option>
          <option value="rejected">Avvisat</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Allvarlighet
        <select
          name="severity"
          defaultValue=""
          className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
        >
          <option value="">(oförändrad)</option>
          <option value="minor">Mindre</option>
          <option value="major">Större</option>
          <option value="blocker">Blockerande</option>
          <option value="safety">Säkerhet</option>
        </select>
      </label>
      <Button type="submit" size="sm" variant="secondary" disabled={pending}>
        {pending ? "Sparar…" : "Uppdatera"}
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
    </form>
  );
}
