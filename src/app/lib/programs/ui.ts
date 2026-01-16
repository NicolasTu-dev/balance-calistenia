import type { ProgramLevel } from "./types";

export const levelLabel: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  skills: "Skills",
  adult: "Adultos / Salud",
};

export const levelBlurb: Record<string, string> = {
  beginner: "Base técnica + fuerza general. Ideal para empezar sin lesiones.",
  intermediate: "Más intensidad, fuerza y performance. Para quien ya domina básicos.",
  skills: "Tracks por habilidad (Handstand, Front Lever, Muscle Up, etc.).",
  adult: "Movilidad, postura y fuerza funcional. Menos impacto, más constancia.",
};

export function getLevelLabel(level: ProgramLevel | null | undefined) {
  if (!level) return "Programa";
  return levelLabel[level] ?? "Programa";
}

export function getLevelBlurb(level: ProgramLevel | null | undefined) {
  if (!level) return "";
  return levelBlurb[level] ?? "";
}
