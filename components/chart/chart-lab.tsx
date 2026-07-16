"use client";

import { useReducer, useState } from "react";
import { ArrowRight, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusChip } from "@/components/design-system/status-chip";
import { distanceNm, trueCourseDeg, type Point } from "@/lib/chart/geometry";
import {
  getChartTask,
  submitChartTask,
  type ChartFeedback,
  type ChartTaskDto,
} from "@/lib/chart/actions";
import { ChartViewport } from "./chart-viewport";
import { initialToolState, toolReducer } from "./tool-reducer";

/**
 * Chart lab orchestrator (SPEC §20.10–20.11, §22): viewport + task panel,
 * live readout while measuring, typed alternative for every pointer task
 * (§20.10 accessibility), server-graded submission, §22.3 feedback overlays.
 */
export function ChartLab({ initialTask }: { initialTask: ChartTaskDto }) {
  const [task, setTask] = useState<ChartTaskDto>(initialTask);
  const [tool, dispatch] = useReducer(
    toolReducer,
    initialToolState(initialTask.toolKind),
  );
  const [typedRaw, setTypedRaw] = useState("");
  const [feedback, setFeedback] = useState<ChartFeedback | null>(null);
  const [busy, setBusy] = useState(false);

  const pxPerNm = task.chart.pxPerNm;
  const startPoint = (task.given.startPoint as Point | undefined) ?? null;

  const placedPoints: Point[] =
    tool.mode === "await_end"
      ? [tool.start]
      : tool.mode === "two_placed"
        ? [tool.start, tool.end]
        : tool.mode === "point_placed"
          ? [tool.point]
          : [];

  // Provisional readout (client-side preview only — server regrades, §58.2).
  const liveMeasure =
    tool.mode === "two_placed"
      ? {
          distance: distanceNm(tool.start, tool.end, pxPerNm),
          bearing: trueCourseDeg(tool.start, tool.end),
        }
      : null;

  const typedValue = (() => {
    const v = Number(typedRaw.replace(",", "."));
    return typedRaw.trim() !== "" && Number.isFinite(v) ? v : null;
  })();

  const canSubmit =
    !busy &&
    feedback === null &&
    (tool.mode === "two_placed" ||
      tool.mode === "point_placed" ||
      typedValue !== null);

  const submit = async () => {
    setBusy(true);
    dispatch({ type: "SUBMITTED" });
    try {
      const fb = await submitChartTask({
        taskId: task.id,
        points: placedPoints.length > 0 ? placedPoints : undefined,
        typedValue:
          placedPoints.length === 0 && typedValue !== null
            ? typedValue
            : undefined,
      });
      setFeedback(fb);
      dispatch({ type: "FEEDBACK_SHOWN" });
    } finally {
      setBusy(false);
    }
  };

  const loadNext = async () => {
    const nextIndex = (task.index + 1) % task.total;
    setBusy(true);
    try {
      const ids = await import("@/lib/chart/actions").then((m) =>
        m.getChartTaskList(),
      );
      const next = await getChartTask(ids[nextIndex].id);
      setTask(next);
      setFeedback(null);
      setTypedRaw("");
      dispatch({ type: "TASK_LOADED", kind: next.toolKind });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      {/* Chart (65–75 % on desktop, §20.11) */}
      <div>
        <ChartViewport
          svgUrl={task.chart.svg}
          widthPx={task.chart.widthPx}
          heightPx={task.chart.heightPx}
          disabled={task.toolKind === "typed_only" || feedback !== null}
          onPlace={(p) => {
            if (feedback) return;
            dispatch({ type: "PLACE", point: p });
          }}
          overlay={
            <ChartOverlay
              placed={placedPoints}
              startPoint={startPoint}
              feedback={feedback}
              pxPerNm={pxPerNm}
            />
          }
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Övningskort — ej för navigation. Panorera genom att dra, zooma med
          hjul/nyp eller knapparna. Tangentbord: pilar, +, −, 0.
        </p>
      </div>

      {/* Task panel — instructions persist outside the chart (§20.8) */}
      <aside className="space-y-4">
        <div className="bezel rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-readout text-xs text-muted-foreground">
              Uppgift {task.index + 1}/{task.total}
            </span>
            <StatusChip tone="info">Sjökortslabb</StatusChip>
          </div>
          <h2 className="mt-2 font-semibold">{task.titleSv}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {task.instructionSv}
          </p>

          {task.type === "compass_conversion" ? (
            <DeviationTable
              table={
                task.given.deviationTable as {
                  compassDeg: number;
                  deviationDeg: number;
                }[]
              }
            />
          ) : null}

          {/* Live instrument readout */}
          {liveMeasure ? (
            <dl className="font-readout mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
              <div>
                <dt className="text-label text-muted-foreground">Distans</dt>
                <dd>{liveMeasure.distance.toFixed(2).replace(".", ",")} M</dd>
              </div>
              <div>
                <dt className="text-label text-muted-foreground">Kurs</dt>
                <dd>{Math.round(liveMeasure.bearing)}°</dd>
              </div>
            </dl>
          ) : null}

          {/* Typed alternative — first-class accessibility path (§20.10) */}
          {task.typedUnit && placedPoints.length === 0 ? (
            <div className="mt-3 border-t border-border pt-3">
              <Label htmlFor="typed-answer" className="text-sm">
                {task.toolKind === "typed_only"
                  ? "Ditt svar"
                  : "Eller skriv ditt svar"}
              </Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  id="typed-answer"
                  inputMode="decimal"
                  value={typedRaw}
                  disabled={feedback !== null}
                  onChange={(e) => setTypedRaw(e.target.value)}
                  className="font-readout max-w-32"
                />
                <span className="text-sm text-muted-foreground">
                  {task.typedUnit}
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void submit()} disabled={!canSubmit}>
              {busy ? "Rättar…" : "Svara"}
            </Button>
            {task.toolKind !== "typed_only" && !feedback ? (
              <Button
                variant="outline"
                onClick={() => dispatch({ type: "CLEAR" })}
                disabled={placedPoints.length === 0}
              >
                <Eraser aria-hidden="true" />
                Rensa
              </Button>
            ) : null}
          </div>
        </div>

        {feedback ? (
          <div
            role="status"
            className={
              feedback.correct
                ? "space-y-2 rounded-lg border border-success/40 bg-success/10 p-4"
                : "space-y-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
            }
          >
            <p className="flex items-center gap-2 text-sm font-semibold">
              <StatusChip tone={feedback.correct ? "success" : "danger"}>
                {feedback.correct ? "Rätt" : "Fel"}
              </StatusChip>
              {feedback.oneLiner}
            </p>
            <dl className="font-readout grid grid-cols-2 gap-2 text-sm">
              {feedback.yourValue ? (
                <div>
                  <dt className="text-label text-muted-foreground">
                    Ditt svar
                  </dt>
                  <dd>{feedback.yourValue}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-label text-muted-foreground">Rätt svar</dt>
                <dd>{feedback.correctValue}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              {feedback.toleranceNote}
            </p>
            <p className="text-sm text-muted-foreground">
              {feedback.explanation}
            </p>
            <div className="flex justify-end pt-1">
              <Button onClick={() => void loadNext()} disabled={busy}>
                Nästa uppgift
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

/** Overlay: learner marks while working; correct geometry after grading (§22.3). */
function ChartOverlay({
  placed,
  startPoint,
  feedback,
  pxPerNm,
}: {
  placed: Point[];
  startPoint: Point | null;
  feedback: ChartFeedback | null;
  pxPerNm: number;
}) {
  const learner = "#0e7490";
  const correct = "#15803d";
  return (
    <g>
      {startPoint ? (
        <g>
          <circle
            cx={startPoint.x}
            cy={startPoint.y}
            r={10}
            fill="none"
            stroke={learner}
            strokeWidth={3}
          />
          <circle cx={startPoint.x} cy={startPoint.y} r={3} fill={learner} />
        </g>
      ) : null}

      {placed.length === 2 ? (
        <line
          x1={placed[0].x}
          y1={placed[0].y}
          x2={placed[1].x}
          y2={placed[1].y}
          stroke={learner}
          strokeWidth={3}
          strokeDasharray="10 6"
        />
      ) : null}
      {(startPoint && placed.length === 1 ? [startPoint, placed[0]] : []).map(
        (_, i, arr) =>
          i === 0 && arr.length === 2 ? (
            <line
              key="plot-line"
              x1={arr[0].x}
              y1={arr[0].y}
              x2={arr[1].x}
              y2={arr[1].y}
              stroke={learner}
              strokeWidth={3}
            />
          ) : null,
      )}
      {placed.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={12}
            fill="none"
            stroke={learner}
            strokeWidth={3}
          />
          <path
            d={`M ${p.x - 16} ${p.y} h 8 M ${p.x + 8} ${p.y} h 8 M ${p.x} ${p.y - 16} v 8 M ${p.x} ${p.y + 8} v 8`}
            stroke={learner}
            strokeWidth={2.5}
          />
        </g>
      ))}

      {/* Correct answer AFTER submission only */}
      {feedback?.overlay?.kind === "line" ? (
        <g>
          <line
            x1={feedback.overlay.from.x}
            y1={feedback.overlay.from.y}
            x2={feedback.overlay.to.x}
            y2={feedback.overlay.to.y}
            stroke={correct}
            strokeWidth={3.5}
          />
          <circle
            cx={feedback.overlay.to.x}
            cy={feedback.overlay.to.y}
            r={8}
            fill="none"
            stroke={correct}
            strokeWidth={3}
          />
        </g>
      ) : null}
      {feedback?.overlay?.kind === "point" ? (
        <g>
          <circle
            cx={feedback.overlay.point.x}
            cy={feedback.overlay.point.y}
            r={feedback.overlay.toleranceRadiusPx}
            fill="none"
            stroke={correct}
            strokeWidth={2.5}
            strokeDasharray="8 6"
          />
          <circle
            cx={feedback.overlay.point.x}
            cy={feedback.overlay.point.y}
            r={5}
            fill={correct}
          />
        </g>
      ) : null}
      <title>{pxPerNm > 0 ? "" : ""}</title>
    </g>
  );
}

function DeviationTable({
  table,
}: {
  table: { compassDeg: number; deviationDeg: number }[];
}) {
  return (
    <details className="mt-3 border-t border-border pt-3 text-sm">
      <summary className="cursor-pointer font-medium">Deviationstabell</summary>
      <table className="font-readout mt-2 w-full text-xs">
        <thead>
          <tr className="text-label text-muted-foreground">
            <th className="py-1 text-left">Kompass</th>
            <th className="py-1 text-left">Deviation</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.compassDeg} className="border-t border-border/60">
              <td className="py-1">{row.compassDeg}°</td>
              <td className="py-1">
                {row.deviationDeg > 0 ? "+" : ""}
                {row.deviationDeg}°
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
