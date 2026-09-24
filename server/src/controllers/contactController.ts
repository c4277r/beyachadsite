import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CreateContactMessageInput } from "../utils/validation.js";
import { ApiError, asyncHandler } from "../middleware/errorHandler.js";

// =====================================================
// Create Contact Message
// =====================================================
export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateContactMessageInput = req.body;

  const message = await prisma.contactMessage.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: "UNREAD",
    },
  });

  res.status(201).json({
    success: true,
    message: "הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.",
    data: message,
  });
});

// =====================================================
// Get All Contact Messages (Admin Only)
// =====================================================
export const getAllContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const where = status ? { status: status as string } : {};

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// =====================================================
// Get Single Contact Message by ID
// =====================================================
export const getContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    throw new ApiError(404, "הודעה לא נמצאת");
  }

  res.json({
    success: true,
    data: message,
  });
});

// =====================================================
// Update Contact Message Status (Admin Only)
// =====================================================
export const updateContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!["UNREAD", "READ", "HANDLED", "ARCHIVED"].includes(status)) {
    throw new ApiError(400, "סטטוס לא תקין");
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      notes: notes || undefined,
    },
  });

  res.json({
    success: true,
    message: "הודעה עודכנה בהצלחה",
    data: message,
  });
});

// =====================================================
// Delete Contact Message (Admin Only)
// =====================================================
export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.contactMessage.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "הודעה נמחקה בהצלחה",
  });
});
