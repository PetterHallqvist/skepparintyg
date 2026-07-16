import type { Metadata } from "next";
import { EntityStatus } from "@/components/admin/entity-status";
import { IssueTriage } from "@/components/admin/issue-triage";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Ärenden" };

export default async function IssuesPage() {
  const staff = await requireStaff();
  const canTriage =
    !staff.preview && ["admin", "editor", "support"].includes(staff.role);
  const issues = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("content_issues")
          .select(
            "id, entity_type, category, description, severity, status, created_at",
          )
          .order("created_at", { ascending: false })
          .limit(100)
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Ärenden</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Innehållsärenden från elever, granskare och källövervakning.
        </p>
      </header>
      <div className="space-y-2">
        {issues.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Inga ärenden.
          </p>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-label text-muted-foreground">
                  {issue.category}
                </span>
                <span className="text-label text-muted-foreground">
                  {issue.entity_type}
                </span>
                <span className="flex-1" />
                <EntityStatus status={issue.status} />
                <span className="text-label text-warning">
                  {issue.severity}
                </span>
              </div>
              <p className="mt-2 text-sm">{issue.description}</p>
              {canTriage ? (
                <IssueTriage issueId={issue.id} currentStatus={issue.status} />
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
