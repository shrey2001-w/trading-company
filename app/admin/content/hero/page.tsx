"use client";

import { useState, useEffect } from "react";

type HeroCategory = { name: string; description: string; href: string; color: string; icon: string };

const ICON_OPTIONS = [
  { value: "droplets", label: "Droplets" },
  { value: "layers", label: "Layers" },
  { value: "shield-check", label: "Shield" },
  { value: "flame", label: "Flame" },
  { value: "wrench", label: "Wrench" },
  { value: "paintbrush", label: "Paintbrush" },
];

export default function AdminHeroContentPage() {
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [categories, setCategories] = useState<HeroCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeadline(data.content.headline);
        setSubheadline(data.content.subheadline);
        setCategories(data.content.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateCategory(index: number, field: keyof HeroCategory, value: string) {
    setCategories((cats) => cats.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function addCategory() {
    setCategories((cats) => [
      ...cats,
      { name: "", description: "", href: "", color: "#2C6E9E", icon: "droplets" },
    ]);
  }

  function removeCategory(index: number) {
    setCategories((cats) => cats.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, subheadline, categories }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }
      setMessage("Hero section updated.");
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-[15px] text-[#4A4540]">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Hero Section</h1>

      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-[#4A4540]">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-[15px] focus:border-[#2F4B8C] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-[#4A4540]">Subheadline</label>
        <textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-[15px] focus:border-[#2F4B8C] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[#4A4540]">Category Cards</label>
        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="rounded-lg border border-stone-200 p-4">
              <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                  className="rounded-md border border-stone-300 px-3 py-2 text-[14px] focus:border-[#2F4B8C] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="/categories/example"
                  value={cat.href}
                  onChange={(e) => updateCategory(i, "href", e.target.value)}
                  className="rounded-md border border-stone-300 px-3 py-2 text-[14px] focus:border-[#2F4B8C] focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Description"
                value={cat.description}
                onChange={(e) => updateCategory(i, "description", e.target.value)}
                className="mb-2 w-full rounded-md border border-stone-300 px-3 py-2 text-[14px] focus:border-[#2F4B8C] focus:outline-none"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#4A4540]">Color</label>
                <input
                  type="color"
                  value={cat.color}
                  onChange={(e) => updateCategory(i, "color", e.target.value)}
                  className="h-8 w-12 rounded border border-stone-300"
                />
                <label className="ml-3 text-sm text-[#4A4540]">Icon</label>
                <select
                  value={cat.icon}
                  onChange={(e) => updateCategory(i, "icon", e.target.value)}
                  className="rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-[#2F4B8C] focus:outline-none"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeCategory(i)}
                  className="ml-auto rounded-md px-3 py-1.5 text-sm text-[#E85D3D] hover:bg-red-50"
                >
                  Remove card
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="mt-3 rounded-md border border-stone-300 px-3 py-1.5 text-sm text-[#4A4540] hover:bg-stone-100"
        >
          + Add category card
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mb-3 text-sm text-green-700">{message}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-[#2F4B8C] px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-[#25396b] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}