import Link from "next/link";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import { supabaseServer } from "@/app/lib/supabase/server";

export default async function AppHome() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  const membership = await requireActiveMembership();

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
        <p className="text-sm text-gray-600">Usuario</p>
        <p className="font-medium">{data.user?.email}</p>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Membresía</p>

          {membership.ok ? (
            <p className="font-medium">Activa</p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">Sin acceso</p>
              <Link
                href="/tienda"
                className="inline-block rounded-xl bg-black text-white px-4 py-2 text-sm"
              >
                Activar membresía
              </Link>
              <p className="text-xs text-gray-600">
                (Para demo: podés activar la membresía desde el SQL insertando un
                entitlement)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Link
          className="rounded-2xl border p-5 hover:shadow-sm"
          href="/app/planificaciones"
        >
          <h2 className="font-semibold">Planificaciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ver tu planificación mensual en formato semanal.
          </p>
        </Link>

        <Link
          className="rounded-2xl border p-5 hover:shadow-sm"
          href="/app/videos"
        >
          <h2 className="font-semibold">Videos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Biblioteca de ejercicios (próximamente).
          </p>
        </Link>
      </div>
    </main>
  );
}
