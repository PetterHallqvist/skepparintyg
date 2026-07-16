/**
 * Staff-facing item preview: renders stem, interaction, answer key and
 * explanation. This component may show answers — it is used ONLY inside the
 * role-gated admin studio (item_versions RLS is staff-only anyway).
 */
type Option = { key: string; text_sv: string };

export function ItemPreview({
  kind,
  interaction,
  answerKey,
  explanation,
}: {
  kind: string;
  interaction: Record<string, unknown>;
  answerKey: Record<string, unknown>;
  explanation: string;
}) {
  return (
    <div className="space-y-3 text-sm">
      <InteractionPreview
        kind={kind}
        interaction={interaction}
        answerKey={answerKey}
      />
      <p className="border-l-2 border-sea-300/50 pl-3 text-muted-foreground">
        <span className="text-label mr-2 text-foreground/80">Förklaring</span>
        {explanation}
      </p>
    </div>
  );
}

function InteractionPreview({
  kind,
  interaction,
  answerKey,
}: {
  kind: string;
  interaction: Record<string, unknown>;
  answerKey: Record<string, unknown>;
}) {
  switch (kind) {
    case "single_choice":
    case "multiple_select": {
      const options = (interaction.options ?? []) as Option[];
      const correct = new Set(
        kind === "single_choice"
          ? [answerKey.correct as string]
          : (answerKey.correct as string[]),
      );
      return (
        <ul className="space-y-1">
          {options.map((o) => (
            <li
              key={o.key}
              className={
                correct.has(o.key)
                  ? "flex items-baseline gap-2 font-medium text-success"
                  : "flex items-baseline gap-2 text-foreground/80"
              }
            >
              <span className="font-readout text-xs uppercase">{o.key}</span>
              {o.text_sv}
              {correct.has(o.key) ? (
                <span className="text-label">rätt</span>
              ) : null}
            </li>
          ))}
        </ul>
      );
    }
    case "numeric":
      return (
        <p className="font-readout">
          Svar: {String(answerKey.value)}{" "}
          <span className="text-muted-foreground">
            {String(interaction.unit ?? "")} (tolerans ±
            {String(answerKey.tolerance)})
          </span>
        </p>
      );
    case "ordering": {
      const items = (interaction.items ?? []) as Option[];
      const order = (answerKey.order ?? []) as string[];
      const byKey = new Map(items.map((i) => [i.key, i.text_sv]));
      return (
        <ol className="list-decimal space-y-0.5 pl-5">
          {order.map((k) => (
            <li key={k}>{byKey.get(k) ?? k}</li>
          ))}
        </ol>
      );
    }
    case "matching": {
      const left = (interaction.left ?? []) as Option[];
      const right = (interaction.right ?? []) as Option[];
      const pairs = (answerKey.pairs ?? {}) as Record<string, string>;
      const rightByKey = new Map(right.map((r) => [r.key, r.text_sv]));
      return (
        <ul className="space-y-0.5">
          {left.map((l) => (
            <li key={l.key}>
              {l.text_sv}{" "}
              <span className="text-muted-foreground">
                → {rightByKey.get(pairs[l.key]) ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    default:
      return (
        <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify({ interaction, answerKey }, null, 2)}
        </pre>
      );
  }
}
