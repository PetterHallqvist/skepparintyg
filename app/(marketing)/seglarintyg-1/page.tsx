import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "Seglarintyg 1 (planerad)",
  description:
    "Seglarintyg 1 är planerad. Ställ dig i kö för besked när grundläggande segling — rigg, bogar, manövrar och sjövett — öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="seglarintyg_1"
      freeTestCertId="seglarintyg_1"
      title="Seglarintyg 1"
      tagline="Grundläggande segling — rigg och segel, bogar, slag och gipp, tilläggning och sjövett."
      covers={[
        "Båtens och riggens delar, segelteori och bogar",
        "Hissa, reva, trimma — och stagvändning/gipp steg för steg",
        "Väjningsregler för segelbåt och man-över-bord under segel",
        "Praktisk förberedelse inför handledd segling",
      ]}
      prerequisite="Inga förkunskaper krävs."
    />
  );
}
