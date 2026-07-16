import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Väder & beslut" };

export default function VaderTrainerPage() {
  return <TrainerPage track="vader" />;
}
