import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError, asyncHandler } from "../middleware/errorHandler.js";

// =====================================================
// TESTIMONIALS
// =====================================================

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { author, content } = req.body;

  if (!author || !content) {
    throw new ApiError(400, "שדות חובה: author, content");
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      author,
      content,
      isActive: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "עדות נוספה בהצלחה",
    data: testimonial,
  });
});

export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  res.json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, content, isActive, orderIndex } = req.body;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      author: author || undefined,
      content: content || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      orderIndex: orderIndex !== undefined ? orderIndex : undefined,
    },
  });

  res.json({
    success: true,
    message: "עדות עודכנה בהצלחה",
    data: testimonial,
  });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.testimonial.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "עדות נמחקה בהצלחה",
  });
});

// =====================================================
// FAQ
// =====================================================

export const createFaq = asyncHandler(async (req: Request, res: Response) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    throw new ApiError(400, "שדות חובה: question, answer");
  }

  const faq = await prisma.faq.create({
    data: {
      question,
      answer,
      isActive: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "שאלה נוספה בהצלחה",
    data: faq,
  });
});

export const getFaqs = asyncHandler(async (req: Request, res: Response) => {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  res.json({
    success: true,
    count: faqs.length,
    data: faqs,
  });
});

export const getAllFaqsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const faqs = await prisma.faq.findMany({
    orderBy: { orderIndex: "asc" },
  });

  res.json({
    success: true,
    count: faqs.length,
    data: faqs,
  });
});

export const updateFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer, isActive, orderIndex } = req.body;

  const faq = await prisma.faq.update({
    where: { id },
    data: {
      question: question || undefined,
      answer: answer || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      orderIndex: orderIndex !== undefined ? orderIndex : undefined,
    },
  });

  res.json({
    success: true,
    message: "שאלה עודכנה בהצלחה",
    data: faq,
  });
});

export const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.faq.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "שאלה נמחקה בהצלחה",
  });
});
