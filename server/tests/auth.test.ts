import { describe, it, expect, beforeAll } from "vitest";
import type { Request, Response } from "express";

beforeAll(() => {
  process.env.JWT_SECRET = "test-only-secret-do-not-use-in-production";
});

describe("authenticate + signAuthToken", () => {
  it("rejects requests with no Authorization header", async () => {
    const { authenticate } = await import("../src/middleware/auth.js");
    const { ApiError } = await import("../src/middleware/errorHandler.js");

    const req = { headers: {} } as Request;
    let capturedError: unknown;
    const next = (err?: unknown) => {
      capturedError = err;
    };

    authenticate(req, {} as Response, next);

    expect(capturedError).toBeInstanceOf(ApiError);
    expect((capturedError as InstanceType<typeof ApiError>).statusCode).toBe(401);
  });

  it("rejects an invalid/garbage token", async () => {
    const { authenticate } = await import("../src/middleware/auth.js");
    const { ApiError } = await import("../src/middleware/errorHandler.js");

    const req = { headers: { authorization: "Bearer not-a-real-token" } } as Request;
    let capturedError: unknown;
    authenticate(req, {} as Response, (err?: unknown) => {
      capturedError = err;
    });

    expect(capturedError).toBeInstanceOf(ApiError);
    expect((capturedError as InstanceType<typeof ApiError>).statusCode).toBe(401);
  });

  it("accepts a token issued by signAuthToken and attaches req.user", async () => {
    const { authenticate, signAuthToken } = await import("../src/middleware/auth.js");

    const token = signAuthToken({ sub: "user-1", role: "ADMIN" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    let nextCalledWithError: unknown = "not-called";
    authenticate(req, {} as Response, (err?: unknown) => {
      nextCalledWithError = err;
    });

    expect(nextCalledWithError).toBeUndefined();
    expect(req.user).toMatchObject({ sub: "user-1", role: "ADMIN" });
  });
});

describe("requireRole", () => {
  it("rejects when there is no authenticated user", async () => {
    const { requireRole } = await import("../src/middleware/auth.js");
    const { ApiError } = await import("../src/middleware/errorHandler.js");

    const req = {} as Request;
    let capturedError: unknown;
    requireRole("ADMIN")(req, {} as Response, (err?: unknown) => {
      capturedError = err;
    });

    expect(capturedError).toBeInstanceOf(ApiError);
    expect((capturedError as InstanceType<typeof ApiError>).statusCode).toBe(401);
  });

  it("rejects a user whose role is not permitted", async () => {
    const { requireRole } = await import("../src/middleware/auth.js");
    const { ApiError } = await import("../src/middleware/errorHandler.js");

    const req = { user: { sub: "u1", role: "EDITOR" } } as Request;
    let capturedError: unknown;
    requireRole("ADMIN")(req, {} as Response, (err?: unknown) => {
      capturedError = err;
    });

    expect(capturedError).toBeInstanceOf(ApiError);
    expect((capturedError as InstanceType<typeof ApiError>).statusCode).toBe(403);
  });

  it("allows a user whose role is permitted", async () => {
    const { requireRole } = await import("../src/middleware/auth.js");

    const req = { user: { sub: "u1", role: "ADMIN" } } as Request;
    let nextCalledWithError: unknown = "not-called";
    requireRole("ADMIN", "EDITOR")(req, {} as Response, (err?: unknown) => {
      nextCalledWithError = err;
    });

    expect(nextCalledWithError).toBeUndefined();
  });
});
