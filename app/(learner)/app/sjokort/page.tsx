import type { Metadata } from "next";
import { ChartLab } from "@/components/chart/chart-lab";
import { getChartTask, getChartTaskList } from "@/lib/chart/actions";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Sjökortslabbet" };

export default async function SjokortPage() {
  const tasks = await getChartTaskList();
  const initialTask = await getChartTask(tasks[0].id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sjökortslabbet · Grundviken
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Mät, sätt ut och räkna på ett fiktivt övningskort. Din lösning rättas
          på servern och det rätta svaret ritas ut efter att du svarat.{" "}
          {BRAND.navigationDisclaimer}
        </p>
      </header>
      <ChartLab initialTask={initialTask} />
    </div>
  );
}
