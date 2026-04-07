import { supabaseAdmin } from "@/app/lib/supabase/admin";
import ProductCard, { type Product } from "./components/ProductCard";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { WA_CONTACT_URL } from "@/app/lib/config";

export const metadata = {
  title: "Tienda — Balance Calistenia",
  description: "Merch oficial de Balance Calistenia. Remeras y shorts.",
};

export const dynamic = "force-dynamic";

type DbProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  badge: string | null;
  colors: { label: string; image: string }[];
  sizes: string[];
  extra_images: string[];
};

async function getActiveProducts(): Promise<Product[]> {
  const { data } = await supabaseAdmin()
    .from("shop_products")
    .select("id,name,description,price,original_price,badge,colors,sizes,extra_images")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!data) return [];

  return (data as DbProduct[]).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    badge: row.badge ?? undefined,
    colors: row.colors,
    sizes: row.sizes,
    extraImages: row.extra_images,
  }));
}

export default async function TiendaPage() {
  const products = await getActiveProducts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 space-y-16">

      {/* Hero */}
      <section className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden px-8 py-14 md:px-14 md:py-18">
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/50 uppercase mb-5">
              <ShoppingBag className="h-3 w-3" /> Merch oficial
            </span>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Tienda{" "}
              <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                Balance.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-white/55 leading-relaxed">
              Indumentaria oficial de Balance Calistenia. Talles y envíos se coordinan por WhatsApp tras consultar disponibilidad.
            </p>
          </div>
          <a
            href={WA_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
          >
            Consultar por WhatsApp <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Productos */}
      <section>
        {products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 text-white/20 mx-auto" />
            <p className="text-white/40 text-lg font-semibold">No hay productos disponibles por el momento.</p>
            <p className="text-sm text-white/30">Próximamente nuevos lanzamientos.</p>
            <a
              href={WA_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-1">Disponible ahora</p>
                <h2 className="text-2xl font-bold">
                  {products.length} {products.length === 1 ? "producto" : "productos"}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Info strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Envío a todo el país", desc: "Coordinamos el envío por WhatsApp una vez confirmado el pedido." },
          { title: "Calidad garantizada", desc: "Materiales seleccionados. Si no estás conforme, lo resolvemos." },
          { title: "Stock limitado", desc: "Cada lanzamiento es en cantidades limitadas. Consultá disponibilidad." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
            <p className="font-semibold text-sm">{item.title}</p>
            <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer note */}
      <p className="text-center text-sm text-white/25">
        Los precios están en pesos argentinos (ARS). El envío se coordina por mensaje.
      </p>

    </main>
  );
}
