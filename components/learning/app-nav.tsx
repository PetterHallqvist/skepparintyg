"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Compass,
  GraduationCap,
  Home,
  Layers,
  NotebookPen,
  Target,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Mobile tab bar: max five primary destinations. */
export const APP_NAV = [
  { href: "/app/start", label: "Start", icon: Home },
  { href: "/app/ova", label: "Öva", icon: GraduationCap },
  { href: "/app/sjokort", label: "Sjökort", icon: Compass },
  { href: "/app/framsteg", label: "Framsteg", icon: BarChart3 },
  { href: "/app/konto", label: "Konto", icon: UserRound },
] as const;

/** Desktop sidebar: full set. */
const SIDEBAR_NAV = [
  APP_NAV[0],
  APP_NAV[1],
  APP_NAV[2],
  { href: "/app/simulering", label: "Simulering", icon: Target },
  { href: "/app/felbok", label: "Felboken", icon: NotebookPen },
  { href: "/app/kortlekar", label: "Kortlekar", icon: Layers },
  APP_NAV[3],
  APP_NAV[4],
] as const;

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop sidebar navigation. */
export function AppSidebarNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Appmeny" className="space-y-1">
      {SIDEBAR_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "border-border bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          <item.icon aria-hidden="true" className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Mobile bottom tab bar. */
export function AppTabBar() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Appmeny"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
    >
      <ul className="grid grid-cols-5">
        {APP_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] flex-col items-center justify-center gap-0.5 pb-[env(safe-area-inset-bottom)] text-[11px] font-medium",
                isActive(item.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon aria-hidden="true" className="size-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
