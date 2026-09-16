import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age, photograph, phone, email, address, aadharNumber, description, password } = body;

    if (!name || !age || !photograph || !phone || !address || !aadharNumber || !description || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const painters = db.collection("painters");

    const existingPhone = await painters.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json({ error: "An account with this phone number already exists." }, { status: 409 });
    }

    if (email) {
      const existingEmail = await painters.findOne({ email });
      if (existingEmail) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await painters.insertOne({
      name,
      age,
      photograph,
      phone,
      email: email || null,
      address,
      aadharNumber,
      description,
      passwordHash,
      role: "painter",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Painter signup error:", err);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}