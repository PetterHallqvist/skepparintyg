import type { Metadata } from "next";
import { AdminTable, EmptyRow } from "@/components/admin/admin-table";
import { EntityStatus } from "@/components/admin/entity-status";
import { SourceFlagButton } from "@/components/admin/source-flag-button";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Källor" };

export default async function SourcesPage() {
  const staff = await requireStaff();
  const canFlag = !staff.preview && ["admin", "editor"].includes(staff.role);
  const sources = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("source_documents")
          .select(
            "id, source_key, title, issuer, canonical_url, document_version, last_checked_at, next_review_at, status, metadata",
          )
          .order("source_key")
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Källor</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Källregistret (SPEC §3.2). Att flagga en källa markerar alla beroende
          mål review_required och öppnar ett ärende — innehåll avpubliceras
          aldrig automatiskt (§3.3).
        </p>
      </header>
      <AdminTable
        headers={[
          "Nyckel",
          "Titel",
          "Utgivare",
          "Senast kontrollerad",
          "Status",
          "",
        ]}
      >
        {sources.length === 0 ? (
          <EmptyRow cols={6} message="Inga källor registrerade." />
        ) : (
          sources.map((s) => (
            <tr key={s.id} className="align-top">
              <td className="font-readout px-4 py-3 text-xs text-muted-foreground">
                {s.source_key}
                {(s.metadata as { placeholder?: boolean } | null)
                  ?.placeholder ? (
                  <span className="ml-2 text-warning">PLATSHÅLLARE</span>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <a
                  href={s.canonical_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline"
                >
                  {s.title}
                </a>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{s.issuer}</td>
              <td className="font-readout px-4 py-3 text-xs">
                {new Date(s.last_checked_at).toISOString().slice(0, 10)}
              </td>
              <td className="px-4 py-3">
                <EntityStatus status={s.status} />
              </td>
              <td className="px-4 py-3">
                {canFlag && s.status !== "review_required" ? (
                  <SourceFlagButton sourceId={s.id} />
                ) : null}
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
}
