import Link from "next/link";
import { CalendarDays, ChevronRight, Lock, MessageSquare } from "lucide-react";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { supabaseServer } from "@/app/lib/supabase/server";

type DbPlan = {
  id: number;
  slug: string;
  title: string;
  admin_note: string | null;
  created_at: string;
  active: boolean;
  owner_user_id: string | null;
};

export default async function PlanificacionesPage() {
  const membership = await requireActiveMembership();

  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Ingresá para ver tus planificaciones</h1>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black
                     bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Ingresar <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const { data: plans, error } = await supabase
    .from("plans")
    .select("id, slug, title, admin_note, created_at, active, owner_user_id")
    .eq("owner_user_id", user.id)
    .order("active", { ascending: false })
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
            Tu coach cargará tu plan personalizado. Vas a poder verlo acá en cuanto esté listo.
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
              {count} {count === 1 ? "plan" : "planes"}
            </span>
          </div>
        </div>

        {/* Contact box if no plans */}
        {count === 0 && (
          <div className="w-full md:w-auto">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 max-w-xs">
              <p className="text-sm font-semibold">¿Todavía no tenés tu plan?</p>
              <p className="mt-1 text-xs text-white/60">
                Contactá a tu coach por WhatsApp para que cargue tu planificación personalizada.
              </p>
              <a
                href="https://wa.me/5491157541046"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full justify-center items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-black
                           bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {count === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-lg font-semibold">Todavía no tenés ningún plan cargado</h2>
          <p className="mt-2 text-sm text-white/70">
            Tu coach preparará y cargará tu planificación personalizada. Cuando esté lista, la vas a ver acá.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans!.map((p) => {
            const locked = lockedAll;

            return (
              <div
                key={p.id}
                className={`rounded-3xl border overflow-hidden transition ${
                  p.active
                    ? "border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/8"
                    : "border-white/10 bg-white/5 hover:bg-white/7"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {p.active && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-300 mb-2">
                          ● Plan actual
                        </span>
                      )}
                      <div className="font-semibold text-lg leading-tight">{p.title}</div>
                      <div className="mt-1 text-xs text-white/40">
                        {new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>

                    <span className={`shrink-0 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                      p.active
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                        : "border-white/10 bg-black/20 text-white/40"
                    }`}>
                      {p.active ? "Activo" : "Anterior"}
                    </span>
                  </div>

                  {/* Admin note */}
                  {p.admin_note && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                      <MessageSquare className="h-3.5 w-3.5 text-white/40 mt-0.5 shrink-0" />
                      <p className="text-xs text-white/70 leading-relaxed">{p.admin_note}</p>
                    </div>
                  )}

                  {locked && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/50">
                        <Lock className="h-3 w-3" />
                        Requiere membresía
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                <div className="p-5 flex items-center justify-between">
                  <div className="text-xs text-white/40">
                    {locked ? "Activá tu membresía para ver el plan" : p.active ? "Tu plan de este mes" : "Plan anterior"}
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
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black
                                 bg-linear-to-r hover:opacity-90 transition ${
                                   p.active
                                     ? "from-emerald-300 via-cyan-300 to-sky-300"
                                     : "from-white/60 to-white/40"
                                 }`}
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
