import { NextRequest, NextResponse } from "next/server";
import { customerEmailHtml, ownerEmailHtml, ContactPayload } from "./email-templates";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME || "Your Trading Co";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Partial<ContactPayload>) {
  if (!data.name?.trim()) return "Name is required.";
  if (!data.phone?.trim() || data.phone.replace(/\D/g, "").length < 7) {
    return "A valid phone number is required.";
  }
  if (!data.email?.trim() || !emailPattern.test(data.email)) {
    return "A valid email is required.";
  }
  if (!data.message?.trim() || data.message.trim().length < 10) {
    return "Message must be at least 10 characters.";
  }
  return null;
}

async function sendBrevoEmail(payload: Record<string, unknown>) {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": BREVO_API_KEY as string,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Brevo request failed (${res.status}): ${errText}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  // TEMPORARY DEBUG LOG — remove once things are working.
  // Check your terminal (not the browser console) after clicking "Send message".
  console.log("Env check:", {
    hasApiKey: Boolean(BREVO_API_KEY),
    apiKeyPreview: BREVO_API_KEY ? BREVO_API_KEY.slice(0, 10) + "..." : null,
    ownerEmail: OWNER_EMAIL,
    senderEmail: SENDER_EMAIL,
  });

  if (!BREVO_API_KEY || !OWNER_EMAIL || !SENDER_EMAIL) {
    console.error("Missing Brevo env vars (BREVO_API_KEY / OWNER_EMAIL / SENDER_EMAIL)");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let data: ContactPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validate(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    // 1. Confirmation email to the customer
    await sendBrevoEmail({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: data.email, name: data.name }],
      subject: "We received your message",
      htmlContent: customerEmailHtml(data),
    });

    // 2. Notification email to the shop owner, with reply-to set to the customer
    await sendBrevoEmail({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: OWNER_EMAIL }],
      replyTo: { email: data.email, name: data.name },
      subject: `New contact form submission from ${data.name}`,
      htmlContent: ownerEmailHtml(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}