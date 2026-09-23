import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "trading_company";
const COLLECTION = "site_content";

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

async function getSiteContentCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<HeaderContent>(COLLECTION);
}

export async function getHeaderContent(): Promise<HeaderContent> {
  const collection = await getSiteContentCollection();
  const doc = await collection.findOne({ key: "header" });
  return doc ?? DEFAULT_HEADER_CONTENT;
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