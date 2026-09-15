"use client";

import { CATEGORY_META, Category } from "./types";

export interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  priceBounds: PriceRange;
  resultCount: number;
}

export default function ProductFilters({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  priceBounds,
  resultCount,
}: ProductFiltersProps) {
  const categories = Object.entries(CATEGORY_META) as [
    Category,
    (typeof CATEGORY_META)[Category]
  ][];

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-[#E4DFD6] bg-[#FAF7F2]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-5">
      <div className="flex flex-col gap-4">
        {/* Search + result count */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A948A]"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 14L17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-[#E4DFD6] bg-white py-2 pl-9 pr-3 text-sm text-[#1C1B1A] placeholder:text-[#9A948A] focus:border-[#2563AC] focus:outline-none focus:ring-1 focus:ring-[#2563AC]"
            />
          </div>
          <p className="text-xs text-[#6B655C] sm:text-sm">
            {resultCount} {resultCount === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              activeCategory === "all"
                ? "border-[#1C1B1A] bg-[#1C1B1A] text-white"
                : "border-[#E4DFD6] bg-white text-[#1C1B1A] hover:border-[#1C1B1A]"
            }`}
          >
            All products
          </button>
          {categories.map(([key, meta]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCategoryChange(key)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  isActive
                    ? "border-transparent text-white"
                    : "border-[#E4DFD6] bg-white text-[#1C1B1A] hover:border-[#1C1B1A]"
                }`}
                style={isActive ? { backgroundColor: meta.swatch } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isActive ? "#FFFFFF" : meta.swatch }}
                />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Price range */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-[#6B655C] sm:text-sm">
            Price range
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={priceBounds.min}
              max={priceRange.max}
              value={priceRange.min}
              onChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  min: Number(e.target.value) || priceBounds.min,
                })
              }
              className="w-24 rounded-lg border border-[#E4DFD6] bg-white px-2 py-1.5 text-sm text-[#1C1B1A] focus:border-[#2563AC] focus:outline-none focus:ring-1 focus:ring-[#2563AC]"
              aria-label="Minimum price"
            />
            <span className="text-[#9A948A]">–</span>
            <input
              type="number"
              min={priceRange.min}
              max={priceBounds.max}
              value={priceRange.max}
              onChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  max: Number(e.target.value) || priceBounds.max,
                })
              }
              className="w-24 rounded-lg border border-[#E4DFD6] bg-white px-2 py-1.5 text-sm text-[#1C1B1A] focus:border-[#2563AC] focus:outline-none focus:ring-1 focus:ring-[#2563AC]"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>
    </div>
  );
}