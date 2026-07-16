import type { Metadata } from "next";
import Link from "next/link";
import { DataReadout } from "@/components/design-system/data-readout";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Översikt" };

async function counts() {
  const supabase = await createSupabaseServerClient();
  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count: c } = await q;
    return c ?? 0;
  };
  const [objectives, itemsReview, itemsLive, lessons, issues, sources] =
    await Promise.all([
      count("objectives"),
      count("item_versions", ["status", "review"]),
      count("item_versions", ["status", "live"]),
      count("lesson_versions"),
      count("content_issues", ["status", "open"]),
      count("source_documents"),
    ]);
  return { objectives, itemsReview, itemsLive, lessons, issues, sources };
}

export default async function AdminOverviewPage() {
  const staff = await requireStaff();
  const data = staff.preview
    ? {
        objectives: 0,
        itemsReview: 0,
        itemsLive: 0,
        lessons: 0,
        issues: 0,
        sources: 0,
      }
    : await counts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Översikt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Innehållsläge för Förarintyg — inget blir live utan källa och godkänd
          granskning.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <DataReadout label="Mål" value={data.objectives} />
        <DataReadout label="Uppgifter i granskning" value={data.itemsReview} />
        <DataReadout label="Uppgifter live" value={data.itemsLive} />
        <DataReadout label="Lektionsversioner" value={data.lessons} />
        <DataReadout label="Öppna ärenden" value={data.issues} />
        <DataReadout label="Källor" value={data.sources} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/review"
          className="bezel rounded-lg border border-border bg-card p-5 transition-colors hover:border-sea-300/40"
        >
          <h2 className="font-semibold">Granskningskön</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fatta domän- och redaktionsbeslut. Publicering kräver källa + två
            godkännanden (säkerhetskritiskt: två olika granskare).
          </p>
        </Link>
        <Link
          href="/admin/settings/official-facts"
          className="bezel rounded-lg border border-border bg-card p-5 transition-colors hover:border-sea-300/40"
        >
          <h2 className="font-semibold">Officiella fakta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Datumstämplade provfakta (75 %, provtider, avgifter). Verifiera om
            regelbundet — aldrig hårdkodat i kod.
          </p>
        </Link>
      </div>
    </div>
  );
}
