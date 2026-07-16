import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { TERMS_VERSION } from "@/lib/commerce/constants";
import { PRE_PURCHASE_DISCLOSURE } from "@/lib/commerce/legal-copy";

export const metadata: Metadata = {
  title: "Köpvillkor",
  description:
    "Sjöklarts köpvillkor: pris inkl. moms, ångerrätt, omedelbar leverans och officiella avgifter som betalas separat.",
};

export default function Page() {
  return (
    <ContentPage
      title="Köpvillkor"
      updated="2026-07-16"
      draftNote="Utkast — köpvillkoren granskas av juridisk expertis inför lansering. Se docs/LEGAL_COPY.md."
      sections={[
        {
          heading: `Version ${TERMS_VERSION}`,
          paragraphs: [
            "Nedan sammanfattas det som visas i kassan innan köp. Den fullständiga, juridiskt granskade texten publiceras inför lansering.",
          ],
        },
        ...PRE_PURCHASE_DISCLOSURE.map((d) => ({
          heading: d.heading,
          paragraphs: [d.body],
        })),
      ]}
    />
  );
}
