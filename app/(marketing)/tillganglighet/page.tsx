import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Tillgänglighet",
  description:
    "Sjöklarts tillgänglighetsarbete: tangentbordsstöd, textalternativ till pekbaserade moment och respekt för minskad rörelse.",
};

export default function Page() {
  return (
    <ContentPage
      title="Tillgänglighet"
      updated="2026-07-16"
      sections={[
        {
          heading: "Vår ambition",
          paragraphs: [
            "Vi strävar efter att tjänsten ska gå att använda med tangentbord och skärmläsare, och att interaktiva moment har textbaserade alternativ.",
          ],
        },
        {
          heading: "Sjökort och övningar",
          paragraphs: [
            "Pekbaserade moment i sjökortslabbet har alltid ett alternativ där du kan skriva in koordinater, kurs och distans. Animationer respekterar inställningen för minskad rörelse.",
          ],
        },
        {
          heading: "Hör av dig",
          paragraphs: [
            <>
              Stöter du på ett hinder? Mejla{" "}
              <a
                className="text-sea-700 underline dark:text-sea-300"
                href={`mailto:${BRAND.supportEmail}`}
              >
                {BRAND.supportEmail}
              </a>{" "}
              så åtgärdar vi det.
            </>,
          ],
        },
      ]}
    />
  );
}
