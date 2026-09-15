"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  Product,
  getGalleryImages,
  getPriceForQuantity,
} from "./types";
import { useCart } from "../CartContext";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
  currencySymbol?: string;
  onAdd?: (product: Product, quantity: number) => void;
  /** Base path used to link to related products, e.g. "/product" */
  detailsBasePath?: string;
}

export default function ProductDetails({
  product,
  relatedProducts,
  currencySymbol = "₹",
  onAdd,
  detailsBasePath = "/product",
}: ProductDetailsProps) {
  const images = useMemo(() => getGalleryImages(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs">(
    "description"
  );
  const { addToCart } = useCart();

  const meta = CATEGORY_META[product.category];
  const pricePerUnit = getPriceForQuantity(product, quantity);
  const totalPrice = pricePerUnit * quantity;
  const hasDiscount = pricePerUnit < product.price;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(999, q + 1));

  const handleAdd = () => {
    addToCart(product, quantity);
    onAdd?.(product, quantity);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-[#6B655C] sm:text-sm">
        <Link href="/" className="hover:text-[#1C1B1A]">
          Products
        </Link>
        <span>/</span>
        <span className="text-[#1C1B1A]">{meta.label}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10">
        {/* Main content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#E4DFD6] bg-[#F5F3EE]">
              <Image
                src={images[activeImage]}
                alt={`${product.name} — photo ${activeImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              {hasDiscount && (
                <span
                  className="absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: meta.swatchDark }}
                >
                  -{Math.round((1 - pricePerUnit / product.price) * 100)}%
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View photo ${index + 1}`}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                      activeImage === index
                        ? "border-[#2563AC]"
                        : "border-[#E4DFD6] hover:border-[#B9C4CF]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#6B655C] sm:text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.swatch }}
              />
              {meta.label}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-[#1C1B1A] sm:text-3xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-[#6B655C] sm:text-base">
                {product.shortDescription}
              </p>
            )}

            {!product.inStock && (
              <span className="w-fit rounded-md bg-[#1C1B1A] px-2.5 py-1 text-xs font-medium text-white">
                Out of stock
              </span>
            )}

            {/* Price */}
            <div className="rounded-xl border border-[#E4DFD6] p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1C1B1A]">
                  {currencySymbol}
                  {pricePerUnit.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-base text-[#9A948A] line-through">
                    {currencySymbol}
                    {product.price.toLocaleString()}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs text-[#9A948A]">
                    {product.unit}
                  </span>
                )}
              </div>

              {product.bulkPricing && product.bulkPricing.length > 1 && (
                <ul className="mt-2 space-y-0.5 text-xs text-[#6B655C]">
                  {product.bulkPricing.map((tier) => (
                    <li key={tier.minQty}>
                      {tier.minQty}+ units — {currencySymbol}
                      {tier.pricePerUnit.toLocaleString()} each
                    </li>
                  ))}
                </ul>
              )}

              {/* Quantity selector */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-[#1C1B1A]">
                  Quantity
                </span>
                <div className="flex items-center rounded-lg border border-[#E4DFD6]">
                  <button
                    type="button"
                    onClick={decrease}
                    disabled={!product.inStock}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-[#1C1B1A]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increase}
                    disabled={!product.inStock}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#6B655C]">Total</span>
                <span className="font-semibold text-[#1C1B1A]">
                  {currencySymbol}
                  {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="mt-4 w-full rounded-lg bg-[#2563AC] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1F5488] disabled:cursor-not-allowed disabled:bg-[#B9C4CF]"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Description / Specifications tabs */}
        <div>
          <div className="flex gap-6 border-b border-[#E4DFD6]">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === "description"
                  ? "border-[#2563AC] text-[#1C1B1A]"
                  : "border-transparent text-[#9A948A] hover:text-[#1C1B1A]"
              }`}
            >
              Description
            </button>
            {product.specifications && product.specifications.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                  activeTab === "specs"
                    ? "border-[#2563AC] text-[#1C1B1A]"
                    : "border-transparent text-[#9A948A] hover:text-[#1C1B1A]"
                }`}
              >
                Specifications
              </button>
            )}
          </div>

          <div className="py-5">
            {activeTab === "description" ? (
              <p className="max-w-2xl text-sm leading-relaxed text-[#3A3733] sm:text-base">
                {product.description ??
                  product.shortDescription ??
                  "No description available for this product yet."}
              </p>
            ) : (
              <dl className="max-w-2xl divide-y divide-[#E4DFD6]">
                {product.specifications?.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between"
                  >
                    <dt className="text-sm font-medium text-[#6B655C]">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-[#1C1B1A] sm:text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* Related products — full width grid, shows every item passed in */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#E4DFD6] pt-8">
            <h2 className="mb-4 text-lg font-bold text-[#1C1B1A]">
              You may also like
              <span className="ml-2 text-sm font-normal text-[#9A948A]">
                ({relatedProducts.length})
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((related) => {
                const relatedPrice = getPriceForQuantity(related, 1);
                return (
                  <Link
                    key={related.id}
                    href={`${detailsBasePath}/${related.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#E4DFD6] bg-white transition-shadow hover:shadow-[0_6px_20px_-6px_rgba(28,27,26,0.18)]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F5F3EE]">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <p className="line-clamp-2 text-xs font-medium text-[#1C1B1A] group-hover:text-[#2563AC] sm:text-sm">
                        {related.name}
                      </p>
                      <p className="mt-auto text-sm font-bold text-[#1C1B1A]">
                        {currencySymbol}
                        {relatedPrice.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}