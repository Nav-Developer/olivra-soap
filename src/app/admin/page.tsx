import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: menuCount }, { count: enquiryCount }, { data: latest }] =
    await Promise.all([
      supabase.from("menu_items").select("*", { count: "exact", head: true }),
      supabase.from("enquiries").select("*", { count: "exact", head: true }),
      supabase
        .from("enquiries")
        .select("item_name, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-ink/70">
        Everything on the website is managed from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/menu"
          className="rounded-[2rem] bg-white p-6 shadow-[0_14px_32px_-16px_rgba(122,23,18,0.45)]"
        >
          <p className="font-display text-5xl font-semibold">
            {menuCount ?? 0}
          </p>
          <p className="mt-1 font-bold">Menu items</p>
          <p className="text-sm text-ink/60">Add, edit or hide items →</p>
        </Link>
        <Link
          href="/admin/enquiries"
          className="rounded-[2rem] bg-white p-6 shadow-[0_14px_32px_-16px_rgba(122,23,18,0.45)]"
        >
          <p className="font-display text-5xl font-semibold">
            {enquiryCount ?? 0}
          </p>
          <p className="mt-1 font-bold">Enquiries</p>
          <p className="text-sm text-ink/60">See what visitors asked for →</p>
        </Link>
      </div>

      <h2 className="mt-10 text-xl font-bold">Latest enquiries</h2>
      {latest?.length ? (
        <ul className="mt-4 space-y-2">
          {latest.map((e, i) => (
            <li
              key={i}
              className="rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_8px_20px_-14px_rgba(122,23,18,0.5)]"
            >
              <strong>{e.item_name ?? "General enquiry"}</strong> — {e.subject}
              <span className="block text-xs text-ink/60">
                {new Date(e.created_at).toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-ink/60">No enquiries yet.</p>
      )}
    </div>
  );
}
