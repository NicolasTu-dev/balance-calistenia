"use client";

import { useMemo, useState } from "react";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

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

type Props = {
  weeks: DbWeek[];
  blocks: DbBlock[];
  exercises: DbExercise[];
};

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

function sectionBadgeClass(section: "CALISTENIA" | "SKILLS") {
  return section === "CALISTENIA"
    ? "border-emerald-400/25 text-emerald-300 bg-emerald-400/10"
    : "border-sky-400/25 text-sky-300 bg-sky-400/10";
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

  // Block sort priority: EEC GENERAL → EEC ESPECIFICA → everything else (EJERCICIOS, etc.)
  function blockPriority(name: string): number {
    const upper = name.toUpperCase();
    if (upper.includes("EEC GENERAL")) return 0;
    if (upper.includes("EEC ESPECIF")) return 1;
    if (upper.includes("EEC")) return 2;
    return 99;
  }

  // Group exercises for selected week by block_name → category
  const groupedBlocks = useMemo(() => {
    const weekExs = exercises
      .filter((e) => e.week_number === week)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));

    // Preserve insertion order of blocks, then re-sort by priority
    const blockOrder: string[] = [];
    const blockMap = new Map<string, {
      section: "CALISTENIA" | "SKILLS";
      categories: Map<string, DbExercise[]>;
    }>();

    for (const ex of weekExs) {
      // Use block_name if available, else fall back to a readable section label
      const blockKey = ex.block_name ?? (ex.section === "CALISTENIA" ? "Básicos" : "Skills");
      if (!blockMap.has(blockKey)) {
        blockOrder.push(blockKey);
        blockMap.set(blockKey, { section: ex.section, categories: new Map() });
      }
      const block = blockMap.get(blockKey)!;
      const catKey = ex.category?.trim() || "";
      if (!block.categories.has(catKey)) block.categories.set(catKey, []);
      block.categories.get(catKey)!.push(ex);
    }

    // Sort blocks: EEC GENERAL first, EEC ESPECIFICA second, then the rest
    blockOrder.sort((a, b) => blockPriority(a) - blockPriority(b));

    return blockOrder.map((key) => ({
      blockName: key,
      ...blockMap.get(key)!,
    }));
  }, [exercises, week]);

  const totalExercises = exercises.filter((e) => e.week_number === week).length;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold">Ejercicios</p>
            <p className="text-xs text-white/50 mt-0.5">
              {totalExercises} ejercicio{totalExercises !== 1 ? "s" : ""} · {groupedBlocks.length} bloque{groupedBlocks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Training days chips */}
          {trainingDays.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {trainingDays.map((d) => (
                <span key={d} className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                  {DAY_NAMES[d - 1] ?? `Día ${d}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Week selector */}
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
          <p className="text-xs text-white/35 mb-2 uppercase tracking-wider">Cronograma semana {week}</p>
          <div className="flex flex-wrap gap-2">
            {trainingDays.map((d) => {
              const blockType = blocksMap.get(`${week}:${d}`) ?? null;
              return (
                <div key={d} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <span className="text-xs font-bold text-white/40 w-7">{DAY_NAMES[d - 1] ?? `D${d}`}</span>
                  <span className="text-xs text-white/80 font-medium">{blockType ?? "—"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bloques de ejercicios */}
      <div className="p-5 space-y-6">
        {groupedBlocks.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
            <p className="text-sm text-white/50">No hay ejercicios para esta semana.</p>
          </div>
        ) : (
          groupedBlocks.map(({ blockName, section, categories }) => (
            <div
              key={blockName}
              className={cx(
                "rounded-2xl border overflow-hidden",
                section === "CALISTENIA"
                  ? "border-emerald-400/15 bg-emerald-400/3"
                  : "border-sky-400/15 bg-sky-400/3"
              )}
            >
              {/* Block header */}
              <div className={cx(
                "flex items-center gap-3 px-4 py-3 border-b",
                section === "CALISTENIA"
                  ? "bg-emerald-400/8 border-emerald-400/15"
                  : "bg-sky-400/8 border-sky-400/15"
              )}>
                <h3 className="font-bold text-sm tracking-wide text-white">{blockName}</h3>
                <span className={cx(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  sectionBadgeClass(section)
                )}>
                  {sectionLabel(section)}
                </span>
              </div>

              {/* Categories within block */}
              <div className="divide-y divide-white/5">
                {Array.from(categories.entries()).map(([catKey, exs]) => (
                  <div key={catKey || "__none__"} className="px-4 py-3 space-y-2">
                    {/* Sub-category label */}
                    {catKey && (
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                        {catKey}
                      </p>
                    )}

                    {/* Exercises */}
                    {exs.map((ex, i) => (
                      <div
                        key={ex.id}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/15 px-3 py-2.5 hover:bg-black/25 transition"
                      >
                        <span className="shrink-0 w-5 text-center text-xs font-bold text-white/20">
                          {ex.order_index ?? i + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium text-white/90 leading-snug">
                          {ex.name}
                        </span>
                        {ex.sets && (
                          <span className="shrink-0 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/75">
                            {ex.sets}
                          </span>
                        )}
                        {ex.notes && (
                          <span className="shrink-0 text-xs text-white/35 italic">{ex.notes}</span>
                        )}
                      </div>
                    ))}
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
