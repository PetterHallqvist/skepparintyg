import { describe, expect, it } from "vitest";
import {
  hashPin,
  verifyPinAgainstHash,
  PinError,
} from "@/lib/guardian/access";

describe("minor-access PIN hashing (§43.5)", () => {
  it("hashes to the scrypt$salt$hash format", () => {
    const stored = hashPin("1234");
    const parts = stored.split("$");
    expect(parts[0]).toBe("scrypt");
    expect(parts[1]).toMatch(/^[0-9a-f]{32}$/); // 16-byte salt hex
    expect(parts[2]).toMatch(/^[0-9a-f]{128}$/); // 64-byte hash hex
  });

  it("verifies a correct PIN and rejects a wrong one", () => {
    const stored = hashPin("482913");
    expect(verifyPinAgainstHash("482913", stored)).toBe(true);
    expect(verifyPinAgainstHash("482914", stored)).toBe(false);
  });

  it("uses a fresh salt each call but both verify", () => {
    const a = hashPin("1234");
    const b = hashPin("1234");
    expect(a).not.toBe(b);
    expect(verifyPinAgainstHash("1234", a)).toBe(true);
    expect(verifyPinAgainstHash("1234", b)).toBe(true);
  });

  it("rejects PINs outside 4–8 digits", () => {
    expect(() => hashPin("123")).toThrow(PinError);
    expect(() => hashPin("123456789")).toThrow(PinError);
    expect(() => hashPin("abcd")).toThrow(PinError);
  });

  it("returns false for a malformed stored hash rather than throwing", () => {
    expect(verifyPinAgainstHash("1234", "garbage")).toBe(false);
    expect(verifyPinAgainstHash("1234", "scrypt$aa")).toBe(false);
    expect(verifyPinAgainstHash("1234", "bcrypt$aa$bb")).toBe(false);
  });
});
