import type { Metadata } from "next";
import { Download, Lock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/design-system/status-chip";
import { requireActiveCertification } from "@/lib/certifications/active";
import { DECK_META } from "@/lib/decks/registry";

export const metadata: Metadata = { title: "Kortlekar" };

/**
 * Deck downloads (SPEC §37), certification-scoped: only the active
 * certification's decks are listed. Facts, terminology, light characters,
 * signals and formulas — for offline flashcards. The core procedural
 * learning stays in the app (§37.1). Free lead-magnet deck downloads now;
 * paid decks unlock with a subscription — the download route enforces this
 * fail-closed per certification.
 */
export default async function KortlekarPage() {
  const def = await requireActiveCertification("/app/kortlekar");
  const decks = DECK_META.filter((d) => d.certification === def.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-label text-muted-foreground">{def.nameSv}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Kortlekar</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Ladda ner glosor, fyrkaraktärer, signaler och formler som flashcards
          till Anki eller Quizlet. Den praktiska träningen — sjökort och
          scenarier — finns kvar här i appen.
        </p>
      </header>

      {decks.length === 0 ? (
        <Card className="bezel flex min-h-40 flex-col items-center justify-center gap-2 p-8 text-center">
          <Layers aria-hidden="true" className="size-6 text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">
            Inga kortlekar för {def.nameSv} ännu — de byggs tillsammans med
            innehållet.
          </p>
        </Card>
      ) : null}

      <ul className="space-y-4">
        {decks.map((deck) => {
          const free = deck.access === "free";
          return (
            <li key={deck.id}>
              <Card className="bezel flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md border border-border bg-accent/40">
                    <Layers aria-hidden="true" className="size-5 text-primary" />
                  </span>
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                      {deck.title_sv}
                      {free ? (
                        <StatusChip tone="success">Gratis</StatusChip>
                      ) : (
                        <StatusChip tone="info">Abonnemang</StatusChip>
                      )}
                    </h2>
                    <p className="font-readout text-xs text-muted-foreground">
                      {deck.cardCount} kort · Anki .apkg + Quizlet .tsv
                    </p>
                  </div>
                </div>

                {free ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a href={`/api/decks/${deck.id}?format=apkg`} download />
                      }
                    >
                      <Download aria-hidden="true" />
                      Anki
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a href={`/api/decks/${deck.id}?format=tsv`} download />
                      }
                    >
                      <Download aria-hidden="true" />
                      Quizlet
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock aria-hidden="true" className="size-4" />
                    Lås upp med abonnemang
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-muted-foreground">
        Filerna är versionerade och innehåller ingen osynlig spårning (§37.7).
        Sjöklart har ingen officiell Quizlet-integration — .tsv är ett
        kompatibelt importformat.
      </p>
    </div>
  );
}
