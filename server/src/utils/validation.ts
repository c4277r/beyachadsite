import { z } from "zod";

// =====================================================
// Contact Form Validation
// =====================================================
export const createContactMessageSchema = z.object({
  firstName: z.string().min(1, "שם פרטי חובה").min(2, "שם קצר מדי"),
  lastName: z.string().min(1, "שם משפחה חובה").min(2, "שם קצר מדי"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z.string().regex(/^05\d{8}$/, "מספר טלפון לא תקין (דוגמה: 0501234567)"),
  message: z.string().min(10, "הודעה חייבת להכיל לפחות 10 תווים").max(2000, "הודעה ארוכה מדי"),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;

// =====================================================
// Donation Form Validation
// =====================================================
// Maximum sensible single-donation amount (in ILS). Prevents typos/abuse
// (e.g. accidental extra zero) from creating unreasonable pending records.
// Adjust if the organization needs to support larger single donations.
export const MAX_DONATION_AMOUNT_ILS = 50_000;

export const createDonationSchema = z.object({
  amount: z
    .number()
    .positive("סכום התרומה חייב להיות חיובי")
    .min(1, "סכום מינימלי: ₪1")
    .max(MAX_DONATION_AMOUNT_ILS, `סכום מקסימלי לתרומה בודדת: ₪${MAX_DONATION_AMOUNT_ILS}`),
  paymentType: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "STANDING_ORDER", "PHONE_PLEDGE"]),
  // Required so every donation can be matched to a receipt and donor
  // can be contacted about it. Never accept card number/expiry/CVV here -
  // card data must only ever be entered on the payment processor's page.
  donorName: z.string().min(2, "שם התורם חובה"),
  donorEmail: z.string().email("כתובת אימייל לא תקינה"),
  donorPhone: z.string().regex(/^05\d{8}$/, "מספר טלפון לא תקין").optional(),
});

export type CreateDonationInput = z.infer<typeof createDonationSchema>;

// =====================================================
// User (Admin) Validation
// =====================================================
export const createUserSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
  name: z.string().min(2, "שם חובה"),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// =====================================================
// Authentication Validation
// =====================================================
export const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "סיסמה חובה"),
});

export type LoginInput = z.infer<typeof loginSchema>;
