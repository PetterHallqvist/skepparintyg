"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { recordConsentAction } from "@/lib/guardian/actions";

type Purpose = "product_analytics" | "study_reminders";

const PURPOSES: { key: Purpose; title: string; body: string }[] = [
  {
    key: "product_analytics",
    title: "Produktanalys",
    body: "Anonym användningsstatistik för att förbättra tjänsten. Inga svar, e-post eller ljud loggas.",
  },
  {
    key: "study_reminders",
    title: "Studiepåminnelser",
    body: "Vänliga påminnelser om att öva. Skickas aldrig till en minderårig elevs egen adress.",
  },
];

/**
 * Purpose-separated consent (SPEC §43.4, §70.3). Essential processing is always
 * on and cannot be toggled off; analytics and reminders default OFF and each
 * flip writes its own immutable consent-event row.
 */
export function ConsentToggles({
  learnerId,
  initial,
}: {
  learnerId: string;
  initial: Record<Purpose, boolean>;
}) {
  const [state, setState] = useState<Record<Purpose, boolean>>(initial);
  const [pending, start] = useTransition();

  function toggle(key: Purpose, granted: boolean) {
    setState((s) => ({ ...s, [key]: granted }));
    start(async () => {
      const r = await recordConsentAction({
        learnerId,
        consentType: key,
        granted,
      });
      if (!r.ok) setState((s) => ({ ...s, [key]: !granted })); // revert on failure
    });
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      <li className="flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-sm font-medium">Nödvändig behandling</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Krävs för att tjänsten ska fungera. Kan inte stängas av.
          </p>
        </div>
        <Switch checked disabled aria-label="Nödvändig behandling (alltid på)" />
      </li>
      {PURPOSES.map((p) => (
        <li key={p.key} className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-medium">{p.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{p.body}</p>
          </div>
          <Switch
            checked={state[p.key]}
            disabled={pending}
            onCheckedChange={(v) => toggle(p.key, v === true)}
            aria-label={p.title}
          />
        </li>
      ))}
    </ul>
  );
}
