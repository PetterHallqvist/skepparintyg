import type { Metadata } from "next";
import { AdminTable, EmptyRow } from "@/components/admin/admin-table";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Logg" };

export default async function AuditPage() {
  const staff = await requireStaff();
  const events =
    staff.preview || staff.role !== "admin"
      ? []
      : ((
          await (
            await createSupabaseServerClient()
          )
            .from("audit_events")
            .select(
              "id, actor_user_id, actor_type, action, entity_type, entity_id, created_at",
            )
            .order("id", { ascending: false })
            .limit(200)
        ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Ändringslogg</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit-händelser (endast admin). Poster skapas via log_audit — aldrig
          direkt från klienten.
        </p>
      </header>
      <AdminTable headers={["Tid", "Aktör", "Händelse", "Entitet", "ID"]}>
        {events.length === 0 ? (
          <EmptyRow
            cols={5}
            message="Inga händelser (eller behörighet saknas)."
          />
        ) : (
          events.map((e) => (
            <tr key={e.id}>
              <td className="font-readout px-4 py-2.5 text-xs text-muted-foreground">
                {new Date(e.created_at)
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 16)}
              </td>
              <td className="font-readout px-4 py-2.5 text-xs">
                {e.actor_type}
                {e.actor_user_id ? ` ${e.actor_user_id.slice(0, 8)}…` : ""}
              </td>
              <td className="px-4 py-2.5 font-medium">{e.action}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {e.entity_type}
              </td>
              <td className="font-readout px-4 py-2.5 text-xs text-muted-foreground">
                {e.entity_id}
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
}
