import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "trading_company";
const COLLECTION = "site_content";

async function getSiteContentCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

// ---- Header ----

export interface HeaderNavLink {
  label: string;
  href: string;
}

export interface HeaderContent {
  key: "header";
  brandName: string;
  logoUrl: string | null;
  navLinks: HeaderNavLink[];
  updatedAt: Date;
}

const DEFAULT_HEADER_CONTENT: HeaderContent = {
  key: "header",
  brandName: "Hue & Co.",
  logoUrl: null,
  navLinks: [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Contact Us", href: "/contact" },
  ],
  updatedAt: new Date(),
};

export async function getHeaderContent(): Promise<HeaderContent> {
  const collection = await getSiteContentCollection();
  const doc = await collection.findOne({ key: "header" });
  return (doc as unknown as HeaderContent) ?? DEFAULT_HEADER_CONTENT;
}

export async function updateHeaderContent(
  data: Pick<HeaderContent, "brandName" | "logoUrl" | "navLinks">
) {
  const collection = await getSiteContentCollection();
  await collection.updateOne(
    { key: "header" },
    { $set: { ...data, key: "header", updatedAt: new Date() } },
    { upsert: true }
  );
  return getHeaderContent();
}

// ---- Hero ----

export interface HeroCategory {
  name: string;
  description: string;
  href: string;
  color: string; // hex, e.g. "#2C6E9E"
  icon: string; // key into ICON_MAP on the frontend, e.g. "droplets"
}

export interface HeroContent {
  key: "hero";
  headline: string;
  subheadline: string;
  categories: HeroCategory[];
  updatedAt: Date;
}

const DEFAULT_HERO_CONTENT: HeroContent = {
  key: "hero",
  headline: "Every coat starts with the right can.",
  subheadline:
    "Browse our range by what the job needs — walls, foundations, wet areas, wood and metal, or the tools to apply it all.",
  categories: [
    {
      name: "Water Based Products",
      description: "Low-odor emulsions for interior walls and ceilings",
      href: "/categories/water-based",
      color: "#2C6E9E",
      icon: "droplets",
    },
    {
      name: "Cement Based Products",
      description: "Renders, primers and bonding compounds",
      href: "/categories/cement-based",
      color: "#6B6660",
      icon: "layers",
    },
    {
      name: "Waterproofing Products",
      description: "Roof, terrace and wet-area sealing systems",
      href: "/categories/waterproofing",
      color: "#1E7A6D",
      icon: "shield-check",
    },
    {
      name: "Oil Based Products",
      description: "Enamels and finishes for wood and metal",
      href: "/categories/oil-based",
      color: "#C4791F",
      icon: "flame",
    },
    {
      name: "Accessories",
      description: "Brushes, rollers, tape and prep tools",
      href: "/categories/accessories",
      color: "#9C5A3C",
      icon: "wrench",
    },
  ],
  updatedAt: new Date(),
};

export async function getHeroContent(): Promise<HeroContent> {
  const collection = await getSiteContentCollection();
  const doc = await collection.findOne({ key: "hero" });
  return (doc as unknown as HeroContent) ?? DEFAULT_HERO_CONTENT;
}

export async function updateHeroContent(
  data: Pick<HeroContent, "headline" | "subheadline" | "categories">
) {
  const collection = await getSiteContentCollection();
  await collection.updateOne(
    { key: "hero" },
    { $set: { ...data, key: "hero", updatedAt: new Date() } },
    { upsert: true }
  );
  return getHeroContent();
}