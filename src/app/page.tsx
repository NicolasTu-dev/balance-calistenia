import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import CodeRedirect from "./CodeRedirect";
import { supabaseServer } from "@/app/lib/supabase/server";
import { requireActiveMembership } from "@/app/lib/supabase/access";

export default async function Home() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user ?? null;

  const membership = user ? await requireActiveMembership() : { ok: false as const };

  // CTAs
  const primaryHref = user ? "/app/planificaciones" : "/login";
  const primaryText = user ? "Ir a mi panel" : "Ingresar";
  const secondaryHref = membership.ok ? "/app/planificaciones" : "/tienda";
  const secondaryText = membership.ok ? "Ver planificaciones" : "Ver membresías";

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

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
              >
                {primaryText} <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Si ya tiene membresía activa, ocultamos CTA de tienda y damos CTA suave */}
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                {secondaryText}
              </Link>
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

              {/* Si ya hay membresía activa, sacamos el CTA de activación y dejamos un CTA directo */}
              <div className="mt-6 flex gap-3">
                <Link
                  href={user ? "/app/planificaciones" : "/login"}
                  className="flex-1 rounded-2xl px-4 py-3 text-center font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
                >
                  {user ? "Ir a mi panel" : "Ingresar"}
                </Link>

                {!membership.ok && (
                  <Link
                    href="/tienda"
                    className="flex-1 rounded-2xl px-4 py-3 text-center font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    Activar membresía
                  </Link>
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
