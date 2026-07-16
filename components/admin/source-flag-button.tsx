"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  flagSourceReviewRequired,
  type ActionResult,
} from "@/lib/admin/actions";

const initial: ActionResult = { ok: true, message: "" };

export function SourceFlagButton({ sourceId }: { sourceId: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) =>
      flagSourceReviewRequired(formData),
    initial,
  );

  return (
    <form action={action} className="space-y-1">
      <input type="hidden" name="sourceId" value={sourceId} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Flaggar…" : "Flagga ändrad"}
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
