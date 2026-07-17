import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeleteAccountForm } from "@/components/account/delete-account-form";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Radera konto" };

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/app/konto"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Konto
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Radera konto</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Radering tar bort dina personuppgifter, återkallar åtkomsten till dina
        elevprofiler och stänger av påminnelser och marknadsföring. Elevprofiler
        som bara du är kopplad till raderas.
      </p>

      <DisclaimerBlock className="mt-4">
        Vi behöver spara vissa köp- och bokföringsuppgifter så länge lagen kräver
        det. Dessa gallras automatiskt när lagringstiden löpt ut.
      </DisclaimerBlock>

      <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
        <DeleteAccountForm enabled={isSupabaseConfigured} />
      </div>
    </div>
  );
}
