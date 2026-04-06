import { supabaseAdmin } from "@/app/lib/supabase/admin";
import ProductCard, { type Product } from "./components/ProductCard";

export const metadata = {
  title: "Tienda",
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
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-emerald-400 tracking-widest uppercase mb-3">
          Balance Calisthenics
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Tienda</h1>
        <p className="mt-3 text-white/60 max-w-lg">
          Indumentaria oficial de Balance Calisthenics. Talles y envíos se coordinan por
          WhatsApp tras consultar.
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/50">No hay productos disponibles por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="mt-12 text-center text-sm text-white/30">
        Los precios están en pesos argentinos (ARS). El envío se coordina por mensaje.
      </p>
    </main>
  );
}
