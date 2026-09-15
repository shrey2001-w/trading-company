"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilters, { PriceRange } from "./ProductFilters";
import { Category, Product } from "./types";

interface ProductsCatalogProps {
  products: Product[];
  currencySymbol?: string;
  onAdd?: (product: Product, quantity: number) => void;
  onDetails?: (product: Product) => void;
  /** Base path for the product details route. Defaults to "/product" (i.e. /product/[id]). */
  detailsBasePath?: string;
}

export default function ProductsCatalog({
  products,
  currencySymbol = "₹",
  onAdd,
  onDetails,
  detailsBasePath = "/product",
}: ProductsCatalogProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const priceBounds = useMemo<PriceRange>(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [priceRange, setPriceRange] = useState<PriceRange>(priceBounds);

  // Keep the range in sync if the product list changes after first render
  const effectiveRange: PriceRange = {
    min: priceRange.min ?? priceBounds.min,
    max: priceRange.max || priceBounds.max,
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = query
        ? product.name.toLowerCase().includes(query)
        : true;
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesPrice =
        product.price >= effectiveRange.min &&
        product.price <= effectiveRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, activeCategory, effectiveRange]);

  const handleAdd = (product: Product, quantity: number) => {
    if (onAdd) {
      onAdd(product, quantity);
    } else {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    }
  };

  const handleDetails = (product: Product) => {
    if (onDetails) {
      onDetails(product);
    } else {
      router.push(`${detailsBasePath}/${product.id}`);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        priceRange={effectiveRange}
        onPriceRangeChange={setPriceRange}
        priceBounds={priceBounds}
        resultCount={filteredProducts.length}
      />

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#E4DFD6] py-16 text-center">
          <p className="text-sm font-medium text-[#1C1B1A]">
            No products match your filters
          </p>
          <p className="text-xs text-[#9A948A]">
            Try widening the price range or clearing the search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              onDetails={handleDetails}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>
      )}
    </section>
  );
}