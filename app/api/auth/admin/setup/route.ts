import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "@/lib/db/admins";

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get("x-setup-key");

  if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { error: "ADMIN_USERNAME / ADMIN_PASSWORD not set in env" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admins = await getAdminsCollection();

  await admins.updateOne(
    { username },
    {
      $set: { username, passwordHash, name: "Admin", updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, message: `Admin '${username}' created/updated.` });
}