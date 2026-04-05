import Link from "next/link";
import { getActiveResultsMedia } from "@/app/lib/results/queries";
import ResultsShowcase from "@/app/components/ResultsShowcase";
import CoachSection from "@/app/components/CoachSection";

export const metadata = {
  title: "Balance Calistenia — Entrená con estructura",
  description:
    "Planificación mensual de calistenia con seguimiento personalizado. Fuerza, skills y progresión real.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const results = await getActiveResultsMedia();
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      {/* HERO */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-wide text-white/70">
          Calistenia • Fuerza • Skills
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Entrená con estructura. <span className="text-white/80">Progresá con calistenia.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/70">
          Bienvenido a Balance: programas y planificación progresiva para mejorar rendimiento,
          técnica y control corporal de forma segura y sostenida en el tiempo.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/precios"
            className="rounded-xl px-5 py-3 text-sm font-semibold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
          >
            Hacerme Socio
          </Link>

          <Link
            href="#resultados"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
          >
            Ver resultados
          </Link>

          <Link
            href="/app"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            Mi panel
          </Link>
        </div>
      </section>

      {/* QUÉ ES */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">¿Qué es Balance Calistenia?</h2>

        <div className="mt-5 space-y-4 text-white/70">
          <p>
            Balance Calistenia es un sistema de entrenamiento enfocado en desarrollar fuerza,
            resistencia y skills a través de la calistenia, con una planificación clara y progresiva.
          </p>

          <p>
            Nació para resolver uno de los mayores problemas del entrenamiento con el peso corporal:
            entrenar sin estructura y sin saber cómo progresar.
          </p>

          <p>
            En Balance no entrenás al azar. Cada plan tiene un objetivo, una lógica y un camino definido,
            adaptado a tu nivel y a tus capacidades.
          </p>

          <p>
            El enfoque combina calistenia clásica, preparación física y experiencia real en el entrenamiento,
            para que mejores rendimiento, técnica y control corporal de forma segura y sostenida en el tiempo.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Lo que ofrecemos</h2>
        <p className="mt-2 text-white/70">
          Una planificación mensual de calistenia, diseñada para tu nivel y objetivo.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Main service card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
            <div>
              <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                Plan mensual
              </span>
              <h3 className="mt-3 text-lg font-semibold">Planificación mensual</h3>
              <p className="mt-1 text-xl font-bold text-white/90">$40.000 ARS / mes</p>
            </div>
            <ul className="mt-4 space-y-2">
              {[
                "Plan personalizado según tu nivel y objetivo",
                "Acceso a tu panel de alumno con todas las semanas",
                "Se actualiza cada mes",
                "Soporte continuo por WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-0.5 text-emerald-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/precios"
                className="inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
              >
                Ver precios y consultar →
              </Link>
            </div>
          </div>

          {/* Merch card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
            <h3 className="text-lg font-semibold">Merch Balance</h3>
            <p className="mt-2 text-sm text-white/70">
              Remeras y shorts oficiales de Balance Calistenia.
            </p>
            <div className="mt-6">
              <Link
                href="/tienda"
                className="inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
              >
                Ver tienda →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Programas de entrenamiento Balance</h2>
        <p className="mt-2 text-white/70">
          Dos formas de entrenar: por nivel o por objetivo.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">1) Balance por Nivel</h3>
            <p className="mt-2 text-sm text-white/70">
              Construí base, resistencia y fortaleza. Progresión hacia skills:
              muscle up, back lever, vertical, front lever, plancha.
            </p>
            <Link
              href="/programas"
              className="mt-5 inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Ver programas por nivel
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">2) Balance por Objetivos</h3>
            <p className="mt-2 text-sm text-white/70">
              Tu primera dominada, calistenia en casa, cambio físico 90 días,
              fuerza total, descenso de peso.
            </p>
            <Link
              href="/programas"
              className="mt-5 inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Ver programas por objetivos
            </Link>
          </div>
        </div>
      </section>

      {/* QUIÉN SOY */}
      <CoachSection />

      {/* RESULTADOS REALES */}
      <section id="resultados" className="mt-14">
        <ResultsShowcase/>
      </section>
    </main>
  );
}
