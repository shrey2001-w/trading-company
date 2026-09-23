import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "@/lib/db/admins";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const admins = await getAdminsCollection();
  const admin = await admins.findOne({ username });

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await setSessionCookie({
    id: admin._id!.toString(),
    role: "admin",
    name: admin.name || "Admin",
  });

  return NextResponse.json({ ok: true });
}