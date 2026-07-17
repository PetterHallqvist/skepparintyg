"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Cookie/analytics consent banner (SPEC §70.3). Decline-by-default: the two
 * choices are equally weighted and nothing is granted until the visitor picks.
 * Purpose is limited to product analytics; essential cookies need no consent.
 */
export function ConsentBanner({
  onDecide,
}: {
  onDecide: (analytics: boolean) => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Samtycke till cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          Vi använder nödvändiga cookies för att sidan ska fungera. Vi vill gärna
          också mäta anonym användning för att förbättra tjänsten — men bara om
          du säger ja.{" "}
          <Link href="/cookies" className="underline hover:text-foreground">
            Läs mer
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => onDecide(false)}>
            Endast nödvändiga
          </Button>
          <Button size="sm" onClick={() => onDecide(true)}>
            Tillåt analys
          </Button>
        </div>
      </div>
    </div>
  );
}
