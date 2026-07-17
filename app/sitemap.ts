import type { MetadataRoute } from "next";
import { clientEnv } from "@/lib/env";
import { getArticles, getGlossary } from "@/lib/content/editorial";

/**
 * sitemap.xml (SPEC M7 DoD). Static public routes plus published kunskapsbank /
 * ordlista entries (demo-seed slugs when no DB). App/admin/kassa are excluded —
 * they are disallowed in robots and noindexed.
 */
const STATIC_PATHS = [
  "",
  "/forarintyg",
  "/priser",
  "/sa-fungerar-provet",
  "/om-oss",
  "/experter-och-kallor",
  "/kundtjanst",
  "/gratis-kunskapstest",
  "/gratis-sjokortsovning",
  "/kunskapsbank",
  "/ordlista",
  "/kustskepparintyg",
  "/src",
  "/batpraktik",
  "/seglarintyg-1",
  "/seglarintyg-2",
  "/seglarintyg-3",
  "/kopvillkor",
  "/integritet",
  "/cookies",
  "/tillganglighet",
  "/sakerhetsinformation",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [articles, glossary] = await Promise.all([
    getArticles(),
    getGlossary(),
  ]);
  const editorial: MetadataRoute.Sitemap = [
    ...articles.map((a) => `/kunskapsbank/${a.slug}`),
    ...glossary.map((g) => `/ordlista/${g.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...editorial];
}
