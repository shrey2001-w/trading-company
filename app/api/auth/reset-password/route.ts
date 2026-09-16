import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { hashToken } from "@/lib/resetToken";

export async function POST(req: NextRequest) {
  try {
    const { role, token, newPassword } = await req.json();

    if (!role || !token || !newPassword || !["painter", "buyer"].includes(role)) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection(role === "painter" ? "painters" : "buyers");

    const hashedToken = hashToken(token);
    const user = await collection.findOne({
      resetTokenHash: hashedToken,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await collection.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash },
        $unset: { resetTokenHash: "", resetTokenExpiresAt: "" },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}