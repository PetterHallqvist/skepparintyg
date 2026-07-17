import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "Seglarintyg 3 (planerad)",
  description:
    "Seglarintyg 3 är planerad. Ställ dig i kö för besked när den avancerade nivån — offshore, hårt väder och natt — öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="seglarintyg_3"
      freeTestCertId="seglarintyg_3"
      title="Seglarintyg 3"
      tagline="Avancerad segling — offshoreplanering, hårt väder, natt- och felscenarier."
      covers={[
        "Offshoreplanering, vaktsystem och angöring",
        "Hårtvädersförberedelser och konservativa beslut",
        "Spinnaker/gennaker och avancerad trim",
        "Natt- och offshorerutiner, avancerad MOB och felscenarier",
      ]}
      prerequisite="Seglarintyg 2 och Kustskepparintyg."
    />
  );
}
