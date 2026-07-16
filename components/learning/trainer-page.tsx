import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/design-system/status-chip";
import { SessionPlayer } from "@/components/learning/session-player";
import { isSupabaseConfigured } from "@/lib/env";
import { getTrackChallenge } from "@/lib/learning/actions";
import { trackMeta } from "@/lib/learning/track-meta";

/**
 * Shared trainer page: a titled header (from track-meta) + the session player
 * bound to one practice track. Used by every /app/ova/<trainer> route.
 */
export async function TrainerPage({ track }: { track: string }) {
  const meta = trackMeta(track);
  const initialChallenge = await getTrackChallenge(track, 0);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/app/ova" />}
          className="-ml-2 text-muted-foreground"
        >
          <ArrowLeft aria-hidden="true" />
          Alla övningar
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {meta?.title ?? "Övning"}
            </h1>
            {meta?.blurb ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {meta.blurb}
              </p>
            ) : null}
          </div>
          {!isSupabaseConfigured ? (
            <StatusChip tone="warning">Demopass</StatusChip>
          ) : null}
        </div>
      </header>
      <SessionPlayer initialChallenge={initialChallenge} track={track} />
    </div>
  );
}
