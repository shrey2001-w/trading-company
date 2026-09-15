"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartDrawer({
  currencySymbol = "₹",
}: {
  currencySymbol?: string;
}) {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-[#1C1B1A]/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        style={{ backgroundColor: "#FFFFFF", colorScheme: "light" }}
        className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-full flex-col text-[#1C1B1A] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-[#2563AC] to-[#1F5488] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.163.075-.3-.148-.594-.458-.594H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Your Cart
              </h2>
              <p className="text-xs text-white/80">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/15 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto bg-[#FAF8F5] px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E4DFD6]/60">
                <svg
                  className="h-10 w-10 text-[#9A948A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.163.075-.3-.148-.594-.458-.594H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1C1B1A]">
                Your cart is empty
              </p>
              <p className="text-xs text-[#6B655C]">
                Add some products to get started.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 rounded-lg bg-[#2563AC] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F5488]"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-[#E4DFD6] bg-white p-3 shadow-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F5F3EE] sm:h-20 sm:w-20">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#1C1B1A]">
                        {product.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="shrink-0 rounded-md p-1 text-[#9A948A] transition-colors hover:bg-[#FDEDEA] hover:text-[#E85D3D]"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#E4DFD6] bg-[#FAF8F5]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#E4DFD6] disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[#1C1B1A]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-[#1C1B1A] transition-colors hover:bg-[#E4DFD6]"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#2563AC]">
                        {currencySymbol}
                        {(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[#E4DFD6] bg-white px-4 py-4 sm:px-6">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[#6B655C]">
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="text-lg font-bold text-[#1C1B1A]">
                {currencySymbol}
                {totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="mb-4 text-xs text-[#9A948A]">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2563AC] to-[#1F5488] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
            >
              Proceed to Checkout
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}