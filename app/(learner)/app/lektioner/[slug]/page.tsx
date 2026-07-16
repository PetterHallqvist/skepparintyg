import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockRenderer, type ContentBlock } from "@/components/content/block-renderer";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Lektion" };

/**
 * Learner-facing lesson renderer (SPEC §38) — closes the M2 gap. Live lesson
 * content is gated by the entitlement predicate folded into the
 * lesson_versions RLS policy (M6): an unentitled learner's query returns no
 * version row, so we show the paywall prompt rather than the content.
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Lektioner visas när innehåll och inloggning är konfigurerade. Prova
          övningspassen under Öva så länge.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const version = lesson
    ? (
        await supabase
          .from("lesson_versions")
          .select("title_sv,lead_sv,content_blocks,status")
          .eq("lesson_id", lesson.id)
          .eq("status", "live")
          .maybeSingle()
      ).data
    : null;

  // No live version readable = either unentitled (RLS) or not published.
  if (!lesson || !version) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
        <Lock aria-hidden="true" className="mx-auto size-6 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Lektionen är låst</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Den här lektionen kräver ett aktivt abonnemang, eller så finns den inte.
        </p>
        <Button className="mt-6" render={<Link href="/priser" />}>
          Se priser
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <article className="theme-paper rounded-lg border border-border bg-paper p-6 text-foreground sm:p-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          {version.title_sv}
        </h1>
        {version.lead_sv && (
          <p className="mt-3 text-lg text-muted-foreground">{version.lead_sv}</p>
        )}
        <div className="mt-8">
          <BlockRenderer
            blocks={(version.content_blocks as ContentBlock[]) ?? []}
          />
        </div>
      </article>
    </div>
  );
}
