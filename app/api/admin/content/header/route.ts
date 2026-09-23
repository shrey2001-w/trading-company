import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getHeaderContent, updateHeaderContent } from "@/lib/db/site-content";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getHeaderContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { brandName, logoUrl, navLinks } = body;

  if (!brandName || typeof brandName !== "string" || !brandName.trim()) {
    return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
  }
  if (!Array.isArray(navLinks)) {
    return NextResponse.json({ error: "Nav links must be an array." }, { status: 400 });
  }
  for (const link of navLinks) {
    if (!link.label?.trim() || !link.href?.trim()) {
      return NextResponse.json({ error: "Each nav link needs a label and a URL." }, { status: 400 });
    }
  }

  const content = await updateHeaderContent({
    brandName: brandName.trim(),
    logoUrl: logoUrl || null,
    navLinks: navLinks.map((l: { label: string; href: string }) => ({
      label: l.label.trim(),
      href: l.href.trim(),
    })),
  });

  return NextResponse.json({ ok: true, content });
}