import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Experter och källor",
  description:
    "Så säkrar vi kvaliteten: källhänvisningar, granskning av navigationskunnig person och datum för senaste kontroll.",
};

export default function Page() {
  return (
    <ContentPage
      title="Experter och källor"
      lead="Vår trovärdighet vilar på spårbara källor och mänsklig granskning."
      draftNote="Namn och kvalifikationer för granskare publiceras inför lansering (operatörsuppgift)."
      sections={[
        {
          heading: "Källhänvisningar",
          paragraphs: [
            "Faktapåståenden knyts till en källa och ett datum för senaste kontroll. Officiella uppgifter (som godkäntgräns och provtid) hämtas från NFB och PTS och visas alltid med källa.",
          ],
        },
        {
          heading: "Granskning",
          paragraphs: [
            "Innehåll granskas av en navigationskunnig person innan det publiceras. Säkerhetskritiska moment kräver mer än en granskare.",
          ],
        },
        {
          heading: "Övningssjökort",
          paragraphs: [
            "Alla sjökort i tjänsten är egna, fiktiva övningskort — aldrig avbildningar av riktiga sjökort — och är märkta ”Övningskort — ej för navigation”.",
          ],
        },
      ]}
    />
  );
}
