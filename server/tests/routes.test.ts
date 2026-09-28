import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

// Mock the Prisma client so these tests never require a real MongoDB
// connection. Only the methods actually exercised below are provided.
vi.mock("../src/lib/prisma.js", () => ({
  prisma: {
    donation: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({
        id: "donation-1",
        amount: data.amount,
        status: "PENDING",
        createdAt: new Date(),
      })),
      findMany: vi.fn(async () => []),
      findUnique: vi.fn(async () => null),
      update: vi.fn(),
    },
    contactMessage: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({
        id: "message-1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findMany: vi.fn(async () => []),
      findUnique: vi.fn(async () => null),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(async () => null),
    },
  },
}));

beforeAll(() => {
  process.env.JWT_SECRET = "test-only-secret-do-not-use-in-production";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.ALLOWED_ORIGINS = "";
});

describe("Public donation submissions", () => {
  it("rejects an invalid amount before ever touching the database", async () => {
    const { default: app } = await import("../src/app.js");
    const { prisma } = await import("../src/lib/prisma.js");

    const res = await request(app)
      .post("/api/donations")
      .send({
        amount: -10,
        paymentType: "CREDIT_CARD",
        donorName: "Test Donor",
        donorEmail: "donor@example.com",
      });

    expect(res.status).toBe(400);
    expect(prisma.donation.create).not.toHaveBeenCalled();
  });

  it("creates a PENDING donation and ignores any client-supplied status", async () => {
    const { default: app } = await import("../src/app.js");
    const { prisma } = await import("../src/lib/prisma.js");

    const res = await request(app)
      .post("/api/donations")
      .send({
        amount: 180,
        paymentType: "CREDIT_CARD",
        donorName: "Test Donor",
        donorEmail: "donor@example.com",
        // A malicious/careless client might try to send these - they must
        // never reach prisma.donation.create's data payload.
        status: "COMPLETED",
        transactionId: "fake-transaction-id",
      });

    expect(res.status).toBe(201);
    const createCall = (prisma.donation.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.data.status).toBe("PENDING");
    expect(createCall.data).not.toHaveProperty("transactionId");
  });
});

describe("Public contact submissions", () => {
  it("rejects a message that is too short", async () => {
    const { default: app } = await import("../src/app.js");

    const res = await request(app).post("/api/contact").send({
      firstName: "דוד",
      lastName: "כהן",
      email: "david@example.com",
      phone: "0501234567",
      message: "קצר",
    });

    expect(res.status).toBe(400);
  });

  it("accepts a valid contact submission", async () => {
    const { default: app } = await import("../src/app.js");

    const res = await request(app).post("/api/contact").send({
      firstName: "דוד",
      lastName: "כהן",
      email: "david@example.com",
      phone: "0501234567",
      message: "אני רוצה לשמוע פרטים נוספים על העמותה, תודה רבה מראש.",
    });

    expect(res.status).toBe(201);
  });
});

describe("CORS configuration", () => {
  it("falls back to CLIENT_URL when ALLOWED_ORIGINS is blank", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app).get("/health").set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});

describe("Unauthorized admin access", () => {
  it("blocks listing donations without a token", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app).get("/api/donations");
    expect(res.status).toBe(401);
  });

  it("blocks looking up a single donation without a token (would otherwise leak donor info)", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app).get("/api/donations/some-id");
    expect(res.status).toBe(401);
  });

  it("blocks an attempted public status change on a donation", async () => {
    const { default: app } = await import("../src/app.js");
    const { prisma } = await import("../src/lib/prisma.js");

    const res = await request(app)
      .patch("/api/donations/some-id")
      .send({ status: "COMPLETED" });

    expect(res.status).toBe(401);
    expect(prisma.donation.update).not.toHaveBeenCalled();
  });

  it("does not allow editors to update donation payment status", async () => {
    const { default: app } = await import("../src/app.js");
    const { signAuthToken } = await import("../src/middleware/auth.js");
    const { prisma } = await import("../src/lib/prisma.js");
    const token = signAuthToken({ sub: "editor-1", role: "EDITOR" });

    const res = await request(app)
      .patch("/api/donations/donation-1")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "COMPLETED" });

    expect(res.status).toBe(403);
    expect(prisma.donation.update).not.toHaveBeenCalled();
  });

  it("blocks listing contact messages without a token", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app).get("/api/contact");
    expect(res.status).toBe(401);
  });

  it("blocks deleting a contact message without a token", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app).delete("/api/contact/some-id");
    expect(res.status).toBe(401);
  });

  it("blocks admin routes with a garbage token", async () => {
    const { default: app } = await import("../src/app.js");
    const res = await request(app)
      .get("/api/donations")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });
});
