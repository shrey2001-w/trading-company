"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORY_META, Product, getDiscountedPrice } from "./types";
import { useCart } from "../CartContext";

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product, quantity: number) => void;
  onDetails: (product: Product) => void;
  currencySymbol?: string;
}

export default function ProductCard({
  product,
  onAdd,
  onDetails,
  currencySymbol = "₹",
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const meta = CATEGORY_META[product.category];
  const hasDiscount = !!product.discountPercent && product.discountPercent > 0;
  const finalPrice = getDiscountedPrice(product);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onAdd?.(product, quantity);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[#E4DFD6] bg-white transition-shadow hover:shadow-[0_6px_20px_-6px_rgba(28,27,26,0.18)]">
      {/* Category accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: meta.swatch }} />

      {/* Image */}
      <div className="relative aspect-square w-full bg-[#F5F3EE]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {hasDiscount && (
          <span
            className="absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: meta.swatchDark }}
          >
            -{product.discountPercent}%
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-md bg-[#1C1B1A] px-3 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-[#6B655C]">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: meta.swatch }}
          />
          {meta.label}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#1C1B1A]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#1C1B1A]">
            {currencySymbol}
            {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[#9A948A] line-through">
              {currencySymbol}
              {product.price.toLocaleString()}
            </span>
          )}
          {product.unit && (
            <span className="text-xs text-[#9A948A]">{product.unit}</span>
          )}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-[#E4DFD6]">
            <button
              type="button"
              onClick={decrease}
              disabled={!product.inStock}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-[#1C1B1A]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={!product.inStock}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 rounded-lg bg-[#2563AC] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5488] disabled:cursor-not-allowed disabled:bg-[#B9C4CF]"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => onDetails(product)}
            className="flex-1 rounded-lg border border-[#1C1B1A] px-3 py-2 text-sm font-semibold text-[#1C1B1A] transition-colors hover:bg-[#1C1B1A] hover:text-white"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}