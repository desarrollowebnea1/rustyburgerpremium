"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse =
  | { ok: true; data: { admin: { id: string; email: string; name: string | null; role: string } } }
  | { ok: false; error: string };

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = (await res.json()) as LoginResponse;

      if (!json.ok) {
        setError(json.error);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border-2 border-rusty-gray/50 bg-rusty-smoke p-8 shadow-brutal">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
          Rusty Burger
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase text-rusty-cream">Panel Admin</h1>
        <p className="mt-2 text-sm text-rusty-cream/60">Ingresá con tu cuenta de administrador.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-rusty-cream/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-rusty-gray/60 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs uppercase tracking-widest text-rusty-cream/70"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-rusty-gray/60 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
            />
          </div>

          {error && (
            <p className="border border-rusty-fire/40 bg-rusty-fire/10 px-3 py-2 text-sm text-rusty-cream">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rusty-orange px-4 py-3 font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
