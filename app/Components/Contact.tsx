"use client";

import { useState, FormEvent, ChangeEvent } from "react";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (data: FormData): FormErrors => {
    const next: FormErrors = {};

    if (!data.name.trim()) {
      next.name = "Enter your name.";
    }

    const phoneDigits = data.phone.replace(/\D/g, "");
    if (!data.phone.trim()) {
      next.phone = "Enter a phone number.";
    } else if (phoneDigits.length < 7) {
      next.phone = "Enter a valid phone number.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      next.email = "Enter your email.";
    } else if (!emailPattern.test(data.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!data.message.trim()) {
      next.message = "Tell us what you need.";
    } else if (data.message.trim().length < 10) {
      next.message = "Add a few more details (10+ characters).";
    }

    return next;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setServerError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setStatus("submitting");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData(initialData);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section className="w-full bg-stone-50 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* Left: intro / brand panel */}
        <div className="relative overflow-hidden rounded-2xl bg-teal-800 px-6 py-10 text-teal-50 sm:px-8 sm:py-12 lg:rounded-3xl">
          {/* paint drip accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl sm:h-56 sm:w-56"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-rose-400/10 blur-2xl"
          />

          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Let&apos;s talk color
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-teal-100 sm:text-base">
            Whether you need a quote, a color match, or advice on finish and
            coverage, send us a note and someone from the shop will get back
            to you.
          </p>

          <dl className="mt-8 space-y-4 text-sm sm:text-base">
            <div>
              <dt className="text-teal-300">Shop hours</dt>
              <dd className="text-teal-50">Mon–Sat, 9am – 6pm</dd>
            </div>
            <div>
              <dt className="text-teal-300">Response time</dt>
              <dd className="text-teal-50">Usually within one business day</dd>
            </div>
          </dl>

          <div className="mt-10 flex gap-2" aria-hidden="true">
            {["#C1440E", "#E4B363", "#3F6C51", "#2C5F6F"].map((swatch) => (
              <span
                key={swatch}
                className="h-6 w-6 rounded-full ring-2 ring-white/30 sm:h-7 sm:w-7"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </div>

        {/* Right: form panel */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8 lg:rounded-3xl">
          {status === "success" ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                <svg
                  className="h-6 w-6 text-teal-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-900">
                Message sent
              </h3>
              <p className="mt-2 max-w-xs text-sm text-stone-500">
                Thanks for reaching out. We&apos;ll get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-medium text-teal-700 underline underline-offset-4 hover:text-teal-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jordan Smith"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 ${
                      errors.name
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-stone-300 focus:border-teal-600"
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 ${
                      errors.phone
                        ? "border-rose-400 focus:border-rose-400"
                        : "border-stone-300 focus:border-teal-600"
                    }`}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-stone-300 focus:border-teal-600"
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  What do you need help with?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, room size, or the color you have in mind..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 ${
                    errors.message
                      ? "border-rose-400 focus:border-rose-400"
                      : "border-stone-300 focus:border-teal-600"
                  }`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-rose-600">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p className="text-sm text-rose-600">
                  {serverError || "Something went wrong sending your message. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
              >
                {status === "submitting" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}