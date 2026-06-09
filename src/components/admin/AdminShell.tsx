"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminInfo = { id: string; email: string; name: string | null; role: string };

type MeResponse =
  | { ok: true; data: { admin: AdminInfo } }
  | { ok: false; error: string };

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/promos", label: "Promos" },
  { href: "/admin/imagenes", label: "Imágenes" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const json = (await res.json()) as MeResponse;
        if (!json.ok) {
          router.replace("/admin/login");
          return;
        }
        setAdmin(json.data.admin);
      } catch {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-rusty-cream/60">Cargando panel…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-rusty-gray/40 bg-rusty-smoke">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.35em] text-rusty-orange">
              Rusty Burger Admin
            </p>
            {admin && (
              <p className="text-xs text-rusty-cream/50">
                {admin.name ?? admin.email}
              </p>
            )}
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 font-display text-xs uppercase tracking-wider ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-rusty-orange text-rusty-carbon"
                    : "text-rusty-cream/70 hover:text-rusty-orange"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="px-3 py-2 font-display text-xs uppercase tracking-wider text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
            >
              {logoutLoading ? "…" : "Salir"}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
