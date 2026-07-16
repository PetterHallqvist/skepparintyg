import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ShieldCheck, Users } from "lucide-react";
import { StatusChip } from "@/components/design-system/status-chip";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Vårdnadshavare" };

const SECTIONS = [
  {
    href: "/app/guardian/learners",
    icon: Users,
    title: "Elevprofiler",
    body: "Lägg till och hantera elevprofiler och deras elev-PIN.",
  },
  {
    href: "/app/guardian/purchases",
    icon: CreditCard,
    title: "Köp och platser",
    body: "Se dina köp och tilldela elevplatser.",
  },
  {
    href: "/app/guardian/consents",
    icon: ShieldCheck,
    title: "Samtycken",
    body: "Styr analys och påminnelser per elev — nödvändig behandling är alltid på.",
  },
] as const;

export default function GuardianHome() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Vårdnadshavare
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kontot och köpen ägs av dig som vuxen. Eleven får en egen profil utan
            marknadsföring eller onödig datainsamling.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <s.icon aria-hidden="true" className="size-5 text-sea-300" />
            <h2 className="mt-3 font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
