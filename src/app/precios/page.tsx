import Link from "next/link";
import { CheckCircle2, ChevronDown } from "lucide-react";

export const metadata = {
  title: "Precios — Balance Calistenia",
  description:
    "Planificación mensual de calistenia por $40.000 ARS. Acceso al panel, plan personalizado y seguimiento.",
};

const WA_URL =
  "https://wa.me/5491159288809?text=Hola%2C+quiero+consultar+sobre+la+planificaci%C3%B3n+mensual+de+calistenia";

const features = [
  "Planificación mensual personalizada",
  "Acceso completo al panel de alumno",
  "Actualización mensual del plan",
  "Seguimiento y progresión estructurada",
  "Soporte por WhatsApp",
];

const faqs = [
  {
    q: "¿Puedo cancelar cuando quiero?",
    a: "Sí, la membresía es mensual. Si no renovás, el acceso se desactiva al vencer el período.",
  },
  {
    q: "¿Cómo recibo mi planificación?",
    a: "Una vez activo tu acceso, la planificación aparece en tu panel en la sección Planificaciones.",
  },
  {
    q: "¿El plan es el mismo para todos?",
    a: "No. Cada plan se arma según tu nivel, objetivo y disponibilidad semanal.",
  },
];

export default function PreciosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Planes y precios
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Un solo plan. Todo lo que necesitás para{" "}
          <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
            entrenar con estructura.
          </span>
        </h1>
      </div>

      {/* Pricing card */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur ring-1 ring-white/5 shadow-xl">
        {/* Badge */}
        <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Plan mensual
        </span>

        <h2 className="mt-4 text-2xl font-semibold">
          Planificación de calistenia
        </h2>

        {/* Price */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">$40.000</span>
          <span className="text-lg text-white/60">/ mes</span>
        </div>
        <p className="mt-1 text-sm text-white/50">Pesos argentinos (ARS)</p>

        {/* Features */}
        <ul className="mt-8 space-y-3">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span className="text-sm text-white/80">{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 px-6 py-4 text-base font-semibold text-black transition hover:opacity-90"
        >
          Consultar por WhatsApp
        </a>

        {/* Note */}
        <p className="mt-4 text-center text-xs text-white/40">
          El acceso al panel se activa dentro de las 24 hs de confirmado el pago.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-semibold">{q}</h3>
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
              </div>
              <p className="mt-3 text-sm text-white/60">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
