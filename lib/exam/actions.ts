"use server";

import { cookies } from "next/headers";
import { gradeResponse } from "@/lib/grading";
import { buildDemoExam } from "@/lib/exam/demo";
import { sanitizeDemoItem } from "@/lib/learning/demo";
import { scoreExam, type ScoredItem, type ExamResult } from "@/lib/exam/scoring";
import { isExpired, remainingMs } from "@/lib/exam/timer";
import { logger } from "@/lib/observability/logger";

/**
 * Demo simulation actions (SPEC §35). Session state lives in an httpOnly cookie
 * — the client cannot read or extend it, so the timer is server-authoritative
 * even in the demo. The challenge payloads NEVER contain answer keys (§58.3);
 * grading happens only here on submit; the cookie is cleared on submit so a
 * session can never be re-scored (one-final-submission, §35.5).
 */

const COOKIE = "sim_demo";

interface Session {
  seed: string;
  startedAt: string;
}

export interface ExamChallenge {
  position: number;
  sectionId: string;
  sectionTitle: string;
  isDiagnostic: boolean;
  itemId: string;
  kind: string;
  stemSv: string;
  interaction: Record<string, unknown>;
  objectiveTitle: string;
}

export interface ExamState {
  title: string;
  startedAt: string;
  durationSeconds: number;
  passThresholdBp: number;
  remainingMs: number;
  challenges: ExamChallenge[];
}

function encode(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}
function decode(raw: string): Session | null {
  try {
    const s = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (typeof s?.seed === "string" && typeof s?.startedAt === "string") return s;
  } catch {
    /* fall through */
  }
  return null;
}

function buildState(session: Session): ExamState {
  const { blueprint, assembled, itemById } = buildDemoExam(session.seed);
  const challenges: ExamChallenge[] = [];
  let position = 0;
  for (const section of assembled.sections) {
    for (const itemId of section.itemIds) {
      const item = itemById.get(itemId)!;
      const sanitized = sanitizeDemoItem(item, assembled.itemOrder.length);
      challenges.push({
        position: position++,
        sectionId: section.sectionId,
        sectionTitle: section.title,
        isDiagnostic: section.isDiagnostic,
        itemId,
        kind: sanitized.kind,
        stemSv: sanitized.stemSv,
        interaction: sanitized.interaction,
        objectiveTitle: sanitized.objectiveTitle,
      });
    }
  }
  return {
    title: blueprint.title,
    startedAt: session.startedAt,
    durationSeconds: blueprint.durationSeconds,
    passThresholdBp: blueprint.passThresholdBp,
    remainingMs: remainingMs(
      session.startedAt,
      blueprint.durationSeconds,
      new Date(),
    ),
    challenges,
  };
}

export async function startDemoExam(): Promise<ExamState> {
  const session: Session = {
    seed: globalThis.crypto.randomUUID(),
    startedAt: new Date().toISOString(),
  };
  const jar = await cookies();
  jar.set(COOKIE, encode(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  logger.info("exam.demo_started", {});
  return buildState(session);
}

export async function getDemoExamState(): Promise<ExamState | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const session = decode(raw);
  return session ? buildState(session) : null;
}

export interface ExamWrongItem {
  stemSv: string;
  explanation: string;
  sourceRef: string;
  objectiveTitle: string;
}

export interface ExamSubmitResult {
  result: ExamResult;
  expired: boolean;
  wrongItems: ExamWrongItem[];
}

export async function submitDemoExam(
  answers: Record<string, unknown>,
): Promise<ExamSubmitResult | { error: "no_session" }> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  const session = raw ? decode(raw) : null;
  if (!session) return { error: "no_session" };

  const { blueprint, assembled, itemById } = buildDemoExam(session.seed);
  const scored: ScoredItem[] = [];
  const wrongItems: ExamWrongItem[] = [];
  const sectionTitles: Record<string, string> = {};

  for (const section of assembled.sections) {
    sectionTitles[section.sectionId] = section.title;
    for (const itemId of section.itemIds) {
      const item = itemById.get(itemId)!;
      const response = answers[itemId];
      // Unanswered (undefined/null) or malformed → incorrect. The per-kind
      // graders Zod-parse the response and throw on a missing one, so guard.
      let correct = false;
      if (response !== undefined && response !== null) {
        try {
          correct = gradeResponse({
            kind: item.kind,
            answerKey: item.answerKey,
            response,
          }).correct;
        } catch {
          correct = false;
        }
      }
      scored.push({
        itemId,
        sectionId: section.sectionId,
        isDiagnostic: section.isDiagnostic,
        correct,
      });
      if (!correct && !section.isDiagnostic) {
        wrongItems.push({
          stemSv: item.stemSv,
          explanation: item.explanation,
          sourceRef: item.sourceRef,
          objectiveTitle: item.objectiveTitle,
        });
      }
    }
  }

  const result = scoreExam(scored, sectionTitles, blueprint.passThresholdBp);
  const expired = isExpired(
    session.startedAt,
    blueprint.durationSeconds,
    new Date(),
  );

  // One-final-submission: clear the session so it can never be re-scored.
  jar.delete(COOKIE);
  logger.info("exam.demo_submitted", {
    scoreBp: result.scoreBp,
    passed: result.passed,
    expired,
  });

  return { result, expired, wrongItems };
}
