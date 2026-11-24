"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import PopBackground from "@/components/ui/PopBackground";
import PlaceholderArt from "@/components/ui/PlaceholderArt";
import {
  CATEGORIES,
  WHATSAPP_NUMBER,
  formatINR,
  type Product,
} from "@/data/shop";

const SOFT_SHADOW = "shadow-[0_14px_32px_-14px_rgba(20,51,8,0.4)]";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) setFailed(true);
        else
          setProducts(
            (data ?? []).map((p) => ({
              id: String(p.id),
              name: p.name,
              category: p.category,
              description: p.description ?? "",
              price: Number(p.price),
              size: p.size ?? "",
              image_url: p.image_url,
              tone: p.tone || "#A9CF73",
            })),
          );
        setLoading(false);
      });
  }, []);

  const visible = useMemo(
    () =>
      cat === "All" ? products : products.filter((p) => p.category === cat),
    [products, cat],
  );

  const items = products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, qty: cart[p.id] }));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const add = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const orderOnWhatsApp = () => {
    const lines = items.map(
      (i) =>
        `- ${i.qty} x ${i.name} (${formatINR(i.price)}) = ${formatINR(i.qty * i.price)}`,
    );
    const msg = [
      "Hi Olivra! I'd like to order:",
      ...lines,
      `Total: ${formatINR(total)}`,
      "",
      "Name:",
      "Delivery address:",
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-cream">
        {/* HERO */}
        <PopBackground variant="blush" className="pb-14 pt-36">
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <p className="inline-block rounded-full bg-brand-red px-4 py-1.5 text-sm font-semibold text-white">
              Shop
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-7xl">
              pick your <span className="italic text-brand-red">bar.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Add to your bag and send the order on WhatsApp. We confirm the
              details and ship it to you.
            </p>
          </div>
        </PopBackground>

        {/* FILTERS */}
        <section className="px-6 pb-40 pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                    cat === c
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-brand-red/30 bg-white text-brand-red hover:bg-brand-red/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    className="h-80 animate-pulse rounded-3xl bg-brand-red/10"
                  />
                ))}
              </div>
            )}

            {!loading && failed && (
              <p className="mt-10 text-ink/70">
                Could not load products right now. Please try again in a moment.
              </p>
            )}

            {!loading && !failed && visible.length === 0 && (
              <p className="mt-10 text-ink/70">
                No products here yet. Check back soon.
              </p>
            )}

            {/* GRID */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, k) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (k % 3) * 0.08 }}
                  className={`overflow-hidden rounded-3xl bg-white ${SOFT_SHADOW}`}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ background: p.tone }}
                  >
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <PlaceholderArt />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-red">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
                        {p.name}
                      </h3>
                      <p className="font-display text-xl font-semibold text-brand-red">
                        {formatINR(p.price)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      {p.description}
                    </p>
                    {p.size && (
                      <p className="mt-2 text-xs font-semibold text-ink/55">
                        {p.size}
                      </p>
                    )}

                    <div className="mt-5">
                      {cart[p.id] ? (
                        <div className="inline-flex items-center gap-4 rounded-full bg-brand-red/10 px-2 py-1.5">
                          <button
                            type="button"
                            aria-label={`Remove one ${p.name}`}
                            onClick={() => dec(p.id)}
                            className="h-8 w-8 rounded-full bg-white text-lg font-bold text-brand-red"
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center font-bold text-ink">
                            {cart[p.id]}
                          </span>
                          <button
                            type="button"
                            aria-label={`Add one more ${p.name}`}
                            onClick={() => add(p.id)}
                            className="h-8 w-8 rounded-full bg-brand-red text-lg font-bold text-white"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => add(p.id)}
                          className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
                        >
                          Add to bag
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CART BAR */}
        <AnimatePresence>
          {count > 0 && !open && (
            <motion.button
              key="bar"
              type="button"
              onClick={() => setOpen(true)}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-brand-red px-7 py-3.5 font-bold text-white shadow-[0_14px_30px_-10px_rgba(20,51,8,0.7)]"
            >
              <span>
                {count} {count === 1 ? "item" : "items"}
              </span>
              <span className="h-4 w-px bg-white/40" />
              <span>{formatINR(total)}</span>
              <span className="text-brand-yellow">View bag</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* CART SHEET */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="bg"
                className="fixed inset-0 z-40 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                key="sheet"
                role="dialog"
                aria-label="Your bag"
                className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    your bag
                  </h2>
                  <button
                    type="button"
                    aria-label="Close bag"
                    onClick={() => setOpen(false)}
                    className="h-9 w-9 rounded-full bg-brand-red/10 text-lg font-bold text-brand-red"
                  >
                    ×
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="mt-6 text-ink/70">Your bag is empty.</p>
                ) : (
                  <ul className="mt-5 divide-y divide-ink/10">
                    {items.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div>
                          <p className="font-semibold text-ink">{i.name}</p>
                          <p className="text-sm text-ink/60">
                            {formatINR(i.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Remove one ${i.name}`}
                            onClick={() => dec(i.id)}
                            className="h-8 w-8 rounded-full bg-brand-red/10 font-bold text-brand-red"
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center font-bold">
                            {i.qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Add one more ${i.name}`}
                            onClick={() => add(i.id)}
                            className="h-8 w-8 rounded-full bg-brand-red font-bold text-white"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                  <span className="font-semibold text-ink/70">Total</span>
                  <span className="font-display text-3xl font-semibold text-brand-red">
                    {formatINR(total)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={orderOnWhatsApp}
                  className="mt-5 w-full rounded-full bg-[#25D366] px-6 py-3.5 font-bold text-white transition hover:brightness-95 disabled:opacity-50"
                >
                  Order on WhatsApp
                </button>
                <p className="mt-3 text-center text-xs text-ink/55">
                  Opens WhatsApp with your order filled in. Add your name and
                  address and hit send.
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
