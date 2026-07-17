import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/design-system/page-shell";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { BlockRenderer } from "@/components/content/block-renderer";
import { getArticle } from "@/lib/content/editorial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artikel" };
  return { title: article.title_sv, description: article.summary_sv };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <Link
          href="/kunskapsbank"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Kunskapsbank
        </Link>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {article.title_sv}
        </h1>
        {article.summary_sv && (
          <p className="mt-3 text-lg text-muted-foreground">
            {article.summary_sv}
          </p>
        )}

        <div className="mt-8">
          <BlockRenderer blocks={article.body_blocks} />
        </div>

        {article.source_short && article.verified_at && (
          <SourceStamp
            checkedAt={article.verified_at}
            source={article.source_short}
            className="mt-10"
          />
        )}
      </PageShell>
    </section>
  );
}
