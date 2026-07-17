import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Kundtjänst",
  description:
    "Kontakta Sjöklarts kundtjänst. Vi svarar normalt inom en till två arbetsdagar.",
};

export default function Page() {
  return (
    <ContentPage
      title="Kundtjänst"
      lead="Vi hjälper dig gärna. Kontakta oss så svarar vi normalt inom en till två arbetsdagar."
      sections={[
        {
          heading: "Kontakt",
          paragraphs: [
            <>
              Mejla oss på{" "}
              <a
                className="text-sea-700 underline dark:text-sea-300"
                href={`mailto:${BRAND.supportEmail}`}
              >
                {BRAND.supportEmail}
              </a>
              .
            </>,
          ],
        },
        {
          heading: "Vanliga frågor",
          paragraphs: [
            "Utfärdar ni intyget? Nej — vi är en fristående utbildning. Provet bokas och intyget utfärdas genom den officiella processen hos NFB.",
            "Kan mitt barn använda kursen? Ja. Förarintyg har 12-årsgräns; kontot och köpet ägs av en vuxen och eleven får en egen profil.",
            "Får jag pengarna tillbaka? Se köpvillkoren om ångerrätt och omedelbar leverans.",
          ],
        },
      ]}
    />
  );
}
