import { NextResponse } from "next/server";
import { getHeroContent } from "@/lib/db/site-content";

export async function GET() {
  const content = await getHeroContent();
  return NextResponse.json({ content });
}