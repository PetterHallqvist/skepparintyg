#!/usr/bin/env node
/**
 * Deck build pipeline (SPEC §37.6). Validates every deck, exports Quizlet TSV
 * (+ import guide) and a deterministic Anki .apkg, writes a committed manifest
 * per deck, and asserts the .apkg is byte-identical across two builds. Fails
 * loudly on any validation problem or non-determinism.
 *
 *   node pipeline/decks/build.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { DECKS } from "./data.mjs";
import { validateDeck } from "./validate.mjs";
import { toQuizletTsv, quizletGuide } from "./quizlet.mjs";
import { buildApkg } from "./anki.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "dist"); // built artifacts incl. binary .apkg (gitignored)
const SNAPSHOTS = join(HERE, "snapshots"); // text snapshots (committed, diffable)
const MANIFESTS = join(HERE, "manifests"); // per-deck manifest (committed)
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

async function main() {
  mkdirSync(DIST, { recursive: true });
  mkdirSync(SNAPSHOTS, { recursive: true });
  mkdirSync(MANIFESTS, { recursive: true });

  for (const deck of DECKS) {
    const problems = validateDeck(deck);
    if (problems.length) {
      console.error(`✗ ${deck.id}:\n  - ${problems.join("\n  - ")}`);
      process.exit(1);
    }

    const tsv = toQuizletTsv(deck);
    const guide = quizletGuide(deck);
    for (const dir of [DIST, SNAPSHOTS]) {
      writeFileSync(join(dir, `${deck.id}.tsv`), tsv, "utf8");
      writeFileSync(join(dir, `${deck.id}.import.md`), guide, "utf8");
    }

    // Deterministic .apkg — build twice, require identical bytes (§37.6).
    const apkg1 = await buildApkg(deck);
    const apkg2 = await buildApkg(deck);
    if (sha256(apkg1) !== sha256(apkg2)) {
      console.error(`✗ ${deck.id}: .apkg är inte deterministisk`);
      process.exit(1);
    }
    writeFileSync(join(DIST, `${deck.id}.apkg`), apkg1);

    const manifest = {
      id: deck.id,
      title_sv: deck.title_sv,
      access: deck.access,
      cardCount: deck.cards.length,
      contentVersion: "1",
      files: {
        tsv: { name: `${deck.id}.tsv`, sha256: sha256(Buffer.from(tsv, "utf8")) },
        apkg: { name: `${deck.id}.apkg`, sha256: sha256(apkg1) },
      },
    };
    writeFileSync(
      join(MANIFESTS, `${deck.id}.json`),
      JSON.stringify(manifest, null, 2) + "\n",
      "utf8",
    );

    console.log(
      `✓ ${deck.id} — ${deck.cards.length} kort · tsv + apkg (${apkg1.length} B) · ${deck.access}`,
    );
  }
  console.log("Alla kortlekar byggda och verifierade.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
