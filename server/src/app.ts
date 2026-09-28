import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

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
app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "Server is running" });
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
