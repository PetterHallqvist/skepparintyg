/**
 * Anki .apkg builder (SPEC §37.2, §37.6). Builds the collection.anki2 SQLite
 * database with sql.js (pure-wasm, no native dependency) and zips it with
 * fflate. Deterministic: every id/timestamp is derived from the deck content
 * (never Date.now) and zip entry mtimes are fixed, so the same deck always
 * produces a byte-identical .apkg — the build's determinism check relies on it.
 */

import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import initSqlJs from "sql.js";
import { zipSync, strToU8 } from "fflate";

const require = createRequire(import.meta.url);

// Fixed epoch anchors (seconds / ms) — deterministic, never "now".
const CRT_S = 1_735_689_600; // 2025-01-01T00:00:00Z, collection creation
const MOD_MS = 1_735_689_600_000;
const FIXED_MTIME = new Date(Date.UTC(2025, 0, 1)); // zip entry mtime

const FIELD_SEP = "\x1f"; // Anki field separator

function sha1(s) {
  return createHash("sha1").update(s, "utf8").digest();
}
/** Stable positive integer id derived from a string (6 bytes). */
function hashInt(s) {
  return sha1(s).readUIntBE(0, 6);
}
/** Anki field checksum: first 8 hex of sha1 of the first field. */
function fieldChecksum(str) {
  return parseInt(sha1(stripHtml(str)).toString("hex").slice(0, 8), 16);
}
function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, "");
}
/** Deterministic guid from card id. */
function guidOf(id) {
  return sha1("guid:" + id).toString("base64").replace(/[+/=]/g, "").slice(0, 10);
}

function models(mid, did, deck) {
  return {
    [mid]: {
      id: mid,
      name: `${deck.title_sv} · modell`,
      type: 0,
      mod: 0,
      usn: -1,
      sortf: 0,
      did,
      tmpls: [
        {
          name: "Kort 1",
          ord: 0,
          qfmt: "{{Front}}",
          afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          did: null,
          bqfmt: "",
          bafmt: "",
        },
      ],
      flds: [
        { name: "Front", ord: 0, sticky: false, rtl: false, font: "Arial", size: 20, media: [] },
        { name: "Back", ord: 1, sticky: false, rtl: false, font: "Arial", size: 20, media: [] },
      ],
      css: ".card{font-family:Arial;font-size:20px;text-align:center;color:#111;background:#fff;}",
      latexPre: "",
      latexPost: "",
      req: [[0, "any", [0]]],
      vers: [],
    },
  };
}

function deckObj(did, name) {
  return {
    id: did,
    mod: 0,
    name,
    usn: -1,
    lrnToday: [0, 0],
    revToday: [0, 0],
    newToday: [0, 0],
    timeToday: [0, 0],
    collapsed: false,
    browserCollapsed: false,
    desc: "",
    dyn: 0,
    conf: 1,
    extendNew: 0,
    extendRev: 0,
  };
}

const DEFAULT_DCONF = {
  1: {
    id: 1,
    mod: 0,
    name: "Default",
    usn: -1,
    maxTaken: 60,
    autoplay: true,
    timer: 0,
    replayq: true,
    new: { bury: false, delays: [1, 10], initialFactor: 2500, ints: [1, 4, 7], order: 1, perDay: 20, separate: true },
    rev: { bury: false, ease4: 1.3, fuzz: 0.05, ivlFct: 1, maxIvl: 36500, minSpace: 1, perDay: 200, hardFactor: 1.2 },
    lapse: { delays: [10], leechAction: 0, leechFails: 8, minInt: 1, mult: 0 },
    dyn: false,
  },
};

const SCHEMA = `
CREATE TABLE col (id integer primary key, crt integer not null, mod integer not null, scm integer not null, ver integer not null, dty integer not null, usn integer not null, ls integer not null, conf text not null, models text not null, decks text not null, dconf text not null, tags text not null);
CREATE TABLE notes (id integer primary key, guid text not null, mid integer not null, mod integer not null, usn integer not null, tags text not null, flds text not null, sfld text not null, csum integer not null, flags integer not null, data text not null);
CREATE TABLE cards (id integer primary key, nid integer not null, did integer not null, ord integer not null, mod integer not null, usn integer not null, type integer not null, queue integer not null, due integer not null, ivl integer not null, factor integer not null, reps integer not null, lapses integer not null, left integer not null, odue integer not null, odid integer not null, flags integer not null, data text not null);
CREATE TABLE revlog (id integer primary key, cid integer not null, usn integer not null, ease integer not null, ivl integer not null, lastIvl integer not null, factor integer not null, time integer not null, type integer not null);
CREATE TABLE graves (usn integer not null, oid integer not null, type integer not null);
CREATE INDEX ix_notes_usn on notes (usn);
CREATE INDEX ix_cards_usn on cards (usn);
CREATE INDEX ix_cards_nid on cards (nid);
CREATE INDEX ix_cards_sched on cards (did, queue, due);
CREATE INDEX ix_revlog_usn on revlog (usn);
CREATE INDEX ix_revlog_cid on revlog (cid);
`;

/** Build a deterministic .apkg for one deck. Returns a Uint8Array. */
export async function buildApkg(deck) {
  const SQL = await initSqlJs({
    locateFile: (f) => require.resolve(`sql.js/dist/${f}`),
  });
  const db = new SQL.Database();
  db.run(SCHEMA);

  const mid = hashInt("model:" + deck.id);
  const did = hashInt("deck:" + deck.id);

  const conf = {
    nextPos: 1,
    estTimes: true,
    activeDecks: [1],
    sortType: "noteFld",
    timeLim: 0,
    sortBackwards: false,
    addToCur: true,
    curDeck: did,
    newBury: true,
    newSpread: 0,
    dueCounts: true,
    curModel: String(mid),
    collapseTime: 1200,
  };
  const decks = { 1: deckObj(1, "Default"), [did]: deckObj(did, deck.title_sv) };

  db.run(
    "INSERT INTO col VALUES (1,?,?,?,11,0,0,0,?,?,?,?,'{}')",
    [
      CRT_S,
      MOD_MS,
      MOD_MS,
      JSON.stringify(conf),
      JSON.stringify(models(mid, did, deck)),
      JSON.stringify(decks),
      JSON.stringify(DEFAULT_DCONF),
    ],
  );

  deck.cards.forEach((c, i) => {
    const nid = hashInt("note:" + deck.id + ":" + c.card_id);
    const cid = hashInt("card:" + deck.id + ":" + c.card_id);
    const back = c.extra_explanation
      ? `${c.back}<br><br><small>${c.extra_explanation}</small>`
      : c.back;
    const flds = `${c.front}${FIELD_SEP}${back}`;
    db.run(
      "INSERT INTO notes VALUES (?,?,?,?,-1,?,?,?,?,0,'')",
      [nid, guidOf(c.card_id), mid, MOD_MS, "", flds, c.front, fieldChecksum(c.front)],
    );
    db.run(
      "INSERT INTO cards VALUES (?,?,?,0,?,-1,0,0,?,0,0,0,0,0,0,0,0,'')",
      [cid, nid, did, MOD_MS, i + 1],
    );
  });

  const collection = db.export();
  db.close();

  return zipSync(
    {
      "collection.anki2": [collection, { mtime: FIXED_MTIME }],
      media: [strToU8("{}"), { mtime: FIXED_MTIME }],
    },
    { level: 6 },
  );
}
