"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-[0_14px_32px_-16px_rgba(122,23,18,0.45)]"
      >
        <h1 className="font-display text-3xl font-semibold">Admin login</h1>
        <p className="mt-1 text-sm text-ink/60">
          Only the cafe admin can sign in here.
        </p>

        <label className="mt-6 block text-sm font-bold">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 focus:border-brand-red focus:outline-none"
        />

        <label className="mt-4 block text-sm font-bold">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 focus:border-brand-red focus:outline-none"
        />

        {error && (
          <p className="mt-3 text-sm font-semibold text-brand-red">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-brand-red py-3 font-bold text-white transition hover:bg-brand-red-dark disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
