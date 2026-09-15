export type Category =
  | "water-based"
  | "cement-based"
  | "waterproofing"
  | "oil-based"
  | "accessories";

export interface BulkPricingTier {
  /** This price-per-unit applies once quantity reaches at least this number */
  minQty: number;
  pricePerUnit: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Primary image, shown on the card in the catalog grid */
  image: string;
  /** Up to 5 gallery images shown on the product details page. Falls back to [image] if omitted. */
  gallery?: string[];
  /** Original price before any discount, in your local currency */
  price: number;
  /** Discount as a whole percentage, e.g. 15 for 15% off. Omit or 0 for no discount. */
  discountPercent?: number;
  /** Selling unit, shown under the price, e.g. "per litre", "20kg bag" */
  unit?: string;
  inStock: boolean;
  /** Short one-line summary shown near the top of the details page */
  shortDescription?: string;
  /** Full description shown on the details page */
  description?: string;
  /** Spec sheet rows, e.g. Coverage, Drying time, Finish */
  specifications?: ProductSpec[];
  /**
   * Optional quantity-based pricing. If provided, the price shown updates as the
   * customer changes quantity — e.g. buying 10+ units drops the per-unit price.
   * Tiers should be sorted by minQty ascending; the highest matching tier wins.
   */
  bulkPricing?: BulkPricingTier[];
}

export interface CategoryMeta {
  label: string;
  /** Swatch color used for the card accent, dot, and filter pill */
  swatch: string;
  swatchDark: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "water-based": {
    label: "Water Based",
    swatch: "#2F86C7",
    swatchDark: "#1F5E8F",
  },
  "cement-based": {
    label: "Cement Based",
    swatch: "#8A8378",
    swatchDark: "#615C53",
  },
  waterproofing: {
    label: "Waterproofing",
    swatch: "#1F8A70",
    swatchDark: "#15604F",
  },
  "oil-based": {
    label: "Oil Based",
    swatch: "#C97A2B",
    swatchDark: "#9B5E1E",
  },
  accessories: {
    label: "Accessories",
    swatch: "#7A5CC0",
    swatchDark: "#5A4090",
  },
};

export function getDiscountedPrice(product: Product): number {
  if (!product.discountPercent) return product.price;
  return Math.round(product.price * (1 - product.discountPercent / 100));
}

/**
 * Returns the per-unit price for a given quantity, taking bulk pricing tiers
 * into account when present. Falls back to the standard discounted price.
 */
export function getPriceForQuantity(product: Product, quantity: number): number {
  if (product.bulkPricing && product.bulkPricing.length > 0) {
    const sorted = [...product.bulkPricing].sort((a, b) => a.minQty - b.minQty);
    let applicable = sorted[0].pricePerUnit;
    for (const tier of sorted) {
      if (quantity >= tier.minQty) {
        applicable = tier.pricePerUnit;
      }
    }
    return applicable;
  }
  return getDiscountedPrice(product);
}

/** Returns up to 5 gallery images, falling back to the primary image if none are set. */
export function getGalleryImages(product: Product): string[] {
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];
  return images.slice(0, 5);
}