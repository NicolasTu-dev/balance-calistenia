import ProductCard, { type Product } from "./components/ProductCard";

const PRODUCTS: Product[] = [
  {
    id: "remera-dragon",
    name: "Remera Balance Dragon",
    description:
      "Remera oversize premium. Frente con logo Balance 我慢, espalda con diseño dragon. 100% algodón.",
    price: 18000,
    badge: "Más vendida",
    colors: [
      { label: "Negra", image: "/shop/remeraAdelante.jpeg" },
      { label: "Blanca", image: "/shop/remeras.jpeg" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    extraImages: ["/shop/remeraAtras.jpeg"],
  },
  {
    id: "short-training",
    name: "Short Balance Training",
    description:
      "Short deportivo liviano con logo Balance Calisthenics. Ideal para entrenamiento o uso casual.",
    price: 14000,
    colors: [{ label: "Negro", image: "/shop/short.jpeg" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "combo-remera-short",
    name: "Combo Remera + Short",
    description:
      "Remera Dragon + Short Training. El pack completo con descuento. Coordinás talle y color por mensaje.",
    price: 27000,
    originalPrice: 32000,
    badge: "Ahorrás $5.000",
    colors: [
      { label: "Blanca / Negro", image: "/shop/comboRemera-Short.jpeg" },
      { label: "Negra / Negro", image: "/shop/remeraAtras.jpeg" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];

export default function TiendaPage() {
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-center text-sm text-white/30">
        Los precios están en pesos argentinos (ARS). El envío se coordina por mensaje.
      </p>
    </main>
  );
}
