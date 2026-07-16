"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Point } from "@/lib/chart/geometry";

/**
 * ChartViewport (SPEC §20.8): pan (drag/keyboard), wheel zoom centred on the
 * pointer, two-pointer pinch, fit-to-chart, zoom clamp 0.5–5×. The base SVG
 * is referenced as an <image>; overlays render in chart coordinates on top.
 * Page scroll is never hijacked outside an active gesture (non-passive wheel
 * listener is scoped to the element).
 */

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const DRAG_THRESHOLD_PX = 6;

type ViewBox = { x: number; y: number; w: number; h: number };

export function ChartViewport({
  svgUrl,
  widthPx,
  heightPx,
  onPlace,
  overlay,
  disabled,
}: {
  svgUrl: string;
  widthPx: number;
  heightPx: number;
  /** Called with CHART coordinates when the learner clicks/taps (not drags). */
  onPlace: (point: Point) => void;
  overlay?: ReactNode;
  disabled?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState<ViewBox>({
    x: 0,
    y: 0,
    w: widthPx,
    h: heightPx,
  });

  const zoomLevel = widthPx / view.w;

  const clampView = useCallback(
    (v: ViewBox): ViewBox => {
      const w = Math.min(widthPx / MIN_ZOOM, Math.max(widthPx / MAX_ZOOM, v.w));
      const h = w * (heightPx / widthPx);
      const x = Math.min(Math.max(v.x, -w * 0.5), widthPx - w * 0.5);
      const y = Math.min(Math.max(v.y, -h * 0.5), heightPx - h * 0.5);
      return { x, y, w, h };
    },
    [widthPx, heightPx],
  );

  const toChartPoint = useCallback(
    (clientX: number, clientY: number): Point => {
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      return {
        x: view.x + ((clientX - rect.left) / rect.width) * view.w,
        y: view.y + ((clientY - rect.top) / rect.height) * view.h,
      };
    },
    [view],
  );

  const zoomAt = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      setView((prev) => {
        const svg = svgRef.current;
        let fx = 0.5;
        let fy = 0.5;
        if (svg && clientX !== undefined && clientY !== undefined) {
          const rect = svg.getBoundingClientRect();
          fx = (clientX - rect.left) / rect.width;
          fy = (clientY - rect.top) / rect.height;
        }
        const w = prev.w / factor;
        const h = prev.h / factor;
        return clampView({
          x: prev.x + (prev.w - w) * fx,
          y: prev.y + (prev.h - h) * fy,
          w,
          h,
        });
      });
    },
    [clampView],
  );

  // Non-passive wheel zoom (React's synthetic wheel can't preventDefault).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Pointer gestures: pan-drag, tap-to-place, two-pointer pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startView: ViewBox;
    startClient: { x: number; y: number };
    moved: boolean;
    pinchStartDist: number | null;
  } | null>(null);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // Synthetic/test events carry pointer ids that cannot be captured.
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = {
        startView: view,
        startClient: { x: e.clientX, y: e.clientY },
        moved: false,
        pinchStartDist: null,
      };
    } else if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinchStartDist = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.moved = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (pointers.current.size === 2 && g.pinchStartDist) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > 0) {
        zoomAt(dist / g.pinchStartDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
        g.pinchStartDist = dist;
      }
      return;
    }

    const dx = e.clientX - g.startClient.x;
    const dy = e.clientY - g.startClient.y;
    if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    g.moved = true;

    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    setView(
      clampView({
        ...g.startView,
        x: g.startView.x - (dx / rect.width) * g.startView.w,
        y: g.startView.y - (dy / rect.height) * g.startView.h,
      }),
    );
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (g && !g.moved && !disabled) {
        onPlace(toChartPoint(e.clientX, e.clientY));
      }
      gesture.current = null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    const panStep = view.w * 0.08;
    const apply = (dx: number, dy: number) =>
      setView((prev) => clampView({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        apply(-panStep, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        apply(panStep, 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        apply(0, -panStep);
        break;
      case "ArrowDown":
        e.preventDefault();
        apply(0, panStep);
        break;
      case "+":
      case "=":
        e.preventDefault();
        zoomAt(1.2);
        break;
      case "-":
        e.preventDefault();
        zoomAt(1 / 1.2);
        break;
      case "0":
        e.preventDefault();
        setView({ x: 0, y: 0, w: widthPx, h: heightPx });
        break;
      case "Enter":
      case " ":
        // Keyboard placement (§20.10): place at the viewport centre reticle.
        if (!disabled) {
          e.preventDefault();
          onPlace({ x: view.x + view.w / 2, y: view.y + view.h / 2 });
        }
        break;
    }
  };

  const [focused, setFocused] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#fdfdfb]">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role="application"
        aria-label="Övningssjökort. Panorera med piltangenterna, zooma med plus och minus, återställ med noll, placera en markering i siktets mitt med Enter. Ej för navigation."
        tabIndex={0}
        className="block aspect-3/2 w-full cursor-crosshair touch-none select-none outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <image href={svgUrl} width={widthPx} height={heightPx} />
        {overlay}
        {focused && !disabled ? (
          <g aria-hidden="true" opacity={0.85}>
            <circle
              cx={view.x + view.w / 2}
              cy={view.y + view.h / 2}
              r={view.w * 0.012}
              fill="none"
              stroke="#0e7490"
              strokeWidth={view.w * 0.0022}
              strokeDasharray={`${view.w * 0.008} ${view.w * 0.006}`}
            />
            <path
              d={`M ${view.x + view.w / 2 - view.w * 0.022} ${view.y + view.h / 2} h ${view.w * 0.012} M ${view.x + view.w / 2 + view.w * 0.01} ${view.y + view.h / 2} h ${view.w * 0.012} M ${view.x + view.w / 2} ${view.y + view.h / 2 - view.w * 0.022} v ${view.w * 0.012} M ${view.x + view.w / 2} ${view.y + view.h / 2 + view.w * 0.01} v ${view.w * 0.012}`}
              stroke="#0e7490"
              strokeWidth={view.w * 0.0022}
            />
          </g>
        ) : null}
      </svg>

      {/* Zoom controls: 44px targets (§20.8) */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          aria-label="Zooma in"
          onClick={() => zoomAt(1.3)}
        >
          <Plus aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          aria-label="Zooma ut"
          onClick={() => zoomAt(1 / 1.3)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          aria-label="Visa hela kortet"
          onClick={() => setView({ x: 0, y: 0, w: widthPx, h: heightPx })}
        >
          <Maximize aria-hidden="true" />
        </Button>
      </div>

      <span className="font-readout pointer-events-none absolute bottom-2 right-3 rounded bg-white/80 px-1.5 text-xs text-navy-800">
        {zoomLevel.toFixed(1)}×
      </span>
    </div>
  );
}
