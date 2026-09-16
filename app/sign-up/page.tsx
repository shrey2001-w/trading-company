"use client";

import Link from "next/link";

export default function SignUpChoicePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-8 px-4 py-16">
      <h1 className="text-3xl font-semibold text-[#1C1B1F]">Join Hue & Co.</h1>
      <p className="text-[#4A4540]">How would you like to sign up?</p>

      <div className="grid w-full gap-6 sm:grid-cols-2">
        <Link
          href="/sign-up/painter"
          className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:border-[#2F4B8C] hover:shadow-md"
        >
          <span className="text-lg font-semibold text-[#1C1B1F]">Sign up as Painter</span>
          <span className="text-sm text-[#4A4540]">Showcase and sell your artwork</span>
        </Link>

        <Link
          href="/sign-up/buyer"
          className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:border-[#E85D3D] hover:shadow-md"
        >
          <span className="text-lg font-semibold text-[#1C1B1F]">Sign up as Buyer</span>
          <span className="text-sm text-[#4A4540]">Browse and purchase artwork</span>
        </Link>
      </div>
    </div>
  );
}