import type { Metadata } from "next";
import { StatusChip } from "@/components/design-system/status-chip";
import { Button } from "@/components/ui/button";
import { setActiveCertificationForm } from "@/lib/certifications/actions";
import { getActiveCertificationId } from "@/lib/certifications/active";
import {
  ALL_CERTIFICATIONS,
  certIdSchema,
  type CertificationDef,
  type CertificationId,
} from "@/lib/certifications/registry";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Välj intyg" };

/**
 * DB-mode preselection fallback: the stored learner target (§12.2), else the
 * certification of an active entitlement. Never auto-chosen — the picker
 * stays mandatory; this only pre-checks the likely card.
 */
async function storedTargetCertification(): Promise<CertificationId | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: learner } = await supabase
      .from("learners")
      .select("target_certification_id")
      .eq("is_self_profile", true)
      .not("target_certification_id", "is", null)
      .limit(1)
      .maybeSingle();
    const fromLearner = certIdSchema.safeParse(
      learner?.target_certification_id,
    );
    if (fromLearner.success) return fromLearner.data;

    const { data: ents } = await supabase
      .from("entitlements")
      .select("status, products(certification_id)")
      .eq("status", "active")
      .limit(1);
    // Supabase infers embedded relations loosely — same idiom as guardian/data.
    type ProductRef = { certification_id: string | null };
    const product = (
      ents?.[0] as { products: ProductRef[] | ProductRef | null } | undefined
    )?.products;
    const certId = Array.isArray(product)
      ? product[0]?.certification_id
      : product?.certification_id;
    const fromEntitlement = certIdSchema.safeParse(certId);
    return fromEntitlement.success ? fromEntitlement.data : null;
  } catch {
    return null;
  }
}

/**
 * First-run certification picker (SPEC §12.2 target certificate). Mandatory:
 * the proxy gate sends every /app visit here until a choice exists. The
 * choice drives which knowledge base every practice surface draws from, and
 * can be changed at any time ("Byt intyg" on start + konto). Preview
 * certifications are labelled honestly (§11.1).
 */

const GROUPS: Array<{ key: CertificationDef["group"]; titleSv: string }> = [
  { key: "intyg", titleSv: "Intyg" },
  { key: "praktik", titleSv: "Båtpraktik" },
  { key: "segling", titleSv: "Seglarintyg" },
];

function CertRadioCard({
  def,
  defaultChecked,
}: {
  def: CertificationDef;
  defaultChecked: boolean;
}) {
  return (
    <label className="group relative flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-accent/40">
      <input
        type="radio"
        name="certification"
        value={def.id}
        defaultChecked={defaultChecked}
        required
        className="mt-1 size-4 shrink-0 accent-[var(--color-primary)]"
      />
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold">{def.nameSv}</span>
          {def.status === "preview" ? (
            <StatusChip tone="warning">Förhandsversion</StatusChip>
          ) : (
            <StatusChip tone="success">Tillgängligt</StatusChip>
          )}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {def.tagline}
        </span>
        {def.status === "preview" ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            Innehåll under granskning — frågorna är utkast.
          </span>
        ) : null}
      </span>
    </label>
  );
}

export default async function ValjIntygPage({
  searchParams,
}: {
  searchParams: Promise<{ intyg?: string; nasta?: string }>;
}) {
  const { intyg, nasta } = await searchParams;
  const current = await getActiveCertificationId();
  const preselectParsed = certIdSchema.safeParse(intyg);
  const stored = preselectParsed.success || current
    ? null
    : await storedTargetCertification();
  const preselected = preselectParsed.success
    ? preselectParsed.data
    : (current ?? stored ?? "forarintyg");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-label text-muted-foreground">
          {current ? "Byt intyg" : "Kom igång"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Vilket intyg pluggar du för?
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Hela appen anpassas efter ditt val — övningar, simuleringar och
          framsteg hämtas ur just det intygets kunskapsbas. Du kan byta när som
          helst.
        </p>
      </header>

      <form action={setActiveCertificationForm} className="space-y-8">
        {typeof nasta === "string" ? (
          <input type="hidden" name="nasta" value={nasta} />
        ) : null}

        {GROUPS.map((group) => {
          const defs = ALL_CERTIFICATIONS.filter((d) => d.group === group.key);
          return (
            <fieldset key={group.key} className="space-y-3">
              <legend className="text-label text-muted-foreground">
                {group.titleSv}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {defs.map((def) => (
                  <CertRadioCard
                    key={def.id}
                    def={def}
                    defaultChecked={def.id === preselected}
                  />
                ))}
              </div>
            </fieldset>
          );
        })}

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="submit" size="lg">
            Fortsätt
          </Button>
        </div>
      </form>
    </div>
  );
}
