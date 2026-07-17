import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { getArticles } from "@/lib/content/editorial";

export const metadata: Metadata = {
  title: "Kunskapsbank",
  description:
    "Artiklar om sjökortsläsning, väjningsregler, navigation och sjömanskap — med källhänvisningar.",
};

export default async function KunskapsbankPage() {
  const articles = await getArticles();

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <SectionHeading
          as="h1"
          kicker="Kunskapsbank"
          title="Fördjupa dig"
          lead="Artiklar som förklarar de moment du möter i kursen — med källor och datum för senaste kontroll."
        />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/kunskapsbank/${a.slug}`}
                className="group flex items-start justify-between gap-4 py-5"
              >
                <span>
                  <span className="font-serif text-lg font-medium group-hover:underline">
                    {a.title_sv}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {a.summary_sv}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1.5 size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="py-8 text-sm text-muted-foreground">
              Inga artiklar publicerade ännu.
            </li>
          )}
        </ul>
      </PageShell>
    </section>
  );
}
