"use client";

import { useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, inputClass, labelClass } from "@/components/admin/admin-ui";

type SettingsForm = {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  instagram: string;
  address: string;
  hours: string;
  deliveryActive: boolean;
  takeawayActive: boolean;
  deliveryFee: string;
  minimumOrder: string;
  topMessage: string;
  ifoodUrl: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY: SettingsForm = {
  businessName: "",
  phone: "",
  whatsappNumber: "",
  instagram: "",
  address: "",
  hours: "",
  deliveryActive: true,
  takeawayActive: true,
  deliveryFee: "0",
  minimumOrder: "0",
  topMessage: "",
  ifoodUrl: "",
  seoTitle: "",
  seoDescription: "",
};

function str(val: unknown): string {
  if (val == null) return "";
  return String(val);
}

function bool(val: unknown, fallback: boolean): boolean {
  if (typeof val === "boolean") return val;
  return fallback;
}

export function AdminSettingsClient() {
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const json = (await res.json()) as {
          ok: boolean;
          error?: string;
          data?: { settings: Record<string, unknown> };
        };
        if (!json.ok || !json.data) {
          setError(json.error ?? "Error al cargar configuración.");
          return;
        }
        const s = json.data.settings;
        setForm({
          businessName: str(s.businessName),
          phone: str(s.phone),
          whatsappNumber: str(s.whatsappNumber),
          instagram: str(s.instagram),
          address: str(s.address),
          hours: str(s.hours),
          deliveryActive: bool(s.deliveryActive, true),
          takeawayActive: bool(s.takeawayActive, true),
          deliveryFee: str(s.deliveryFee !== undefined ? s.deliveryFee : "0"),
          minimumOrder: str(s.minimumOrder !== undefined ? s.minimumOrder : "0"),
          topMessage: str(s.topMessage),
          ifoodUrl: str(s.ifoodUrl),
          seoTitle: str(s.seoTitle),
          seoDescription: str(s.seoDescription),
        });
      } catch {
        setError("No se pudo cargar la configuración.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const body = {
      businessName: form.businessName,
      phone: form.phone,
      whatsappNumber: form.whatsappNumber,
      instagram: form.instagram,
      address: form.address,
      hours: form.hours,
      deliveryActive: form.deliveryActive,
      takeawayActive: form.takeawayActive,
      deliveryFee: parseFloat(form.deliveryFee) || 0,
      minimumOrder: parseFloat(form.minimumOrder) || 0,
      topMessage: form.topMessage,
      ifoodUrl: form.ifoodUrl,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "No se pudo guardar la configuración.");
        return;
      }
      setSuccess("Configuración guardada correctamente.");
    } catch {
      setError("No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-rusty-cream/50">Cargando configuración…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl uppercase text-rusty-cream">Configuración</h1>
        <p className="mt-2 text-sm text-rusty-cream/60">
          Datos del negocio, contacto, delivery y SEO.
        </p>
      </div>

      {error && (
        <div className="mt-6">
          <AdminAlert type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="mt-6">
          <AdminAlert type="success" message={success} onDismiss={() => setSuccess(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-10">
        <section>
          <h2 className="font-display text-lg uppercase text-rusty-orange">Datos del negocio</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre del negocio</label>
              <input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Dirección</label>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Horarios</label>
              <input
                value={form.hours}
                onChange={(e) => update("hours", e.target.value)}
                className={inputClass}
                placeholder="Lun–Dom 18:00–00:00"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg uppercase text-rusty-orange">Contacto y redes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp (número)</label>
              <input
                value={form.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                className={inputClass}
                placeholder="@rusty_burgers_"
              />
            </div>
            <div>
              <label className={labelClass}>iFood URL</label>
              <input
                value={form.ifoodUrl}
                onChange={(e) => update("ifoodUrl", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg uppercase text-rusty-orange">Delivery / retiro</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
              <input
                type="checkbox"
                checked={form.deliveryActive}
                onChange={(e) => update("deliveryActive", e.target.checked)}
              />
              Delivery activo
            </label>
            <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
              <input
                type="checkbox"
                checked={form.takeawayActive}
                onChange={(e) => update("takeawayActive", e.target.checked)}
              />
              Retiro activo
            </label>
            <div>
              <label className={labelClass}>Costo delivery</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.deliveryFee}
                onChange={(e) => update("deliveryFee", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pedido mínimo</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.minimumOrder}
                onChange={(e) => update("minimumOrder", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg uppercase text-rusty-orange">SEO</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelClass}>Título SEO</label>
              <input
                value={form.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Descripción SEO</label>
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg uppercase text-rusty-orange">Mensaje superior</h2>
          <div className="mt-4">
            <label className={labelClass}>Top message</label>
            <input
              value={form.topMessage}
              onChange={(e) => update("topMessage", e.target.value)}
              className={inputClass}
              placeholder="Feast Mode On"
            />
          </div>
        </section>

        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Guardando…" : "Guardar configuración"}
        </button>
      </form>
    </AdminShell>
  );
}
