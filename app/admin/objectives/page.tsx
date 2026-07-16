import type { Metadata } from "next";
import { AdminTable, EmptyRow } from "@/components/admin/admin-table";
import { EntityStatus } from "@/components/admin/entity-status";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Mål" };

export default async function ObjectivesPage() {
  const staff = await requireStaff();
  const objectives = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("objectives")
          .select(
            "id, section_key, order_index, title_sv, outcome_sv, objective_type, criticality, status",
          )
          .order("section_key")
          .order("order_index")
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Mål</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Atomära lärandemål per kursplaneavsnitt (SPEC §14). Ett mål = en
          observerbar förmåga.
        </p>
      </header>
      <AdminTable
        headers={["Avsnitt", "ID", "Mål", "Typ", "Kritikalitet", "Status"]}
      >
        {objectives.length === 0 ? (
          <EmptyRow
            cols={6}
            message="Inga mål ännu — kör seed eller importera."
          />
        ) : (
          objectives.map((o) => (
            <tr key={o.id} className="align-top">
              <td className="text-label px-4 py-3 text-muted-foreground">
                {o.section_key}
              </td>
              <td className="font-readout px-4 py-3 text-xs text-muted-foreground">
                {o.id}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{o.title_sv}</p>
                <p className="text-xs text-muted-foreground">{o.outcome_sv}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {o.objective_type}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {o.criticality === "safety_critical" ? (
                  <span className="font-medium text-warning">
                    säkerhetskritiskt
                  </span>
                ) : (
                  o.criticality
                )}
              </td>
              <td className="px-4 py-3">
                <EntityStatus status={o.status} />
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
}
