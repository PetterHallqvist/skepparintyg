import type { Metadata } from "next";
import { EntityStatus } from "@/components/admin/entity-status";
import { ItemPreview } from "@/components/admin/item-preview";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Uppgifter" };

export default async function ItemsPage() {
  const staff = await requireStaff();
  const items = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("item_versions")
          .select(
            "id, version, stem_sv, interaction, answer_key, explanation_sv, criticality, status, item_templates(stable_key, item_kind)",
          )
          .order("created_at", { ascending: true })
          .limit(200)
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Uppgifter</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} uppgiftsversioner. Nya versioner skapas via
            innehållspipelinen; live-versioner är oföränderliga.
          </p>
        </div>
      </header>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Inga uppgifter ännu — kör seed eller importera via pipeline.
          </p>
        ) : (
          items.map((item) => (
            <details
              key={item.id}
              className="group rounded-lg border border-border bg-card"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="font-readout text-xs text-muted-foreground">
                  {
                    (item.item_templates as { stable_key?: string } | null)
                      ?.stable_key
                  }{" "}
                  v{item.version}
                </span>
                <span className="flex-1 truncate text-sm">{item.stem_sv}</span>
                <span className="text-label text-muted-foreground">
                  {
                    (item.item_templates as { item_kind?: string } | null)
                      ?.item_kind
                  }
                </span>
                <EntityStatus status={item.status} />
              </summary>
              <div className="border-t border-border p-4">
                <ItemPreview
                  kind={
                    (item.item_templates as { item_kind?: string } | null)
                      ?.item_kind ?? "unknown"
                  }
                  interaction={item.interaction as Record<string, unknown>}
                  answerKey={item.answer_key as Record<string, unknown>}
                  explanation={item.explanation_sv}
                />
              </div>
            </details>
          ))
        )}
      </div>
    </div>
  );
}
