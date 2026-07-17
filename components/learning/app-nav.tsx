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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * App navigation, tailored to the active certification: the chart-lab slot
 * appears only for the navigation certificates (chartLab); the mobile tab
 * bar promotes the simulation instead for everyone else.
 */

type NavItem = { href: string; label: string; icon: LucideIcon };

const START: NavItem = { href: "/app/start", label: "Start", icon: Home };
const OVA: NavItem = { href: "/app/ova", label: "Öva", icon: GraduationCap };
const SJOKORT: NavItem = { href: "/app/sjokort", label: "Sjökort", icon: Compass };
const SIMULERING: NavItem = {
  href: "/app/simulering",
  label: "Simulering",
  icon: Target,
};
const FELBOK: NavItem = { href: "/app/felbok", label: "Felboken", icon: NotebookPen };
const KORTLEKAR: NavItem = { href: "/app/kortlekar", label: "Kortlekar", icon: Layers };
const FRAMSTEG: NavItem = { href: "/app/framsteg", label: "Framsteg", icon: BarChart3 };
const KONTO: NavItem = { href: "/app/konto", label: "Konto", icon: UserRound };

/** Mobile tab bar: max five primary destinations. */
function tabItems(chartLab: boolean): NavItem[] {
  return [START, OVA, chartLab ? SJOKORT : SIMULERING, FRAMSTEG, KONTO];
}

/** Desktop sidebar: full set. */
function sidebarItems(chartLab: boolean): NavItem[] {
  return [
    START,
    OVA,
    ...(chartLab ? [SJOKORT] : []),
    SIMULERING,
    FELBOK,
    KORTLEKAR,
    FRAMSTEG,
    KONTO,
  ];
}

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop sidebar navigation. */
export function AppSidebarNav({ chartLab = true }: { chartLab?: boolean }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Appmeny" className="space-y-1">
      {sidebarItems(chartLab).map((item) => (
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
export function AppTabBar({ chartLab = true }: { chartLab?: boolean }) {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Appmeny"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabItems(chartLab).map((item) => (
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
