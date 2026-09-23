import { NextResponse } from "next/server";
import { getHeaderContent } from "@/lib/db/site-content";

export async function GET() {
  const content = await getHeaderContent();
  return NextResponse.json({ content });
}