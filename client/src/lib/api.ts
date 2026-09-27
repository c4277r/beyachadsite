// Thin client for the server's public API endpoints. Keeps request/response
// shapes in one place instead of duplicating fetch/error-handling per form.
// Server routes: server/src/routes/contactRoutes.ts, donationRoutes.ts.

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

interface ApiFieldError {
  field?: string;
  message: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  details?: ApiFieldError[];
}

export class ApiRequestError extends Error {
  status: number;
  details?: ApiFieldError[];

  constructor(message: string, status: number, details?: ApiFieldError[]) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError('לא ניתן להתחבר לשרת, בדוק את החיבור לאינטרנט ונסה שוב', 0);
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok || !payload || payload.success === false) {
    throw new ApiRequestError(
      payload?.message ?? 'אירעה שגיאה, אנא נסה שוב',
      response.status,
      payload && payload.success === false ? payload.details : undefined
    );
  }

  return payload.data;
}

// =====================================================
// Contact form
// =====================================================
// Matches server/src/utils/validation.ts createContactMessageSchema exactly.
export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export function submitContactMessage(input: ContactSubmission) {
  return postJson<{ id: string }>('/contact', input);
}

// =====================================================
// Donations
// =====================================================
// Matches server/src/utils/validation.ts createDonationSchema exactly.
// amount is in whole ILS - the server converts to/from agorot internally.
export type PaymentType = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'STANDING_ORDER' | 'PHONE_PLEDGE';

export interface DonationSubmission {
  amount: number;
  paymentType: PaymentType;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
}

export function submitDonation(input: DonationSubmission) {
  return postJson<{ id: string; amount: number; status: string }>('/donations', input);
}
