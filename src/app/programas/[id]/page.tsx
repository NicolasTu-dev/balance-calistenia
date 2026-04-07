import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCourseById, isMembershipActive } from "@/app/lib/courses/queries";
import { Play, Video, PhoneCall, ExternalLink, MessageCircle, ChevronLeft, FileText, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const KIND_CONFIG = {
  recorded: { label: "Curso grabado", icon: Play, color: "emerald" },
  live:     { label: "Clase en vivo",  icon: Video, color: "sky" },
  call:     { label: "Mentoría",       icon: PhoneCall, color: "amber" },
} as const;

// Extrae el ID de un URL de YouTube (youtube.com/watch?v=ID o youtu.be/ID)
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

type Exercise = { title: string; description: string; videoId: string; level: string; channel?: string };

// Matchea por keywords en el título del curso
const COURSE_EXERCISES: { keywords: string[]; exercises: Exercise[] }[] = [
  {
    keywords: ["dominada", "pull-up", "pullup", "jale"],
    exercises: [
      {
        title: "Dominadas para principiantes — técnica completa",
        description: "Activación escapular, rango de movimiento completo y los errores más comunes a evitar desde el primer día.",
        videoId: "eGo4IYlbE5g",
        level: "Inicial",
        channel: "FitnessFAQs",
      },
      {
        title: "Negativas controladas — el secreto para progresar rápido",
        description: "La fase excéntrica es donde se construye la fuerza real. Cómo ejecutarlas, cuántas series y cómo integrarlas al entrenamiento.",
        videoId: "lueEJGjrzf0",
        level: "Inicial",
        channel: "Calistenia Argentina",
      },
      {
        title: "Australian Pull-up — la regresión perfecta",
        description: "Si todavía no podés hacer una dominada, esta es tu herramienta. Trabaja el patrón de jale con el peso corporal ideal para tu nivel.",
        videoId: "PGTHkJPKQ8M",
        level: "Principiante",
        channel: "ThenX",
      },
      {
        title: "Archer Pull-up — hacia la dominada a un brazo",
        description: "Progresión unilateral avanzada. Requiere una base sólida pero es el paso previo más efectivo para el one arm pull-up.",
        videoId: "jKNKPZCIBQg",
        level: "Avanzado",
        channel: "Osvaldo Ugarte",
      },
    ],
  },
  {
    keywords: ["muscle up", "muscleup", "muscle-up"],
    exercises: [
      {
        title: "Muscle Up — técnica y transición",
        description: "El movimiento más buscado en calistenia. La clave está en el timing del falso agarre y la explosividad del tirón.",
        videoId: "1zAMEBBYAHg",
        level: "Intermedio",
        channel: "FitnessFAQs",
      },
      {
        title: "Chest to Bar — el paso previo al Muscle Up",
        description: "Aprendé a llevar el pecho a la barra con potencia. Sin este patrón no hay muscle up real.",
        videoId: "VtS9SLKEXOQ",
        level: "Intermedio",
        channel: "ThenX",
      },
      {
        title: "Muscle Up en anillas — mayor control y dificultad",
        description: "Las anillas demandan más estabilidad y rango. Si querés dominar el Muscle Up en barra, trabaja primero en anillas.",
        videoId: "AfV_KMnmR8Y",
        level: "Avanzado",
        channel: "Calistenia Argentina",
      },
      {
        title: "Dip profundo en barra — la fase final del Muscle Up",
        description: "La extensión de codos completa sobre la barra requiere fuerza de empuje específica. Cómo trabajarla de forma aislada.",
        videoId: "KoLuYNVOgCk",
        level: "Intermedio",
        channel: "Osvaldo Ugarte",
      },
    ],
  },
  {
    keywords: ["back lever", "front lever", "lever", "palanca"],
    exercises: [
      {
        title: "Front Lever — progresión completa desde cero",
        description: "Tucked, advanced tucked, one leg y full. Cada etapa con sus isométricos, el tiempo de trabajo y cómo progresar sin estancarse.",
        videoId: "R89jN4mBqE0",
        level: "Avanzado",
        channel: "FitnessFAQs",
      },
      {
        title: "Back Lever — técnica y progresiones",
        description: "Activación escapular, alineación lumbar y las posiciones de entrada más seguras para aprender el Back Lever sin lesionarse.",
        videoId: "Vs-MAVhgc1g",
        level: "Intermedio",
        channel: "ThenX",
      },
      {
        title: "German Hang — movilidad y entrada al Back Lever",
        description: "La posición de entrada al Back Lever requiere movilidad de hombros específica. Cómo trabajarla de forma segura.",
        videoId: "hQE2IXKmrYE",
        level: "Intermedio",
        channel: "Calistenia Argentina",
      },
      {
        title: "Isométricos avanzados — el método más efectivo para skills",
        description: "Los holds de 5-10 segundos en posición máxima son la clave para ganar fuerza específica en palancas.",
        videoId: "k_MsNLXmrFg",
        level: "Avanzado",
        channel: "Osvaldo Ugarte",
      },
    ],
  },
];

// Fallback genérico para otros cursos
const DEFAULT_EXERCISES: Exercise[] = [
  {
    title: "Dominadas — fundamentos del jale",
    description: "La base de la calistenia de empuje. Activación escapular, rango completo y progresiones para todo nivel.",
    videoId: "eGo4IYlbE5g",
    level: "Inicial",
    channel: "FitnessFAQs",
  },
  {
    title: "Flexiones perfectas — técnica completa",
    description: "El movimiento de empuje más básico y más mal ejecutado. Cómo hacerlas bien desde el día uno.",
    videoId: "IODxDxX7oi4",
    level: "Inicial",
    channel: "ThenX",
  },
  {
    title: "Dips en paralelas — fuerza de triceps y pecho",
    description: "El complemento ideal al jale. Rango profundo, postura correcta y progresiones para aumentar la carga.",
    videoId: "2z8JmcrW-As",
    level: "Principiante",
    channel: "Calistenia Argentina",
  },
  {
    title: "Core en calistenia — L-sit y hollow body",
    description: "Sin core no hay skills. El hollow body y el L-sit son la base de todos los movimientos avanzados.",
    videoId: "XF3bPMQmHQc",
    level: "Intermedio",
    channel: "Osvaldo Ugarte",
  },
];

function getExercises(title: string): Exercise[] {
  const lower = title.toLowerCase();
  for (const entry of COURSE_EXERCISES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.exercises;
    }
  }
  return DEFAULT_EXERCISES;
}

