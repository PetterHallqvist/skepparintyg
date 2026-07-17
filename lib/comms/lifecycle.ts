import "server-only";
import { sendEmail, type SendEmailResult } from "@/lib/comms/email";
import { BRAND } from "@/lib/brand";

/**
 * Lifecycle email skeletons (SPEC §53, extends the 6c Resend layer). All go
 * through sendEmail, so they no-op with a preview log when comms is unconfigured
 * and are logged to communication_log. `study_reminder` is a marketing-class
 * message and is BLOCKED for minor learner addresses by sendEmail (§70.3).
 *
 * These are ready to call; wiring them to triggers (welcome on signup,
 * reminders via a scheduled job) is an operator/cron task (HUMAN_VERIFY).
 */

function shell(bodyHtml: string): string {
  return `<!doctype html><html lang="sv"><body style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">${bodyHtml}<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/><p style="font-size:12px;color:#64748b">${BRAND.independenceDisclaimer}</p></body></html>`;
}

export function sendWelcome(input: {
  to: string;
  userId?: string;
}): Promise<SendEmailResult> {
  const text = `Välkommen till ${BRAND.name}!\n\nDu är igång. Börja med ett övningspass och följ din beredskap fram till provdagen.\n\n${BRAND.independenceDisclaimer}`;
  return sendEmail({
    to: input.to,
    subject: `Välkommen till ${BRAND.name}`,
    html: shell(
      `<h1 style="font-size:20px">Välkommen till ${BRAND.name}</h1><p>Du är igång. Börja med ett övningspass och följ din beredskap fram till provdagen.</p>`,
    ),
    text,
    messageType: "welcome",
    userId: input.userId,
  });
}

export function sendGuardianWelcome(input: {
  to: string;
  userId?: string;
}): Promise<SendEmailResult> {
  const text = `Tack för att du satte upp ett konto hos ${BRAND.name}.\n\nDu hanterar elevprofiler, elevplatser och samtycken under Vårdnadshavare. Elevens studiedata tillhör eleven, och vi minimerar vilka uppgifter vi samlar in.`;
  return sendEmail({
    to: input.to,
    subject: `Kom igång som vårdnadshavare — ${BRAND.name}`,
    html: shell(
      `<h1 style="font-size:20px">Kom igång som vårdnadshavare</h1><p>Du hanterar elevprofiler, elevplatser och samtycken under <strong>Vårdnadshavare</strong>. Elevens studiedata tillhör eleven.</p>`,
    ),
    text,
    messageType: "guardian_welcome",
    userId: input.userId,
  });
}

export function sendStudyReminder(input: {
  to: string;
  userId?: string;
  recipientIsMinor?: boolean;
}): Promise<SendEmailResult> {
  const text = `Dags att öva lite? Ett kort pass i dag håller din beredskap uppe inför provet.`;
  return sendEmail({
    to: input.to,
    subject: `Dags för ett övningspass — ${BRAND.name}`,
    html: shell(
      `<h1 style="font-size:20px">Dags för ett övningspass?</h1><p>Ett kort pass i dag håller din beredskap uppe inför provet.</p>`,
    ),
    text,
    messageType: "study_reminder",
    userId: input.userId,
    recipientIsMinor: input.recipientIsMinor,
  });
}
