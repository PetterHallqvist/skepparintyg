import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Elektroniskt sjökort" };

export default function PlotterTrainerPage() {
  return <TrainerPage track="plotter" />;
}
