import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

const MAX_PHOTO_BYTES = 1_500_000; // ~1.5MB base64 string, keeps the doc small

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "buyer") {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyer = await db.collection("buyers").findOne(
      { _id: new ObjectId(session.id) },
      { projection: { passwordHash: 0 } }
    );

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found." }, { status: 404 });
    }

    return NextResponse.json({ buyer }, { status: 200 });
  } catch (err) {
    console.error("Fetch buyer profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "buyer") {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json();
    const { name, contact, photo } = body as {
      name?: string;
      contact?: string;
      photo?: string | null; // data URL, e.g. "data:image/jpeg;base64,..."
    };

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!contact || !contact.trim()) {
      return NextResponse.json({ error: "Contact number is required." }, { status: 400 });
    }
    if (photo && photo.length > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Photo is too large. Please use a smaller image." },
        { status: 413 }
      );
    }
    if (photo && !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(photo)) {
      return NextResponse.json({ error: "Invalid photo format." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyers = db.collection("buyers");

    const update: Record<string, unknown> = {
      name: name.trim(),
      contact: contact.trim(),
      updatedAt: new Date(),
    };
    if (photo !== undefined) {
      update.photo = photo; // allow null to clear the photo
    }

    await buyers.updateOne({ _id: new ObjectId(session.id) }, { $set: update });

    const updated = await buyers.findOne(
      { _id: new ObjectId(session.id) },
      { projection: { passwordHash: 0 } }
    );

    return NextResponse.json({ success: true, buyer: updated }, { status: 200 });
  } catch (err) {
    console.error("Update buyer profile error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}