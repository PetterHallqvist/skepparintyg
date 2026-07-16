import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Väjningsregler" };

export default function VajningTrainerPage() {
  return <TrainerPage track="vajning" />;
}
