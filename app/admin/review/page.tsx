import type { Metadata } from "next";
import { EntityStatus } from "@/components/admin/entity-status";
import { ItemPreview } from "@/components/admin/item-preview";
import { ReviewActions } from "@/components/admin/review-actions";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin · Granskning" };

type ReviewItem = {
  id: string;
  stem_sv: string | null;
  interaction: Record<string, unknown>;
  answer_key: Record<string, unknown>;
  explanation_sv: string;
  criticality: string;
  status: string;
  item_templates: { stable_key: string; item_kind: string } | null;
  decisions: {
    review_type: string;
    decision: string;
    reviewer_user_id: string;
  }[];
};

type ReviewLesson = {
  id: string;
  title_sv: string;
  lead_sv: string | null;
  status: string;
  decisions: { review_type: string; decision: string }[];
};

async function loadQueue() {
  const supabase = await createSupabaseServerClient();
  const [items, lessons] = await Promise.all([
    supabase
      .from("item_versions")
      .select(
        "id, stem_sv, interaction, answer_key, explanation_sv, criticality, status, item_templates(stable_key, item_kind)",
      )
      .in("status", ["review", "review_required"])
      .order("created_at", { ascending: true })
      .limit(50),
    supabase
      .from("lesson_versions")
      .select("id, title_sv, lead_sv, status")
      .in("status", ["review", "review_required"])
      .order("created_at", { ascending: true })
      .limit(20),
  ]);

  const versionIds = [
    ...(items.data ?? []).map((i) => i.id),
    ...(lessons.data ?? []).map((l) => l.id),
  ];

  type Decision = {
    entity_version_id: string;
    review_type: string;
    decision: string;
    reviewer_user_id: string;
  };
  let decisions: Decision[] = [];
  if (versionIds.length > 0) {
    const { data } = await supabase
      .from("review_decisions")
      .select("entity_version_id, review_type, decision, reviewer_user_id")
      .in("entity_version_id", versionIds);
    decisions = (data ?? []) as Decision[];
  }

  const byVersion = new Map<string, Decision[]>();
  for (const d of decisions) {
    const list = byVersion.get(d.entity_version_id) ?? [];
    list.push(d);
    byVersion.set(d.entity_version_id, list);
  }

  return {
    items: (items.data ?? []).map((i) => ({
      ...i,
      decisions: byVersion.get(i.id) ?? [],
    })) as unknown as ReviewItem[],
    lessons: (lessons.data ?? []).map((l) => ({
      ...l,
      decisions: byVersion.get(l.id) ?? [],
    })) as unknown as ReviewLesson[],
  };
}

function DecisionSummary({
  decisions,
}: {
  decisions: { review_type: string; decision: string }[];
}) {
  if (decisions.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">Inga beslut ännu</span>
    );
  }
  return (
    <span className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      {decisions.map((d, i) => (
        <span key={i} className="rounded-sm border border-border px-1.5 py-0.5">
          {d.review_type}: {d.decision}
        </span>
      ))}
    </span>
  );
}

export default async function ReviewQueuePage() {
  const staff = await requireStaff();
  const canReview =
    !staff.preview && ["admin", "reviewer"].includes(staff.role);
  const canPublish = !staff.preview && ["admin", "editor"].includes(staff.role);
  const { items, lessons } = staff.preview
    ? { items: [], lessons: [] }
    : await loadQueue();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Granskningskön
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Publicering kräver källa + godkänd domän- och redaktionsgranskning;
          säkerhetskritiskt innehåll kräver två olika granskare. Gaterna
          verkställs i databasen — de går inte att kringgå härifrån.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-label text-muted-foreground">
          Uppgifter ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Kön är tom.
          </p>
        ) : (
          items.map((item) => (
            <details
              key={item.id}
              className="group rounded-lg border border-border bg-card"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span className="font-readout text-xs text-muted-foreground">
                  {item.item_templates?.stable_key}
                </span>
                <span className="flex-1 text-sm font-medium">
                  {item.stem_sv}
                </span>
                <EntityStatus status={item.status} />
                {item.criticality === "safety_critical" ? (
                  <EntityStatus status="review_required" />
                ) : null}
              </summary>
              <div className="space-y-4 border-t border-border p-4">
                <ItemPreview
                  kind={item.item_templates?.item_kind ?? "unknown"}
                  interaction={item.interaction}
                  answerKey={item.answer_key}
                  explanation={item.explanation_sv}
                />
                <DecisionSummary decisions={item.decisions} />
                <ReviewActions
                  entityType="item"
                  versionId={item.id}
                  canReview={canReview}
                  canPublish={canPublish}
                />
              </div>
            </details>
          ))
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-label text-muted-foreground">
          Lektioner ({lessons.length})
        </h2>
        {lessons.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Kön är tom.
          </p>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex-1 text-sm font-medium">
                  {lesson.title_sv}
                </span>
                <EntityStatus status={lesson.status} />
              </div>
              {lesson.lead_sv ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {lesson.lead_sv}
                </p>
              ) : null}
              <div className="mt-3 space-y-3">
                <DecisionSummary decisions={lesson.decisions} />
                <ReviewActions
                  entityType="lesson"
                  versionId={lesson.id}
                  canReview={canReview}
                  canPublish={canPublish}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
