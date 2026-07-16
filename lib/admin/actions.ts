"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/observability/logger";

export type ActionResult = { ok: boolean; message: string };

const fail = (message: string): ActionResult => ({ ok: false, message });
const ok = (message: string): ActionResult => ({ ok: true, message });

async function audit(
  action: string,
  entityType: string,
  entityId: string,
  after?: unknown,
) {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("log_audit", {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_after: after ?? null,
  });
}

// ---------------------------------------------------------------------------
// Review decisions (SPEC §39.2, §47)
// ---------------------------------------------------------------------------

const reviewSchema = z.object({
  entityType: z.enum(["item", "lesson"]),
  versionId: z.uuid(),
  reviewType: z.enum([
    "domain",
    "editorial",
    "accessibility",
    "media",
    "legal",
  ]),
  decision: z.enum(["approve", "changes_requested", "reject"]),
  comments: z.string().max(4000).optional(),
});

export async function recordReviewDecision(
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireStaff();
  if (staff.preview) return fail("Supabase är inte konfigurerat.");
  if (!["admin", "reviewer"].includes(staff.role)) {
    return fail("Endast granskare kan registrera granskningsbeslut.");
  }

  const parsed = reviewSchema.safeParse({
    entityType: formData.get("entityType"),
    versionId: formData.get("versionId"),
    reviewType: formData.get("reviewType"),
    decision: formData.get("decision"),
    comments: formData.get("comments") || undefined,
  });
  if (!parsed.success) return fail("Ogiltiga fält i granskningsbeslutet.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("review_decisions").insert({
    entity_type: parsed.data.entityType,
    entity_version_id: parsed.data.versionId,
    review_type: parsed.data.reviewType,
    reviewer_user_id: staff.userId,
    decision: parsed.data.decision,
    comments: parsed.data.comments ?? null,
  });
  if (error) {
    logger.warn("admin.review_decision_failed", { code: error.code });
    return fail("Beslutet kunde inte sparas.");
  }

  await audit(
    "review_decision",
    parsed.data.entityType,
    parsed.data.versionId,
    {
      reviewType: parsed.data.reviewType,
      decision: parsed.data.decision,
    },
  );
  revalidatePath("/admin/review");
  return ok("Granskningsbeslut sparat.");
}

// ---------------------------------------------------------------------------
// Publish (DB triggers enforce the gates regardless of this path)
// ---------------------------------------------------------------------------

const publishSchema = z.object({
  entityType: z.enum(["item", "lesson"]),
  versionId: z.uuid(),
});

export async function publishVersion(
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireStaff();
  if (staff.preview) return fail("Supabase är inte konfigurerat.");
  if (!["admin", "editor"].includes(staff.role)) {
    return fail("Endast admin/redaktör kan publicera.");
  }

  const parsed = publishSchema.safeParse({
    entityType: formData.get("entityType"),
    versionId: formData.get("versionId"),
  });
  if (!parsed.success) return fail("Ogiltig publiceringsbegäran.");

  const supabase = await createSupabaseServerClient();
  const table =
    parsed.data.entityType === "item" ? "item_versions" : "lesson_versions";

  const { error } = await supabase
    .from(table)
    .update({ status: "live" })
    .eq("id", parsed.data.versionId);

  if (error) {
    // Publish-gate exceptions surface here (missing source/reviews) — show them.
    return fail(`Publicering stoppad: ${error.message}`);
  }

  // Point the parent at the new live version.
  if (parsed.data.entityType === "item") {
    const { data: version } = await supabase
      .from("item_versions")
      .select("template_id")
      .eq("id", parsed.data.versionId)
      .single();
    if (version) {
      await supabase
        .from("item_templates")
        .update({ current_version_id: parsed.data.versionId, status: "live" })
        .eq("id", version.template_id);
    }
  } else {
    const { data: version } = await supabase
      .from("lesson_versions")
      .select("lesson_id")
      .eq("id", parsed.data.versionId)
      .single();
    if (version) {
      await supabase
        .from("lessons")
        .update({ current_version_id: parsed.data.versionId, status: "live" })
        .eq("id", version.lesson_id);
    }
  }

  await audit("publish", parsed.data.entityType, parsed.data.versionId);
  revalidatePath("/admin/review");
  revalidatePath("/admin");
  return ok("Publicerad.");
}

