import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CreateDonationInput, UpdateDonationInput } from "../utils/validation.js";
import { ApiError, asyncHandler } from "../middleware/errorHandler.js";
import { ADMIN_PAGE_SIZE, parsePage } from "../utils/pagination.js";
import { sendDonationConfirmation } from "../services/emailService.js";

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
  const { status, paymentType, page: pageQuery } = req.query;
  const page = parsePage(pageQuery);

  const where: any = {};
  if (status) where.status = status;
  if (paymentType) where.paymentType = paymentType;

  const [donations, count, totalResult] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        amount: true,
        paymentType: true,
        status: true,
        donorName: true,
        donorEmail: true,
        createdAt: true,
      },
    }),
    prisma.donation.count({ where }),
    prisma.$runCommandRaw({
      aggregate: "donations",
      pipeline: [
        { $match: where },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ],
      cursor: {},
    }),
  ]);
  const totalAmountInCents = (totalResult as unknown as {
    cursor?: { firstBatch?: Array<{ totalAmount?: number }> };
  }).cursor?.firstBatch?.[0]?.totalAmount ?? 0;

  res.json({
    success: true,
    count,
    totalAmount: centsToIls(totalAmountInCents), // Convert to ILS
    pagination: {
      page,
      pageSize: ADMIN_PAGE_SIZE,
      total: count,
      totalPages: Math.ceil(count / ADMIN_PAGE_SIZE),
    },
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
  const updateData = {
    status,
    transactionId: transactionId || undefined,
    receiptUrl: receiptUrl || undefined,
  };
  let donation: Awaited<ReturnType<typeof prisma.donation.update>> | null = null;
  let becameCompleted = false;

  if (status === "COMPLETED") {
    const transition = await prisma.donation.updateMany({
      where: { id, status: { not: "COMPLETED" } },
      data: updateData,
    });

    if (transition.count > 0) {
      donation = await prisma.donation.findUnique({ where: { id } });
      becameCompleted = true;
    } else {
      donation = await prisma.donation.update({ where: { id }, data: updateData });
    }
  } else {
    donation = await prisma.donation.update({ where: { id }, data: updateData });
  }

  if (!donation) {
    throw new ApiError(404, "תרומה לא נמצאת");
  }

  if (becameCompleted) {
    await sendDonationConfirmation({
      id: donation.id,
      amount: donation.amount,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      receiptUrl: donation.receiptUrl,
    });
  }

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
  const result = await prisma.$runCommandRaw({
    aggregate: "donations",
    pipeline: [
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalDonations: { $sum: 1 },
                completedDonations: {
                  $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
                },
                pendingDonations: {
                  $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
                },
                totalAmount: {
                  $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0] },
                },
                averageDonation: {
                  $avg: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", null] },
                },
              },
            },
          ],
          paymentTypes: [
            { $match: { status: "COMPLETED" } },
            {
              $group: {
                _id: "$paymentType",
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ],
    cursor: {},
  });
  const aggregateData = (result as unknown as {
    cursor?: {
      firstBatch?: Array<{
        totals?: Array<{
          totalDonations: number;
          completedDonations: number;
          pendingDonations: number;
          totalAmount: number;
          averageDonation: number | null;
        }>;
        paymentTypes?: Array<{ _id: string; totalAmount: number }>;
      }>;
    };
  }).cursor?.firstBatch?.[0];
  const totals = aggregateData?.totals?.[0];
  const paymentTypeBreakdown: Record<string, number> = {};
  for (const paymentType of aggregateData?.paymentTypes ?? []) {
    paymentTypeBreakdown[paymentType._id] = centsToIls(paymentType.totalAmount);
  }

  res.json({
    success: true,
    data: {
      totalDonations: totals?.totalDonations ?? 0,
      completedDonations: totals?.completedDonations ?? 0,
      pendingDonations: totals?.pendingDonations ?? 0,
      totalAmount: centsToIls(totals?.totalAmount ?? 0), // Convert to ILS
      averageDonation: Math.round(centsToIls(totals?.averageDonation ?? 0)), // Convert to ILS
      paymentTypeBreakdown,
    },
  });
});
