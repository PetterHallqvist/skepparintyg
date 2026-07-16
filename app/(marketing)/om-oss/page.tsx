import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Sjöklart är en fristående förberedelsetjänst inför Förarintyg, byggd på övning, källhänvisningar och ärlig återkoppling.",
};

export default function Page() {
  return (
    <ContentPage
      title="Om oss"
      lead="Vi bygger en förberedelsetjänst som lär dig det du faktiskt behöver kunna — genom att göra, inte bara läsa."
      sections={[
        {
          heading: "Vad vi tror på",
          paragraphs: [
            "Passiv video tar dig inte till godkänt. Vår metod bygger på att du gör momenten själv, med omedelbar och exakt återkoppling — särskilt sjökortsarbetet, som vi låter dig träna på ett interaktivt övningskort.",
          ],
        },
        {
          heading: "Källor och granskning",
          paragraphs: [
            "Varje faktapåstående ska kunna spåras till en källa, och vi visar alltid datum för senaste kontroll. Innehåll granskas innan det publiceras.",
          ],
        },
        {
          heading: "Fristående",
          paragraphs: [BRAND.independenceDisclaimer],
        },
        {
          heading: "Ärlighet framför löften",
          paragraphs: [
            "Vi mäter din beredskap öppet och visar vad som återstår — men ingen kurs kan garantera ett provresultat. Vi lovar ärlig återkoppling, inte garantier.",
          ],
        },
      ]}
    />
  );
}
