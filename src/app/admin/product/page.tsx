"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, formatINR } from "@/data/shop";

type Row = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  size: string | null;
  image_url: string | null;
  tone: string | null;
  is_active: boolean;
  sort_order: number;
};

type Form = {
  name: string;
  category: string;
  description: string;
  price: string;
  size: string;
  tone: string;
  sort_order: string;
};

const EMPTY: Form = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  price: "",
  size: "",
  tone: "#A9CF73",
  sort_order: "0",
};

const BUCKET = "products";

export default function AdminProductsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setMsg(error.message);
    else setRows((data ?? []) as Row[]);
  }, [supabase]);

  //   useEffect(() => {
  //     supabase.auth.getSession().then(({ data }) => {
  //       if (!data.session) {
  //         router.replace("/admin/login");
  //         return;
  //       }
  //       setReady(true);
  //       load();
  //     });
  //   }, [supabase, router, load]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      const { data: ok } = await supabase.rpc("is_admin");
      if (!ok) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }
      setReady(true);
      load();
    })();
  }, [supabase, router, load]);

  const set =
    (k: keyof Form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm(EMPTY);
    setEditId(null);
    setOldImage(null);
    setFile(null);
    setMsg("");
  };

  const edit = (r: Row) => {
    setEditId(r.id);
    setOldImage(r.image_url);
    setFile(null);
    setForm({
      name: r.name,
      category: r.category,
      description: r.description ?? "",
      price: String(r.price),
      size: r.size ?? "",
      tone: r.tone ?? "#A9CF73",
      sort_order: String(r.sort_order),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setMsg("Name and price are required.");
      return;
    }
    setSaving(true);
    setMsg("");

    let image_url = oldImage;
    if (file) {
      const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
      const path = `${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        setMsg(`Image upload failed: ${upErr.message}`);
        setSaving(false);
        return;
      }
      image_url = supabase.storage.from(BUCKET).getPublicUrl(path)
        .data.publicUrl;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      size: form.size.trim(),
      tone: form.tone,
      sort_order: Number(form.sort_order) || 0,
      image_url,
    };

    const { error } = editId
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    reset();
    load();
  };

  const toggle = async (r: Row) => {
    await supabase
      .from("products")
      .update({ is_active: !r.is_active })
      .eq("id", r.id);
    load();
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete "${r.name}"?`)) return;
    await supabase.from("products").delete().eq("id", r.id);
    if (editId === r.id) reset();
    load();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (!ready) return null;

  const box =
    "rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-brand-red";

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-semibold text-ink">
            products
          </h1>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-brand-red/40 px-5 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red/10"
          >
            Log out
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={save}
          className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-[0_14px_32px_-14px_rgba(20,51,8,0.4)] md:grid-cols-2"
        >
          <h2 className="font-display text-2xl font-semibold text-ink md:col-span-2">
            {editId ? "Edit product" : "Add product"}
          </h2>

          <input
            className={box}
            placeholder="Name"
            value={form.name}
            onChange={set("name")}
          />
          <select
            className={box}
            value={form.category}
            onChange={set("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            className={box}
            placeholder="Price (₹)"
            type="number"
            min="0"
            value={form.price}
            onChange={set("price")}
          />
          <input
            className={box}
            placeholder="Size, e.g. 100 g"
            value={form.size}
            onChange={set("size")}
          />

          <textarea
            className={`${box} md:col-span-2`}
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={set("description")}
          />

          <label className="flex items-center gap-3 text-sm font-semibold text-ink/70">
            Card colour
            <input
              type="color"
              value={form.tone}
              onChange={set("tone")}
              className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>
          <input
            className={box}
            placeholder="Sort order (0 = first)"
            type="number"
            value={form.sort_order}
            onChange={set("sort_order")}
          />

          <div className="md:col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            {editId && oldImage && !file && (
              <p className="mt-1 text-xs text-ink/60">
                Keeping the current image. Pick a file to replace it.
              </p>
            )}
          </div>

          {msg && (
            <p className="text-sm font-semibold text-red-700 md:col-span-2">
              {msg}
            </p>
          )}

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand-red px-7 py-3 font-bold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : editId ? "Update" : "Add product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-ink/20 px-7 py-3 font-bold text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <ul className="mt-10 space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className={`flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ${
                r.is_active ? "" : "opacity-50"
              }`}
            >
              <div
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                style={{ background: r.tone ?? "#A9CF73" }}
              >
                {r.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{r.name}</p>
                <p className="text-sm text-ink/60">
                  {r.category} · {formatINR(Number(r.price))}
                  {r.size ? ` · ${r.size}` : ""}
                </p>
              </div>
              <div className="flex gap-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => edit(r)}
                  className="rounded-full bg-brand-red/10 px-4 py-1.5 text-brand-red"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggle(r)}
                  className="rounded-full bg-ink/10 px-4 py-1.5 text-ink"
                >
                  {r.is_active ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(r)}
                  className="rounded-full bg-red-100 px-4 py-1.5 text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="text-ink/60">
              No products yet. Add your first one above.
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
