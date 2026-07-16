import type { Metadata } from "next";
import { WaitlistPage } from "@/components/marketing/waitlist";

export const metadata: Metadata = {
  title: "SRC (VHF) (planerad)",
  description:
    "SRC/VHF-förberedelse är planerad. Ställ dig i kö för besked när radiokommunikation och scenarioövningar öppnar.",
};

export default function Page() {
  return (
    <WaitlistPage
      certId="src"
      title="SRC (VHF)"
      tagline="Marin radiokommunikation med scenarioövningar inför SRC-provet."
      covers={[
        "VHF-anrop, kanaler och radiodisciplin",
        "Nöd-, il- och varningstrafik (DSC)",
        "Scenarioövningar för vanliga situationer",
        "Regler och tillstånd (PTS)",
      ]}
      prerequisite="VHF i fritidsbåt kräver tillstånd från PTS. Den officiella processen omfattar även praktisk/simulatordel."
    />
  );
}
