import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

// =====================================================
// API Routes
// =====================================================

// Contact Messages (Public submissions + Admin management)
app.use("/api/contact", contactRoutes);

// Donations (Public submissions + Admin management)
app.use("/api/donations", donationRoutes);

// =====================================================
// Error Handler (Must be last)
// =====================================================
app.use(errorHandler);

export default app;
