"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PainterSignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    aadharNumber: "",
    description: "",
    password: "",
  });
  const [photograph, setPhotograph] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotograph(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!photograph) {
      setError("Please upload a photograph.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/painter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), photograph }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-24 text-center">
        <div className="text-3xl">✅</div>
        <h1 className="text-2xl font-semibold text-[#1C1B1F]">
          Your account has been created successfully!
        </h1>
        <p className="text-sm text-[#4A4540]">Redirecting you to the homepage...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Sign up as Painter</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
        <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} required />

        <div>
          <label className="mb-1 block text-sm font-medium text-[#4A4540]">Photograph</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} required className="w-full text-sm" />
          {photograph && (
            <img src={photograph} alt="Preview" className="mt-2 h-24 w-24 rounded-md object-cover" />
          )}
        </div>

        <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />

        <div>
          <label className="mb-1 block text-sm font-medium text-[#4A4540]">
            Email <span className="font-normal text-[#8a8378]">(optional — used only for password recovery)</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <Field label="Address" name="address" value={form.address} onChange={handleChange} required />
        <Field label="Aadhar Card Number" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} required />

        <div>
          <label className="mb-1 block text-sm font-medium text-[#4A4540]">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-[#2F4B8C] px-4 py-2.5 font-semibold text-white transition hover:bg-[#25396b] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Painter Account"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#4A4540]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
      />
    </div>
  );
}