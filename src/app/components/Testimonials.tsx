const testimonials = [
  {
    name: "Matías R.",
    tag: "Alumno desde hace 6 meses",
    quote:
      "Empecé sin poder hacer una dominada y hoy entreno muscle up. La planificación es clara, progresiva y se adapta a mis tiempos.",
  },
  {
    name: "Lucas F.",
    tag: "Socio activo",
    quote:
      "Lo que más me gustó es que no es un plan genérico — está pensado para mí. El soporte por WhatsApp es inmediato y se nota el seguimiento.",
  },
  {
    name: "Tomás G.",
    tag: "3 meses de entrenamiento",
    quote:
      "Cambié mi físico más en 3 meses con Balance que en un año yendo al gimnasio sin estructura. No hay excusa para no arrancar.",
  },
];

export default function Testimonials() {
  return (
    <section>
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">Testimonios</p>
        <h2 className="text-3xl font-bold tracking-tight">Lo que dicen los alumnos</h2>
        <p className="mt-2 text-white/50">
          Resultados reales de personas que entrenaron con método.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-3xl border border-white/10 bg-white/5 p-7 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Big quote mark */}
            <span className="absolute -top-2 -left-1 text-8xl font-black text-white/5 select-none leading-none">
              &ldquo;
            </span>

            <p className="relative text-white/75 text-sm leading-relaxed pt-4">
              {t.quote}
            </p>

            <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-emerald-300">{t.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-white/40">{t.tag}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
