"use client";

import { useMemo, useState } from "react";
import { Dumbbell, Sparkles, ChevronDown } from "lucide-react";

const DAYS = [
  { day: 1, label: "Lun" },
  { day: 2, label: "Mar" },
  { day: 3, label: "Mié" },
  { day: 4, label: "Jue" },
  { day: 5, label: "Vie" },
] as const;

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

function normalizeBlockType(v: string | null) {
  const s = (v ?? "").trim().toUpperCase();
  if (!s) return null;
  return s;
}

// Heurística simple: si el block_type dice SKILL(S) => SKILLS; sino CALISTENIA
function sectionFromBlockType(blockType: string | null): "CALISTENIA" | "SKILLS" | null {
  const t = normalizeBlockType(blockType);
  if (!t) return null;
  if (t.includes("SKILL")) return "SKILLS";
  // tu plan usa "BASICOS" o similares => CALISTENIA
  return "CALISTENIA";
}

function pillClass(active: boolean) {
  return cx(
    "inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-semibold transition",
    active
      ? "text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300"
      : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10"
  );
}

export default function PlanViewer({ weeks, blocks, exercises }: Props) {
  const defaultWeek = weeks[0]?.week_number ?? 1;

  const [week, setWeek] = useState<number>(defaultWeek);
  const [day, setDay] = useState<number>(1);

  // “Auto” significa: la sección se decide por el día (según cronología)
  const [mode, setMode] = useState<"AUTO" | "MANUAL">("AUTO");
  const [manualSection, setManualSection] = useState<"CALISTENIA" | "SKILLS">("CALISTENIA");

  const weekIdByNumber = useMemo(() => {
    const m = new Map<number, number>();
    weeks.forEach((w) => m.set(w.week_number, w.id));
    return m;
  }, [weeks]);

  const blocksMap = useMemo(() => {
    // key: `${week_number}:${day}` => block_type
    const weekNumberByWeekId = new Map<number, number>();
    weeks.forEach((w) => weekNumberByWeekId.set(w.id, w.week_number));

    const m = new Map<string, string | null>();
    blocks.forEach((b) => {
      const wn = weekNumberByWeekId.get(b.plan_week_id);
      if (!wn) return;
      m.set(`${wn}:${b.day}`, b.block_type);
    });
    return m;
  }, [weeks, blocks]);

  const blockTypeForSelected = blocksMap.get(`${week}:${day}`) ?? null;

  const selectedSection: "CALISTENIA" | "SKILLS" = useMemo(() => {
    if (mode === "MANUAL") return manualSection;
    return sectionFromBlockType(blockTypeForSelected) ?? "CALISTENIA";
  }, [mode, manualSection, blockTypeForSelected]);

  const filtered = useMemo(() => {
    return exercises
      .filter((e) => e.week_number === week && e.section === selectedSection)
      .sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
  }, [exercises, week, selectedSection]);

  const grouped = useMemo(() => {
    const map = new Map<string, DbExercise[]>();
    for (const e of filtered) {
      const key = e.category?.trim() || "Ejercicios";
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const headerSubtitle = useMemo(() => {
    const modeLabel = mode === "AUTO" ? "Auto (según día)" : "Manual";
    const blockLabel = blockTypeForSelected ? `• ${blockTypeForSelected}` : "";
    const sectionLabel = selectedSection === "CALISTENIA" ? "Básicos" : "Skills";
    return `Semana ${week} • ${DAYS.find((d) => d.day === day)?.label ?? ""} ${blockLabel} • ${sectionLabel} • ${modeLabel}`;
  }, [week, day, blockTypeForSelected, selectedSection, mode]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-5 py-4 bg-black/20 border-b border-white/10">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div>
            <div className="text-sm font-semibold">Vista por día</div>
            <div className="mt-1 text-xs text-white/60">{headerSubtitle}</div>
          </div>

          {/* Toggle Auto/Manual */}
          <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
            <button
              className={cx(
                "px-3 py-2 rounded-xl text-sm font-semibold transition",
                mode === "AUTO" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              )}
              onClick={() => setMode("AUTO")}
              type="button"
            >
              Auto
            </button>
            <button
              className={cx(
                "px-3 py-2 rounded-xl text-sm font-semibold transition",
                mode === "MANUAL" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              )}
              onClick={() => setMode("MANUAL")}
              type="button"
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Semana */}
      <div className="p-5 border-b border-white/10">
        <div className="text-xs text-white/60 mb-2 flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          Seleccioná semana
        </div>
        <div className="flex flex-wrap gap-2">
          {weeks.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => {
                setWeek(w.week_number);
                setDay(1);
              }}
              className={pillClass(week === w.week_number)}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Día */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="w-full sm:w-auto">
            <div className="text-xs text-white/60 mb-2">Día</div>
            <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
              {DAYS.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setDay(d.day)}
                  className={cx(
                    "px-3 py-2 rounded-xl text-sm font-semibold transition",
                    day === d.day ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section tabs (solo si Manual, o por si querés override) */}
          <div className="w-full sm:w-auto">
            <div className="text-xs text-white/60 mb-2">Sección</div>
            <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("MANUAL");
                  setManualSection("CALISTENIA");
                }}
                className={cx(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition",
                  selectedSection === "CALISTENIA"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Dumbbell className="h-4 w-4 text-emerald-200" />
                Básicos
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("MANUAL");
                  setManualSection("SKILLS");
                }}
                className={cx(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition",
                  selectedSection === "SKILLS"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Sparkles className="h-4 w-4 text-sky-200" />
                Skills
              </button>
            </div>

            {mode === "AUTO" && (
              <div className="mt-2 text-[11px] text-white/55">
                Auto usa la cronología del día:{" "}
                <span className="text-white/75 font-semibold">
                  {blockTypeForSelected ?? "—"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ejercicios */}
      <div className="p-5 space-y-6">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            No hay ejercicios para <b>Semana {week}</b> y <b>{selectedSection === "CALISTENIA" ? "Básicos" : "Skills"}</b>.
          </div>
        ) : (
          grouped.map(([category, list]) => (
            <div key={category} className="space-y-3">
              <div className="text-sm font-semibold text-white/80">{category}</div>

              <div className="grid gap-3">
                {list.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-black/25 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{ex.name}</div>
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
                        Semana {ex.week_number}
                      </span>
                    </div>
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
