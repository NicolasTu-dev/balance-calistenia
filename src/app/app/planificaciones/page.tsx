import Link from "next/link";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { CalendarDays, ChevronRight, Filter, Lock } from "lucide-react";

type PlanCard = {
  slug: string;
  title: string;
  objective: "Descenso de peso" | "Skills & Control" | "Estética & Volumen";
  level: "Inicial" | "Intermedio" | "Avanzado";
  included: boolean;
  months: string;
};

const PLANS: PlanCard[] = [
  {
    slug: "mes-6",
    title: "Sexto mes — Descenso de peso",
    objective: "Descenso de peso",
    level: "Intermedio",
    included: true,
    months: "4 semanas",
  },
  {
    slug: "mes-7",
    title: "Séptimo mes — Skills & Control",
    objective: "Skills & Control",
    level: "Intermedio",
    included: false,
    months: "4 semanas",
  },
  {
    slug: "mes-8",
    title: "Octavo mes — Estética & Volumen",
    objective: "Estética & Volumen",
    level: "Avanzado",
    included: false,
    months: "4 semanas",
  },
];

function badgeObjective(obj: PlanCard["objective"]) {
  if (obj === "Descenso de peso") return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
  if (obj === "Skills & Control") return "border-sky-300/30 bg-sky-300/10 text-sky-200";
  return "border-white/10 bg-white/5 text-white/70";
}

export default async function PlanificacionesPage() {
  const membership = await requireActiveMembership();

  return (
    <div className="space-y-6">
      {/* Header interno */}
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <p className="text-sm text-white/60">Planificaciones</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Tus planes</h1>
          <p className="mt-2 text-white/70 max-w-2xl text-sm">
            Importá tu XLSX o seleccioná una planificación disponible.
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
              {PLANS.length} planes
            </span>
          </div>
        </div>

        {/* Filters demo */}
        <div className="w-full md:w-auto">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-emerald-200" />
              Filtros (demo)
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40">
                <option>Objetivo: Todos</option>
                <option>Descenso de peso</option>
                <option>Skills & Control</option>
                <option>Estética & Volumen</option>
              </select>
              <select className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40">
                <option>Nivel: Todos</option>
                <option>Inicial</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </div>

            {!membership.ok && (
              <Link
                href="/tienda"
                className="mt-3 inline-flex w-full justify-center rounded-xl px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
              >
                Activar membresía
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const locked = !membership.ok && !p.included;

          return (
            <div
              key={p.slug}
              className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/7 transition"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/60">Plan mensual</div>
                    <div className="mt-1 font-semibold text-lg">{p.title}</div>
                    <div className="mt-2 text-sm text-white/65">{p.months}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeObjective(p.objective)}`}>
                      {p.objective}
                    </span>
                    <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                      Nivel: {p.level}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {p.included ? (
                    <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                      Incluido
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      Premium
                    </span>
                  )}

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
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    Activar <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/app/planificaciones/${p.slug}`}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
                  >
                    Ver plan <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
