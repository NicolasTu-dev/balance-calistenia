import { supabaseServer } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const isAuthed = !!userData.user;

  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, description, mp_title, price_cents, currency, duration_days, active")
    .eq("active", true)
    .order("price_cents", { ascending: true });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Tienda</h1>
      <p className="mt-3 text-white/70">
        Membresía mensual con activación automática al acreditarse el pago.
      </p>

      {!isAuthed && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">
            Para comprar necesitás iniciar sesión.
          </p>
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

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(products ?? []).map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            {p.description && <p className="mt-2 text-sm text-white/70">{p.description}</p>}

            <div className="mt-4 text-sm text-white/80">
              <div>
                Precio: <span className="font-semibold">{(p.price_cents ?? 0) / 100} {p.currency ?? "ARS"}</span>
              </div>
              <div>Duración: {p.duration_days ?? 30} días</div>
            </div>

            <form
              action="/api/checkout"
              method="post"
              className="mt-6"
            >
              <input type="hidden" name="productId" value={p.id} />
              <button
                type="submit"
                disabled={!isAuthed}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
              >
                Comprar
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
