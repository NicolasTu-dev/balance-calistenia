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
    <section className="mt-14">
      <h2 className="text-2xl font-semibold">Lo que dicen los alumnos</h2>
      <p className="mt-2 text-white/60">
        Resultados reales de personas que entrenaron con método.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
          >
            <p className="text-white/80 text-sm leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-auto pt-4 border-t border-white/10">
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-white/40 mt-0.5">{t.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
