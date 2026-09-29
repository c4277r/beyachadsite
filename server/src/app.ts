import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./lib/prisma.js";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

const app = express();

// =====================================================
// CORS - restrict to known site origins only
// =====================================================
// ALLOWED_ORIGINS is a comma-separated list, e.g.
// "https://baitbeyached.org.il,https://www.baitbeyached.org.il"
// Falls back to CLIENT_URL (single origin) for simple setups, and to the
// local Vite dev server so local development keeps working out of the box.
const configuredOrigins = process.env.ALLOWED_ORIGINS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
if (process.env.NODE_ENV === "production") {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 64) {
    throw new Error("Production requires a randomly generated JWT_SECRET of at least 64 characters");
  }
  if (!configuredOrigins?.length) {
    throw new Error("Production requires ALLOWED_ORIGINS to explicitly list the official HTTPS site origin(s)");
  }
  for (const origin of configuredOrigins) {
    let parsedOrigin: URL;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error(`Invalid production CORS origin: ${origin}`);
    }
    if (parsedOrigin.protocol !== "https:" || parsedOrigin.origin !== origin) {
      throw new Error(`Production CORS origins must be exact HTTPS origins: ${origin}`);
    }
  }
}
const allowedOrigins =
  configuredOrigins?.length
    ? configuredOrigins
    : [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header, e.g. curl/health checks).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Origin not allowed by CORS"));
    },
  })
);

// Limit JSON body size to reduce abuse via oversized payloads.
app.use(express.json({ limit: "20kb" }));

// Health Check
app.get("/health", async (_req, res) => {
  try {
    const result = await prisma.$runCommandRaw({ ping: 1 }) as { ok?: number };
    if (result.ok !== 1) {
      return res.status(503).json({ ok: false, message: "Database unavailable" });
    }

    return res.json({ ok: true, message: "Server and database are ready" });
  } catch {
    return res.status(503).json({ ok: false, message: "Database unavailable" });
  }
});

// =====================================================
// API Routes
// =====================================================

// Admin authentication
app.use("/api/auth", authRoutes);

// Contact Messages (Public submissions + Admin management)
app.use("/api/contact", contactRoutes);

// Donations (Public submissions + Admin management)
app.use("/api/donations", donationRoutes);

// =====================================================
// Error Handler (Must be last)
// =====================================================
app.use(errorHandler);

export default app;
