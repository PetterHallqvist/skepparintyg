import { StatusChip } from "@/components/design-system/status-chip";

const TONE: Record<
  string,
  { tone: "neutral" | "info" | "success" | "warning" | "danger"; label: string }
> = {
  draft: { tone: "neutral", label: "Utkast" },
  review: { tone: "info", label: "Granskas" },
  approved: { tone: "info", label: "Godkänd" },
  active: { tone: "success", label: "Aktiv" },
  live: { tone: "success", label: "Live" },
  review_required: { tone: "warning", label: "Kräver omgranskning" },
  retired: { tone: "neutral", label: "Avvecklad" },
  superseded: { tone: "neutral", label: "Ersatt" },
  unavailable: { tone: "danger", label: "Otillgänglig" },
  open: { tone: "warning", label: "Öppet" },
  triaged: { tone: "info", label: "Triagerat" },
  in_progress: { tone: "info", label: "Pågår" },
  resolved: { tone: "success", label: "Löst" },
  rejected: { tone: "neutral", label: "Avvisat" },
};

export function EntityStatus({ status }: { status: string }) {
  const cfg = TONE[status] ?? { tone: "neutral" as const, label: status };
  return <StatusChip tone={cfg.tone}>{cfg.label}</StatusChip>;
}
