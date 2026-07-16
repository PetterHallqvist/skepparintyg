"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusChip } from "@/components/design-system/status-chip";
import {
  getTrackChallenge,
  getTrackHint,
  submitTrackAttempt,
  type AttemptFeedback,
} from "@/lib/learning/actions";
import type { DemoChallenge } from "@/lib/learning/demo";
import {
  ItemRenderer,
  StimulusView,
  type ItemResponse,
} from "./item-renderers";

type Confidence = "guessed" | "fairly_sure" | "very_sure";
type Phase = "loading" | "answering" | "confidence" | "feedback" | "done";

/**
 * Study-session player (SPEC §12.3–12.4, §13.3–13.5). Server grades every
 * response; feedback uses progressive disclosure; confidence is collected
 * before the verdict (§13.4); hints are tiered and recorded (§13.5).
 */
export function SessionPlayer({
  initialChallenge,
  track = "demo",
}: {
  initialChallenge: DemoChallenge;
  track?: string;
}) {
  const total = initialChallenge.total;
  const [phase, setPhase] = useState<Phase>("answering");
  const [challenge, setChallenge] = useState<DemoChallenge | null>(
    initialChallenge,
  );
  const [response, setResponse] = useState<ItemResponse | null>(null);
  const [feedback, setFeedback] = useState<AttemptFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingResponse, setPendingResponse] = useState<ItemResponse | null>(
    null,
  );
  const startedAt = useRef<number>(0);

  // Event-handler context only (never called during render).
  const load = async (index: number) => {
    setPhase("loading");
    try {
      const c = await getTrackChallenge(track, index);
      setChallenge(c);
      setResponse(null);
      setPendingResponse(null);
      setFeedback(null);
      setHint(null);
      setHintLevel(0);
      startedAt.current = Date.now();
      setPhase("answering");
    } catch {
      setPhase("done");
    }
  };

  const submitWithConfidence = async (confidence: Confidence) => {
    if (!challenge || !pendingResponse) return;
    setPhase("loading");
    // eslint-disable-next-line react-hooks/purity -- event-handler context: measures active latency
    const activeLatencyMs = Date.now() - startedAt.current;
    const fb = await submitTrackAttempt({
      track,
      index: challenge.index,
      response: pendingResponse,
      confidence,
      hintLevel,
      activeLatencyMs,
    });
    if (fb.correct) setCorrectCount((n) => n + 1);
    setFeedback(fb);
    setPhase("feedback");
  };

  const requestHint = async () => {
    if (!challenge) return;
    const next = Math.min(hintLevel + 1, 3);
    const h = await getTrackHint(track, challenge.index, next);
    setHint(h.text);
    setHintLevel(h.tier);
  };

  if (phase === "done") {
    return (
      <Card className="bezel mx-auto max-w-xl">
        <CardContent className="space-y-4 py-8 text-center">
          <p className="text-label text-muted-foreground">Passet klart</p>
          <p className="font-readout text-4xl">
            {correctCount}
            <span className="text-lg text-muted-foreground">
              {" "}
              rätt av {total}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            I den riktiga kursen uppdaterar varje svar din repetitionsplan, dina
            färdighetssteg och felboken.
          </p>
          <div className="flex justify-center gap-3">
            <Button render={<Link href="/app/start" />}>Till start</Button>
            <Button variant="outline" onClick={() => void load(0)}>
              Kör igen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <p
        role="status"
        className="py-16 text-center text-sm text-muted-foreground"
      >
        Laddar …
      </p>
    );
  }

  const progress = (challenge.index / challenge.total) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Progress
          value={progress}
          aria-label={`Uppgift ${challenge.index + 1} av ${challenge.total}`}
          className="h-1.5"
        />
        <span className="font-readout shrink-0 text-xs text-muted-foreground">
          {challenge.index + 1}/{challenge.total}
        </span>
      </div>

      <Card className="bezel">
        <CardContent className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-label text-muted-foreground">
              {challenge.objectiveTitle}
            </p>
            <StatusChip tone="info">Övning</StatusChip>
          </div>
          <p className="text-base font-medium leading-relaxed">
            {challenge.stemSv}
          </p>

          <StimulusView interaction={challenge.interaction} />

          <ItemRenderer
            kind={challenge.kind}
            interaction={challenge.interaction}
            disabled={phase !== "answering"}
            onChange={setResponse}
          />

          {hint ? (
            <p
              role="status"
              className="flex items-start gap-2 border-l-2 border-warning pl-3 text-sm text-muted-foreground"
            >
              <Lightbulb
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-warning"
              />
              {hint}
            </p>
          ) : null}

          {phase === "answering" ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void requestHint()}
                disabled={hintLevel >= 3}
              >
                <Lightbulb aria-hidden="true" />
                Ledtråd{hintLevel > 0 ? ` (nivå ${hintLevel})` : ""}
              </Button>
              <Button
                disabled={response === null}
                onClick={() => {
                  setPendingResponse(response);
                  setPhase("confidence");
                }}
              >
                Svara
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          ) : null}

          {phase === "confidence" ? (
            <div
              role="group"
              aria-label="Hur säker var du?"
              className="space-y-2 border-t border-border pt-4"
            >
              <p className="text-sm font-medium">Hur säker var du?</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["guessed", "Gissade"],
                    ["fairly_sure", "Ganska säker"],
                    ["very_sure", "Mycket säker"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => void submitWithConfidence(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {phase === "feedback" && feedback ? (
            <FeedbackPanel
              feedback={feedback}
              onNext={() => void load(challenge.index + 1)}
              isLast={challenge.index + 1 >= challenge.total}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

/** §13.3 progressive disclosure: diagnosis → method → explanation → source. */
function FeedbackPanel({
  feedback,
  onNext,
  isLast,
}: {
  feedback: AttemptFeedback;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div
      role="status"
      className={
        feedback.correct
          ? "space-y-3 rounded-md border border-success/40 bg-success/10 p-4"
          : "space-y-3 rounded-md border border-destructive/40 bg-destructive/10 p-4"
      }
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <StatusChip tone={feedback.correct ? "success" : "danger"}>
          {feedback.correct ? "Rätt" : "Fel"}
        </StatusChip>
        {feedback.oneLiner}
      </p>

      {feedback.misconception ? (
        <p className="text-sm">
          <span className="text-label mr-2">Vanlig missuppfattning</span>
          {feedback.misconception}
        </p>
      ) : null}

      {!feedback.correct && feedback.method ? (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">
            Visa rätt metod steg för steg
          </summary>
          <p className="mt-2 whitespace-pre-line text-muted-foreground">
            {feedback.method}
          </p>
        </details>
      ) : null}

      <details className="text-sm" open={!feedback.correct}>
        <summary className="cursor-pointer font-medium">Förklaring</summary>
        <p className="mt-2 text-muted-foreground">{feedback.explanation}</p>
      </details>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen aria-hidden="true" className="size-3.5" />
        {feedback.sourceRef}
      </p>

      <div className="flex justify-end">
        <Button onClick={onNext}>
          {isLast ? "Avsluta passet" : "Nästa uppgift"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
