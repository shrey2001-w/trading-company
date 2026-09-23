import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { sendBrevoEmail } from "@/lib/brevo";
import { buyerWelcomeEmailHtml } from "@/app/api/contact/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, contact, password } = body;

    if (!name || !email || !contact || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContact = contact.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyers = db.collection("buyers");

    const existing = await buyers.findOne({ email: trimmedEmail });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await buyers.insertOne({
      name: trimmedName,
      email: trimmedEmail,
      contact: trimmedContact,
      passwordHash,
      role: "buyer",
      createdAt: new Date(),
    });

    // Fire the welcome email — don't let a Brevo failure block the signup response
    try {
      await sendBrevoEmail({
        to: [{ email: trimmedEmail, name: trimmedName }],
        subject: "Welcome to Your Trading Co",
        htmlContent: buyerWelcomeEmailHtml({
          name: trimmedName,
          email: trimmedEmail,
          contact: trimmedContact,
        }),
      });
    } catch (emailErr) {
      console.error("Buyer welcome email failed:", emailErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Buyer signup error:", err);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}