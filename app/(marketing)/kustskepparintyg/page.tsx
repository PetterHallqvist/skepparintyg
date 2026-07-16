import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "Kustskepparintyg (planerad)",
  description:
    "Kustskepparintyg är planerad. Ställ dig i kö för besked när fördjupad navigation, mörkerkörning och ruttplanering öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="kustskepparintyg"
      title="Kustskepparintyg"
      tagline="Fördjupad navigation, mörkerkörning och ruttplanering för längre kustturer."
      covers={[
        "Terrängnavigering och positionsbestämning i mörker",
        "Ruttplanering med tid, ström och tidvatten",
        "Fördjupad sjökortskunskap och elektroniska sjökort",
        "Säkerhet och beredskap på längre turer",
      ]}
      prerequisite="Förarintyg samt godkänd båtpraktik."
    />
  );
}
