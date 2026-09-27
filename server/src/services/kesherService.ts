// =====================================================
// Kesher HK payment service (placeholder)
// =====================================================
// This module isolates all Kesher-specific request/response shapes so the
// rest of the server (controllers, routes, DB schema) never depends on
// Kesher's field names directly. Nothing here is wired up yet - the exact
// GetLinkToken request format, hosted-page redirect URL, and webhook
// authentication scheme must be confirmed with Kesher support first.
//
// Amount convention: this whole server stores Donation.amount as an
// integer number of agorot (1 ILS = 100 agorot). Kesher's payment-page
// docs describe "Total" in whole shekels, so any conversion to/from
// Kesher happens ONLY inside this module via the helpers below.

export interface InitiateKesherPaymentParams {
  donationId: string;
  amountAgorot: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
}

export interface InitiateKesherPaymentResult {
  redirectUrl: string;
}

/** Converts the internal agorot amount to the shekel value Kesher expects. */
export function agorotToShekels(amountAgorot: number): number {
  return Math.round(amountAgorot) / 100;
}

/** Converts a shekel amount (e.g. from Kesher) back to internal agorot. */
export function shekelsToAgorot(amountShekels: number): number {
  return Math.round(amountShekels * 100);
}

/**
 * Not implemented yet. Will call Kesher's GetLinkToken operation once the
 * exact request/response format is confirmed, and return a URL to redirect
 * the donor to Kesher's hosted payment page (id 328222).
 */
export async function initiateKesherPayment(
  _params: InitiateKesherPaymentParams
): Promise<InitiateKesherPaymentResult> {
  throw new Error(
    "Kesher payment initiation is not implemented yet - confirm GetLinkToken request/redirect format with Kesher first"
  );
}

/**
 * Not implemented yet. Will verify an incoming Kesher webhook payload
 * (signature/authentication method to be confirmed with Kesher) and return
 * a normalized result the donation controller can apply.
 */
export function verifyKesherWebhook(_rawBody: unknown, _headers: unknown): never {
  throw new Error(
    "Kesher webhook verification is not implemented yet - confirm authentication method with Kesher first"
  );
}
