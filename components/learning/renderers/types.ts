/** Shared contract for every response widget in the session player. */

export type ItemResponse =
  | { selected: string }
  | { selected: string[] }
  | { value: number }
  | { order: string[] }
  | { pairs: Record<string, string> }
  | { answers: Record<string, string> }
  | { taps: number[] }
  | { lat: string; lon: string };

export type ResponseWidgetProps = {
  interaction: Record<string, unknown>;
  disabled: boolean;
  onChange: (response: ItemResponse | null) => void;
};
