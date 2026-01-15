import Link from "next/link";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { ArrowLeft, Dumbbell, PlayCircle } from "lucide-react";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;
type Day = (typeof DAYS)[number];

type BlockType = "BASICOS" | "SKILLS";
type Week = { name: string; blocks: Partial<Record<Day, BlockType>> };

const plan = {
  title: "Sexto mes — Descenso de peso",
  meta: {
    objective: "Descenso de peso",
    focus: ["Fuerza", "Movilidad", "Skills"],
    level: "Intermedio",
  },
  weeks: [
    { name: "Semana 1", blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" } },
    { name: "Semana 2", blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" } },
    { name: "Semana 3", blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" } },
    { name: "Semana 4", blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" } },
  ] as Week[],
  exercises: [
    { name: "Dominadas prono", sets: "5×2", notes: "Controladas, técnica estricta" },
    { name: "Fondos en paralelas + flexiones", sets: "5 + 10 × 2", notes: "Pausa corta, buena forma" },
    { name: "Dominadas wide / normal / close", sets: "BMB / 3 c/u ×2", notes: "Ritmo parejo" },
  ],
};

function chipClass(v: BlockType) {
  if (v === "BASICOS") {
    return "bg-emerald-300/10 text-emerald-200 border-emerald-300/30";
  }
  return "bg-sky-300/10 text-sky-200 border-sky-300/30";
}

export default async function PlanMes6() {
  const membership = await requireActiveMembership();
  if (!membership.ok) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold">Acceso restringido</h1>
          <p className="mt-2 text-white/70">
            Necesitás membresía activa para ver esta planificación.
          </p>
          <Link
            className="inline-flex mt-6 rounded-2xl px-5 py-3 font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
            href="/tienda"
          >
            Activar membresía
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">Planificación</p>
              <h1 className="text-3xl font-bold tracking-tight mt-1">{plan.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                  Objetivo: {plan.meta.objective}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                  Nivel: {plan.meta.level}
                </span>
                {plan.meta.focus.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/app/planificaciones"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Cronología */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Cronología semanal</h2>
            <div className="text-xs text-white/60">
              Básicos / Skills por semana
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-black/20">
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white/60 font-medium">Semana</th>
                  {DAYS.map((d) => (
                    <th key={d} className="p-4 text-left text-white/60 font-medium">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-black/10">
                {plan.weeks.map((w) => (
                  <tr key={w.name} className="border-b border-white/10 last:border-b-0">
                    <td className="p-4 font-semibold">{w.name}</td>
                    {DAYS.map((d) => {
                      const v = w.blocks[d];
                      return (
                        <td key={d} className="p-4">
                          {v ? (
                            <span
                              className={[
                                "inline-flex items-center justify-center",
                                "rounded-full border px-3 py-1 font-semibold",
                                "transition hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                                chipClass(v),
                              ].join(" ")}
                            >
                              {v}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/50">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex gap-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Básicos
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-300" /> Skills
            </span>
          </div>
        </div>
      </section>

      {/* Ejercicios */}
      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h2 className="font-semibold">Ejercicios</h2>
          <span className="text-xs text-white/60">Biblioteca de videos: próximo upgrade</span>
        </div>
        <div className="h-px bg-white/10" />

        <div className="p-6 grid gap-4">
          {plan.exercises.map((ex) => (
            <div
              key={ex.name}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 hover:bg-black/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <div className="font-semibold">{ex.name}</div>
                    <div className="mt-1 text-sm text-white/60">
                      Series: <span className="text-white/80 font-medium">{ex.sets}</span>
                    </div>
                    {ex.notes && (
                      <div className="mt-2 text-xs text-white/55">{ex.notes}</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                  title="Próximamente"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ver video
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
