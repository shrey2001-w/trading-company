import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, contact, password } = body;

    if (!name || !email || !contact || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyers = db.collection("buyers");

    const existing = await buyers.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await buyers.insertOne({
      name,
      email,
      contact,
      passwordHash,
      role: "buyer",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Buyer signup error:", err);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}