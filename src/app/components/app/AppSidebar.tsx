import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, Shield } from "lucide-react";
import { getCurrentUserRole } from "@/app/lib/supabase/roles";

export default async function AppSidebar() {
  const role = await getCurrentUserRole();
  const isAdmin = role === 'administrador';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl overflow-hidden ring-1 ring-white/10">
            <Image
              src="/brand/logo.jpg"
              alt="Balance Calistenia"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Balance Calistenia</div>
            <div className="text-xs text-white/60">Mi panel</div>
          </div>
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        <Link
          href="/app/planificaciones"
          className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm border border-transparent hover:border-white/10 hover:bg-black/20 transition"
        >
          <span className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 text-emerald-200" />
          </span>
          <div className="flex-1">
            <div className="font-semibold">Planificaciones</div>
            <div className="text-xs text-white/60">Tus planes mensuales</div>
          </div>
        </Link>

        {isAdmin && (
          <Link
            href="/app/admin"
            className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm border border-transparent hover:border-amber-400/20 hover:bg-amber-400/5 transition"
          >
            <span className="h-9 w-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-amber-300" />
            </span>
            <div className="flex-1">
              <div className="font-semibold text-amber-200">Administración</div>
              <div className="text-xs text-white/60">Panel administrativo</div>
            </div>
          </Link>
        )}
      </nav>

      <div className="p-5 border-t border-white/10 text-xs text-white/55">
        MVP • Sprint 1 — Layout premium
      </div>
    </div>
  );
}
