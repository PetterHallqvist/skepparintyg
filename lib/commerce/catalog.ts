import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Product catalog with the demo-shell fallback (same seam as everything else:
 * `isSupabaseConfigured` decides). The demo values mirror supabase/seed.sql so
 * the /priser and checkout surfaces render identically before a database
 * exists. Real prices live in product_prices and are an operator decision
 * (SPEC §9.4); 25 % VAT is the §69.4 working assumption (accountant gate).
 */

export interface CatalogProduct {
  id: string;
  nameSv: string;
  descriptionSv: string;
  certificationId: string | null;
  accessMonths: number;
  seatCount: number;
  priceOreIncVat: number;
  vatRateBasisPoints: number;
  currency: string;
}

export const DEMO_CATALOG: CatalogProduct[] = [
  {
    id: "forarintyg-digital",
    nameSv: "Förarintyg Digital",
    descriptionSv:
      "Full tillgång till kurs, övningar, sjökortslabb och kortlekar för Förarintyget i 12 månader.",
    certificationId: "forarintyg",
    accessMonths: 12,
    seatCount: 1,
    priceOreIncVat: 89_500,
    vatRateBasisPoints: 2500,
    currency: "SEK",
  },
];

type ProductRow = {
  id: string;
  name_sv: string;
  description_sv: string;
  certification_id: string | null;
  access_months: number;
  seat_count: number;
  product_prices: {
    amount_ore_inc_vat: number;
    vat_rate_basis_points: number;
    currency: string;
    active_from: string;
    active_to: string | null;
  }[];
};

/** Active products with their currently valid price. Public read (RLS). */
export async function getCatalog(): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured) return DEMO_CATALOG;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name_sv, description_sv, certification_id, access_months, seat_count, product_prices (amount_ore_inc_vat, vat_rate_basis_points, currency, active_from, active_to)",
    )
    .eq("status", "active");

  const rows = (data ?? []) as ProductRow[];
  const catalog: CatalogProduct[] = [];
  for (const row of rows) {
    // RLS already filters to currently valid prices; latest active_from wins.
    const price = [...row.product_prices].sort((a, b) =>
      b.active_from.localeCompare(a.active_from),
    )[0];
    if (!price) continue;
    catalog.push({
      id: row.id,
      nameSv: row.name_sv,
      descriptionSv: row.description_sv,
      certificationId: row.certification_id,
      accessMonths: row.access_months,
      seatCount: row.seat_count,
      priceOreIncVat: price.amount_ore_inc_vat,
      vatRateBasisPoints: price.vat_rate_basis_points,
      currency: price.currency,
    });
  }
  return catalog.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getCatalogProduct(
  id: string,
): Promise<CatalogProduct | undefined> {
  const catalog = await getCatalog();
  return catalog.find((p) => p.id === id);
}
