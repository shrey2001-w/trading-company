import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getHeroContent, updateHeroContent, HeroCategory } from "@/lib/db/site-content";

const VALID_ICONS = ["droplets", "layers", "shield-check", "flame", "wrench", "paintbrush"];

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getHeroContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { headline, subheadline, categories } = body;

  if (!headline?.trim() || !subheadline?.trim()) {
    return NextResponse.json({ error: "Headline and subheadline are required." }, { status: 400 });
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json({ error: "At least one category is required." }, { status: 400 });
  }

  for (const cat of categories as HeroCategory[]) {
    if (!cat.name?.trim() || !cat.description?.trim() || !cat.href?.trim()) {
      return NextResponse.json(
        { error: "Each category needs a name, description, and link." },
        { status: 400 }
      );
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(cat.color)) {
      return NextResponse.json(
        { error: `Invalid color for "${cat.name}". Use a hex value like #2C6E9E.` },
        { status: 400 }
      );
    }
    if (!VALID_ICONS.includes(cat.icon)) {
      return NextResponse.json({ error: `Invalid icon for "${cat.name}".` }, { status: 400 });
    }
  }

  const content = await updateHeroContent({
    headline: headline.trim(),
    subheadline: subheadline.trim(),
    categories: categories.map((c: HeroCategory) => ({
      name: c.name.trim(),
      description: c.description.trim(),
      href: c.href.trim(),
      color: c.color,
      icon: c.icon,
    })),
  });

  return NextResponse.json({ ok: true, content });
}