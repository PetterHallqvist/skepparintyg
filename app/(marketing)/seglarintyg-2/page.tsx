import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "Seglarintyg 2 (planerad)",
  description:
    "Seglarintyg 2 är planerad. Ställ dig i kö för besked när fortsättningsnivån — båtsystem, precisionstrim och trånga vatten — öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="seglarintyg_2"
      freeTestCertId="seglarintyg_2"
      title="Seglarintyg 2"
      tagline="Fortsättningssegling — moderna båtsystem, precisionstrim, hamnmanöver och skiftande väder."
      covers={[
        "Moderna båtsystem, underhåll och kontroller",
        "Precisionstrim och koordinerade manövrar",
        "Manövrering i trånga vatten, tilläggning och ankring",
        "Dimma, lokalväder och prognostolkning",
      ]}
      prerequisite="Seglarintyg 1 och Förarintyg."
    />
  );
}
