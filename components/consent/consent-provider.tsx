"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  subscribeConsent,
  getConsentSnapshot,
  getConsentServerSnapshot,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics/consent";
import { buildEnvelope, type AnalyticsEvent } from "@/lib/analytics/events";
import { recordAnalyticsConsent } from "@/lib/analytics/actions";
import { ConsentBanner } from "@/components/consent/consent-banner";

interface ConsentContextValue {
  consent: ConsentState | null;
  decide: (analytics: boolean) => void;
  track: (event: AnalyticsEvent) => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  decide: () => {},
  track: () => {},
});

export function useAnalytics() {
  return useContext(ConsentContext);
}

/**
 * Consent + analytics runtime (SPEC §81, §70.3). Analytics is OFF until the
 * visitor actively grants it AND a PostHog key is present — so it no-ops
 * entirely in dev. Events go to the EU endpoint via fetch (no third-party SDK,
 * no autocapture, no session recording). Only allow-listed enum/id props are
 * sent (buildEnvelope). Consent is read via useSyncExternalStore — server
 * snapshot is always "undecided", so there is no setState-in-effect and no
 * hydration mismatch.
 */
export function ConsentProvider({
  posthogKey,
  posthogHost,
  children,
}: {
  posthogKey?: string;
  posthogHost: string;
  children: React.ReactNode;
}) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const distinctId = useRef<string>("");

  useEffect(() => {
    // A non-PII, per-browser id — only ever sent alongside consented events.
    if (!distinctId.current) {
      distinctId.current =
        globalThis.crypto?.randomUUID?.() ??
        `anon-${Math.floor(performance.now())}`;
    }
  }, []);

  const decide = useCallback((analytics: boolean) => {
    writeConsent({ analytics, decidedAt: new Date().toISOString() });
    void recordAnalyticsConsent(analytics);
  }, []);

  const track = useCallback(
    (event: AnalyticsEvent) => {
      if (!consent?.analytics || !posthogKey) return; // fail-closed
      const envelope = buildEnvelope(event);
      void fetch(`${posthogHost.replace(/\/$/, "")}/i/v0/e/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          api_key: posthogKey,
          event: envelope.event,
          distinct_id: distinctId.current || "anon",
          properties: { ...envelope.properties, $lib: "sjoklart-web" },
        }),
      }).catch(() => {});
    },
    [consent, posthogKey, posthogHost],
  );

  return (
    <ConsentContext.Provider value={{ consent, decide, track }}>
      {children}
      {consent === null && <ConsentBanner onDecide={decide} />}
    </ConsentContext.Provider>
  );
}
