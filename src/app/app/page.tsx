import Link from "next/link";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { supabaseServer } from "@/app/lib/supabase/server";
import { getCurrentUserRole, type UserRole } from "@/app/lib/supabase/roles";

const ROLE_LABELS: Record<UserRole, string> = {
  fundador: "Fundador",
  administrador: "Administrador",
  socio: "Socio",
  no_socio: "No Socio",
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  fundador: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  administrador: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
  socio: "bg-sky-400/10 text-sky-300 border border-sky-400/20",
  no_socio: "bg-white/5 text-white/40 border border-white/10",
};

export default async function AppHome() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  const membership = await requireActiveMembership();
  const role = await getCurrentUserRole();

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Balance Calistenia</h1>

        <form
          action={async () => {
            "use server";
            const supabase = await supabaseServer(); 
            await supabase.auth.signOut();
          }}
        >
          <button className="rounded-xl border px-3 py-2 text-sm">
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600">Usuario</p>
            <p className="font-medium">{data.user?.email}</p>
          </div>
          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${ROLE_BADGE_CLASSES[role]}`}>
            {ROLE_LABELS[role]}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Membresía</p>

          {membership.ok ? (
            <p className="font-medium">Activa</p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">Sin acceso</p>
              <Link
                href="/precios"
                className="inline-block rounded-xl bg-black text-white px-4 py-2 text-sm"
              >
                Hacerme Socio
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 mt-6">
        <Link
          className="rounded-2xl border p-5 hover:shadow-sm"
          href="/app/planificaciones"
        >
          <h2 className="font-semibold">Planificaciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ver tu planificación mensual en formato semanal.
          </p>
        </Link>
      </div>
    </main>
  );
}
