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

// Ejercicios de ejemplo para cada tipo de curso
const EXERCISE_EXAMPLES: Record<string, { title: string; description: string; videoId: string; level: string }[]> = {
  recorded: [
    {
      title: "Dominada con agarre prono",
      description: "La base de todo. Aprende el patrón de movimiento correcto, la activación escapular y cómo evitar compensaciones.",
      videoId: "eGo4IYlbE5g",
      level: "Inicial",
    },
    {
      title: "Negativas controladas",
      description: "La herramienta más efectiva para ganar fuerza en la fase excéntrica. Fundamental para progresar rápido.",
      videoId: "lueEJGjrzf0",
      level: "Inicial",
    },
    {
      title: "Australian Pull-up",
      description: "La regresión perfecta. Trabajá el patrón de jale con el peso justo para tu nivel.",
      videoId: "PGTHkJPKQ8M",
      level: "Principiante",
    },
    {
      title: "Archer Pull-up",
      description: "Progresión unilateral hacia la dominada a un brazo. Requiere base sólida de dominadas.",
      videoId: "jKNKPZCIBQg",
      level: "Avanzado",
    },
  ],
  live: [
    {
      title: "Muscle Up técnica",
      description: "La transición que separa el nivel intermedio del avanzado. Técnica, timing y fuerza específica.",
      videoId: "1zAMEBBYAHg",
      level: "Intermedio",
    },
    {
      title: "Front Lever progresiones",
      description: "Desde tucked hasta full front lever. Cada etapa con sus isométricos y dinámicos.",
      videoId: "R89jN4mBqE0",
      level: "Avanzado",
    },
    {
      title: "Handstand básico",
      description: "Alineación, activación y las primeras progresiones para pararte de manos contra la pared.",
      videoId: "XF3bPMQmHQc",
      level: "Intermedio",
    },
    {
      title: "Planche lean",
      description: "El punto de partida de la planche. Inclinación, activación de escápulas y respiración.",
      videoId: "afK4GmFgpIM",
      level: "Avanzado",
    },
  ],
  call: [
    {
      title: "Evaluación de movimiento",
      description: "Análisis de tu técnica actual, identificación de limitaciones y diseño del camino a seguir.",
      videoId: "eGo4IYlbE5g",
      level: "Todos los niveles",
    },
    {
      title: "Corrección de dominadas",
      description: "Los errores más comunes en la dominada y cómo corregirlos para entrenar sin lesiones.",
      videoId: "lueEJGjrzf0",
      level: "Todos los niveles",
    },
    {
      title: "Planificación personalizada",
      description: "Armado de tu plan mensual en vivo, explicando la lógica de cada semana y progresión.",
      videoId: "PGTHkJPKQ8M",
      level: "Todos los niveles",
    },
    {
      title: "Revisión de progreso",
      description: "Análisis de tus avances, ajustes al plan y resolución de dudas en tiempo real.",
      videoId: "jKNKPZCIBQg",
      level: "Todos los niveles",
    },
  ],
};

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

  const exercises = EXERCISE_EXAMPLES[course.kind] ?? EXERCISE_EXAMPLES.recorded;

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
                <h3 className="font-bold text-base">{ex.title}</h3>
                <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{ex.description}</p>
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
