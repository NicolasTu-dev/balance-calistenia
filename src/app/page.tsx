import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Balance Calistenia
          </h1>
          <p className="mt-6 text-zinc-300 text-lg">
            Entrenamientos estructurados, progresiones reales y planificación
            inteligente para construir fuerza, estética y control corporal.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-white text-black px-6 py-3 font-medium hover:bg-zinc-200 transition"
            >
              Ingresar
            </Link>
            <Link
              href="/tienda"
              className="rounded-xl border border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-800 transition"
            >
              Ver planes
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-zinc-800 to-zinc-900 p-10 shadow-xl">
          <h2 className="text-xl font-semibold">¿Qué incluye la membresía?</h2>
          <ul className="mt-6 space-y-3 text-zinc-300">
            <li>✔ Planificaciones mensuales estructuradas</li>
            <li>✔ Programas por objetivo (fuerza, peso, skills)</li>
            <li>✔ Biblioteca de ejercicios en video</li>
            <li>✔ Progresiones guiadas</li>
            <li>✔ Acceso desde cualquier dispositivo</li>
          </ul>
        </div>
      </section>

      {/* SECCIÓN PROGRAMAS */}
      <section className="bg-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">
            Programas de entrenamiento
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-zinc-800 p-6">
              <h3 className="font-semibold text-xl">
                Descenso de peso + fuerza
              </h3>
              <p className="mt-2 text-zinc-400">
                Planificaciones diseñadas para quemar grasa sin perder masa
                muscular.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-6">
              <h3 className="font-semibold text-xl">Skills & Control</h3>
              <p className="mt-2 text-zinc-400">
                Handstand, muscle-up, front lever, planche y progresiones reales.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-6">
              <h3 className="font-semibold text-xl">Estética & Volumen</h3>
              <p className="mt-2 text-zinc-400">
                Construí un físico equilibrado con calistenia avanzada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold">
          Entrená con una planificación real
        </h2>
        <p className="mt-4 text-zinc-400">
          Accedé a tu panel, seguí tu progreso y entrená con estructura.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white text-black px-8 py-4 font-semibold hover:bg-zinc-200 transition"
          >
            Comenzar ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