const LEVEL_COLORS: Record<string, string> = {
  "Inicial": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Principiante": "border-sky-400/30 bg-sky-400/10 text-sky-300",
  "Intermedio": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Avanzado": "border-red-400/30 bg-red-400/10 text-red-300",
  "Todos los niveles": "border-white/20 bg-white/10 text-white/70",
};

export default async function CursoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await getCourseById(id);
  if (!course) return notFound();

  const hasMembership = await isMembershipActive();
  if (course.requires_membership && !hasMembership) {
    redirect("/tienda");
  }

  const config = KIND_CONFIG[course.kind];
  const Icon = config.icon;

  const youtubeId = course.content_url ? extractYoutubeId(course.content_url) : null;
  const isYoutube = !!youtubeId;

  const exercises = getExercises(course.title);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 space-y-10">

      {/* Back */}
      <Link
        href="/programas"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a programas
      </Link>

      {/* Header */}
      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="relative h-24 bg-linear-to-br from-emerald-500/10 to-sky-500/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-3 left-8 h-12 w-12 rounded-2xl border border-white/10 rotate-12 opacity-40" />
            <div className="absolute bottom-2 right-10 h-8 w-8 rounded-xl border border-white/10 -rotate-6 opacity-40" />
          </div>
        </div>
        <div className="px-8 pb-8 -mt-5">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold mb-4
            ${course.kind === "recorded" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" :
              course.kind === "live" ? "border-sky-400/30 bg-sky-400/10 text-sky-300" :
              "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
          {course.description && (
            <p className="mt-3 text-white/60 leading-relaxed max-w-2xl">{course.description}</p>
          )}
        </div>
      </section>

      {/* Video embed o acceso */}
      {isYoutube ? (
        <section>
          <div className="rounded-3xl border border-white/10 overflow-hidden bg-black">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>
      ) : course.content_url ? (
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 flex items-center justify-between gap-6 flex-col sm:flex-row">
          <div>
            <h2 className="text-lg font-bold">Acceso al contenido</h2>
            <p className="mt-1 text-sm text-white/60">
              El material está disponible en el siguiente enlace.
            </p>
          </div>
          <a
            href={course.content_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir contenido
          </a>
        </section>
      ) : null}

      {/* Ejercicios del programa */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-2">Contenido del programa</p>
          <h2 className="text-2xl font-bold">Ejercicios y técnicas</h2>
          <p className="mt-1 text-sm text-white/50">
            Ejemplos representativos de lo que trabajás en este programa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {exercises.map((ex) => (
            <div
              key={ex.title}
              className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* YouTube thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${ex.videoId}/maxresdefault.jpg`}
                  alt={ex.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={`https://www.youtube.com/watch?v=${ex.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 border border-white/20 hover:bg-red-600/80 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                  </a>
                </div>
                {/* Level badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm ${LEVEL_COLORS[ex.level] ?? LEVEL_COLORS["Todos los niveles"]}`}>
                    {ex.level}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-base leading-tight">{ex.title}</h3>
                </div>
                {ex.channel && (
                  <p className="text-xs text-white/30 mb-2">por {ex.channel}</p>
                )}
                <p className="text-sm text-white/55 leading-relaxed">{ex.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${ex.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition"
                >
                  Ver en YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Materiales + Seguimiento */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-10 w-10 rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-sky-300" />
            </span>
            <h3 className="font-bold text-lg">Materiales</h3>
          </div>
          <ul className="space-y-2.5">
            {["PDF con progresiones detalladas", "Rutinas descargables", "Checklist de técnica", "Guía de calentamiento"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-10 w-10 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-emerald-300" />
            </span>
            <h3 className="font-bold text-lg">Seguimiento</h3>
          </div>
          <ul className="space-y-2.5">
            {["Soporte por WhatsApp durante el programa", "Corrección de técnica por video", "Ajustes al plan según tu progreso", "Consultas ilimitadas al coach"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="h-12 w-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-emerald-300" />
          </span>
          <div>
            <h3 className="font-bold">¿Tenés dudas sobre este programa?</h3>
            <p className="text-sm text-white/50 mt-0.5">Escribile a tu coach directo por WhatsApp.</p>
          </div>
        </div>
        <a
          href="https://wa.me/5491157541046"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Consultar por WhatsApp
        </a>
      </section>

    </main>
  );
}
