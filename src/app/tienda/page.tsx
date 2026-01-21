import { supabaseServer } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  mp_title: string | null;
  price_cents: number | null;
  currency: string | null;
  duration_days: number | null;
  active: boolean;
  category: string | null;
  product_type: string | null;
};

const SERVICE_CATEGORY_LABEL: Record<string, string> = {
  personalizada: "Personalizada (presencial o virtual)",
  recreativa: "Recreativa",
  competitiva: "Competitiva",
  adultos: "Adultos mayores",
  otros: "Otros",
};

const MERCH_CATEGORY_LABEL: Record<string, string> = {
  ropa: "Ropa",
  suplementos: "Suplementos",
  equipamiento: "Equipamiento",
  otros: "Otros",
};

function formatMoney(cents: number | null | undefined, currency?: string | null) {
  const amount = ((cents ?? 0) / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${amount} ${currency ?? "ARS"}`;
}

function groupByCategory(items: Product[]) {
  return items.reduce<Record<string, Product[]>>((acc, p) => {
    const key = (p.category ?? "otros").toLowerCase();
    acc[key] = acc[key] ?? [];
    acc[key].push(p);
    return acc;
  }, {});
}

export default async function TiendaPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const isAuthed = !!userData.user;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, mp_title, price_cents, currency, duration_days, active, category, product_type"
    )
    .eq("active", true)
    .in("product_type", ["service", "merch"])
    .order("product_type", { ascending: true })
    .order("category", { ascending: true })
    .order("duration_days", { ascending: true })
    .order("price_cents", { ascending: true });

  const products = (data ?? []) as Product[];

  const services = products.filter((p) => (p.product_type ?? "service") === "service");
  const merch = products.filter((p) => p.product_type === "merch");

  // Servicios: categorías esperadas (y si hay otras, caen en "otros")
  const serviceGroups = groupByCategory(services);
  const orderedServiceKeys = ["personalizada", "recreativa", "competitiva", "adultos", "otros"].filter(
    (k) => serviceGroups[k]?.length
  );

  // Merch: categorías típicas (ropa/suplementos/equipamiento) + otros
  const merchGroups = groupByCategory(merch);
  const orderedMerchKeys = ["ropa", "suplementos", "equipamiento", "otros"].filter(
    (k) => merchGroups[k]?.length
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Tienda</h1>
      <p className="mt-3 text-white/70">
        Elegí un servicio o producto. La activación es automática al acreditarse el pago.
      </p>

      {!isAuthed && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">Para comprar necesitás iniciar sesión.</p>
          <a
            href="/login?next=/tienda"
            className="mt-3 inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Ir a login
          </a>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-sm text-white/80">Error cargando productos: {error.message}</p>
        </div>
      )}

      {!error && products.length === 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          Todavía no hay productos activos cargados.
        </div>
      )}

      {/* =========================
          SERVICIOS
         ========================= */}
      {services.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Servicios</h2>
          <p className="mt-1 text-sm text-white/60">
            Packs de 1/3/6/9/12 meses con descuentos según duración.
          </p>

          <div className="mt-8 space-y-10">
            {orderedServiceKeys.map((key) => (
              <section key={key}>
                <h3 className="text-xl font-semibold">
                  {SERVICE_CATEGORY_LABEL[key] ?? key}
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {serviceGroups[key].map((p) => (
                    <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h4 className="text-lg font-semibold">{p.name}</h4>

                      {p.description && (
                        <p className="mt-2 text-sm text-white/70">{p.description}</p>
                      )}

                      <div className="mt-4 text-sm text-white/80">
                        <div>
                          Precio:{" "}
                          <span className="font-semibold">
                            {formatMoney(p.price_cents, p.currency)}
                          </span>
                        </div>
                        <div>Duración: {p.duration_days ?? 30} días</div>
                      </div>

                      <form action="/api/checkout" method="post" className="mt-6">
                        <input type="hidden" name="productId" value={p.id} />
                        <button
                          type="submit"
                          disabled={!isAuthed}
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
                        >
                          Comprar
                        </button>
                      </form>

                      {!isAuthed && (
                        <p className="mt-3 text-xs text-white/50">Iniciá sesión para comprar.</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {/* =========================
          MERCH
         ========================= */}
      {merch.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold">Merch</h2>
          <p className="mt-1 text-sm text-white/60">
            Indumentaria, suplementos y equipamiento. (v1: coordinación de talle/envío por mensaje).
          </p>

          <div className="mt-8 space-y-10">
            {orderedMerchKeys.map((key) => (
              <section key={key}>
                <h3 className="text-xl font-semibold">
                  {MERCH_CATEGORY_LABEL[key] ?? key}
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {merchGroups[key].map((p) => (
                    <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h4 className="text-lg font-semibold">{p.name}</h4>

                      {p.description && (
                        <p className="mt-2 text-sm text-white/70">{p.description}</p>
                      )}

                      <div className="mt-4 text-sm text-white/80">
                        <div>
                          Precio:{" "}
                          <span className="font-semibold">
                            {formatMoney(p.price_cents, p.currency)}
                          </span>
                        </div>
                      </div>

                      <form action="/api/checkout" method="post" className="mt-6">
                        <input type="hidden" name="productId" value={p.id} />
                        <button
                          type="submit"
                          disabled={!isAuthed}
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
                        >
                          Comprar
                        </button>
                      </form>

                      {!isAuthed && (
                        <p className="mt-3 text-xs text-white/50">Iniciá sesión para comprar.</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
