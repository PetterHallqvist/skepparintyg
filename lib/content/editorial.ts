import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentBlock } from "@/components/content/block-renderer";

/**
 * Kunskapsbank + ordlista data access (SPEC §11.1). Demo-shell fallback mirrors
 * the seed so the public pages render before a database exists; the DB path
 * reads only `live`/`published` rows (RLS). Content ships review-status via seed
 * with unverified-source flags — same policy as M1.
 */

export interface Article {
  slug: string;
  title_sv: string;
  summary_sv: string;
  body_blocks: ContentBlock[];
  source_short: string | null;
  verified_at: string | null;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition_sv: string;
  see_also: string[];
  source_short: string | null;
  verified_at: string | null;
}

const DEMO_ARTICLES: Article[] = [
  {
    slug: "sa-laser-du-ett-sjokort",
    title_sv: "Så läser du ett sjökort",
    summary_sv:
      "Djupsiffror, sjömärken och latitudskalan — grunderna för att förstå vad ett sjökort faktiskt visar.",
    body_blocks: [
      {
        type: "markdown",
        body_sv:
          "## Vad sjökortet visar\n\nEtt sjökort är en karta över vattnet. Det visar **djup**, **grund**, **farleder**, **sjömärken** och **fyrar**. Siffrorna i vattnet är djup i meter vid ett bestämt referensvattenstånd.\n\n- Ljusblå ytor är grunt vatten.\n- Vita ytor är djupare.\n- Streckade linjer kan markera farleder och ledningar.",
      },
      {
        type: "callout",
        tone: "info",
        body_sv:
          "Mät alltid distanser mot **latitudskalan** i kortets sidokant — en latitudminut är en nautisk mil.",
      },
      {
        type: "worked_example",
        body_sv:
          "**Exempel.** Du vill veta avståndet mellan två uddar.\n\n1. Ställ passaren mellan punkterna.\n2. Flytta passaren till latitudskalan i höjd med området.\n3. Läs av antalet minuter — varje minut är 1 M.",
      },
    ],
    source_short: "Sjöklart (utkast, ej källgranskad)",
    verified_at: "2026-07-16",
  },
  {
    slug: "vajningsreglerna-i-korthet",
    title_sv: "Väjningsreglerna i korthet",
    summary_sv:
      "Vem viker för vem? En översikt av möte, korsande och upphinnande — och varför du aldrig får ta något för givet.",
    body_blocks: [
      {
        type: "markdown",
        body_sv:
          "## Grundprinciperna\n\nSjövägsreglerna avgör vem som ska hålla undan. Tre vanliga situationer:\n\n- **Möte** styvt om styvt: båda viker åt styrbord.\n- **Korsande** kurser: den som har den andra om styrbord viker.\n- **Upphinnande**: den som hinner upp viker, oavsett båttyp.",
      },
      {
        type: "callout",
        tone: "warning",
        body_sv:
          "Reglerna säger vem som **bör** hålla undan — men alla ombord är skyldiga att undvika kollision. Ta aldrig för givet att den andre väjer.",
      },
    ],
    source_short: "Sjöklart (utkast, ej källgranskad)",
    verified_at: "2026-07-16",
  },
];

const DEMO_GLOSSARY: GlossaryTerm[] = [
  ["styrbord", "Styrbord", "Höger sida av båten sett föröver.", ["babord"]],
  ["babord", "Babord", "Vänster sida av båten sett föröver.", ["styrbord"]],
  ["knop", "Knop", "Fartenhet: en nautisk mil per timme.", ["nautisk-mil"]],
  ["nautisk-mil", "Nautisk mil (M)", "Distansenhet till sjöss, 1 852 meter, motsvarar en latitudminut.", ["knop"]],
  ["baring", "Bäring", "Riktningen till ett föremål, mätt i grader.", ["missvisning", "deviation"]],
  ["missvisning", "Missvisning (variation)", "Skillnaden mellan rättvisande och magnetisk nord på platsen.", ["deviation", "kompasskurs"]],
  ["deviation", "Deviation", "Kompassfel orsakat av båtens eget magnetfält; varierar med kursen.", ["missvisning"]],
  ["kompasskurs", "Kompasskurs", "Kursen som visas på kompassen, korrigerad för missvisning och deviation.", ["missvisning", "deviation"]],
  ["lateralmarke", "Lateralmärke", "Sjömärke som markerar sidan av en farled (rött babord, grönt styrbord i IALA A).", ["kardinalmarke"]],
  ["kardinalmarke", "Kardinalmärke", "Sjömärke som anger säkert vatten i en väderstrecksriktning (N/O/S/V).", ["lateralmarke"]],
  ["fyrkaraktar", "Fyrkaraktär", "Ljusets rytm och färg som identifierar en fyr, t.ex. Fl(2) eller Iso.", []],
  ["latitud", "Latitud", "Nord–sydläge, mätt i grader från ekvatorn; latitudminuter används för distans.", ["longitud"]],
  ["longitud", "Longitud", "Öst–västläge, mätt i grader från nollmeridianen.", ["latitud"]],
  ["lovart", "Lovart", "Den sida som vinden kommer ifrån.", ["la"]],
  ["la", "Lä", "Den sida som är vindskyddad, bort från vinden.", ["lovart"]],
  ["gnss", "GNSS/GPS", "Satellitbaserad positionsbestämning; ska alltid dubbelkollas mot sjökortet.", []],
  ["vhf", "VHF", "Marin radiokommunikation; kräver tillstånd från PTS.", []],
  ["fortoja", "Förtöjning", "Att säkra båten vid brygga, boj eller ankare.", ["ankra"]],
  ["ankra", "Ankra", "Att ligga för ankare; kräll koll på botten, djup och svajutrymme.", ["fortoja"]],
  ["std", "Fart, tid, distans (STD)", "Sambandet distans = fart × tid, grunden för all törnplanering.", ["knop", "nautisk-mil"]],
].map(([slug, term, definition_sv, see_also]) => ({
  slug: slug as string,
  term: term as string,
  definition_sv: definition_sv as string,
  see_also: see_also as string[],
  source_short: "Sjöklart (utkast, ej källgranskad)",
  verified_at: "2026-07-16",
}));

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return DEMO_ARTICLES;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("articles")
    .select("slug,title_sv,summary_sv,body_blocks,source_short,verified_at")
    .eq("status", "live")
    .order("title_sv");
  return (data as Article[] | null) ?? [];
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured) {
    return DEMO_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("articles")
    .select("slug,title_sv,summary_sv,body_blocks,source_short,verified_at")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  return (data as Article | null) ?? null;
}

export async function getGlossary(): Promise<GlossaryTerm[]> {
  if (!isSupabaseConfigured)
    return [...DEMO_GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "sv"));
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug,term,definition_sv,see_also,source_short,verified_at")
    .eq("status", "live")
    .order("term");
  return (data as GlossaryTerm[] | null) ?? [];
}

export async function getGlossaryTerm(
  slug: string,
): Promise<GlossaryTerm | null> {
  if (!isSupabaseConfigured) {
    return DEMO_GLOSSARY.find((t) => t.slug === slug) ?? null;
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug,term,definition_sv,see_also,source_short,verified_at")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  return (data as GlossaryTerm | null) ?? null;
}
