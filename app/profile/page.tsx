"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type BuyerProfile = {
  _id: string;
  name: string;
  email: string;
  contact: string;
  photo?: string | null;
};

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type OrderStatus = "pending" | "paid" | "confirmed" | "cancelled";

type OrderRecord = {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: "cash" | "stripe";
  currencySymbol?: string;
  status: OrderStatus;
  createdAt: string;
};

const MAX_DIMENSION = 500; // resize photos client-side before upload

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  paid: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  cancelled: "bg-stone-100 text-stone-500 ring-1 ring-inset ring-stone-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export default function BuyerProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [photo, setPhoto] = useState<string | null | undefined>(undefined); // undefined = unchanged
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [upcomingOrders, setUpcomingOrders] = useState<OrderRecord[]>([]);
  const [pastOrders, setPastOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderTab, setOrderTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/buyer/profile");
        if (res.status === 401) {
          router.push("/sign-in/buyer");
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile.");
        if (cancelled) return;

        setProfile(data.buyer);
        setName(data.buyer.name || "");
        setContact(data.buyer.contact || "");
        setPreviewUrl(data.buyer.photo || null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const res = await fetch("/api/buyer/orders");
        if (res.status === 401) return;
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load orders.");
        if (cancelled) return;

        setUpcomingOrders(data.upcoming || []);
        setPastOrders(data.past || []);
      } catch (err) {
        if (!cancelled) setOrdersError(err instanceof Error ? err.message : "Failed to load orders.");
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(dataUrl);
        setPreviewUrl(dataUrl);
        setError("");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/buyer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          ...(photo !== undefined ? { photo } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      setProfile(data.buyer);
      setPhoto(undefined);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="animate-pulse space-y-8">
          <div className="h-7 w-40 rounded bg-stone-200" />
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-stone-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-stone-200" />
              <div className="h-4 w-20 rounded bg-stone-200" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-11 rounded-lg bg-stone-200" />
            <div className="h-11 rounded-lg bg-stone-200" />
            <div className="h-11 rounded-lg bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <p className="text-sm font-medium text-red-600">{error || "Profile not found."}</p>
      </div>
    );
  }

  const visibleOrders = orderTab === "upcoming" ? upcomingOrders : pastOrders;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1C1B1F] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-[#8a8378]">
          Update your details and keep track of your orders.
        </p>
      </header>

      {/* Profile card */}
      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-100 ring-1 ring-stone-100">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-[#8a8378]">
                  No photo
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <label className="cursor-pointer rounded-md border border-stone-300 px-3.5 py-2 text-sm font-medium text-[#1C1B1F] transition hover:border-stone-400 hover:bg-stone-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#E85D3D]/40">
                Change photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-md px-2 py-2 text-sm font-medium text-[#8a8378] transition hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#4A4540]">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1C1B1F] transition focus:border-[#E85D3D] focus:outline-none focus:ring-2 focus:ring-[#E85D3D]/25"
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-[#4A4540]">
                Contact number
              </label>
              <input
                id="contact"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1C1B1F] transition focus:border-[#E85D3D] focus:outline-none focus:ring-2 focus:ring-[#E85D3D]/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#4A4540]">
                Email
              </label>
              <input
                id="email"
                value={profile.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#8a8378]"
              />
            </div>
          </div>

          <div
            aria-live="polite"
            className="min-h-[1.25rem]"
          >
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">Profile updated.</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-[#E85D3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D14F31] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D3D]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Orders */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-[#1C1B1F] sm:text-xl">My Orders</h2>

        <div
          role="tablist"
          className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-stone-100 p-1 sm:inline-grid sm:w-fit"
        >
          <button
            type="button"
            role="tab"
            aria-selected={orderTab === "upcoming"}
            onClick={() => setOrderTab("upcoming")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D3D]/40 ${
              orderTab === "upcoming"
                ? "bg-white text-[#1C1B1F] shadow-sm"
                : "text-[#8a8378] hover:text-[#4A4540]"
            }`}
          >
            Upcoming ({upcomingOrders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderTab === "past"}
            onClick={() => setOrderTab("past")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D3D]/40 ${
              orderTab === "past"
                ? "bg-white text-[#1C1B1F] shadow-sm"
                : "text-[#8a8378] hover:text-[#4A4540]"
            }`}
          >
            Past / Cancelled ({pastOrders.length})
          </button>
        </div>

        {ordersLoading && (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />
            ))}
          </div>
        )}

        {ordersError && <p className="text-sm text-red-600">{ordersError}</p>}

        {!ordersLoading && !ordersError && visibleOrders.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center">
            <p className="text-sm text-[#8a8378]">
              {orderTab === "upcoming" ? "No upcoming orders yet." : "No past or cancelled orders."}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {visibleOrders.map((order) => {
            const symbol = order.currencySymbol || "₹";
            return (
              <div
                key={order.orderId}
                className="rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-300 sm:p-5"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1C1B1F]">
                      Order #{order.orderId}
                    </p>
                    <p className="text-xs text-[#8a8378]">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-sm text-[#4A4540]">
                      <span className="min-w-0 break-words">
                        {item.name}{" "}
                        <span className="whitespace-nowrap text-[#8a8378]">× {item.quantity}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {symbol}
                        {item.total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                  <span className="text-xs text-[#8a8378]">
                    {order.paymentMethod === "cash" ? "Cash on delivery" : "Paid via Stripe"}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-[#1C1B1F]">
                    {symbol}
                    {order.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}