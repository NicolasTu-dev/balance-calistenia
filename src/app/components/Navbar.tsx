import Image from "next/image";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { supabaseServer } from "@/app/lib/supabase/server";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/programas", label: "Programas" },
  { href: "/tienda", label: "Tienda" },
];

export default async function Navbar() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user ?? null;

  const membership = user ? await requireActiveMembership() : { ok: false as const };

  const showActivate = !user || (user && !membership.ok);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl overflow-hidden ring-1 ring-white/10">
              <Image
                src="/brand/logo.jpg"
                alt="Balance Calisthenics"
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Balance Calistenia</div>
              <div className="text-xs text-white/60">Calistenia • Fuerza • Skills</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/app/planificaciones"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Mi panel
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <Link
                href="/login"
                className={cn(
                  "hidden sm:inline-flex items-center justify-center",
                  "rounded-xl px-4 py-2 text-sm font-medium",
                  "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                )}
              >
                Ingresar
              </Link>
            )}

            {showActivate && (
              <Link
                href="/tienda"
                className={cn(
                  "inline-flex items-center justify-center",
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  "text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300",
                  "hover:opacity-90 transition"
                )}
              >
                Activar membresía
              </Link>
            )}

            {user && (
              <form
                action={async () => {
                  "use server";
                  const supabase = await supabaseServer();
                  await supabase.auth.signOut();
                }}
              >
                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "rounded-xl px-4 py-2 text-sm font-medium",
                    "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                  )}
                >
                  Cerrar sesión
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
