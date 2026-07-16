import Link from "next/link";
import { Logo } from "@/components/design-system/logo";
import { StatusChip } from "@/components/design-system/status-chip";
import { requireStaff } from "@/lib/admin/guard";

const ADMIN_NAV = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/review", label: "Granskning" },
  { href: "/admin/objectives", label: "Mål" },
  { href: "/admin/items", label: "Uppgifter" },
  { href: "/admin/lessons", label: "Lektioner" },
  { href: "/admin/sources", label: "Källor" },
  { href: "/admin/issues", label: "Ärenden" },
  { href: "/admin/settings/official-facts", label: "Officiella fakta" },
  { href: "/admin/audit", label: "Logg" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();

  return (
    <div className="theme-instrument flex min-h-svh flex-col bg-background text-foreground">
      {staff.preview ? (
        <p
          role="status"
          className="border-b border-border bg-warning/15 px-4 py-1.5 text-center text-xs text-warning"
        >
          Förhandsvisning — Supabase är inte konfigurerat, data saknas.
        </p>
      ) : null}
      <header className="border-b border-border">
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="Adminstudion">
              <Logo />
            </Link>
            <span className="text-label text-muted-foreground">
              Innehållsstudio
            </span>
          </div>
          <StatusChip tone={staff.preview ? "warning" : "info"}>
            {staff.preview ? "Preview" : `Roll: ${staff.role}`}
          </StatusChip>
        </div>
        <nav
          aria-label="Adminmeny"
          className="flex gap-1 overflow-x-auto px-3 pb-2"
        >
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
