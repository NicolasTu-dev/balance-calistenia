import Link from "next/link";
import ResultsShowcase from "@/app/components/ResultsShowcase";
import CoachSection from "@/app/components/CoachSection";
import FadeIn from "@/app/components/FadeIn";
import Testimonials from "@/app/components/Testimonials";
import { getActiveResultsMedia } from "@/app/lib/results/queries";
import { PRICING, WA_CONTACT_URL } from "@/app/lib/config";
import { CheckCircle2, Zap, Calendar, MessageCircle, ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Balance Calistenia — Entrená con estructura",
  description:
    "Planificación mensual de calistenia con seguimiento personalizado. Fuerza, skills y progresión real.",
};

export const dynamic = "force-dynamic";

const stats = [
  { value: "50+", label: "Alumnos activos" },
  { value: "2+", label: "Años de experiencia" },
  { value: "100%", label: "Personalizado" },
  { value: "24/7", label: "Soporte WhatsApp" },
];

const features = [
  {
    icon: Calendar,
    title: "Planificación estructurada",
    desc: "Cada semana tiene un propósito. Nada al azar, todo con lógica y progresión.",
  },
  {
    icon: Zap,
    title: "Progresión real",
    desc: "El plan evoluciona con vos. Cada mes más exigente, más técnico, más tuyo.",
  },
  {
    icon: MessageCircle,
    title: "Soporte continuo",
    desc: "Tu coach disponible por WhatsApp para dudas, ajustes y seguimiento.",
  },
];

const planFeatures = [
  "Plan personalizado según tu nivel y objetivo",
  "Acceso completo al panel de alumno digital",
  "Cronograma semanal con ejercicios y series",
  "Actualización mensual del plan",
  "Seguimiento y progresión estructurada",
  "Soporte directo por WhatsApp",
];

export default async function HomePage() {
  await getActiveResultsMedia();

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 space-y-24">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative px-8 py-16 md:px-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
            Calistenia · Fuerza · Skills
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            Entrená con{" "}
            <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              estructura real.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/60 leading-relaxed">
            Planificación mensual de calistenia diseñada para tu nivel. Progresás con método, no al azar.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/precios"
              className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
            >
              Hacerme Socio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#resultados"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              Ver resultados
            </Link>
          </div>

          {/* inline stats */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">{s.value}</span>
                <span className="text-sm text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ ES BALANCE ───────────────────────────────── */}
      <FadeIn>
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">El método</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Entrenás diferente desde el primer día
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Balance no es un programa genérico. Es un sistema pensado para que mejorés rendimiento,
              técnica y control corporal de forma sostenida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-7 flex flex-col gap-4">
                <span className="h-11 w-11 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </span>
                <div>
                  <h3 className="font-bold text-base">{title}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── PLAN MENSUAL ─────────────────────────────────── */}
      <FadeIn>
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 mb-5">
                Plan mensual
              </span>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Tu planificación personalizada
              </h2>
              <p className="mt-4 text-white/50 text-sm leading-relaxed">
                Un plan armado para vos, con tu nombre, tu nivel y tus objetivos. Cada mes renovado y ajustado a tu progreso.
              </p>

              <ul className="mt-8 space-y-3">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="border-t border-emerald-400/10 md:border-t-0 md:border-l bg-black/20 p-10 md:p-14 flex flex-col justify-center">
              <p className="text-sm text-white/40 uppercase tracking-widest font-medium mb-4">Precio mensual</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-black tracking-tight">{PRICING.amount}</span>
              </div>
              <p className="text-white/40 text-sm mb-10">Pesos argentinos (ARS) · renovás cada mes</p>

              <a
                href={WA_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
              >
                Consultar por WhatsApp <ChevronRight className="h-4 w-4" />
              </a>

              <Link
                href="/app"
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-3.5 text-sm font-semibold hover:bg-white/5 transition"
              >
                Ya soy socio — ir a mi panel
              </Link>

              <p className="mt-5 text-center text-xs text-white/30">
                El acceso se activa dentro de las 24 hs de confirmado el pago.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── PROGRAMAS ────────────────────────────────────── */}
      <FadeIn>
        <section>
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Programas</p>
            <h2 className="text-3xl font-bold tracking-tight">Dos caminos para entrenar</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col gap-5">
              <div>
                <span className="text-3xl font-black text-white/10">01</span>
                <h3 className="text-xl font-bold mt-2">Balance por Nivel</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  Construí base, resistencia y fortaleza. Progresión hacia skills:
                  muscle up, back lever, vertical, front lever, plancha.
                </p>
              </div>
              <Link
                href="/programas"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                Ver programas por nivel <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col gap-5">
              <div>
                <span className="text-3xl font-black text-white/10">02</span>
                <h3 className="text-xl font-bold mt-2">Balance por Objetivos</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  Tu primera dominada, calistenia en casa, cambio físico 90 días,
                  fuerza total, descenso de peso.
                </p>
              </div>
              <Link
                href="/programas"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                Ver programas por objetivos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── COACH ────────────────────────────────────────── */}
      <FadeIn>
        <CoachSection />
      </FadeIn>

      {/* ── TESTIMONIOS ──────────────────────────────────── */}
      <FadeIn>
        <Testimonials />
      </FadeIn>

      {/* ── RESULTADOS ───────────────────────────────────── */}
      <FadeIn>
        <section id="resultados">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Resultados</p>
            <h2 className="text-3xl font-bold tracking-tight">Lo que lograron los alumnos</h2>
          </div>
          <ResultsShowcase />
        </section>
      </FadeIn>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <FadeIn>
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-8 py-16 md:px-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-sky-500/5" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">¿Listo para empezar?</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl max-w-2xl mx-auto">
              Dejá de entrenar sin método. Empezá a progresar.
            </h2>
            <p className="mt-4 text-white/50 max-w-lg mx-auto">
              Escribinos por WhatsApp y armamos tu plan este mes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={WA_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
              >
                Consultar ahora <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold hover:bg-white/10 transition"
              >
                Ver precios
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

    </main>
  );
}
