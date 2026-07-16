"use client";

import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  CloudSun,
  Compass,
  GraduationCap,
  Lightbulb,
  NotebookPen,
  Radar,
  Sailboat,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/design-system/status-chip";
import { TRACK_META } from "@/lib/learning/track-meta";
import { cn } from "@/lib/utils";

/**
 * Trainer directory (the /app/ova hub). One card per practice track, plus the
 * chart lab and — when there are open felbok patterns — a remediation entry.
 * Counts and the felbok total are computed server-side and passed in.
 */

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Lightbulb,
  Sailboat,
  Anchor,
  CloudSun,
  Radar,
};

function TrainerCard({
  href,
  title,
  blurb,
  icon: Icon,
  meta,
  accent,
}: {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  meta?: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={cn(
        "bezel group relative flex flex-col gap-3 p-5 transition-colors hover:border-primary/50",
        accent && "border-primary/40",
      )}
    >
      <Link href={href} className="absolute inset-0" aria-label={title}>
        <span className="sr-only">{title}</span>
      </Link>
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-md border border-border bg-accent/40">
          <Icon aria-hidden="true" className="size-5 text-primary" />
        </span>
        {meta ? (
          <span className="font-readout text-xs text-muted-foreground">{meta}</span>
        ) : null}
      </div>
      <div>
        <h3 className="flex items-center gap-1.5 text-base font-semibold">
          {title}
          <ArrowRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
      </div>
    </Card>
  );
}

export function TrainerDirectory({
  counts,
  felbokOpen,
}: {
  counts: Record<string, number>;
  felbokOpen: number;
}) {
  return (
    <div className="space-y-6">
      {felbokOpen > 0 ? (
        <Card className="bezel flex flex-wrap items-center justify-between gap-3 border-warning/40 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md border border-warning/40 bg-warning/10">
              <NotebookPen aria-hidden="true" className="size-5 text-warning" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Träna på dina fel</h3>
              <p className="text-sm text-muted-foreground">
                Ett riktat pass byggt från dina öppna felmönster.
              </p>
            </div>
          </div>
          <div className="relative">
            <StatusChip tone="warning">{felbokOpen} öppna</StatusChip>
            <Link href="/app/ova/repetition" className="absolute inset-0" aria-label="Starta repetitionspass">
              <span className="sr-only">Starta repetitionspass</span>
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACK_META.map((t) => (
          <TrainerCard
            key={t.id}
            href={t.route}
            title={t.title}
            blurb={t.blurb}
            icon={ICONS[t.icon] ?? GraduationCap}
            meta={counts[t.id] ? `${counts[t.id]} uppgifter` : undefined}
            accent={t.id === "demo"}
          />
        ))}
        <TrainerCard
          href="/app/sjokort"
          title="Sjökortslabbet"
          blurb="Mät, sätt ut och räkna på ett fiktivt övningskort."
          icon={Compass}
        />
      </div>
    </div>
  );
}