// ---------------------------------------------------------------------------
// Sources (§3.3 change monitoring — manual flag)
// ---------------------------------------------------------------------------

const sourceFlagSchema = z.object({ sourceId: z.uuid() });

export async function flagSourceReviewRequired(
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireStaff();
  if (staff.preview) return fail("Supabase är inte konfigurerat.");
  if (!["admin", "editor"].includes(staff.role)) {
    return fail("Endast admin/redaktör kan flagga källor.");
  }

  const parsed = sourceFlagSchema.safeParse({
    sourceId: formData.get("sourceId"),
  });
  if (!parsed.success) return fail("Ogiltig källa.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("source_documents")
    .update({
      status: "review_required",
      last_checked_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.sourceId);

  if (error) return fail("Källan kunde inte flaggas.");

  await audit("source_flagged", "source", parsed.data.sourceId);
  revalidatePath("/admin/sources");
  return ok("Källan flaggad — berörda mål har markerats review_required.");
}

// ---------------------------------------------------------------------------
// Official facts (§44.5) — re-verify with date stamp
// ---------------------------------------------------------------------------

const factSchema = z.object({
  factId: z.uuid(),
  publicCopy: z.string().min(1).max(2000),
});

export async function reverifyOfficialFact(
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireStaff();
  if (staff.preview) return fail("Supabase är inte konfigurerat.");
  if (!["admin", "editor"].includes(staff.role)) {
    return fail("Endast admin/redaktör kan uppdatera officiella fakta.");
  }

  const parsed = factSchema.safeParse({
    factId: formData.get("factId"),
    publicCopy: formData.get("publicCopy"),
  });
  if (!parsed.success) return fail("Ogiltiga faktafält.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("official_facts")
    .update({
      public_copy_sv: parsed.data.publicCopy,
      verified_at: new Date().toISOString(),
      verified_by: staff.userId,
      status: "active",
    })
    .eq("id", parsed.data.factId);

  if (error) return fail("Faktumet kunde inte uppdateras.");

  await audit("fact_reverified", "fact", parsed.data.factId);
  revalidatePath("/admin/settings/official-facts");
  return ok("Faktum verifierat med dagens datum.");
}

// ---------------------------------------------------------------------------
// Content issues triage
// ---------------------------------------------------------------------------

const issueSchema = z.object({
  issueId: z.uuid(),
  status: z.enum(["open", "triaged", "in_progress", "resolved", "rejected"]),
  severity: z
    .enum(["untriaged", "minor", "major", "blocker", "safety"])
    .optional(),
});

export async function triageIssue(formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  if (staff.preview) return fail("Supabase är inte konfigurerat.");
  if (!["admin", "editor", "support"].includes(staff.role)) {
    return fail("Behörighet saknas.");
  }

  const parsed = issueSchema.safeParse({
    issueId: formData.get("issueId"),
    status: formData.get("status"),
    severity: formData.get("severity") || undefined,
  });
  if (!parsed.success) return fail("Ogiltiga ärendefält.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("content_issues")
    .update({
      status: parsed.data.status,
      ...(parsed.data.severity ? { severity: parsed.data.severity } : {}),
      ...(parsed.data.status === "resolved"
        ? { resolved_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", parsed.data.issueId);

  if (error) return fail("Ärendet kunde inte uppdateras.");

  await audit("issue_triaged", "issue", parsed.data.issueId, parsed.data);
  revalidatePath("/admin/issues");
  return ok("Ärendet uppdaterat.");
}
