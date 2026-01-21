import Link from "next/link";
import { getActiveResultsMedia } from "@/app/lib/results/queries";
import ResultsShowcase from "@/app/components/ResultsShowcase";


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
            href="/programas"
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm hover:bg-white/15"
          >
            Ver programas
          </Link>

          <Link
            href="/tienda"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
          >
            Ir a tienda
          </Link>

          <Link
            href="/app"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
          >
            Entrar a mi panel
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
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Servicios</h2>
            <p className="mt-2 text-white/70">
              Elegí el formato que mejor se adapte a tu nivel, objetivo y disponibilidad.
            </p>
          </div>
          <Link
            href="/tienda"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 md:inline-block"
          >
            Ver opciones
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            {
              title: "Calistenia personalizada (presencial o virtual)",
              desc: "Plan y seguimiento 1:1, con progresión semanal y ajustes según tu rendimiento.",
            },
            {
              title: "Calistenia recreativa",
              desc: "Constancia, fuerza general y salud. Ideal para mejorar sin presión competitiva.",
            },
            {
              title: "Calistenia competitiva",
              desc: "Preparación orientada a competencia: rendimiento, técnica, volumen e intensidad.",
            },
            {
              title: "Calistenia para adultos mayores",
              desc: "Movilidad, postura y fuerza funcional para entrenar seguro y con continuidad.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70">{s.desc}</p>
              <p className="mt-4 text-xs text-white/50">
                Próximo: packs 1/3/6/9/12 meses con descuentos.
              </p>
            </div>
          ))}
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

      {/* RESULTADOS REALES */}
      <section className="mt-14">
        <ResultsShowcase/>
      </section>
    </main>
  );
}
