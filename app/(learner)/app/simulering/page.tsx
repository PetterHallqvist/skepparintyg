import type { Metadata } from "next";
import { ExamClient } from "@/components/exam/exam-client";
import { getDemoExamState } from "@/lib/exam/actions";

export const metadata: Metadata = { title: "Träningssimulering" };

/**
 * Training simulation (SPEC §35). Resumes an in-progress session (server-owned
 * timer) if one exists, otherwise shows the intro. The demo path is fully
 * playable without a database; the DB-backed path (exam_sessions + RPCs, M5)
 * activates with real blueprints and a live item pool.
 */
export default async function SimuleringPage() {
  const resumed = await getDemoExamState();
  return <ExamClient resumed={resumed} />;
}
