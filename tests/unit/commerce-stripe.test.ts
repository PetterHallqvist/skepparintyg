import { describe, expect, it } from "vitest";
import crypto from "node:crypto";
import {
  encodeStripeForm,
  verifyStripeSignature,
  payloadHash,
  StripeError,
} from "@/lib/commerce/stripe";

const SECRET = "whsec_test_deadbeef";

/** Build a valid Stripe-Signature header for a body at a given timestamp. */
function sign(body: string, ts: number, secret = SECRET): string {
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${body}`, "utf8")
    .digest("hex");
  return `t=${ts},v1=${sig}`;
}

describe("encodeStripeForm", () => {
  it("encodes nested objects with bracket keys", () => {
    const out = encodeStripeForm({
      mode: "payment",
      line_items: [
        { quantity: 1, price_data: { currency: "sek", unit_amount: 89500 } },
      ],
    });
    expect(out).toContain("mode=payment");
    expect(out).toContain("line_items%5B0%5D%5Bquantity%5D=1");
    expect(out).toContain(
      "line_items%5B0%5D%5Bprice_data%5D%5Bunit_amount%5D=89500",
    );
  });

  it("drops null and undefined values", () => {
    const out = encodeStripeForm({ a: "x", b: null, c: undefined });
    expect(out).toBe("a=x");
  });

  it("url-encodes special characters", () => {
    const out = encodeStripeForm({ name: "Förarintyg & Co" });
    expect(out).toBe("name=F%C3%B6rarintyg%20%26%20Co");
  });
});

describe("verifyStripeSignature", () => {
  const body = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const now = 1_800_000_000;

  it("accepts a valid signature and returns the parsed event", () => {
    const event = verifyStripeSignature(body, sign(body, now), {
      secret: SECRET,
      nowSeconds: now,
    }) as { id: string };
    expect(event.id).toBe("evt_1");
  });

  it("rejects a tampered body", () => {
    const header = sign(body, now);
    expect(() =>
      verifyStripeSignature(body + " ", header, {
        secret: SECRET,
        nowSeconds: now,
      }),
    ).toThrow(StripeError);
  });

  it("rejects a wrong secret", () => {
    expect(() =>
      verifyStripeSignature(body, sign(body, now, "whsec_wrong"), {
        secret: SECRET,
        nowSeconds: now,
      }),
    ).toThrow(/matchar inte/);
  });

  it("rejects a stale timestamp beyond tolerance", () => {
    const header = sign(body, now - 10_000);
    expect(() =>
      verifyStripeSignature(body, header, {
        secret: SECRET,
        nowSeconds: now,
        toleranceSeconds: 300,
      }),
    ).toThrow(/toleransen/);
  });

  it("throws on a missing signature header", () => {
    expect(() =>
      verifyStripeSignature(body, null, { secret: SECRET, nowSeconds: now }),
    ).toThrow(/saknas/);
  });

  it("throws on a malformed header", () => {
    expect(() =>
      verifyStripeSignature(body, "garbage", { secret: SECRET, nowSeconds: now }),
    ).toThrow(/Ogiltig signaturrubrik/);
  });

  it("accepts when one of several v1 candidates matches (key rotation)", () => {
    const good = crypto
      .createHmac("sha256", SECRET)
      .update(`${now}.${body}`, "utf8")
      .digest("hex");
    const header = `t=${now},v1=${"0".repeat(64)},v1=${good}`;
    const event = verifyStripeSignature(header ? body : body, header, {
      secret: SECRET,
      nowSeconds: now,
    }) as { id: string };
    expect(event.id).toBe("evt_1");
  });

  it("rejects a body that is validly signed but not JSON", () => {
    const notJson = "not json";
    expect(() =>
      verifyStripeSignature(notJson, sign(notJson, now), {
        secret: SECRET,
        nowSeconds: now,
      }),
    ).toThrow(/giltig JSON/);
  });
});

describe("payloadHash", () => {
  it("is a deterministic sha256 hex of the raw body", () => {
    expect(payloadHash("abc")).toBe(payloadHash("abc"));
    expect(payloadHash("abc")).toBe(
      crypto.createHash("sha256").update("abc", "utf8").digest("hex"),
    );
    expect(payloadHash("abc")).not.toBe(payloadHash("abd"));
  });
});
