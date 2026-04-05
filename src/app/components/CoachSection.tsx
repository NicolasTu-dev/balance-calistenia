import Link from "next/link";

const INSTAGRAM_PROFILE = "https://www.instagram.com/balance_calistenia/";
const INSTAGRAM_REELS = [
  "https://www.instagram.com/p/DMGHGD3xNcY/",
  "https://www.instagram.com/p/DV__sLZD5To/",
];

export default function CoachSection() {
  return (
    <section className="mt-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
          {/* Left: identity */}
          <div>
            <p className="text-sm font-medium text-emerald-400 tracking-widest uppercase mb-3">
              Entrenador & Fundador
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              ¿Quién está detrás de Balance?
            </h2>

            <div className="mt-6 space-y-4 text-white/70 text-base leading-relaxed">
              <p>
                Atleta y Entrenador de Calistenia & Street Workout, dedicado a la
                enseñanza y a la práctica de esta disciplina. 🔥🤸‍♂️
              </p>
              <p>
                Creador de <span className="text-white font-medium">Balance Calistenia</span> —
                no solo como entrenamiento, sino como estilo de vida. 🤍
              </p>
              <p className="italic text-white/50">
                Sabiduría, templanza y coraje.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-linear-to-r from-pink-500 via-rose-500 to-orange-400 text-white hover:opacity-90 transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @balance_calistenia
              </Link>
            </div>
          </div>

          {/* Right: video links */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
              Ver en acción
            </p>
            {INSTAGRAM_REELS.map((url, i) => (
              <Link
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-pink-500/20 to-orange-400/20 border border-pink-500/20">
                  <svg className="h-5 w-5 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {i === 0 ? "Entrenamiento en calistenia" : "Skills y progresión"}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">Ver en Instagram →</p>
                </div>
              </Link>
            ))}

            <div className="mt-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
              <p className="text-sm text-emerald-300 font-medium">¿Querés entrenar con método?</p>
              <p className="mt-1 text-sm text-white/60">
                Escribime directo y te armo una planificación personalizada.
              </p>
              <Link
                href="/precios"
                className="mt-4 inline-block rounded-xl bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Ver planes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
