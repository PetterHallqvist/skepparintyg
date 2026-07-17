import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Download, HeartHandshake, LogOut, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/design-system/status-chip";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/account/actions";

export const metadata: Metadata = { title: "Konto" };

const LINKS = [
  {
    href: "/app/guardian",
    icon: Users,
    title: "Vårdnadshavare",
    body: "Elevprofiler, elevplatser och samtycken.",
  },
  {
    href: "/app/konto/export",
    icon: Download,
    title: "Exportera mina data",
    body: "Ladda ner en kopia av dina personuppgifter och köp.",
  },
  {
    href: "/app/konto/studiegaranti",
    icon: HeartHandshake,
    title: "Studiegaranti",
    body: "Ansök om förlängd tillgång enligt studiegarantin.",
  },
  {
    href: "/app/konto/radera",
    icon: Trash2,
    title: "Radera konto",
    body: "Ta bort ditt konto och dina personuppgifter.",
  },
] as const;

export default async function KontoPage() {
  let email: string | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Konto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {email ?? "Din profil, elevprofiler, samtycken och dina data."}
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <StatusChip tone="warning">Demoläge</StatusChip>
        ) : null}
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center gap-4 bg-card px-4 py-4 transition-colors hover:bg-accent/40"
            >
              <l.icon aria-hidden="true" className="size-5 text-sea-300" />
              <span className="flex-1">
                <span className="font-medium">{l.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {l.body}
                </span>
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </Link>
          </li>
        ))}
      </ul>

      {isSupabaseConfigured && (
        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline">
            <LogOut aria-hidden="true" />
            Logga ut
          </Button>
        </form>
      )}
    </div>
  );
}
