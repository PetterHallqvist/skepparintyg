import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { getGlossary } from "@/lib/content/editorial";

export const metadata: Metadata = {
  title: "Ordlista",
  description:
    "Sjötermer förklarade: styrbord, babord, knop, missvisning, deviation, lateralmärke och fler nautiska begrepp.",
};

export default async function OrdlistaPage() {
  const terms = await getGlossary();

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <SectionHeading
          as="h1"
          kicker="Ordlista"
          title="Sjötermer förklarade"
          lead="Korta, tydliga förklaringar av begreppen du möter i kursen och till sjöss."
        />
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {terms.map((t) => (
            <div key={t.slug} className="py-4">
              <dt>
                <Link
                  href={`/ordlista/${t.slug}`}
                  className="font-semibold hover:underline"
                >
                  {t.term}
                </Link>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.definition_sv}
              </dd>
            </div>
          ))}
          {terms.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">
              Inga begrepp publicerade ännu.
            </p>
          )}
        </dl>
      </PageShell>
    </section>
  );
}
