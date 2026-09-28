import { describe, it, expect } from "vitest";
import {
  createDonationSchema,
  updateDonationSchema,
  createContactMessageSchema,
  MAX_DONATION_AMOUNT_ILS,
} from "../src/utils/validation.js";

describe("createDonationSchema", () => {
  const validDonation = {
    amount: 180,
    paymentType: "CREDIT_CARD" as const,
    donorName: "ישראל ישראלי",
    donorEmail: "israel@example.com",
    donorPhone: "0501234567",
  };

  it("accepts a valid donation", () => {
    const result = createDonationSchema.safeParse(validDonation);
    expect(result.success).toBe(true);
  });

  it("rejects a zero amount", () => {
    const result = createDonationSchema.safeParse({ ...validDonation, amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative amount", () => {
    const result = createDonationSchema.safeParse({ ...validDonation, amount: -50 });
    expect(result.success).toBe(false);
  });

  it("rejects an amount above the configured maximum", () => {
    const result = createDonationSchema.safeParse({
      ...validDonation,
      amount: MAX_DONATION_AMOUNT_ILS + 1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts an amount exactly at the configured maximum", () => {
    const result = createDonationSchema.safeParse({
      ...validDonation,
      amount: MAX_DONATION_AMOUNT_ILS,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported payment type", () => {
    const result = createDonationSchema.safeParse({ ...validDonation, paymentType: "PAYPAL" });
    expect(result.success).toBe(false);
  });

  it("requires a donor name (needed for the receipt)", () => {
    const { donorName, ...rest } = validDonation;
    const result = createDonationSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("requires a donor email (needed for the receipt)", () => {
    const { donorEmail, ...rest } = validDonation;
    const result = createDonationSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("does not accept card number, expiry, or CVV fields", () => {
    const result = createDonationSchema.safeParse({
      ...validDonation,
      cardNumber: "4111111111111111",
      cardExpiry: "12/30",
      cvv: "123",
    });
    // Extra fields are simply stripped by zod's default parsing behaviour,
    // but the parsed output must never contain them.
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("cardNumber");
      expect(result.data).not.toHaveProperty("cardExpiry");
      expect(result.data).not.toHaveProperty("cvv");
    }
  });

  it("does not allow the caller to set status directly", () => {
    const result = createDonationSchema.safeParse({ ...validDonation, status: "COMPLETED" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("status");
    }
  });
});

describe("updateDonationSchema", () => {
  it("accepts a valid admin status update", () => {
    expect(updateDonationSchema.safeParse({ status: "COMPLETED" }).success).toBe(true);
  });

  it("rejects invalid status values and unknown fields", () => {
    expect(updateDonationSchema.safeParse({ status: "REFUNDED" }).success).toBe(false);
    expect(updateDonationSchema.safeParse({ status: "COMPLETED", amount: 10 }).success).toBe(false);
  });

  it("rejects malformed receipt URLs", () => {
    expect(updateDonationSchema.safeParse({ status: "COMPLETED", receiptUrl: "not-a-url" }).success).toBe(false);
  });
});

describe("createContactMessageSchema", () => {
  const validMessage = {
    firstName: "דוד",
    lastName: "כהן",
    email: "david@example.com",
    phone: "0501234567",
    message: "אני רוצה לשמוע פרטים נוספים על העמותה, תודה רבה.",
  };

  it("accepts a valid submission", () => {
    const result = createContactMessageSchema.safeParse(validMessage);
    expect(result.success).toBe(true);
  });

  it("rejects a message that is too short", () => {
    const result = createContactMessageSchema.safeParse({ ...validMessage, message: "היי" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = createContactMessageSchema.safeParse({ ...validMessage, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-Israeli-formatted phone number", () => {
    const result = createContactMessageSchema.safeParse({ ...validMessage, phone: "12345" });
    expect(result.success).toBe(false);
  });
});
