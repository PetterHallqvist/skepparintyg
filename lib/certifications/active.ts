import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CERT_COOKIE,
  certIdSchema,
  certification,
  type CertificationDef,
  type CertificationId,
} from "@/lib/certifications/registry";

/**
 * Server-side read of the learner's chosen certification. The httpOnly cookie
 * is the runtime truth in both demo and DB mode; it is set only by the
 * validated server action in ./actions.ts. Invalid or missing → null, and the
 * proxy gate sends the learner to /app/valj-intyg.
 */
export async function getActiveCertificationId(): Promise<CertificationId | null> {
  const jar = await cookies();
  const parsed = certIdSchema.safeParse(jar.get(CERT_COOKIE)?.value);
  return parsed.success ? parsed.data : null;
}

/**
 * Defence-in-depth behind the middleware gate: pages that need a
 * certification call this and get a redirect instead of a crash if the
 * cookie disappeared mid-session.
 */
export async function requireActiveCertification(
  nasta: string,
): Promise<CertificationDef> {
  const id = await getActiveCertificationId();
  if (!id) redirect(`/app/valj-intyg?nasta=${encodeURIComponent(nasta)}`);
  return certification(id);
}
