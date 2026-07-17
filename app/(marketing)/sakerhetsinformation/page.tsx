import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Säkerhetsinformation",
  description:
    "Viktigt: allt övningsmaterial hos Sjöklart är fiktivt och får aldrig användas för verklig navigation.",
};

export default function Page() {
  return (
    <ContentPage
      title="Säkerhetsinformation"
      sections={[
        {
          heading: "Övningskort — ej för navigation",
          paragraphs: [
            `Alla sjökort och övningsmiljöer i tjänsten är egna, fiktiva övningskort. ${BRAND.navigationDisclaimer} Använd alltid officiella sjökort och utrustning för verklig navigation.`,
          ],
        },
        {
          heading: "Utbildning ersätter inte omdöme",
          paragraphs: [
            "Materialet förbereder dig för teoriprovet. Verklig sjösäkerhet kräver praktik, gott sjömanskap och att du följer gällande regler och väderförhållanden.",
          ],
        },
        {
          heading: "I nödsituation",
          paragraphs: [
            "Vid fara för liv, ring 112. Denna tjänst är inte avsedd för nödsituationer och kan inte kontaktas för räddning.",
          ],
        },
      ]}
    />
  );
}
