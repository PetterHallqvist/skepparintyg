import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, NotebookPen, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataReadout } from "@/components/design-system/data-readout";
import { ReadinessGauge } from "@/components/design-system/readiness-gauge";
import { StatusChip } from "@/components/design-system/status-chip";

export const metadata: Metadata = { title: "Start" };

/**
 * Dashboard shell (SPEC §12.3): ONE primary action — "Dagens pass".
 * Placeholder data until the learning engine lands (Phase 2).
 */
export default function StartPage() {
  return (
    <div className="bg-graticule min-h-full">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label text-muted-foreground">Förarintyg</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              God eftermiddag
            </h1>
          </div>
          <StatusChip tone="info">Demo­data</StatusChip>
        </header>

        {/* Primary action */}
        <Card className="bezel">
          <CardContent className="flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-56">
              <p className="text-label text-muted-foreground">Dagens pass</p>
              <p className="mt-1.5 text-xl font-semibold">Cirka 18 minuter</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Repetition av väjningsregler · distansmätning · 4 blandade
                uppgifter
              </p>
            </div>
            <Button size="lg" render={<Link href="/app/ova" />}>
              Starta passet
              <ArrowRight aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Readiness */}
          <Card className="bezel">
            <CardHeader>
              <CardTitle className="text-label text-muted-foreground">
                Beredskap
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ReadinessGauge score={62} />
              <Link
                href="/app/framsteg"
                className="text-sm font-medium text-primary hover:underline"
              >
                Så beräknas detta
              </Link>
            </CardContent>
          </Card>

          {/* Status readouts */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DataReadout label="Att repetera" value={12} unit="kort" />
              <DataReadout label="Svaga områden" value={3} />
              <DataReadout
                label="Dagar till prov"
                value="—"
                hint="Ange provdatum"
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-label text-muted-foreground">
                  Fortsätt där du var
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  {
                    href: "/app/sjokort",
                    icon: Compass,
                    title: "Sjökortslabbet",
                    hint: "Mät distans i Grundviken",
                  },
                  {
                    href: "/app/ova",
                    icon: NotebookPen,
                    title: "Väjningsregler",
                    hint: "2 av 6 scenarier kvar",
                  },
                  {
                    href: "/app/framsteg",
                    icon: Timer,
                    title: "Träningssimulering",
                    hint: "Lås upp vid 75 i beredskap",
                  },
                ].map((row) => (
                  <Link
                    key={row.href}
                    href={row.href}
                    className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/40"
                  >
                    <row.icon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium">
                        {row.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {row.hint}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
