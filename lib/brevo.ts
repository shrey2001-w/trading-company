// lib/brevo.ts
// Thin wrapper around Brevo's transactional email API.

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface SendBrevoEmailInput {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  replyTo?: BrevoRecipient;
}

export async function sendBrevoEmail(input: SendBrevoEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;
  const senderName = process.env.SENDER_NAME || "Trading Co";

  if (!apiKey || !senderEmail) {
    throw new Error(
      "Missing BREVO_API_KEY or SENDER_EMAIL environment variable."
    );
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: input.to,
      subject: input.subject,
      htmlContent: input.htmlContent,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo API error (${res.status}): ${errorBody}`);
  }

  return res.json();
}