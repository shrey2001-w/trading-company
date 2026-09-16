import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone number and password are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const painter = await db.collection("painters").findOne({ phone });

    if (!painter) {
      return NextResponse.json({ error: "No painter account found with that phone number." }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, painter.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await setSessionCookie({ id: painter._id.toString(), role: "painter", name: painter.name });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Painter signin error:", err);
    return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
  }
}