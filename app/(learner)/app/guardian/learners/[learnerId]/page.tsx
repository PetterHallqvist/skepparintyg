import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PinForm } from "@/components/guardian/pin-form";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { learnerHasPin } from "@/lib/guardian/access";

export const metadata: Metadata = { title: "Elevprofil" };

const AGE_BAND_LABELS: Record<string, string> = {
  under_13: "Under 13 år",
  "13_15": "13–15 år",
  "16_17": "16–17 år",
  "18_plus": "18+ år",
  unknown: "Okänd ålder",
};

export default async function GuardianLearnerDetail({
  params,
}: {
  params: Promise<{ learnerId: string }>;
}) {
  const { learnerId } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Elevprofilens detaljer visas när inloggning är konfigurerad.
        </p>
      </div>
    );
  }

  // RLS: this returns the learner ONLY if the caller is an active guardian.
  const supabase = await createSupabaseServerClient();
  const { data: learner } = await supabase
    .from("learners")
    .select("id,display_name,age_band,is_self_profile")
    .eq("id", learnerId)
    .maybeSingle();
  if (!learner) notFound();

  const hasPin = await learnerHasPin(learnerId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/app/guardian/learners"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Alla elevprofiler
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">
        {learner.display_name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {AGE_BAND_LABELS[learner.age_band as string] ?? learner.age_band}
      </p>

      <section className="mt-8 rounded-lg border border-border bg-card p-5">
        <h2 className="font-semibold">Elev-PIN</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          {hasPin
            ? "En PIN är satt. Du kan byta den när som helst."
            : "Ingen PIN är satt ännu."}
        </p>
        <PinForm learnerId={learnerId} hasPin={hasPin} />
      </section>

      <DisclaimerBlock className="mt-6">
        I elevläget kommer eleven bara åt sin egen studie­miljö — aldrig
        betalning, marknadsföring eller andra elevers profiler.
      </DisclaimerBlock>
    </div>
  );
}
