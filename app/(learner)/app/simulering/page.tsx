import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExamClient } from "@/components/exam/exam-client";
import { setActiveCertification } from "@/lib/certifications/actions";
import { requireActiveCertification } from "@/lib/certifications/active";
import { certification } from "@/lib/certifications/registry";
import { discardDemoExam, getDemoExamState } from "@/lib/exam/actions";
import { EXAM_CONFIG } from "@/lib/exam/blueprints";

export const metadata: Metadata = { title: "Träningssimulering" };

/**
 * Training simulation (SPEC §35), certification-scoped. Resumes an
 * in-progress session (server-owned timer) if one exists FOR THE ACTIVE
 * certification; a session started for another certification renders a
 * resume/discard notice — pools are never mixed. The demo path is fully
 * playable without a database.
 */
export default async function SimuleringPage() {
  const def = await requireActiveCertification("/app/simulering");
  const resumed = await getDemoExamState();

  if (resumed && resumed.cert !== def.id) {
    const sessionDef = certification(resumed.cert);
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card className="bezel">
          <CardContent className="space-y-4 py-8">
            <p className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle aria-hidden="true" className="size-5 text-warning" />
              Du har en pågående simulering för {sessionDef.nameSv}
            </p>
            <p className="text-sm text-muted-foreground">
              Du pluggar just nu mot {def.nameSv}. Simuleringen som pågår
              startades för {sessionDef.nameSv} — återuppta den (byter tillbaka
              ditt intyg) eller avbryt den och starta en ny för {def.nameSv}.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <form
                action={setActiveCertification.bind(
                  null,
                  resumed.cert,
                  "/app/simulering",
                )}
              >
                <Button type="submit">
                  Återuppta som {sessionDef.shortLabel}
                </Button>
              </form>
              <form action={discardDemoExam}>
                <Button type="submit" variant="outline">
                  Avbryt simuleringen
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = EXAM_CONFIG[def.id];
  return (
    <ExamClient
      resumed={resumed}
      intro={{
        titleSv: config.titleSv,
        minutes: Math.round(config.durationSeconds / 60),
        preview: def.status === "preview",
      }}
    />
  );
}
