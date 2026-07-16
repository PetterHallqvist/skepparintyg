"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestAccountExport } from "@/lib/account/actions";

/** Downloads the caller's data export as JSON (SPEC §71.3). */
export function ExportButton({ enabled }: { enabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run() {
    setError(null);
    start(async () => {
      const r = await requestAccountExport();
      if (!r.ok) {
        setError(r.message);
        return;
      }
      const blob = new Blob([JSON.stringify(r.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sjoklart-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={run} disabled={!enabled || pending}>
        <Download aria-hidden="true" />
        {pending ? "Förbereder …" : "Ladda ner mina data (JSON)"}
      </Button>
      {!enabled && (
        <p className="text-sm text-muted-foreground">
          Export är tillgänglig när kontot är aktivt.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
