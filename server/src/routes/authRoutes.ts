import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/authController.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { loginSchema } from "../utils/validation.js";

const router = Router();

// Slow down brute-force login attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "יותר מדי ניסיונות התחברות, נסה שוב מאוחר יותר" },
});

// POST /api/auth/login
router.post("/login", loginLimiter, validateRequest(loginSchema), login);

export default router;
