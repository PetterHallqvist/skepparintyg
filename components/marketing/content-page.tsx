import type { ReactNode } from "react";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";

export interface ContentSection {
  heading?: string;
  paragraphs: (string | ReactNode)[];
}

/**
 * Shared informational / legal page shell. Renders a titled article of prose
 * sections at a comfortable reading measure (paper theme). Legal pages pass a
 * draft note to surface the [LEGAL GATE] status.
 */
export function ContentPage({
  title,
  lead,
  updated,
  sections,
  draftNote,
  children,
}: {
  title: string;
  lead?: string;
  updated?: string;
  sections?: ContentSection[];
  draftNote?: string;
  children?: ReactNode;
}) {
  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <SectionHeading as="h1" title={title} lead={lead} />
        {updated && (
          <p className="mt-3 text-xs text-muted-foreground">
            Senast uppdaterad {updated}
          </p>
        )}
        {draftNote && (
          <DisclaimerBlock className="mt-6">{draftNote}</DisclaimerBlock>
        )}

        {sections && (
          <div className="mt-8 space-y-8">
            {sections.map((s, i) => (
              <div key={s.heading ?? i}>
                {s.heading && (
                  <h2 className="font-semibold tracking-tight">{s.heading}</h2>
                )}
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {s.paragraphs.map((p, j) =>
                    typeof p === "string" ? (
                      <p key={j}>{p}</p>
                    ) : (
                      // Non-string nodes (e.g. SourceStamp) render block-level.
                      <div key={j}>{p}</div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {children}
      </PageShell>
    </section>
  );
}
