import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DECKS } from "@/pipeline/decks/data.mjs";
import { toQuizletTsv } from "@/pipeline/decks/quizlet.mjs";
import { deckMeta } from "@/lib/decks/registry";

/**
 * Deck download (SPEC §37.7). Entitlement is fail-closed: free decks download
 * now; paid decks return 403 until real entitlements land (M6). TSV is generated
 * in-memory (deterministic, no deps); the binary .apkg is served from the
 * pipeline build output — never bundled into the client.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meta = deckMeta(id);
  if (!meta) return new Response("Kortleken finns inte.", { status: 404 });

  // Fail-closed: only the free lead-magnet deck is downloadable pre-M6.
  if (meta.access !== "free") {
    return new Response("Kräver aktivt abonnemang (kommer i M6).", {
      status: 403,
    });
  }

  const format = new URL(req.url).searchParams.get("format") ?? "tsv";
  const deck = DECKS.find((d) => d.id === id);
  if (!deck) return new Response("Kortleken finns inte.", { status: 404 });

  if (format === "tsv") {
    return new Response(toQuizletTsv(deck), {
      headers: {
        "Content-Type": "text/tab-separated-values; charset=utf-8",
        "Content-Disposition": `attachment; filename="${id}.tsv"`,
      },
    });
  }

  if (format === "apkg") {
    try {
      const buf = await readFile(
        join(process.cwd(), "pipeline", "decks", "dist", `${id}.apkg`),
      );
      return new Response(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${id}.apkg"`,
        },
      });
    } catch {
      return new Response(
        "Anki-filen är inte byggd. Kör: node pipeline/decks/build.mjs",
        { status: 501 },
      );
    }
  }

  return new Response("Okänt format.", { status: 400 });
}
