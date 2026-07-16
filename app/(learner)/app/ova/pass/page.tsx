import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";

export const metadata: Metadata = { title: "Dagens pass" };

export default function DagensPassPage() {
  return <TrainerPage track="demo" />;
}
