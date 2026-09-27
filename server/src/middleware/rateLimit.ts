import rateLimit from "express-rate-limit";

// =====================================================
// Rate limiters for public-facing write endpoints
// =====================================================
// Applied only to routes that unauthenticated visitors can call, to
// reduce spam/abuse without affecting authenticated admin traffic.

export const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "יותר מדי בקשות, אנא נסה שוב בעוד כמה דקות",
  },
});
