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

export interface AdminContactMessage extends ContactSubmission {
  id: string;
  status: 'UNREAD' | 'READ' | 'HANDLED' | 'ARCHIVED';
  createdAt: string;
}

export interface AdminDonation {
  id: string;
  amount: number;
  paymentType: PaymentType;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  donorName: string | null;
  donorEmail: string | null;
  createdAt: string;
}

async function adminRequest<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    if (init.body) headers.set('Content-Type', 'application/json');
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
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

export function loginAdmin(email: string, password: string) {
  return postJson<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
    '/auth/login',
    { email, password }
  );
}

export function getAdminContactMessages(token: string) {
  return adminRequest<AdminContactMessage[]>('/contact', token);
}

export function updateAdminContactMessage(
  token: string,
  id: string,
  input: { status: AdminContactMessage['status'] }
) {
  return adminRequest<AdminContactMessage>(`/contact/${encodeURIComponent(id)}`, token, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function getAdminDonations(token: string) {
  return adminRequest<AdminDonation[]>('/donations', token);
}
