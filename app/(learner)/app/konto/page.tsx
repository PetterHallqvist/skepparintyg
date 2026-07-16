import type { Metadata } from "next";
import { ComingSoon } from "@/components/learning/coming-soon";

export const metadata: Metadata = { title: "Konto" };

export default function KontoPage() {
  return (
    <ComingSoon
      title="Konto"
      phase="fas 6"
      description="Profil, elevprofiler för vårdnadshavare, samtyckesinställningar, dataexport och radering av konto."
    />
  );
}
