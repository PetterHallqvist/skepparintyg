import type { Metadata } from "next";
import { DataReadout } from "@/components/design-system/data-readout";
import { ReadinessGauge } from "@/components/design-system/readiness-gauge";
import { StatusChip } from "@/components/design-system/status-chip";
import {
  computeReadiness,
  DEFAULT_WEIGHTS,
  type ReadinessComponents,
} from "@/lib/domain/readiness";
import { FORAR_MODULES } from "@/lib/curriculum/modules";
import { BRAND } from "@/lib/brand";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Framsteg" };

const COMPONENT_LABELS: Record<keyof ReadinessComponents, string> = {
  coverage: "Måltäckning",
  recall: "Varaktigt minne",
  procedural: "Praktisk färdighet",
  simulations: "Simuleringar",
  calibration: "Kalibrering & aktualitet",
};

/**
 * Beredskap dashboard (SPEC §17.5): the score is never shown without its
 * "Så beräknas detta" explanation. Demo evidence until the DB path is live.
 */
export default function FramstegPage() {
  const components: ReadinessComponents = {
    coverage: 0.55,
    recall: 0.62,
    procedural: 0.4,
    simulations: 0,
    calibration: 0.7,
  };
  const result = computeReadiness(components, {
    unseenSafetyCriticalObjective: false,
    failedSafetyCriticalLast72h: false,
    noValidTimedSimulation: true,
    noIndependentChartEvidence: true,
    staleSyllabusMapping: false,
  });

  if (result.hidden) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="rounded-lg border border-warning/50 bg-warning/10 p-6 text-sm">
          {result.reason_sv}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-graticule min-h-full">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Framsteg</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {BRAND.readinessDisclaimer}
            </p>
          </div>
          {!isSupabaseConfigured ? (
            <StatusChip tone="warning">Demodata</StatusChip>
          ) : null}
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bezel flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-8">
            <ReadinessGauge score={result.score} />
          </div>

          {/* §17.5 — Så beräknas detta */}
          <section
            aria-labelledby="sa-beraknas"
            className="rounded-lg border border-border bg-card p-6"
          >
            <h2 id="sa-beraknas" className="text-label text-muted-foreground">
              Så beräknas detta
            </h2>
            <ul className="mt-4 space-y-3">
              {(
                Object.keys(COMPONENT_LABELS) as (keyof ReadinessComponents)[]
              ).map((key) => (
                <li
                  key={key}
                  className="grid grid-cols-[1fr_auto] items-center gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {COMPONENT_LABELS[key]}
                      <span className="ml-2 text-xs text-muted-foreground">
                        vikt {Math.round(DEFAULT_WEIGHTS[key] * 100)} %
                      </span>
                    </p>
                    <div
                      role="progressbar"
                      aria-valuenow={Math.round(components[key] * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={COMPONENT_LABELS[key]}
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${components[key] * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-readout text-sm">
                    {Math.round(components[key] * 100)}
                  </span>
                </li>
              ))}
            </ul>

            {result.appliedCaps.length > 0 ? (
              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <p className="text-label text-warning">Aktiva tak</p>
                {result.appliedCaps.map((cap) => (
                  <p
                    key={cap.reason_sv}
                    className="text-sm text-muted-foreground"
                  >
                    Max {cap.cap}: {cap.reason_sv}
                  </p>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DataReadout
            label="Rå poäng"
            value={result.rawScore}
            hint="före tak"
          />
          <DataReadout label="Beredskap" value={result.score} unit="/100" />
          <DataReadout label="Aktiva tak" value={result.appliedCaps.length} />
          <DataReadout label="Algoritm" value="v1" hint="beredskap-v1" />
        </div>

        {/* §28 — per-module breadth */}
        <section
          aria-labelledby="moduler"
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id="moduler" className="text-label text-muted-foreground">
              Måltäckning per modul (F1–F12)
            </h2>
            <span className="text-xs text-muted-foreground">
              Praktiska knopmoment räknas som ”teoretiskt förberedd”
            </span>
          </div>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {FORAR_MODULES.map((m) => {
              const pct = Math.round(m.demoReadiness * 100);
              return (
                <li key={m.id} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3">
                  <span className="font-readout text-xs text-muted-foreground">
                    {m.id}
                  </span>
                  <div>
                    <p className="text-sm">{m.title_sv}</p>
                    <div
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${m.id} ${m.title_sv}`}
                      className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className={pct >= 60 ? "h-full bg-primary" : "h-full bg-warning"}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-readout text-right text-sm">{pct}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
