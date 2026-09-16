import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyer = await db.collection("buyers").findOne({ email });

    if (!buyer) {
      return NextResponse.json({ error: "No buyer account found with that email." }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, buyer.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await setSessionCookie({ id: buyer._id.toString(), role: "buyer", name: buyer.name });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Buyer signin error:", err);
    return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
  }
}