import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/design-system/page-shell";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { getGlossary, getGlossaryTerm } from "@/lib/content/editorial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const entry = await getGlossaryTerm(term);
  if (!entry) return { title: "Ordlista" };
  return {
    title: `${entry.term} — Ordlista`,
    description: entry.definition_sv,
  };
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const entry = await getGlossaryTerm(term);
  if (!entry) notFound();

  // Resolve see_also slugs to their display terms (best-effort).
  const all = await getGlossary();
  const related = entry.see_also
    .map((slug) => all.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <Link
          href="/ordlista"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Ordlista
        </Link>
        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          {entry.term}
        </h1>
        <p className="mt-4 text-lg leading-relaxed">{entry.definition_sv}</p>

        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-label text-muted-foreground">Se även</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/ordlista/${r.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50"
                  >
                    {r.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.source_short && entry.verified_at && (
          <SourceStamp
            checkedAt={entry.verified_at}
            source={entry.source_short}
            className="mt-10"
          />
        )}
      </PageShell>
    </section>
  );
}
