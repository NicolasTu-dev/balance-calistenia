import Link from "next/link";
import { listCourses, isMembershipActive } from "@/app/lib/courses/queries";
import { Lock, Play, Video, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Programas — Balance Calistenia",
  description: "Cursos grabados, clases en vivo y mentorías de calistenia con Balance.",
};

export const dynamic = "force-dynamic";

const KIND_CONFIG = {
  recorded: { label: "Curso grabado", icon: Play, color: "emerald" },
  live:     { label: "Clase en vivo",  icon: Video, color: "sky" },
  call:     { label: "Mentoría",       icon: PhoneCall, color: "amber" },
} as const;

const INCLUDED = [
  "Ejercicios explicados paso a paso",
  "Videos demostrativos de cada movimiento",
  "Progresiones adaptadas a tu nivel",
  "Materiales y recursos descargables",
  "Seguimiento por WhatsApp",
];

export default async function ProgramasPage() {
  const [courses, hasMembership] = await Promise.all([
    listCourses(),
    isMembershipActive(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 space-y-20">

      {/* Hero */}
      <section className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden px-8 py-16 md:px-14 md:py-20">
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
            Programas de entrenamiento
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
            Aprendé calistenia{" "}
            <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              con estructura.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/60 leading-relaxed">
            Cursos grabados, clases en vivo y mentorías personalizadas para que progreses
            con método real desde cualquier nivel.
          </p>
        </div>
      </section>

      {/* Qué incluye */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Qué incluye cada programa</p>
          <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitás para progresar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cursos */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Disponibles ahora</p>
          <h2 className="text-3xl font-bold tracking-tight">Programas</h2>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
            <p className="text-white/40 text-lg">Próximamente</p>
            <p className="mt-2 text-sm text-white/30">Los programas están en preparación. Volvé pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c, idx) => {
              const locked = c.requires_membership && !hasMembership;
              const config = KIND_CONFIG[c.kind];
              const Icon = config.icon;

              return (
                <div
                  key={c.id}
                  className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
                >
                  {/* Header decorativo */}
                  <div className="relative h-36 bg-linear-to-br from-white/5 to-black/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-4 left-6 h-16 w-16 rounded-2xl border border-white/10 rotate-12" />
                      <div className="absolute bottom-3 right-8 h-10 w-10 rounded-xl border border-white/10 -rotate-6" />
                      <div className="absolute top-8 right-12 h-8 w-8 rounded-lg border border-white/10 rotate-3" />
                    </div>
                    <span className="relative text-6xl font-black text-white/5 select-none">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold
                        ${c.kind === "recorded" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" :
                          c.kind === "live" ? "border-sky-400/30 bg-sky-400/10 text-sky-300" :
                          "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    {locked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="h-4 w-4 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold leading-tight">{c.title}</h2>
                      {c.description && (
                        <p className="mt-2 text-sm text-white/55 leading-relaxed line-clamp-3">
                          {c.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      {locked ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                          <Lock className="h-3 w-3" /> Requiere membresía
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-400">Disponible</span>
                      )}
                      <Link
                        href={locked ? "/precios" : `/programas/${c.id}`}
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                          locked
                            ? "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                            : "text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90"
                        }`}
                      >
                        {locked ? "Activar" : "Ver programa"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
