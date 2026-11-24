"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, type Category, type MenuItem } from "@/data/menu";

type AdminItem = MenuItem & { is_active: boolean; sort_order: number };

type FormState = {
  name: string;
  category: Category;
  description: string;
  price: string;
  priceValue: string;
  note: string;
  emoji: string;
  tone: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "Desserts",
  description: "",
  price: "",
  priceValue: "",
  note: "",
  emoji: "🍰",
  tone: "#F4E2C8",
};

export default function AdminMenuPage() {
  const supabase = createClient();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order");
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems(
      (data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category as Category,
        description: r.description,
        price: r.price,
        priceValue: r.price_value ?? undefined,
        note: r.note ?? undefined,
        emoji: r.emoji,
        tone: r.tone,
        imageUrl: r.image_url ?? undefined,
        is_active: r.is_active,
        sort_order: r.sort_order,
      })),
    );
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadPhoto(file: File, id: string) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `menu/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("menu-images").getPublicUrl(path).data
      .publicUrl;
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const id = editingId ?? `${slug}-${Date.now().toString(36)}`;

      let imageUrl: string | null = editingId
        ? (items.find((i) => i.id === editingId)?.imageUrl ?? null)
        : null;
      if (photoFile) imageUrl = await uploadPhoto(photoFile, id);

      const row = {
        id,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: form.price.trim(),
        price_value: form.priceValue ? Number(form.priceValue) : null,
        note: form.note.trim() || null,
        emoji: form.emoji || "🍰",
        tone: form.tone,
        image_url: imageUrl,
        sort_order: editingId
          ? (items.find((i) => i.id === editingId)?.sort_order ?? 0)
          : items.length + 1,
      };

      const { error } = editingId
        ? await supabase.from("menu_items").update(row).eq("id", editingId)
        : await supabase.from("menu_items").insert(row);
      if (error) throw error;

      setForm(EMPTY_FORM);
      setEditingId(null);
      setPhotoFile(null);
      setPhotoPreview("");
      await load();
    } catch (err: any) {
      setError(err.message ?? "Could not save the item.");
    } finally {
      setSaving(false);
    }
  }

  function onEdit(item: AdminItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      priceValue: item.priceValue ? String(item.priceValue) : "",
      note: item.note ?? "",
      emoji: item.emoji,
      tone: item.tone,
    });
    setPhotoFile(null);
    setPhotoPreview(item.imageUrl ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview("");
  }

  async function onToggle(item: AdminItem) {
    await supabase
      .from("menu_items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    load();
  }

  async function onDelete(item: AdminItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    await supabase.from("menu_items").delete().eq("id", item.id);
    load();
  }

  function onPhotoChange(file: File | undefined) {
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const inputCls =
    "w-full rounded-2xl border border-ink/20 bg-white px-4 py-2.5 focus:border-brand-red focus:outline-none";

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">Menu items</h1>
      <p className="mt-2 text-ink/70">
        Add a new item and it appears on the website straight away.
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_14px_32px_-16px_rgba(122,23,18,0.45)]"
      >
        <h2 className="text-xl font-bold">
          {editingId ? "Edit item" : "Add a new item"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Name *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Blueberry cheesecake"
              className={`${inputCls} mt-1 font-normal`}
            />
          </label>

          <label className="block text-sm font-bold">
            Category *
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
              className={`${inputCls} mt-1 font-normal`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold">
            Price shown on the site *
            <input
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="₹180"
              className={`${inputCls} mt-1 font-normal`}
            />
          </label>

          <label className="block text-sm font-bold">
            Price value (number, for totals)
            <input
              type="number"
              value={form.priceValue}
              onChange={(e) => setForm({ ...form, priceValue: e.target.value })}
              placeholder="180"
              className={`${inputCls} mt-1 font-normal`}
            />
          </label>

          <label className="block text-sm font-bold sm:col-span-2">
            Description
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Soft cheesecake with a blueberry topping."
              className={`${inputCls} mt-1 font-normal`}
            />
          </label>

          <label className="block text-sm font-bold">
            Note
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="per slice"
              className={`${inputCls} mt-1 font-normal`}
            />
          </label>

          <div className="flex gap-4">
            <label className="block flex-1 text-sm font-bold">
              Emoji
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className={`${inputCls} mt-1 font-normal`}
              />
            </label>
            <label className="block text-sm font-bold">
              Tile colour
              <input
                type="color"
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="mt-1 h-11 w-16 cursor-pointer rounded-2xl border border-ink/20 bg-white p-1"
              />
            </label>
          </div>

          <label className="block text-sm font-bold sm:col-span-2">
            Photo (optional — if you skip this, the emoji tile shows)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPhotoChange(e.target.files?.[0])}
              className="mt-1 block w-full text-sm"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-3 h-32 w-full rounded-2xl object-cover"
              />
            )}
          </label>
        </div>

        {error && (
          <p className="mt-4 text-sm font-semibold text-brand-red">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-red-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Add item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-full border border-ink/30 px-6 py-3 font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="mt-10 text-xl font-bold">All items ({items.length})</h2>
      {loading ? (
        <p className="mt-4 text-sm text-ink/60">Loading...</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-[2rem] bg-white p-4 shadow-[0_8px_20px_-14px_rgba(122,23,18,0.5)]"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: item.tone }}
                >
                  {item.emoji}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {item.name}{" "}
                  <span className="font-normal text-ink/60">
                    · {item.price}
                  </span>
                </p>
                <p className="truncate text-sm text-ink/60">
                  {item.category}
                  {!item.is_active && " · Hidden from the website"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-full border border-ink/30 px-4 py-2 text-sm font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggle(item)}
                  className="rounded-full border border-ink/30 px-4 py-2 text-sm font-bold"
                >
                  {item.is_active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
