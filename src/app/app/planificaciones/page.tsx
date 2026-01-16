import Link from "next/link";
import { CalendarDays, ChevronRight, UploadCloud, Lock } from "lucide-react";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { supabaseServer } from "@/app/lib/supabase/server";

type DbPlan = {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  active: boolean;
  owner_user_id: string | null;
};

function badgeFromTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("descenso")) return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
  if (t.includes("skills")) return "border-sky-300/30 bg-sky-300/10 text-sky-200";
  if (t.includes("estética") || t.includes("estetica") || t.includes("volumen"))
    return "border-white/10 bg-white/5 text-white/70";
  return "border-white/10 bg-white/5 text-white/70";
}

function objectiveLabel(title: string) {
  const t = title.toLowerCase();
  if (t.includes("descenso")) return "Descenso de peso";
  if (t.includes("skills")) return "Skills & Control";
  if (t.includes("estética") || t.includes("estetica") || t.includes("volumen")) return "Estética & Volumen";
  return "Plan mensual";
}

export default async function PlanificacionesPage() {
  const membership = await requireActiveMembership();

  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  // Si no hay sesión, redirigimos a login (o podés mostrar pantalla)
  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Ingresá para ver tus planificaciones</h1>
        <p className="mt-2 text-sm text-white/70">
          Necesitás iniciar sesión para acceder a tu panel.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black
                     bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Ingresar <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Traemos planes del usuario (importados)
  const { data: plans, error } = await supabase
    .from("plans")
    .select("id, slug, title, created_at, active, owner_user_id")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<DbPlan[]>();

  if (error) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Error cargando tus planes</h1>
        <p className="mt-2 text-sm text-white/70">{error.message}</p>
      </div>
    );
  }

  const count = plans?.length ?? 0;
  const lockedAll = !membership.ok;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <p className="text-sm text-white/60">Planificaciones</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Tus planes</h1>
          <p className="mt-2 text-white/70 max-w-2xl text-sm">
            Subí tu XLSX para que se cargue automáticamente tu planificación.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {membership.ok ? (
              <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
                Acceso activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
                <Lock className="h-4 w-4" />
                Sin membresía activa
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
              <CalendarDays className="h-4 w-4" />
              {count} planes importados
            </span>
          </div>
        </div>

        {/* Import box (UI) */}
        <div className="w-full md:w-auto">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UploadCloud className="h-4 w-4 text-emerald-200" />
              Importar XLSX
            </div>
            <p className="mt-2 text-xs text-white/60 max-w-xs">
              Subí el archivo exportado desde Google Sheets (.xlsx). Se guarda en tu cuenta.
            </p>

            {/* Si todavía no conectaste el botón real, te lo conecto con un componente client */}
            <Link
              href="/app/planificaciones/import"
              className="mt-3 inline-flex w-full justify-center rounded-xl px-4 py-2 text-sm font-semibold text-black
                         bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
            >
              Ir a importar
            </Link>

            {!membership.ok && (
              <Link
                href="/tienda"
                className="mt-3 inline-flex w-full justify-center rounded-xl px-4 py-2 text-sm font-semibold
                           bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Activar membresía
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {count === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-lg font-semibold">Todavía no importaste ningún plan</h2>
          <p className="mt-2 text-sm text-white/70">
            Exportá tu Google Sheet como <b>.xlsx</b>, subilo y lo vas a ver acá automáticamente.
          </p>
          <div className="mt-5 flex gap-3 flex-col sm:flex-row">
            <Link
              href="/app/planificaciones/import"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-black
                         bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
            >
              Importar ahora <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans!.map((p) => {
            const locked = lockedAll; // en V1: si no hay membresía, bloqueamos acceso
            const objective = objectiveLabel(p.title);

            return (
              <div
                key={p.id}
                className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/7 transition"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/60">Plan mensual</div>
                      <div className="mt-1 font-semibold text-lg">{p.title}</div>
                      <div className="mt-2 text-xs text-white/55">
                        Importado: {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeFromTitle(
                          p.title
                        )}`}
                      >
                        {objective}
                      </span>
                      <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                        4 semanas
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                      Tu plan
                    </span>

                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                        <Lock className="h-3.5 w-3.5" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="p-5 flex items-center justify-between">
                  <div className="text-xs text-white/55">
                    {locked ? "Requiere membresía activa" : "Listo para ver"}
                  </div>

                  {locked ? (
                    <Link
                      href="/tienda"
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold
                                 bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    >
                      Activar <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/app/planificaciones/${p.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black
                                 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
                    >
                      Ver plan <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
