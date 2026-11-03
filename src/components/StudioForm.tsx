"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { uploadToImgbb } from "@/lib/upload";
import { Studio } from "@/types";

export interface StudioInput {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}

export default function StudioForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Studio;
  submitLabel: string;
  onSubmit: (data: StudioInput) => Promise<void>;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    hourlyRate: initial ? String(initial.hourlyRate) : "",
    securityDeposit: initial ? String(initial.securityDeposit) : "",
    maxCapacity: initial ? String(initial.maxCapacity) : "",
    location: initial?.location ?? "",
    image: initial?.image ?? "",
    gallery: (initial?.gallery ?? []).join(", "),
    overview: initial?.overview ?? "",
  });
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [customTag, setCustomTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleAmenity = (a: string) =>
    setAmenities((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  const addTag = () => {
    const t = customTag.trim();
    if (!t) return;
    if (!amenities.includes(t)) setAmenities((p) => [...p, t]);
    setCustomTag("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please choose a category");
    if (!form.image) return toast.error("Please add a cover image");
    if (amenities.length === 0) return toast.error("Select at least one amenity");
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        category: form.category,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit),
        maxCapacity: Number(form.maxCapacity),
        location: form.location.trim(),
        image: form.image.trim(),
        gallery: form.gallery.split(",").map((s) => s.trim()).filter(Boolean),
        amenities,
        overview: form.overview.trim(),
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const allAmenities = Array.from(new Set([...AMENITIES, ...amenities]));

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-box border border-base-300 bg-base-100 p-5 md:grid-cols-2 md:p-8">
      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">Studio title</span>
        <input required className="input w-full" placeholder="e.g. Northlight Cyc Wall Studio" value={form.title} onChange={set("title")} />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Category</span>
        <select required className="select w-full" value={form.category} onChange={set("category")}>
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Location / address</span>
        <input required className="input w-full" placeholder="Street, area, city" value={form.location} onChange={set("location")} />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Hourly rate ($)</span>
        <input required type="number" min={1} step="0.01" className="input w-full" value={form.hourlyRate} onChange={set("hourlyRate")} />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Security deposit ($)</span>
        <input required type="number" min={0} step="0.01" className="input w-full" value={form.securityDeposit} onChange={set("securityDeposit")} />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Max capacity (people)</span>
        <input required type="number" min={1} className="input w-full" value={form.maxCapacity} onChange={set("maxCapacity")} />
      </label>

      <div className="form-control">
        <span className="mb-1 block text-sm font-medium">Upload cover image (optional)</span>
        <input type="file" accept="image/*" className="file-input w-full" onChange={handleFile} disabled={uploading} />
        {uploading && <span className="mt-1 text-xs text-primary">Uploading to imgbb…</span>}
      </div>

      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">Image URL</span>
        <input required type="url" className="input w-full" placeholder="https://…" value={form.image} onChange={set("image")} />
      </label>

      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">More gallery image URLs (comma separated, optional)</span>
        <input className="input w-full" placeholder="https://…, https://…" value={form.gallery} onChange={set("gallery")} />
      </label>

      <fieldset className="md:col-span-2">
        <legend className="mb-2 text-sm font-medium">Amenities</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {allAmenities.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 rounded-field border border-base-300 px-3 py-2 text-sm">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
        <div className="join mt-3 w-full max-w-sm">
          <input
            className="input join-item w-full"
            placeholder="Add your own amenity"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button type="button" className="btn join-item btn-secondary" onClick={addTag}>Add</button>
        </div>
      </fieldset>

      <label className="form-control md:col-span-2">
        <span className="mb-1 block text-sm font-medium">Detailed overview</span>
        <textarea required rows={5} className="textarea w-full" placeholder="Describe size, lighting, rules and what makes your space special" value={form.overview} onChange={set("overview")} />
      </label>

      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Host name</span>
        <input readOnly className="input w-full opacity-70" value={initial?.ownerName ?? user?.name ?? ""} />
      </label>
      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">Host email</span>
        <input readOnly className="input w-full opacity-70" value={initial?.ownerEmail ?? user?.email ?? ""} />
      </label>

      <div className="md:col-span-2">
        <button className="btn btn-primary w-full sm:w-auto" disabled={saving || uploading}>
          {saving && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
