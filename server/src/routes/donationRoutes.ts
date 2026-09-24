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

const router = Router();

// =====================================================
// Public Routes
// =====================================================

// POST /api/donations - Create donation
router.post("/", validateRequest(createDonationSchema), createDonation);

// GET /api/donations/:id - Get single donation
router.get("/:id", getDonation);

// =====================================================
// Admin Routes (should have auth middleware in production)
// =====================================================

// GET /api/donations - Get all donations
router.get("/", getAllDonations);

// PATCH /api/donations/:id - Update donation (payment status, transaction ID)
router.patch("/:id", updateDonation);

// GET /api/donations/stats/overview - Get donation statistics
router.get("/stats/overview", getDonationStats);

export default router;
