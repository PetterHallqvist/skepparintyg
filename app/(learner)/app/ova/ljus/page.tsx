import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Ljus, dagersignaler & ljud" };

export default function LjusTrainerPage() {
  return <TrainerPage track="ljus" />;
}
