import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabase/server";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { ChevronLeft } from "lucide-react";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

type DbPlan = {
  id: number;
  title: string;
  slug: string;
  active: boolean;
};

type DbWeek = { id: number; week_number: number; name: string };
type DbBlock = { plan_week_id: number; day: number; block_type: string | null };
type DbExercise = {
  id: number;
  week_number: number;
  section: "CALISTENIA" | "SKILLS";
  category: string | null;
  order_index: number | null;
  name: string;
  sets: string | null;
  notes: string | null;
};

function dayLabel(day: number) {
  return DAYS[day - 1] ?? "—";
}

export default async function PlanByIdPage(props: { params: { id: string } }) {
  const membership = await requireActiveMembership();
  if (!membership.ok) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-white/70">Necesitás membresía activa para ver esta planificación.</p>
        <Link
          href="/tienda"
          className="mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-black
                     bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Activar membresía
        </Link>
      </div>
    );
  }

  const planId = Number(props.params.id);
  if (!Number.isFinite(planId)) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Plan inválido</h1>
      </div>
    );
  }

  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Ingresá para ver tu plan</h1>
        <Link href="/login" className="mt-4 inline-flex underline text-sm">Ir a login</Link>
      </div>
    );
  }

  // Plan (aseguramos ownership)
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("id, title, slug, active")
    .eq("id", planId)
    .eq("owner_user_id", user.id)
    .single<DbPlan>();

  if (planErr || !plan) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Plan no encontrado</h1>
        <p className="mt-2 text-sm text-white/70">Puede que no exista o no tengas acceso.</p>
      </div>
    );
  }

  const { data: weeks } = await supabase
    .from("plan_weeks")
    .select("id, week_number, name")
    .eq("plan_id", planId)
    .order("week_number", { ascending: true })
    .returns<DbWeek[]>();

  const weekIds = (weeks ?? []).map((w) => w.id);

  const { data: blocks } = await supabase
    .from("plan_blocks")
    .select("plan_week_id, day, block_type")
    .in("plan_week_id", weekIds.length ? weekIds : [-1])
    .returns<DbBlock[]>();

  const { data: exercises } = await supabase
    .from("plan_exercises")
    .select("id, week_number, section, category, order_index, name, sets, notes")
    .eq("plan_id", planId)
    .order("week_number", { ascending: true })
    .order("section", { ascending: true })
    .order("order_index", { ascending: true })
    .returns<DbExercise[]>();

  // Map blocks: week_number -> day -> block_type
  const weekById = new Map<number, number>();
  (weeks ?? []).forEach((w) => weekById.set(w.id, w.week_number));

  const blocksMap = new Map<string, string | null>();
  (blocks ?? []).forEach((b) => {
    const wn = weekById.get(b.plan_week_id);
    if (!wn) return;
    blocksMap.set(`${wn}:${b.day}`, b.block_type);
  });

  // Group exercises by week -> section -> category
  const exByWeek = new Map<number, DbExercise[]>();
  (exercises ?? []).forEach((e) => {
    const list = exByWeek.get(e.week_number) ?? [];
    list.push(e);
    exByWeek.set(e.week_number, list);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Planificación</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{plan.title}</h1>
        </div>

        <Link
          href="/app/planificaciones"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      {/* Cronología */}
      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 bg-black/20 border-b border-white/10 font-semibold">
          Cronología semanal
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-black/10">
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-white/70 font-medium">Semana</th>
                {DAYS.map((d) => (
                  <th key={d} className="p-4 text-left text-white/70 font-medium">{d}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(weeks ?? []).map((w) => (
                <tr key={w.id} className="border-b border-white/10">
                  <td className="p-4 font-semibold">{w.name}</td>
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const day = idx + 1;
                    const val = blocksMap.get(`${w.week_number}:${day}`) ?? null;
                    return (
                      <td key={day} className="p-4">
                        <span className="inline-flex items-center rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold">
                          {val ?? "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ejercicios por semana */}
      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 bg-black/20 border-b border-white/10 font-semibold">
          Ejercicios
        </div>

        <div className="p-5 space-y-6">
          {(weeks ?? []).map((w) => {
            const list = exByWeek.get(w.week_number) ?? [];
            if (list.length === 0) return null;

            return (
              <div key={w.id} className="space-y-3">
                <div className="text-sm font-semibold text-white/80">{w.name}</div>

                <div className="grid gap-3">
                  {list.map((ex) => (
                    <div
                      key={ex.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs text-white/60">
                          {ex.section}{ex.category ? ` • ${ex.category}` : ""}
                        </div>
                        <div className="mt-1 font-semibold">{ex.name}</div>
                        {ex.sets && (
                          <div className="mt-1 text-xs text-white/60">
                            Series: <span className="text-white/75">{ex.sets}</span>
                          </div>
                        )}
                        {ex.notes && (
                          <div className="mt-1 text-xs text-white/60">{ex.notes}</div>
                        )}
                      </div>

                      <span className="shrink-0 inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                        Semana {w.week_number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
