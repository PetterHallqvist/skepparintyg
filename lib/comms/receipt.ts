import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { formatOre, formatVatRate } from "@/lib/commerce/money";
import { WITHDRAWAL_CONFIRMATION } from "@/lib/commerce/legal-copy";
import { BRAND } from "@/lib/brand";
import { sendEmail } from "@/lib/comms/email";
import { logger } from "@/lib/observability/logger";

/**
 * Receipt email (SPEC §52.4). Sent by the webhook after the FIRST successful
 * provisioning (never on idempotent replays, so no double-send). Every figure
 * comes from the immutable order snapshot, so the receipt survives later price
 * edits. Best-effort: a mail failure never fails the webhook.
 */

interface OrderRow {
  id: string;
  total_ore: number;
  subtotal_ore: number;
  vat_ore: number;
  currency: string;
  paid_at: string | null;
  purchaser_user_id: string;
}

interface ItemRow {
  product_name_snapshot: string;
  unit_amount_ore_inc_vat: number;
  vat_rate_basis_points: number;
  access_months_snapshot: number;
  quantity: number;
}

function receiptText(order: OrderRow, items: ItemRow[]): string {
  const lines = items.map(
    (i) =>
      `- ${i.product_name_snapshot} (${i.access_months_snapshot} mån) — ${formatOre(
        i.unit_amount_ore_inc_vat * i.quantity,
      )}`,
  );
  return [
    `Tack för ditt köp hos ${BRAND.name}!`,
    "",
    ...lines,
    "",
    `Delsumma (exkl. moms): ${formatOre(order.subtotal_ore)}`,
    `Moms: ${formatOre(order.vat_ore)}`,
    `Totalt: ${formatOre(order.total_ore)}`,
    "",
    WITHDRAWAL_CONFIRMATION,
    "",
    `Ordernummer: ${order.id}`,
    BRAND.independenceDisclaimer,
  ].join("\n");
}

function receiptHtml(order: OrderRow, items: ItemRow[]): string {
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:4px 0">${i.product_name_snapshot} (${i.access_months_snapshot} mån)</td><td style="padding:4px 0;text-align:right">${formatOre(
          i.unit_amount_ore_inc_vat * i.quantity,
        )}</td></tr>`,
    )
    .join("");
  const vatRate = items[0] ? formatVatRate(items[0].vat_rate_basis_points) : "";
  return `<!doctype html><html lang="sv"><body style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
  <h1 style="font-size:20px">Tack för ditt köp hos ${BRAND.name}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
    <tr><td style="padding-top:8px">Delsumma (exkl. moms)</td><td style="padding-top:8px;text-align:right">${formatOre(order.subtotal_ore)}</td></tr>
    <tr><td>Moms (${vatRate})</td><td style="text-align:right">${formatOre(order.vat_ore)}</td></tr>
    <tr><td style="font-weight:600;border-top:1px solid #e2e8f0;padding-top:6px">Totalt</td><td style="font-weight:600;border-top:1px solid #e2e8f0;padding-top:6px;text-align:right">${formatOre(order.total_ore)}</td></tr>
  </table>
  <p style="font-size:13px;color:#475569">${WITHDRAWAL_CONFIRMATION}</p>
  <p style="font-size:12px;color:#64748b">Ordernummer: ${order.id}<br/>${BRAND.independenceDisclaimer}</p>
  </body></html>`;
}

/** Read an order via the service client and email its receipt. Best-effort. */
export async function sendReceiptForOrder(orderId: string): Promise<void> {
  try {
    const svc = createSupabaseServiceClient();
    const { data: order } = await svc
      .from("orders")
      .select(
        "id,total_ore,subtotal_ore,vat_ore,currency,paid_at,purchaser_user_id",
      )
      .eq("id", orderId)
      .single();
    if (!order) return;

    const { data: items } = await svc
      .from("order_items")
      .select(
        "product_name_snapshot,unit_amount_ore_inc_vat,vat_rate_basis_points,access_months_snapshot,quantity",
      )
      .eq("order_id", orderId);

    const { data: userData } = await svc.auth.admin.getUserById(
      (order as OrderRow).purchaser_user_id,
    );
    const to = userData?.user?.email;
    if (!to) return;

    await sendEmail({
      to,
      subject: `Kvitto — ${BRAND.name}`,
      html: receiptHtml(order as OrderRow, (items ?? []) as ItemRow[]),
      text: receiptText(order as OrderRow, (items ?? []) as ItemRow[]),
      messageType: "receipt",
      userId: (order as OrderRow).purchaser_user_id,
      metadata: { orderId },
    });
  } catch (err) {
    logger.error("receipt.send_error", {
      orderId,
      message: err instanceof Error ? err.message : "okänt fel",
    });
  }
}
