import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TrainerPage } from "@/components/learning/trainer-page";
import { requireActiveCertification } from "@/lib/certifications/active";

export const metadata: Metadata = { title: "Övning" };

/**
 * Dynamic trainer route: one (certification, track) pair per page. The active
 * certification comes from the httpOnly cookie; a track the certification
 * does not declare (e.g. /app/ova/ljus while studying SRC) redirects to the
 * hub — cross-certification questions can never render.
 */
export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const def = await requireActiveCertification(`/app/ova/${track}`);
  const exists = def.tracks.some((t) => t.id === track);
  if (!exists) redirect("/app/ova");
  return <TrainerPage cert={def.id} track={track} />;
}
