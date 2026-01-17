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

const CATEGORY_LABEL: Record<string, string> = {
  personalizada: "Personalizada (presencial o virtual)",
  recreativa: "Recreativa",
  competitiva: "Competitiva",
  adultos: "Adultos mayores",
  otros: "Otros",
};

function formatMoney(cents: number | null | undefined, currency?: string | null) {
  const amount = ((cents ?? 0) / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${amount} ${currency ?? "ARS"}`;
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
    .eq("product_type", "service")
    .order("category", { ascending: true })
    .order("duration_days", { ascending: true })
    .order("price_cents", { ascending: true });

  const products = (data ?? []) as Product[];

  const groups = products.reduce<Record<string, Product[]>>((acc, p) => {
    const key = (p.category ?? "otros").toLowerCase();
    acc[key] = acc[key] ?? [];
    acc[key].push(p);
    return acc;
  }, {});

  const orderedCategoryKeys = ["personalizada", "recreativa", "competitiva", "adultos", "otros"].filter(
    (k) => groups[k]?.length
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Tienda</h1>
      <p className="mt-3 text-white/70">
        Elegí un servicio y duración. La activación es automática al acreditarse el pago.
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

      <div className="mt-10 space-y-10">
        {orderedCategoryKeys.map((key) => (
          <section key={key}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">{CATEGORY_LABEL[key] ?? key}</h2>
                <p className="mt-1 text-sm text-white/60">
                  Packs de 1/3/6/9/12 meses con descuentos según duración.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groups[key].map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold">{p.name}</h3>

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
                    <p className="mt-3 text-xs text-white/50">
                      Iniciá sesión para comprar.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
