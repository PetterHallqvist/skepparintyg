import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { StatusChip } from "@/components/design-system/status-chip";
import { SessionPlayer } from "@/components/learning/session-player";
import {
  certification,
  type CertificationId,
} from "@/lib/certifications/registry";
import { isSupabaseConfigured } from "@/lib/env";
import { getTrackChallenge } from "@/lib/learning/actions";

/**
 * Shared trainer page: a titled header (from the certification registry) +
 * the session player bound to one (certification, track) pair. Used by the
 * dynamic /app/ova/[track] route and the public free test. Preview
 * certifications are labelled honestly (§11.1 — never imply finished
 * content).
 */
export async function TrainerPage({
  cert,
  track,
  backHref = "/app/ova",
}: {
  cert: CertificationId;
  track: string;
  backHref?: string | null;
}) {
  const def = certification(cert);
  const meta = def.tracks.find((t) => t.id === track);
  const initialChallenge = await getTrackChallenge(track, 0, cert);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 space-y-3">
        {backHref ? (
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={backHref} />}
            className="-ml-2 text-muted-foreground"
          >
            <ArrowLeft aria-hidden="true" />
            Alla övningar
          </Button>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-label text-muted-foreground">{def.nameSv}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {meta?.title ?? "Övning"}
            </h1>
            {meta?.blurb ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {meta.blurb}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {def.status === "preview" ? (
              <StatusChip tone="warning">Förhandsversion</StatusChip>
            ) : null}
            {!isSupabaseConfigured ? (
              <StatusChip tone="warning">Demopass</StatusChip>
            ) : null}
          </div>
        </div>
        {def.status === "preview" ? (
          <DisclaimerBlock>
            Innehållet för {def.nameSv} är en förhandsversion under granskning —
            frågorna är utkast och källgranskas innan lansering.
          </DisclaimerBlock>
        ) : null}
      </header>
      <SessionPlayer initialChallenge={initialChallenge} track={track} cert={cert} />
    </div>
  );
}
