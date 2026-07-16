"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    sendMagicLink,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">E-postadress</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="namn@exempel.se"
          aria-describedby="email-status"
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Skickar…" : "Skicka inloggningslänk"}
      </Button>
      <p
        id="email-status"
        role="status"
        aria-live="polite"
        className={
          state.status === "error"
            ? "text-sm text-destructive"
            : "text-sm text-muted-foreground"
        }
      >
        {state.message ??
          "Vi skickar en engångslänk till din e-post — inget lösenord behövs."}
      </p>
    </form>
  );
}
