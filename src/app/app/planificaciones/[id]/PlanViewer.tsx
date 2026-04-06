"use client";

import { useMemo, useState } from "react";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

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

type Props = {
  weeks: DbWeek[];
  blocks: DbBlock[];
  exercises: DbExercise[];
};

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

function sectionColor(section: "CALISTENIA" | "SKILLS") {
  return section === "CALISTENIA"
    ? "border-emerald-400/20 text-emerald-300 bg-emerald-400/8"
    : "border-sky-400/20 text-sky-300 bg-sky-400/8";
}

function sectionLabel(section: "CALISTENIA" | "SKILLS") {
  return section === "CALISTENIA" ? "Básicos" : "Skills";
}

export default function PlanViewer({ weeks, blocks, exercises }: Props) {
  const [week, setWeek] = useState<number>(weeks[0]?.week_number ?? 1);

  const weekNumberByWeekId = useMemo(() => {
    const m = new Map<number, number>();
    weeks.forEach((w) => m.set(w.id, w.week_number));
    return m;
  }, [weeks]);

  // blocksMap: `weekNum:day` → block_type
  const blocksMap = useMemo(() => {
    const m = new Map<string, string | null>();
    blocks.forEach((b) => {
      const wn = weekNumberByWeekId.get(b.plan_week_id);
      if (!wn) return;
      m.set(`${wn}:${b.day}`, b.block_type);
    });
    return m;
  }, [blocks, weekNumberByWeekId]);

  // Only show days that have actual training (block_type not null/empty)
  const trainingDays = useMemo(() => {
    const daySet = new Set<number>();
    blocks.forEach((b) => {
      if (b.block_type && b.block_type.trim() !== "") daySet.add(b.day);
    });
    return Array.from(daySet).sort((a, b) => a - b);
  }, [blocks]);

  // All exercises for selected week, grouped by section → category
  const grouped = useMemo(() => {
    const weekExs = exercises
      .filter((e) => e.week_number === week)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));

    // Group by section first, then by category
    const sectionOrder: Array<"SKILLS" | "CALISTENIA"> = ["SKILLS", "CALISTENIA"];
    const result: Array<{
      section: "CALISTENIA" | "SKILLS";
      category: string;
      exercises: DbExercise[];
    }> = [];

    for (const section of sectionOrder) {
      const sectionExs = weekExs.filter((e) => e.section === section);
      if (sectionExs.length === 0) continue;

      const catMap = new Map<string, DbExercise[]>();
      for (const ex of sectionExs) {
        const key = ex.category?.trim() || "Ejercicios";
        if (!catMap.has(key)) catMap.set(key, []);
        catMap.get(key)!.push(ex);
      }

      for (const [category, exs] of catMap.entries()) {
        result.push({ section, category, exercises: exs });
      }
    }
    return result;
  }, [exercises, week]);

  const totalExercises = grouped.reduce((s, g) => s + g.exercises.length, 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Ejercicios</p>
            <p className="text-xs text-white/50 mt-0.5">
              {totalExercises} ejercicio{totalExercises !== 1 ? "s" : ""} · {grouped.length} bloque{grouped.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Días de entrenamiento */}
          {trainingDays.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {trainingDays.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
                >
                  {DAY_NAMES[d - 1] ?? `Día ${d}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Semana selector */}
      <div className="px-5 py-3 border-b border-white/10 flex flex-wrap gap-2">
        {weeks.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWeek(w.week_number)}
            className={cx(
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
              week === w.week_number
                ? "text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300"
                : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10"
            )}
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* Cronograma de la semana */}
      {trainingDays.length > 0 && (
        <div className="px-5 py-3 border-b border-white/10">
          <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Cronograma semana {week}</p>
          <div className="flex flex-wrap gap-2">
            {trainingDays.map((d) => {
              const blockType = blocksMap.get(`${week}:${d}`) ?? null;
              return (
                <div
                  key={d}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                >
                  <span className="text-xs font-semibold text-white/50 w-7">
                    {DAY_NAMES[d - 1] ?? `D${d}`}
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    {blockType ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ejercicios */}
      <div className="p-5 space-y-8">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
            <p className="text-sm text-white/50">No hay ejercicios para esta semana.</p>
          </div>
        ) : (
          grouped.map(({ section, category, exercises: exs }) => (
            <div key={`${section}-${category}`} className="space-y-3">
              {/* Category header */}
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white tracking-wide">{category}</h3>
                <span className={cx(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  sectionColor(section)
                )}>
                  {sectionLabel(section)}
                </span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Exercises */}
              <div className="space-y-2">
                {exs.map((ex, i) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 hover:bg-black/30 transition"
                  >
                    {/* Number */}
                    <span className="shrink-0 w-6 text-center text-xs font-bold text-white/25">
                      {ex.order_index ?? i + 1}
                    </span>

                    {/* Name */}
                    <span className="flex-1 text-sm font-medium text-white/90 leading-snug">
                      {ex.name}
                    </span>

                    {/* Sets pill */}
                    {ex.sets && (
                      <span className="shrink-0 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                        {ex.sets}
                      </span>
                    )}

                    {/* Notes */}
                    {ex.notes && (
                      <span className="shrink-0 text-xs text-white/40 italic">{ex.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
