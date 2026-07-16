"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  publishVersion,
  recordReviewDecision,
  type ActionResult,
} from "@/lib/admin/actions";

const initial: ActionResult = { ok: true, message: "" };

/**
 * Decision + publish forms. Server actions; the DB publish-gate triggers are
 * the real enforcement — these forms surface their verdicts (e.g. "saknar
 * källa", "saknar godkänd domängranskning").
 */
export function ReviewActions({
  entityType,
  versionId,
  canReview,
  canPublish,
}: {
  entityType: "item" | "lesson";
  versionId: string;
  canReview: boolean;
  canPublish: boolean;
}) {
  const [reviewState, reviewAction, reviewPending] = useActionState(
    async (_prev: ActionResult, formData: FormData) =>
      recordReviewDecision(formData),
    initial,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => publishVersion(formData),
    initial,
  );

  const message = publishState.message || reviewState.message;
  const isError =
    (publishState.message && !publishState.ok) ||
    (reviewState.message && !reviewState.ok);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        {canReview ? (
          <form
            action={reviewAction}
            className="flex flex-wrap items-end gap-2"
          >
            <input type="hidden" name="entityType" value={entityType} />
            <input type="hidden" name="versionId" value={versionId} />
            <label className="grid gap-1 text-xs text-muted-foreground">
              Granskningstyp
              <select
                name="reviewType"
                className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                defaultValue="domain"
              >
                <option value="domain">Domän</option>
                <option value="editorial">Redaktionell</option>
                <option value="accessibility">Tillgänglighet</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Beslut
              <select
                name="decision"
                className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                defaultValue="approve"
              >
                <option value="approve">Godkänn</option>
                <option value="changes_requested">Begär ändringar</option>
                <option value="reject">Avvisa</option>
              </select>
            </label>
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={reviewPending}
            >
              {reviewPending ? "Sparar…" : "Spara beslut"}
            </Button>
          </form>
        ) : null}
        {canPublish ? (
          <form action={publishAction}>
            <input type="hidden" name="entityType" value={entityType} />
            <input type="hidden" name="versionId" value={versionId} />
            <Button type="submit" size="sm" disabled={publishPending}>
              {publishPending ? "Publicerar…" : "Publicera"}
            </Button>
          </form>
        ) : null}
      </div>
      {message ? (
        <p
          role="status"
          className={
            isError ? "text-xs text-destructive" : "text-xs text-success"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
