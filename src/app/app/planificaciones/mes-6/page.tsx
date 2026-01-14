import { requireActiveMembership } from "@/app/lib/supabase/access";
import Link from "next/link";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;
type Day = (typeof DAYS)[number];

type PlanWeek = {
  name: string;
  blocks: Partial<Record<Day, "BASICOS" | "SKILLS" | "MOVILIDAD">>;
};

type PlanExercise = {
  name: string;
  sets: string;
  notes?: string;
};

type Plan = {
  title: string;
  weeks: PlanWeek[];
  exercises: PlanExercise[];
};

const plan: Plan = {
  title: "Sexto mes — Descenso de peso",
  weeks: [
    {
      name: "Semana 1",
      blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" },
    },
    {
      name: "Semana 2",
      blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" },
    },
    {
      name: "Semana 3",
      blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" },
    },
    {
      name: "Semana 4",
      blocks: { Lunes: "BASICOS", Martes: "SKILLS", Jueves: "BASICOS", Viernes: "SKILLS" },
    },
  ],
  exercises: [
    { name: "Dominadas prono", sets: "5x2" },
    { name: "Fondos en paralelas + flexiones", sets: "5 + 10 x 2" },
    { name: "Dominadas wide / normal / close", sets: "BMB/3 c/u x2" },
  ],
};

export default async function PlanMes6() {
  const membership = await requireActiveMembership();

  if (!membership.ok) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-gray-600 mt-2">
          Necesitás membresía activa para ver esta planificación.
        </p>
        <Link
          className="inline-block mt-4 rounded-xl bg-black text-white px-4 py-2 text-sm"
          href="/tienda"
        >
          Activar membresía
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-600">Planificación</p>
          <h1 className="text-2xl font-semibold">{plan.title}</h1>
        </div>
        <Link href="/app/planificaciones" className="text-sm underline">
          Volver
        </Link>
      </div>

      {/* Cronología semanal estilo tabla */}
      <section className="rounded-2xl border overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 font-medium">Cronología semanal</div>
        <div className="overflow-x-auto">
          <table className="min-w-225 w-full text-sm">
            <thead className="bg-white">
              <tr className="border-b">
                <th className="p-3 text-left">Semana</th>
                {DAYS.map((d) => (
                  <th key={d} className="p-3 text-left">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.weeks.map((w) => (
                <tr key={w.name} className="border-b">
                  <td className="p-3 font-medium">{w.name}</td>
                  {DAYS.map((d) => (
                    <td key={d} className="p-3">
                      <span className="inline-block rounded-lg border px-2 py-1">
                        {w.blocks[d] ?? "—"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ejercicios */}
      <section className="rounded-2xl border overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 font-medium">Ejercicios</div>
        <div className="p-4 space-y-3">
          {plan.exercises.map((ex) => (
            <div
              key={ex.name}
              className="rounded-xl border p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{ex.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Series: {ex.sets}
                </div>
              </div>
              <Link className="text-sm underline" href="/app/videos">
                Ver video
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
