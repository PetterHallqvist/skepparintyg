import type { Metadata } from "next";
import { EntityStatus } from "@/components/admin/entity-status";
import { FactReverifyForm } from "@/components/admin/fact-reverify-form";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Officiella fakta" };

export default async function OfficialFactsPage() {
  const staff = await requireStaff();
  const canEdit = !staff.preview && ["admin", "editor"].includes(staff.role);
  const facts = staff.preview
    ? []
    : ((
        await (
          await createSupabaseServerClient()
        )
          .from("official_facts")
          .select(
            "id, certification_id, fact_key, value, public_copy_sv, verified_at, status",
          )
          .order("certification_id", { nullsFirst: true })
          .order("fact_key")
      ).data ?? []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Officiella fakta
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Provtider, godkäntgräns, åldersgränser och avgiftsfakta (SPEC §4,
          §44.5). Datadrivna och datumstämplade — aldrig hårdkodade i kod.
          Verifiera om alla värden inom 14 dagar före lansering.
        </p>
      </header>
      <div className="space-y-3">
        {facts.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Inga fakta i databasen ännu — Fas 0-registret i
            lib/content/official-facts.ts används tills detta fylls på.
          </p>
        ) : (
          facts.map((fact) => (
            <div
              key={fact.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-readout text-xs text-muted-foreground">
                  {fact.certification_id ?? "generellt"} · {fact.fact_key}
                </span>
                <span className="flex-1" />
                <EntityStatus status={fact.status} />
              </div>
              <p className="font-readout mt-2 text-lg">
                {JSON.stringify(fact.value)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {fact.public_copy_sv}
              </p>
              <SourceStamp
                checkedAt={new Date(fact.verified_at)
                  .toISOString()
                  .slice(0, 10)}
                className="mt-2 border-0 px-0"
              />
              {canEdit ? (
                <FactReverifyForm
                  factId={fact.id}
                  publicCopy={fact.public_copy_sv ?? ""}
                />
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
