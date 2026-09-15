"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Components/CartContext";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/Footer";
import { getPriceForQuantity } from "@/app/Components/Products/types";

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash" | null>(
    null
  );
  const [paymentError, setPaymentError] = useState("");

  const currencySymbol = "₹";
  const shippingFee = totalPrice > 999 || totalPrice === 0 ? 0 : 49;
  const grandTotal = totalPrice + shippingFee;

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Enter your full name.";

    if (!form.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      next.phone = "Enter your phone number.";
    } else if (!/^\d{10}$/.test(form.phone.replace(/\s+/g, ""))) {
      next.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.address.trim()) next.address = "Enter your delivery address.";
    if (!form.city.trim()) next.city = "Enter your city.";
    if (!form.state.trim()) next.state = "Enter your state.";

    if (!form.pincode.trim()) {
      next.pincode = "Enter your PIN code.";
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = "Enter a valid 6-digit PIN code.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Builds the order payload shared by both payment routes.
  const buildOrderPayload = () => ({
    customer: form,
    items: items.map(({ product, quantity }) => {
      const unitPrice = getPriceForQuantity(product, quantity);
      return {
        name: product.name,
        quantity,
        unitPrice,
        total: unitPrice * quantity,
      };
    }),
    subtotal: totalPrice,
    shipping: shippingFee,
    grandTotal,
  });

  // Step 1: validate the form, then open the payment method modal.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;
    setPaymentError("");
    setShowPaymentModal(true);
  };

  // Step 2a: Cash on delivery — place the order and email both parties via Brevo.
  const handleCashPayment = async () => {
    setPaymentMethod("cash");
    setSubmitting(true);
    setPaymentError("");
    try {
      const res = await fetch("/api/checkout/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOrderPayload()),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order.");

      clearCart();
      router.push("/");
    } catch (err) {
      console.error("Cash order failed:", err);
      setPaymentError(
        "We couldn't place your order. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  // Step 2b: Stripe — create a Checkout Session and redirect to it.
  // Cart is intentionally NOT cleared here; it clears on /checkout/success
  // once the payment has actually gone through.
  const handleStripePayment = async () => {
    setPaymentMethod("stripe");
    setSubmitting(true);
    setPaymentError("");
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buildOrderPayload(),
          customer: form,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data?.error || "Failed to start payment.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe payment failed:", err);
      setPaymentError(
        "We couldn't start Stripe checkout. Please try again in a moment."
      );
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#FAF8F5] px-4 py-20 text-center">
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
          <h1 className="text-xl font-bold text-[#1C1B1A]">
            Your cart is empty
          </h1>
          <p className="max-w-sm text-sm text-[#6B655C]">
            Add a few products before heading to checkout.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-lg bg-[#2563AC] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1F5488]"
          >
            Browse products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#6B655C] sm:text-sm">
          <Link href="/" className="hover:text-[#1C1B1A]">
            Cart
          </Link>
          <span>/</span>
          <span className="font-medium text-[#1C1B1A]">Checkout</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-[#1C1B1A] sm:text-3xl">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
          {/* Delivery details */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-[#E4DFD6] bg-white p-5 sm:p-6">
              <h2 className="mb-1 text-base font-semibold text-[#1C1B1A]">
                Delivery details
              </h2>
              <p className="mb-5 text-sm text-[#6B655C]">
                We&apos;ll use this to deliver your order and send updates.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Anita Sharma"
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="anita@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </Field>

                <Field label="Phone number" error={errors.phone}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="98765 43210"
                    className={inputClass(!!errors.phone)}
                  />
                </Field>

                <Field
                  label="Address"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <textarea
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="House no., street, locality"
                    rows={3}
                    className={`${inputClass(!!errors.address)} resize-none`}
                  />
                </Field>

                <Field label="City" error={errors.city}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    placeholder="Delhi"
                    className={inputClass(!!errors.city)}
                  />
                </Field>

                <Field label="State" error={errors.state}>
                  <input
                    type="text"
                    value={form.state}
                    onChange={handleChange("state")}
                    placeholder="Delhi"
                    className={inputClass(!!errors.state)}
                  />
                </Field>

                <Field
                  label="PIN code"
                  error={errors.pincode}
                  className="sm:col-span-2 sm:max-w-[220px]"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    placeholder="110001"
                    className={inputClass(!!errors.pincode)}
                  />
                </Field>
              </div>
            </div>

            {/* Mobile-only submit (order summary sits below on small screens) */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2563AC] to-[#1F5488] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
            >
              {submitting
                ? "Processing…"
                : `Proceed to Payment · ${currencySymbol}${grandTotal.toLocaleString()}`}
            </button>
          </div>

          {/* Order summary */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-20 rounded-2xl border border-[#E4DFD6] bg-white p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-[#1C1B1A]">
                Order summary
                <span className="ml-2 text-sm font-normal text-[#9A948A]">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h2>

              <ul className="mb-4 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => {
                  const unitPrice = getPriceForQuantity(product, quantity);
                  return (
                    <li key={product.id} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F5F3EE]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#1C1B1A] px-1 text-[10px] font-bold text-white">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="line-clamp-2 text-sm font-medium text-[#1C1B1A]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#6B655C]">
                          {currencySymbol}
                          {unitPrice.toLocaleString()} × {quantity}
                        </p>
                      </div>
                      <span className="shrink-0 self-center text-sm font-semibold text-[#1C1B1A]">
                        {currencySymbol}
                        {(unitPrice * quantity).toLocaleString()}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-2 border-t border-[#E4DFD6] pt-4 text-sm">
                <div className="flex items-center justify-between text-[#6B655C]">
                  <span>Subtotal</span>
                  <span className="text-[#1C1B1A]">
                    {currencySymbol}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#6B655C]">
                  <span>Shipping</span>
                  <span className="text-[#1C1B1A]">
                    {shippingFee === 0
                      ? "Free"
                      : `${currencySymbol}${shippingFee}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-[#9A948A]">
                    Free shipping on orders over {currencySymbol}999.
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-[#E4DFD6] pt-2 text-base font-bold text-[#1C1B1A]">
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Desktop submit */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 hidden w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2563AC] to-[#1F5488] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
              >
                {submitting ? "Processing…" : "Proceed to Payment"}
                {!submitting && (
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
                )}
              </button>

              {paymentError && (
                <p className="mt-3 text-center text-xs font-medium text-[#E85D3D]">
                  {paymentError}
                </p>
              )}

              <p className="mt-3 text-center text-xs text-[#9A948A]">
                Your payment is processed securely.
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />

      <PaymentModal
        open={showPaymentModal}
        submitting={submitting}
        paymentMethod={paymentMethod}
        grandTotal={grandTotal}
        currencySymbol={currencySymbol}
        onClose={() => {
          if (!submitting) setShowPaymentModal(false);
        }}
        onSelectStripe={handleStripePayment}
        onSelectCash={handleCashPayment}
      />
    </div>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-[#1C1B1A]">{label}</span>
      {children}
      {error && (
        <span className="text-xs font-medium text-[#E85D3D]">{error}</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1C1B1A] placeholder:text-[#9A948A] outline-none transition-colors focus:ring-2 focus:ring-[#2563AC]/30 ${
    hasError
      ? "border-[#E85D3D] focus:border-[#E85D3D]"
      : "border-[#E4DFD6] focus:border-[#2563AC]"
  }`;
}

function PaymentModal({
  open,
  submitting,
  paymentMethod,
  grandTotal,
  currencySymbol,
  onClose,
  onSelectStripe,
  onSelectCash,
}: {
  open: boolean;
  submitting: boolean;
  paymentMethod: "stripe" | "cash" | null;
  grandTotal: number;
  currencySymbol: string;
  onClose: () => void;
  onSelectStripe: () => void;
  onSelectCash: () => void;
}) {
  // Close on Escape key.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock background scroll while modal is open.
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
      >
        {/* Drag handle for mobile bottom-sheet feel */}
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#E4DFD6] sm:hidden" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="payment-modal-title"
              className="text-lg font-bold text-[#1C1B1A]"
            >
              Choose payment method
            </h2>
            <p className="mt-1 text-sm text-[#6B655C]">
              Total to pay:{" "}
              <span className="font-semibold text-[#1C1B1A]">
                {currencySymbol}
                {grandTotal.toLocaleString()}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-[#9A948A] transition-colors hover:bg-[#F5F3EE] hover:text-[#1C1B1A] disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="flex flex-col gap-3">
          {/* Pay with Stripe */}
          <button
            type="button"
            onClick={onSelectStripe}
            disabled={submitting}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E4DFD6] bg-white px-4 py-4 text-left transition-colors hover:border-[#2563AC] hover:bg-[#F5F9FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#635BFF]/10">
                <svg
                  className="h-5 w-5 text-[#635BFF]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1B1A]">
                  Pay with Stripe
                </p>
                <p className="text-xs text-[#6B655C]">
                  Card, UPI &amp; more — secure checkout
                </p>
              </div>
            </div>
            {submitting && paymentMethod === "stripe" ? (
              <Spinner />
            ) : (
              <ChevronIcon />
            )}
          </button>

          {/* Pay with Cash */}
          <button
            type="button"
            onClick={onSelectCash}
            disabled={submitting}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E4DFD6] bg-white px-4 py-4 text-left transition-colors hover:border-[#2563AC] hover:bg-[#F5F9FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1F8A56]/10">
                <svg
                  className="h-5 w-5 text-[#1F8A56]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-9-8.25v6.75A2.25 2.25 0 0 0 5.25 18h13.5A2.25 2.25 0 0 0 21 15.75V9M3.75 6h16.5a1.5 1.5 0 0 1 1.5 1.5v.75a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-.75a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1B1A]">
                  Pay with Cash
                </p>
                <p className="text-xs text-[#6B655C]">
                  Cash on delivery
                </p>
              </div>
            </div>
            {submitting && paymentMethod === "cash" ? (
              <Spinner />
            ) : (
              <ChevronIcon />
            )}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-[#9A948A]">
          Your order will be confirmed once payment is complete.
        </p>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[#9A948A]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin text-[#2563AC]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}