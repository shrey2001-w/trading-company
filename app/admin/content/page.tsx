"use client";

import { useState, useEffect } from "react";

type NavLink = { label: string; href: string };

const MAX_LOGO_BYTES = 1_500_000; // ~1.5MB as a data URL, keeps the DB doc small

export default function AdminContentPage() {
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/header")
      .then((res) => res.json())
      .then((data) => {
        setBrandName(data.content.brandName);
        setLogoUrl(data.content.logoUrl);
        setNavLinks(data.content.navLinks);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!/^image\/(png|jpeg|jpg|webp|svg\+xml)$/.test(file.type)) {
      setError("Only PNG, JPEG, WEBP, or SVG images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError("Logo is too large. Please use a smaller image (under ~1.5MB).");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.onerror = () => setError("Failed to read the file.");
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function updateNavLink(index: number, field: keyof NavLink, value: string) {
    setNavLinks((links) => links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function addNavLink() {
    setNavLinks((links) => [...links, { label: "", href: "" }]);
  }

  function removeNavLink(index: number) {
    setNavLinks((links) => links.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, logoUrl, navLinks }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }
      setMessage("Header updated.");
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
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Header Content</h1>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-[#4A4540]">Brand Name</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-[15px] focus:border-[#2F4B8C] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-[#4A4540]">Logo</label>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Logo preview"
            className="mb-2 h-12 w-12 rounded border border-stone-200 object-contain"
          />
        )}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} />
        {logoUrl && (
          <button
            type="button"
            onClick={() => setLogoUrl(null)}
            className="mt-2 block text-xs text-[#E85D3D] hover:underline"
          >
            Remove logo (use default mark)
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[#4A4540]">Navigation Links</label>
        <div className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateNavLink(i, "label", e.target.value)}
                className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-[14px] focus:border-[#2F4B8C] focus:outline-none"
              />
              <input
                type="text"
                placeholder="/href"
                value={link.href}
                onChange={(e) => updateNavLink(i, "href", e.target.value)}
                className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-[14px] focus:border-[#2F4B8C] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeNavLink(i)}
                className="rounded-md px-3 py-2 text-sm text-[#E85D3D] hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addNavLink}
          className="mt-2 rounded-md border border-stone-300 px-3 py-1.5 text-sm text-[#4A4540] hover:bg-stone-100"
        >
          + Add link
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