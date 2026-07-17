import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExportButton } from "@/components/account/export-button";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Exportera mina data" };

export default function ExportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/app/konto"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Konto
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        Exportera mina data
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Du kan när som helst ladda ner en kopia av dina personuppgifter,
        elevprofiler, samtycken och köp i JSON-format. Svarsnycklar och andra
        användares data ingår aldrig.
      </p>
      <div className="mt-6">
        <ExportButton enabled={isSupabaseConfigured} />
      </div>
    </div>
  );
}
