import type { Metadata } from "next";
import { AdminTable, EmptyRow } from "@/components/admin/admin-table";
import { EntityStatus } from "@/components/admin/entity-status";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Lektioner" };

export default async function LessonsPage() {
  const staff = await requireStaff();
  const lessons = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("lesson_versions")
          .select(
            "id, version, title_sv, lead_sv, estimated_minutes, status, lessons(slug, certification_id)",
          )
          .order("created_at", { ascending: true })
          .limit(100)
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Lektioner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lektionsversioner med blockinnehåll (SPEC §38). Live-versioner är
          oföränderliga — ändringar skapar en ny version.
        </p>
      </header>
      <AdminTable headers={["Slug", "Titel", "Ingress", "Min", "Status"]}>
        {lessons.length === 0 ? (
          <EmptyRow cols={5} message="Inga lektioner ännu." />
        ) : (
          lessons.map((l) => (
            <tr key={l.id} className="align-top">
              <td className="font-readout px-4 py-3 text-xs text-muted-foreground">
                {(l.lessons as { slug?: string } | null)?.slug} v{l.version}
              </td>
              <td className="px-4 py-3 font-medium">{l.title_sv}</td>
              <td className="max-w-md px-4 py-3 text-muted-foreground">
                {l.lead_sv}
              </td>
              <td className="font-readout px-4 py-3">{l.estimated_minutes}</td>
              <td className="px-4 py-3">
                <EntityStatus status={l.status} />
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
}
