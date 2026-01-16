import { requireActiveMembership } from "@/app/lib/supabase/access";
import Link from "next/link";
import { Lock } from "lucide-react";
import ImportClient from "./ImportClient";

export default async function ImportPage() {
  const membership = await requireActiveMembership();

  if (!membership.ok) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-white/70">
          Necesitás membresía activa para importar planificaciones.
        </p>
        <Link
          href="/tienda"
          className="mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-black
                     bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Activar membresía
        </Link>
      </div>
    );
  }

  return <ImportClient />;
}
