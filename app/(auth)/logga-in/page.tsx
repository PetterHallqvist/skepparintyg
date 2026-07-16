import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Logga in" };

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <Card className="bezel">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">
            Logga in
          </CardTitle>
          <CardDescription>
            Fortsätt din förberedelse där du slutade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSupabaseConfigured ? (
            <LoginForm />
          ) : (
            <DisclaimerBlock>
              Inloggning aktiveras när Supabase-miljön är konfigurerad. Du kan{" "}
              <Link href="/app/start" className="font-medium underline">
                förhandsvisa elevytan
              </Link>{" "}
              under tiden.
            </DisclaimerBlock>
          )}
        </CardContent>
      </Card>
      <p className="px-1 text-center text-xs text-muted-foreground">
        Nytt konto skapas automatiskt vid första inloggningen. Genom att logga
        in godkänner du våra{" "}
        <Link href="/kopvillkor" className="underline">
          villkor
        </Link>
        .
      </p>
    </div>
  );
}
