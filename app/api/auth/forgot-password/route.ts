import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateResetToken } from "@/lib/resetToken";
import { sendResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { role, identifier } = await req.json();

    if (!role || !identifier || !["painter", "buyer"].includes(role)) {
      return NextResponse.json({ error: "Role and identifier are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection(role === "painter" ? "painters" : "buyers");

    const user = await collection.findOne({ email: identifier });

    // Always return success even if not found — avoids leaking which emails are registered
    if (!user || !user.email) {
      return NextResponse.json({ success: true });
    }

    const { rawToken, hashedToken } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await collection.updateOne(
      { _id: user._id },
      { $set: { resetTokenHash: hashedToken, resetTokenExpiresAt: expiresAt } }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${rawToken}?role=${role}`;
    await sendResetEmail(user.email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}