import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "Båtpraktik — förberedelse (planerad)",
  description:
    "Förberedelse inför det handledda båtpraktikpasset är planerad. Ställ dig i kö för besked när checklistor och loggbok öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="batpraktik"
      title="Båtpraktik — förberedelse"
      tagline="Checklista, genomgång och loggbok inför det handledda praktikpasset."
      covers={[
        "Vad praktikmomenten kräver av dig",
        "Förberedande genomgång av manövrer",
        "Loggbok och checklistor",
        "Vad du tar med dig till passet",
      ]}
      prerequisite="Själva praktiken sker fysiskt med en handledare och ingår inte i den digitala förberedelsen."
    />
  );
}
