"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ResponseWidgetProps } from "./types";

/**
 * Phase 2 response widgets (SPEC §19.1 subset): single_choice, multiple_select,
 * numeric, ordering, matching. Controlled — the player owns the response value
 * and submits it to server grading. 44px targets, keyboard complete, no
 * colour-only signals.
 */

export type Option = { key: string; text_sv: string };

export function SingleChoice({
  interaction,
  disabled,
  onChange,
}: ResponseWidgetProps) {
  const options = (interaction.options as Option[]) ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div role="radiogroup" aria-label="Svarsalternativ" className="grid gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={selected === o.key}
          disabled={disabled}
          onClick={() => {
            setSelected(o.key);
            onChange({ selected: o.key });
          }}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors",
            selected === o.key
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-card hover:border-muted-foreground/40",
            disabled && "opacity-70",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border",
              selected === o.key
                ? "border-primary"
                : "border-muted-foreground/50",
            )}
          >
            {selected === o.key ? (
              <span className="size-2 rounded-full bg-primary" />
            ) : null}
          </span>
          {o.text_sv}
        </button>
      ))}
    </div>
  );
}

export function MultipleSelect({
  interaction,
  disabled,
  onChange,
}: ResponseWidgetProps) {
  const options = (interaction.options as Option[]) ?? [];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (key: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(key);
    else next.delete(key);
    setSelected(next);
    onChange({ selected: [...next].sort() });
  };
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <Label
          key={o.key}
          className={cn(
            "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-normal transition-colors hover:border-muted-foreground/40",
            selected.has(o.key) && "border-primary bg-accent",
            disabled && "pointer-events-none opacity-70",
          )}
        >
          <Checkbox
            checked={selected.has(o.key)}
            onCheckedChange={(v) => toggle(o.key, v === true)}
            disabled={disabled}
          />
          {o.text_sv}
        </Label>
      ))}
    </div>
  );
}

export function Numeric({
  interaction,
  disabled,
  onChange,
}: ResponseWidgetProps) {
  const unit = (interaction.unit as string) ?? "";
  const [raw, setRaw] = useState("");
  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="numeric-answer" className="sr-only">
        Ditt svar
      </Label>
      <Input
        id="numeric-answer"
        inputMode="decimal"
        autoComplete="off"
        value={raw}
        disabled={disabled}
        placeholder="Ditt svar"
        className="font-readout max-w-40 text-lg"
        onChange={(e) => {
          const v = e.target.value;
          setRaw(v);
          const parsed = Number(v.replace(",", "."));
          onChange(
            v.trim() !== "" && Number.isFinite(parsed)
              ? { value: parsed }
              : null,
          );
        }}
      />
      {unit ? (
        <span className="text-sm text-muted-foreground">{unit}</span>
      ) : null}
    </div>
  );
}

export function Ordering({
  interaction,
  disabled,
  onChange,
}: ResponseWidgetProps) {
  const items = (interaction.items as Option[]) ?? [];
  const [order, setOrder] = useState<Option[]>(items);
  const move = (index: number, delta: -1 | 1) => {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    onChange({ order: next.map((i) => i.key) });
  };
  return (
    <ol className="grid gap-2" aria-label="Ordna stegen">
      {order.map((item, i) => (
        <li
          key={item.key}
          className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          <span className="font-readout w-5 text-xs text-muted-foreground">
            {i + 1}
          </span>
          <span className="flex-1">{item.text_sv}</span>
          <span className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={disabled || i === 0}
              aria-label={`Flytta upp: ${item.text_sv}`}
              onClick={() => move(i, -1)}
            >
              <ArrowUp aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={disabled || i === order.length - 1}
              aria-label={`Flytta ned: ${item.text_sv}`}
              onClick={() => move(i, 1)}
            >
              <ArrowDown aria-hidden="true" />
            </Button>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Matching({
  interaction,
  disabled,
  onChange,
}: ResponseWidgetProps) {
  const left = (interaction.left as Option[]) ?? [];
  const right = (interaction.right as Option[]) ?? [];
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const setPair = (l: string, r: string) => {
    const next = { ...pairs, [l]: r };
    setPairs(next);
    onChange(Object.keys(next).length === left.length ? { pairs: next } : null);
  };
  return (
    <div className="grid gap-3">
      {left.map((l) => (
        <div
          key={l.key}
          className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]"
        >
          <span className="rounded-md border border-border bg-card px-3 py-2 text-sm">
            {l.text_sv}
          </span>
          <span
            aria-hidden="true"
            className="hidden text-muted-foreground sm:block"
          >
            →
          </span>
          <div>
            <Label htmlFor={`match-${l.key}`} className="sr-only">
              Matcha {l.text_sv}
            </Label>
            <select
              id={`match-${l.key}`}
              disabled={disabled}
              value={pairs[l.key] ?? ""}
              onChange={(e) => setPair(l.key, e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="" disabled>
                Välj …
              </option>
              {right.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.text_sv}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
