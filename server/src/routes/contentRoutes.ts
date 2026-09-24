import { Router } from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  createFaq,
  getFaqs,
  getAllFaqsAdmin,
  updateFaq,
  deleteFaq,
} from "../controllers/contentController.js";

const router = Router();

// =====================================================
// TESTIMONIALS - Public Routes
// =====================================================

// GET /api/content/testimonials - Get active testimonials for homepage
router.get("/testimonials", getTestimonials);

// =====================================================
// FAQ - Public Routes
// =====================================================

// GET /api/content/faq - Get active FAQ items for homepage
router.get("/faq", getFaqs);

// =====================================================
// Admin Routes (should have auth middleware in production)
// =====================================================

// POST /api/content/testimonials - Create testimonial
router.post("/testimonials", createTestimonial);

// PATCH /api/content/testimonials/:id - Update testimonial
router.patch("/testimonials/:id", updateTestimonial);

// DELETE /api/content/testimonials/:id - Delete testimonial
router.delete("/testimonials/:id", deleteTestimonial);

// =====================================================

// POST /api/content/faq - Create FAQ
router.post("/faq", createFaq);

// GET /api/content/faq/admin/all - Get all FAQ items (including inactive)
router.get("/faq/admin/all", getAllFaqsAdmin);

// PATCH /api/content/faq/:id - Update FAQ
router.patch("/faq/:id", updateFaq);

// DELETE /api/content/faq/:id - Delete FAQ
router.delete("/faq/:id", deleteFaq);

export default router;
