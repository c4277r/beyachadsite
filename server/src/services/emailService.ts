const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TEAM_EMAIL = "beitbeyachad@gmail.com";

type ContactNotification = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type DonationConfirmation = {
  id: string;
  amount: number;
  donorName: string | null;
  donorEmail: string | null;
  receiptUrl: string | null;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn("Email notification skipped: RESEND_API_KEY or EMAIL_FROM is not configured");
    return;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, ...payload }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`Email delivery failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Email delivery failed", error);
  }
}

export function sendContactNotification(message: ContactNotification): Promise<void> {
  const name = `${message.firstName} ${message.lastName}`;
  const text = [
    `New contact form submission from ${name}`,
    `Email: ${message.email}`,
    `Phone: ${message.phone}`,
    "",
    message.message,
  ].join("\n");

  return sendEmail({
    to: process.env.SITE_TEAM_EMAIL || DEFAULT_TEAM_EMAIL,
    subject: `New contact form submission: ${name}`,
    text,
    html: `<h2>New contact form submission</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(message.email)}</p><p><strong>Phone:</strong> ${escapeHtml(message.phone)}</p><p>${escapeHtml(message.message).replace(/\n/g, "<br>")}</p>`,
  });
}

export function sendDonationConfirmation(donation: DonationConfirmation): Promise<void> {
  if (!donation.donorEmail) return Promise.resolve();

  const amount = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(donation.amount / 100);
  const donorName = donation.donorName || "תורם/ת יקר/ה";
  const receiptLink = donation.receiptUrl
    ? `<p><a href="${escapeHtml(donation.receiptUrl)}">לצפייה בקבלה</a></p>`
    : "";
  const receiptText = donation.receiptUrl ? `\nReceipt: ${donation.receiptUrl}` : "";

  return sendEmail({
    to: donation.donorEmail,
    subject: "אישור קבלת תרומתך לבית ביחד",
    text: `שלום ${donorName},\nתודה על תרומתך בסך ${amount}.\nמספר תרומה: ${donation.id}${receiptText}\n\nהודעה זו מאשרת את קבלת התרומה ואינה קבלה לצורכי מס.`,
    html: `<p>שלום ${escapeHtml(donorName)},</p><p>תודה על תרומתך בסך <strong>${escapeHtml(amount)}</strong>.</p><p>מספר תרומה: ${escapeHtml(donation.id)}</p>${receiptLink}<p>הודעה זו מאשרת את קבלת התרומה ואינה קבלה לצורכי מס.</p>`,
  });
}