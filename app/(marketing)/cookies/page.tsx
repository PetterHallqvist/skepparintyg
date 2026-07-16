import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Så använder Sjöklart cookies: nödvändiga cookies för att tjänsten ska fungera, och analys först efter samtycke.",
};

export default function Page() {
  return (
    <ContentPage
      title="Cookies"
      updated="2026-07-16"
      sections={[
        {
          heading: "Nödvändiga cookies",
          paragraphs: [
            "Vissa cookies krävs för att tjänsten ska fungera, till exempel för inloggning och säkerhet. De kan inte stängas av.",
          ],
        },
        {
          heading: "Analys",
          paragraphs: [
            "Analys används först efter att du aktivt samtyckt. Samtycket är avstängt som standard och du kan när som helst ändra det. Utan samtycke laddas ingen analys.",
          ],
        },
        {
          heading: "Inga spårpixlar för minderåriga",
          paragraphs: [
            "I elevläge för minderåriga används ingen analys eller marknadsföringsspårning.",
          ],
        },
      ]}
    />
  );
}
