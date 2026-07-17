/**
 * Money is ALWAYS integer öre (SPEC §52.1) — never a float, never kronor in a
 * number. Prices are stored VAT-inclusive with the VAT rate in basis points
 * (2500 = 25 %). The ex-VAT / VAT split is derived here with a single, tested
 * rounding policy so the parts ALWAYS sum back to the inclusive total — no öre
 * ever leaks onto the books. The exact VAT rate is an accountant decision
 * (§69.4); this module only does the arithmetic and stores the rate as data.
 */

const ORE_PER_KRONA = 100;
const BPS_DENOMINATOR = 10_000;
const NBSP = " ";

/** Guard: every amount that crosses this module must be integer öre. */
export function assertOre(ore: number): void {
  if (!Number.isInteger(ore)) {
    throw new Error(`Belopp måste vara heltal öre, fick ${ore}`);
  }
}

/** Symmetric rounding so refund/credit (negative) amounts round consistently. */
function roundHalfAwayFromZero(n: number): number {
  return Math.sign(n) * Math.round(Math.abs(n));
}

export interface VatSplit {
  /** The stored, authoritative inclusive amount. */
  incVatOre: number;
  /** Derived net (ex-VAT). */
  exVatOre: number;
  /** Derived tax. Invariant: exVatOre + vatOre === incVatOre. */
  vatOre: number;
  vatRateBasisPoints: number;
}

/**
 * Split a VAT-inclusive amount into net + tax. Ex-VAT is rounded to the
 * nearest öre and VAT is taken as the remainder, so the two parts reconstruct
 * the inclusive total exactly regardless of the rate.
 */
export function splitVat(
  incVatOre: number,
  vatRateBasisPoints: number,
): VatSplit {
  assertOre(incVatOre);
  if (!Number.isInteger(vatRateBasisPoints) || vatRateBasisPoints < 0) {
    throw new Error(`Ogiltig momssats i baspunkter: ${vatRateBasisPoints}`);
  }
  // incVat = exVat · (10000 + bps) / 10000  ⇒  exVat = incVat · 10000 / (10000 + bps)
  const exVatOre = roundHalfAwayFromZero(
    (incVatOre * BPS_DENOMINATOR) / (BPS_DENOMINATOR + vatRateBasisPoints),
  );
  return {
    incVatOre,
    exVatOre,
    vatOre: incVatOre - exVatOre,
    vatRateBasisPoints,
  };
}

export interface OrderLine {
  unitAmountOreIncVat: number;
  vatRateBasisPoints: number;
  quantity: number;
}

export interface OrderTotals {
  /** Sum of ex-VAT line nets. */
  subtotalOre: number;
  vatOre: number;
  /** Sum of inclusive line totals. Invariant: subtotalOre + vatOre === totalOre. */
  totalOre: number;
}

/**
 * Aggregate order lines into the three integer-öre totals persisted on an
 * order (§52). Each line is split independently so mixed VAT rates stay
 * correct.
 */
export function computeOrderTotals(lines: readonly OrderLine[]): OrderTotals {
  let subtotalOre = 0;
  let vatOre = 0;
  let totalOre = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new Error(`Ogiltigt antal på orderrad: ${line.quantity}`);
    }
    const split = splitVat(
      line.unitAmountOreIncVat * line.quantity,
      line.vatRateBasisPoints,
    );
    subtotalOre += split.exVatOre;
    vatOre += split.vatOre;
    totalOre += split.incVatOre;
  }
  return { subtotalOre, vatOre, totalOre };
}

function groupThousands(digits: string): string {
  // Insert a non-breaking space every three digits from the right (sv-SE).
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/**
 * Format integer öre as Swedish currency: "1 234,56 kr" (NBSP thousands
 * separator, comma decimal). Deterministic — does not depend on runtime
 * locale.
 */
export function formatOre(ore: number): string {
  assertOre(ore);
  const negative = ore < 0;
  const abs = Math.abs(ore);
  const kronor = Math.floor(abs / ORE_PER_KRONA);
  const rest = abs % ORE_PER_KRONA;
  const grouped = groupThousands(String(kronor));
  const decimals = String(rest).padStart(2, "0");
  return `${negative ? "−" : ""}${grouped},${decimals}${NBSP}kr`;
}

/** Format a VAT rate given in basis points as "25 %" / "12,5 %". */
export function formatVatRate(vatRateBasisPoints: number): string {
  const percent = vatRateBasisPoints / 100;
  const text = Number.isInteger(percent)
    ? String(percent)
    : String(percent).replace(".", ",");
  return `${text}${NBSP}%`;
}
