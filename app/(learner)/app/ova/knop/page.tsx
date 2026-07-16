import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Knopar" };

export default function KnopTrainerPage() {
  return <TrainerPage track="knop" />;
}
