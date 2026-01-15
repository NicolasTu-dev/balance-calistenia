import Link from "next/link";
import { MapPin, Sparkles, ChevronRight } from "lucide-react";
import CodeRedirect from "./CodeRedirect";
import { supabaseServer } from "@/app/lib/supabase/server";
import { requireActiveMembership } from "@/app/lib/supabase/access";

export default async function Home() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user ?? null;

  const membership = user
    ? await requireActiveMembership()
    : ({ ok: false as const, reason: "no_user" } as const);

  // Un único CTA: si hay sesión, va directo a planificaciones; si no, login
  const ctaHref = user ? "/app/planificaciones" : "/login";

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <CodeRedirect />

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              Planificaciones reales • Acceso inmediato
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
              Entrená con estructura.
              <span className="block text-white/70">Progresá con calistenia.</span>
            </h1>

            <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-xl">
              Balance Calistenia combina fuerza, skills y planificación semanal para que tengas un camino claro:
              qué hacer, cuándo hacerlo y cómo progresar.
            </p>

            {/* UN SOLO BOTÓN */}
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-black
                           bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
              >
                Ir a mi planificación
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black/10">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>

              <p className="mt-3 text-sm text-white/60">
                {user
                  ? "Accedé directo a tu panel."
                  : "Ingresá con tu email y empezá a entrenar con estructura."}
              </p>
            </div>

            {user && (
              <div className="mt-5 text-sm text-white/60">
                Sesión: <span className="text-white/80 font-medium">{user.email}</span>
                {membership.ok && (
                  <span className="ml-2 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-200">
                    Membresía activa
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2 text-sm text-white/60">
              {["Fuerza", "Movilidad", "Skills", "Descenso de peso", "Progresiones"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="gradient-border">
            <div className="rounded-[1.25rem] bg-white/5 border border-white/10 p-6">
              <h2 className="text-lg font-semibold">Qué incluye la membresía</h2>
              <ul className="mt-4 space-y-3 text-white/70 text-sm">
                <li>• Planificaciones mensuales y semanales</li>
                <li>• Estructura por bloques (Básicos / Skills)</li>
                <li>• Ejercicios + series + notas</li>
                <li>• Acceso desde cualquier dispositivo</li>
                <li>• Gestión simple por alumno</li>
              </ul>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                <div className="flex items-center gap-2 font-medium text-white">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  Plaza Giordano Bruno — Caballito
                </div>
                <div className="mt-1 text-white/60">
                  Entrenamientos presenciales + acceso online a la plataforma.
                </div>
              </div>

              {/* Dejamos sólo estado visual; NO CTA extra */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                {user ? (
                  membership.ok ? (
                    <span>Tu acceso está activo. Entrá al panel para ver tus planificaciones.</span>
                  ) : (
                    <span>Tenés sesión iniciada, pero todavía no tenés membresía activa.</span>
                  )
                ) : (
                  <span>Ingresá con tu email para acceder a tu panel.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Descenso de peso + fuerza", desc: "Planificación para quemar grasa sin perder rendimiento." },
            { title: "Skills & Control", desc: "Progresiones para handstand, muscle-up, front lever y más." },
            { title: "Estética & Volumen", desc: "Construcción equilibrada con calistenia y accesorios." },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7 transition"
            >
              <div className="font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-white/65">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-white/50">
          © {new Date().getFullYear()} Balance Calistenia — MVP.
        </div>
      </footer>
    </main>
  );
}
