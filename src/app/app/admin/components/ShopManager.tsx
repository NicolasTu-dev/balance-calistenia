"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

type Color = { label: string; image: string };

type DbProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  badge: string | null;
  colors: Color[];
  sizes: string[];
  extra_images: string[];
  active: boolean;
  sort_order: number;
};

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  original_price: string;
  badge: string;
  sizes: string[];
  colors: Color[];
  extra_images: string[];
  active: boolean;
  sort_order: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  original_price: "",
  badge: "",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [{ label: "", image: "" }],
  extra_images: [],
  active: true,
  sort_order: "0",
};

export default function ShopManager() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const colorFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const extraFileRef = useRef<HTMLInputElement | null>(null);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/shop");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  async function uploadImage(file: File): Promise<string | null> {
    setUploadError(null);
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("La imagen no puede superar 8MB.");
      return null;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Solo se permiten archivos de imagen.");
      return null;
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/shop/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      setUploadError(`Error al subir: ${errData?.error ?? res.status}`);
      return null;
    }
    const { url } = await res.json();
    return url as string;
  }

  async function handleColorImageChange(index: number, file: File) {
    setUploadingIndex(index);
    const url = await uploadImage(file);
    setUploadingIndex(null);
    if (!url || !form) return;
    const updated = [...form.colors];
    updated[index] = { ...updated[index], image: url };
    setForm({ ...form, colors: updated });
  }

  async function handleExtraImageChange(file: File) {
    setUploadingExtra(true);
    const url = await uploadImage(file);
    setUploadingExtra(false);
    if (!url || !form) return;
    setForm({ ...form, extra_images: [...form.extra_images, url] });
  }

  function toggleSize(size: string) {
    if (!form) return;
    const has = form.sizes.includes(size);
    setForm({ ...form, sizes: has ? form.sizes.filter((s) => s !== size) : [...form.sizes, size] });
  }

  function addColor() {
    if (!form) return;
    setForm({ ...form, colors: [...form.colors, { label: "", image: "" }] });
  }

  function removeColor(i: number) {
    if (!form) return;
    setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) });
  }

  function removeExtraImage(i: number) {
    if (!form) return;
    setForm({ ...form, extra_images: form.extra_images.filter((_, idx) => idx !== i) });
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      badge: form.badge.trim() || null,
      colors: form.colors.filter((c) => c.label.trim()),
      sizes: form.sizes,
      extra_images: form.extra_images,
      active: form.active,
      sort_order: Number(form.sort_order ?? 0),
    };
    const isEdit = !!form.id;
    const res = await fetch(
      isEdit ? `/api/admin/shop/${form.id}` : "/api/admin/shop",
      { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );
    setSaving(false);
    if (res.ok) { setForm(null); fetchProducts(); }
  }

  async function handleToggleActive(product: DbProduct) {
    await fetch(`/api/admin/shop/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    fetchProducts();
  }

  async function handleDelete(product: DbProduct) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/shop/${product.id}`, { method: "DELETE" });
    fetchProducts();
  }

  if (form !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{form.id ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={() => setForm(null)} className="text-sm text-white/50 hover:text-white">
            ← Volver
          </button>
        </div>

        <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/5 p-6">
          {/* Nombre */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Nombre del producto *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Remera Balance Dragon"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describí el producto..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Precio (ARS) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="18000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Precio original (para tachado)</label>
              <input
                type="number"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                placeholder="22000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Badge (ej: "Más vendida", "Ahorrás $5.000")</label>
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="Opcional"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Talles */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Talles disponibles</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`h-9 w-9 rounded-xl text-xs font-medium border transition-all ${
                    form.sizes.includes(s)
                      ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Upload error */}
          {uploadError && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs text-red-300 flex items-center justify-between">
              <span>{uploadError}</span>
              <button type="button" onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-300 ml-3">✕</button>
            </div>
          )}

          {/* Colores con imágenes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">Colores (con foto por color)</label>
              <button type="button" onClick={addColor} className="text-xs text-emerald-400 hover:text-emerald-300">
                + Agregar color
              </button>
            </div>
            <div className="space-y-3">
              {form.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  {/* Preview */}
                  <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
                    {color.image ? (
                      <Image src={color.image} alt={color.label} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-white/20 text-xs">foto</span>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <input
                    value={color.label}
                    onChange={(e) => {
                      const updated = [...form.colors];
                      updated[i] = { ...updated[i], label: e.target.value };
                      setForm({ ...form, colors: updated });
                    }}
                    placeholder="Ej: Negra"
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />

                  {/* Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { colorFileRefs.current[i] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleColorImageChange(i, file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => colorFileRefs.current[i]?.click()}
                    disabled={uploadingIndex === i}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-50"
                  >
                    {uploadingIndex === i ? "Subiendo…" : "Subir foto"}
                  </button>

                  {/* Remove */}
                  {form.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="shrink-0 text-white/30 hover:text-red-400 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fotos extra (frente/espalda) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">Fotos adicionales (ej: espalda)</label>
              <div className="flex items-center gap-2">
                {uploadingExtra && <span className="text-xs text-white/40">Subiendo…</span>}
                <input
                  type="file"
                  accept="image/*"
                  ref={extraFileRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleExtraImageChange(file);
                    if (extraFileRef.current) extraFileRef.current.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => extraFileRef.current?.click()}
                  disabled={uploadingExtra}
                  className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                >
                  + Agregar foto
                </button>
              </div>
            </div>
            {form.extra_images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.extra_images.map((url, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden group">
                    <Image src={url} alt={`extra ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(i)}
                      className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opciones */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-white/70">{form.active ? "Visible en tienda" : "Oculto en tienda"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.price}
            className="rounded-xl bg-linear-to-r from-emerald-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : form.id ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            onClick={() => setForm(null)}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">{products.length} producto{products.length !== 1 ? "s" : ""} en total</p>
        </div>
        <button
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="rounded-xl bg-linear-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-white/40 py-8 text-center">Cargando productos…</div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50 text-sm">No hay productos todavía.</p>
          <button
            onClick={() => setForm({ ...EMPTY_FORM })}
            className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
          >
            Crear el primero →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                product.active ? "border-white/10 bg-white/5" : "border-white/5 bg-white/2 opacity-60"
              }`}
            >
              {/* Foto */}
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white/10">
                {product.colors[0]?.image ? (
                  <Image
                    src={product.colors[0].image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-white/20 text-xs">sin foto</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  {product.badge && (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
                      {product.badge}
                    </span>
                  )}
                  {!product.active && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/40">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50 mt-0.5">
                  ${product.price.toLocaleString("es-AR")} ARS
                  {product.original_price && (
                    <span className="ml-1 text-white/30 line-through text-xs">
                      ${product.original_price.toLocaleString("es-AR")}
                    </span>
                  )}
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  {product.colors.length} color{product.colors.length !== 1 ? "es" : ""} · Talles: {product.sizes.join(", ") || "—"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    product.active
                      ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                      : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
                  }`}
                >
                  {product.active ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  onClick={() =>
                    setForm({
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: String(product.price),
                      original_price: String(product.original_price ?? ""),
                      badge: product.badge ?? "",
                      sizes: product.sizes,
                      colors: product.colors,
                      extra_images: product.extra_images,
                      active: product.active,
                      sort_order: String(product.sort_order),
                    })
                  }
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="rounded-lg border border-red-400/20 text-red-400/70 px-3 py-1.5 text-xs hover:bg-red-400/10 hover:text-red-400"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
