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
export const createDonationSchema = z.object({
  amount: z.number().positive("סכום התרומה חייב להיות חיובי").min(1, "סכום מינימלי: ₪1"),
  paymentType: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "STANDING_ORDER", "PHONE_PLEDGE"]),
  donorName: z.string().min(2, "שם התורם חובה").optional(),
  donorEmail: z.string().email("כתובת אימייל לא תקינה").optional(),
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
