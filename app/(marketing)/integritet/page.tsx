import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Så behandlar Sjöklart personuppgifter: dataminimering, barns uppgifter, samtycken och dina rättigheter enligt GDPR.",
};

export default function Page() {
  return (
    <ContentPage
      title="Integritetspolicy"
      updated="2026-07-16"
      draftNote="Utkast — integritetspolicyn granskas inför lansering, inklusive flödet för barn och vårdnadshavare. Se docs/LEGAL_COPY.md."
      sections={[
        {
          heading: "Dataminimering",
          paragraphs: [
            "Vi samlar bara in det vi behöver. För elevprofiler lagrar vi visningsnamn och åldersspann — aldrig fullständigt namn, personnummer eller exakt plats.",
          ],
        },
        {
          heading: "Barn och vårdnadshavare",
          paragraphs: [
            "Konton och köp ägs av en vuxen. En minderårig elev får en egen studieprofil utan marknadsföring. Samtycken hanteras per ändamål och är avstängda som standard.",
          ],
        },
        {
          heading: "Samtycken",
          paragraphs: [
            "Marknadsföring och produktanalys kräver separata, aktiva samtycken. Du kan när som helst återkalla ett samtycke.",
          ],
        },
        {
          heading: "Dina rättigheter",
          paragraphs: [
            "Du kan exportera dina data och radera ditt konto under Konto. Vissa köp- och bokföringsuppgifter sparas så länge lagen kräver det och gallras därefter.",
          ],
        },
      ]}
    />
  );
}
