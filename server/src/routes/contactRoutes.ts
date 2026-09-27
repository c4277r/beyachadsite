import { Router } from "express";
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { createContactMessageSchema } from "../utils/validation.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { publicSubmissionLimiter } from "../middleware/rateLimit.js";

const router = Router();

// =====================================================
// Public Routes
// =====================================================

// POST /api/contact - Submit contact form
router.post(
  "/",
  publicSubmissionLimiter,
  validateRequest(createContactMessageSchema),
  createContactMessage
);

// =====================================================
// Admin Routes (require a valid staff login)
// =====================================================
router.use(authenticate, requireRole("ADMIN", "EDITOR"));

// GET /api/contact - Get all contact messages
router.get("/", getAllContactMessages);

// GET /api/contact/:id - Get single contact message
router.get("/:id", getContactMessage);

// PATCH /api/contact/:id - Update contact message status
router.patch("/:id", updateContactMessage);

// DELETE /api/contact/:id - Delete contact message
router.delete("/:id", deleteContactMessage);

export default router;
