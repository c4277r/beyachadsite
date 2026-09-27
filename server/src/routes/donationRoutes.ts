import { Router } from "express";
import {
  createDonation,
  getAllDonations,
  getDonation,
  updateDonation,
  getDonationStats,
} from "../controllers/donationController.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { createDonationSchema } from "../utils/validation.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { publicSubmissionLimiter } from "../middleware/rateLimit.js";

const router = Router();

// =====================================================
// Public Routes
// =====================================================

// POST /api/donations - Create a PENDING donation record.
// Status/transactionId are always server-set to PENDING here; donors can
// never set them directly (see createDonationSchema - it has no status
// field, and createDonation ignores anything but the validated fields).
router.post(
  "/",
  publicSubmissionLimiter,
  validateRequest(createDonationSchema),
  createDonation
);

// =====================================================
// Admin Routes (require a valid staff login)
// =====================================================
// Everything below - including single-donation lookup, which can expose
// donor name/email/phone - requires authentication. Once Kesher webhook
// verification is implemented, that endpoint will use its own signature
// check instead of this staff-login requirement.
router.use(authenticate, requireRole("ADMIN", "EDITOR"));

// GET /api/donations - Get all donations
router.get("/", getAllDonations);

// GET /api/donations/stats/overview - Get donation statistics
// (must be registered before "/:id" so "stats" isn't treated as an id)
router.get("/stats/overview", getDonationStats);

// GET /api/donations/:id - Get single donation
router.get("/:id", getDonation);

// PATCH /api/donations/:id - Update donation (payment status, transaction ID)
router.patch("/:id", updateDonation);

export default router;
