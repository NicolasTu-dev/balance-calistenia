import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { ChevronLeft } from "lucide-react";
import PlanViewer from "./PlanViewer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

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
  block_name: string | null;
  category: string | null;
  order_index: number | null;
  name: string;
  sets: string | null;
  notes: string | null;
};

type PageProps =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export default async function PlanByIdPage(props: PageProps) {
  const membership = await requireActiveMembership();
  if (!membership.ok) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-white/70">
          Necesitás membresía activa para ver esta planificación.
        </p>
        <Link
          href="/tienda"
          className="mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-black
                     bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Activar membresía
        </Link>
      </div>
    );
  }

  const resolvedParams = "then" in props.params ? await props.params : props.params;
  const raw = resolvedParams?.id;
  const planId = raw ? parseInt(raw, 10) : NaN;

  if (!Number.isFinite(planId)) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Plan inválido</h1>
        <p className="mt-2 text-sm text-white/70">
          Param recibido:{" "}
          <span className="text-white/90 font-mono">{String(raw)}</span>
        </p>
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
        <Link href="/login" className="mt-4 inline-flex underline text-sm">
          Ir a login
        </Link>
      </div>
    );
  }

  const isAdmin = await hasAdminAccess();

  // Admins can view any plan; regular users only their own
  const db = isAdmin ? supabaseAdmin() : supabase;
  const planQuery = db
    .from("plans")
    .select("id, title, slug, active")
    .eq("id", planId);

  if (!isAdmin) planQuery.eq("owner_user_id", user.id);

  const { data: plan, error: planErr } = await planQuery.single<DbPlan>();

  if (planErr || !plan) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Plan no encontrado</h1>
        <p className="mt-2 text-sm text-white/70">
          Puede que no exista o no tengas acceso.
        </p>
      </div>
    );
  }

  const { data: weeks } = await db
    .from("plan_weeks")
    .select("id, week_number, name")
    .eq("plan_id", planId)
    .order("week_number", { ascending: true })
    .returns<DbWeek[]>();

  const weekIds = (weeks ?? []).map((w) => w.id);

  const { data: blocks } = await db
    .from("plan_blocks")
    .select("plan_week_id, day, block_type")
    .in("plan_week_id", weekIds.length ? weekIds : [-1])
    .returns<DbBlock[]>();

  const { data: exercises } = await db
    .from("plan_exercises")
    .select("id, week_number, section, block_name, category, order_index, name, sets, notes")
    .eq("plan_id", planId)
    .order("week_number", { ascending: true })
    .order("section", { ascending: true })
    .order("order_index", { ascending: true })
    .order("id", { ascending: true })
    .returns<DbExercise[]>();

  // Cronología (resumen visual)
  const blocksMap = new Map<string, string | null>();
  const weekById = new Map<number, number>();
  (weeks ?? []).forEach((w) => weekById.set(w.id, w.week_number));
  (blocks ?? []).forEach((b) => {
    const wn = weekById.get(b.plan_week_id);
    if (!wn) return;
    blocksMap.set(`${wn}:${b.day}`, b.block_type);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
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

        {(() => {
          // Only show training days (non-null block_type)
          const trainingDayNums = new Set<number>();
          (blocks ?? []).forEach((b) => {
            if (b.block_type && b.block_type.trim() !== "") trainingDayNums.add(b.day);
          });
          const trainingDays = Array.from(trainingDayNums).sort((a, b) => a - b);
          const dayLabels = trainingDays.map((d) => DAYS[d - 1] ?? `Día ${d}`);

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/10">
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-white/70 font-medium">Semana</th>
                    {dayLabels.map((label) => (
                      <th key={label} className="p-4 text-left text-white/70 font-medium">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(weeks ?? []).map((w) => (
                    <tr key={w.id} className="border-b border-white/10">
                      <td className="p-4 font-semibold">{w.name}</td>
                      {trainingDays.map((day) => {
                        const val = blocksMap.get(`${w.week_number}:${day}`) ?? null;
                        return (
                          <td key={day} className="p-4">
                            <span className="inline-flex items-center rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-semibold text-emerald-200">
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
          );
        })()}
      </section>

      {/* Vista premium por día + tabs */}
      <PlanViewer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weeks={(weeks ?? []) as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        blocks={(blocks ?? []) as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        exercises={(exercises ?? []) as any}
      />
    </div>
  );
}
