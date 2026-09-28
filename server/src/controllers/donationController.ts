import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CreateDonationInput, UpdateDonationInput } from "../utils/validation.js";
import { ApiError, asyncHandler } from "../middleware/errorHandler.js";

// =====================================================
// Helper: Convert ILS to cents and vice versa
// =====================================================
const ilsToCents = (ils: number): number => Math.round(ils * 100);
const centsToIls = (cents: number): number => cents / 100;

// =====================================================
// Create Donation
// =====================================================
export const createDonation = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateDonationInput = req.body;

  const donation = await prisma.donation.create({
    data: {
      amount: ilsToCents(data.amount), // Convert ILS to cents
      paymentType: data.paymentType,
      donorName: data.donorName || null,
      donorEmail: data.donorEmail || null,
      donorPhone: data.donorPhone || null,
      status: "PENDING",
    },
  });

  res.status(201).json({
    success: true,
    message: "תרומתך קבלה בהצלחה! תודה על התמיכה.",
    data: {
      id: donation.id,
      amount: centsToIls(donation.amount), // Convert back to ILS
      status: donation.status,
      createdAt: donation.createdAt,
    },
  });
});

// =====================================================
// Get All Donations (Admin Only)
// =====================================================
export const getAllDonations = asyncHandler(async (req: Request, res: Response) => {
  const { status, paymentType } = req.query;

  const where: any = {};
  if (status) where.status = status;
  if (paymentType) where.paymentType = paymentType;

  const donations = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      paymentType: true,
      status: true,
      donorName: true,
      donorEmail: true,
      createdAt: true,
    },
  });

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    success: true,
    count: donations.length,
    totalAmount: centsToIls(totalAmount), // Convert to ILS
    data: donations.map((d) => ({
      ...d,
      amount: centsToIls(d.amount), // Convert each donation to ILS
    })),
  });
});

// =====================================================
// Get Single Donation by ID
// =====================================================
export const getDonation = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const donation = await prisma.donation.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      paymentType: true,
      status: true,
      donorName: true,
      donorEmail: true,
      receiptUrl: true,
      createdAt: true,
    },
  });

  if (!donation) {
    throw new ApiError(404, "תרומה לא נמצאת");
  }

  res.json({
    success: true,
    data: {
      ...donation,
      amount: centsToIls(donation.amount), // Convert to ILS
    },
  });
});

// =====================================================
// Update Donation Status & Transaction ID (Payment Processor Webhook)
// =====================================================
export const updateDonation = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, transactionId, receiptUrl }: UpdateDonationInput = req.body;

  const donation = await prisma.donation.update({
    where: { id },
    data: {
      status,
      transactionId: transactionId || undefined,
      receiptUrl: receiptUrl || undefined,
    },
  });

  res.json({
    success: true,
    message: "תרומה עודכנה בהצלחה",
    data: {
      id: donation.id,
      status: donation.status,
    },
  });
});

// =====================================================
// Get Donation Statistics (Admin Only)
// =====================================================
export const getDonationStats = asyncHandler(async (req: Request, res: Response) => {
  const totalDonations = await prisma.donation.findMany();
  const completedDonations = totalDonations.filter((d) => d.status === "COMPLETED");
  const pendingDonations = totalDonations.filter((d) => d.status === "PENDING");

  const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
  const averageDonation = completedDonations.length > 0 ? totalAmount / completedDonations.length : 0;

  const paymentTypeBreakdown: Record<string, number> = {};
  completedDonations.forEach((d) => {
    const amountInIls = centsToIls(d.amount);
    paymentTypeBreakdown[d.paymentType] = (paymentTypeBreakdown[d.paymentType] || 0) + amountInIls;
  });

  res.json({
    success: true,
    data: {
      totalDonations: totalDonations.length,
      completedDonations: completedDonations.length,
      pendingDonations: pendingDonations.length,
      totalAmount: centsToIls(totalAmount), // Convert to ILS
      averageDonation: Math.round(centsToIls(averageDonation)), // Convert to ILS
      paymentTypeBreakdown,
    },
  });
});
