import type { Metadata } from "next";
import { ComingSoon } from "@/components/learning/coming-soon";

export const metadata: Metadata = { title: "Öva" };

export default function OvaPage() {
  return (
    <ComingSoon
      title="Öva"
      phase="fas 2"
      description="Adaptiva studiepass: repetitioner som är på väg att glömmas, ett huvudmoment med stöd och blandade självständiga uppgifter — cirka 15–20 minuter per pass."
    />
  );
}
