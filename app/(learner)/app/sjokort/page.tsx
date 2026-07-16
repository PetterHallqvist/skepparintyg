import type { Metadata } from "next";
import { ComingSoon } from "@/components/learning/coming-soon";

export const metadata: Metadata = { title: "Sjökortslabbet" };

export default function SjokortPage() {
  return (
    <ComingSoon
      title="Sjökortslabbet"
      phase="fas 3"
      description="Här ritar, mäter och räknar du på ett interaktivt fiktivt övningskort — distans, kurs, position och rutter med exakt gradering av dina svar."
    />
  );
}
