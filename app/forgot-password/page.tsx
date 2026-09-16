"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "painter" ? "painter" : "buyer";

  const [role, setRole] = useState<"painter" | "buyer">(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, identifier }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-semibold text-[#1C1B1F]">Check your email</h1>
        <p className="text-[#4A4540]">
          If an account exists with that email, we&apos;ve sent a password reset link. It expires in 1 hour.
        </p>
        {role === "painter" && (
          <p className="mt-4 text-sm text-[#8a8378]">
            Didn&apos;t provide a recovery email when you signed up? Contact support for help resetting your password.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Forgot Password</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setRole("buyer")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium ${
            role === "buyer" ? "border-[#E85D3D] bg-[#E85D3D]/10 text-[#E85D3D]" : "border-stone-300 text-[#4A4540]"
          }`}
        >
          I&apos;m a Buyer
        </button>
        <button
          onClick={() => setRole("painter")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium ${
            role === "painter" ? "border-[#2F4B8C] bg-[#2F4B8C]/10 text-[#2F4B8C]" : "border-stone-300 text-[#4A4540]"
          }`}
        >
          I&apos;m a Painter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#4A4540]">Email Address</label>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
          {role === "painter" && (
            <p className="mt-1 text-xs text-[#8a8378]">
              Use the recovery email you provided during signup (optional field).
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-[#2F4B8C] px-4 py-2.5 font-semibold text-white transition hover:bg-[#25396b] disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}