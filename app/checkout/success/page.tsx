"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/Components/CartContext";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/Footer";

// Stripe redirects here after a successful payment with ?session_id=...
// NOTE: for production, verify the session server-side (and ideally send
// the confirmation emails from a Stripe webhook) instead of trusting the
// client redirect alone.
export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (sessionId && !cleared) {
      clearCart();
      setCleared(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1F8A56]/10">
          <svg
            className="h-10 w-10 text-[#1F8A56]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#1C1B1A]">Payment successful</h1>
        <p className="max-w-sm text-sm text-[#6B655C]">
          Thanks for your order! You&apos;ll receive a confirmation email shortly.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg bg-[#2563AC] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1F5488]"
        >
          Continue shopping
        </Link>
      </main>
      <Footer />
    </div>
  );
}