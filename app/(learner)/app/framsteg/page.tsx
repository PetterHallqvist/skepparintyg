import type { Metadata } from "next";
import { ComingSoon } from "@/components/learning/coming-soon";

export const metadata: Metadata = { title: "Framsteg" };

export default function FramstegPage() {
  return (
    <ComingSoon
      title="Framsteg"
      phase="fas 2"
      description="Din beredskap per kunskapsområde, med panelen ”Så beräknas detta”: vilka belägg som höjde eller sänkte poängen och vad du bör göra härnäst."
    />
  );
}
