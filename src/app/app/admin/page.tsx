import { getCurrentUserRole } from "@/app/lib/supabase/roles";
import UserRoleTable from "./components/UserRoleTable";
import MembershipTable from "./components/MembershipTable";
import ShopManager from "./components/ShopManager";
import PlanificacionesManager from "./components/PlanificacionesManager";
import Link from "next/link";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "membresias" ? "membresias" : tab === "tienda" ? "tienda" : tab === "planificaciones" ? "planificaciones" : "roles";
  const myRole = await getCurrentUserRole();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Panel Administrativo</h1>
        <p className="text-sm text-white/50 mt-1">
          Gestioná usuarios, membresías, tienda y planificaciones.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
        <Link
          href="/app/admin?tab=roles"
          className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 transition ${
            activeTab === "roles"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Roles
        </Link>
        <Link
          href="/app/admin?tab=membresias"
          className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 transition ${
            activeTab === "membresias"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Membresías
        </Link>
        <Link
          href="/app/admin?tab=tienda"
          className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 transition ${
            activeTab === "tienda"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Tienda
        </Link>
        <Link
          href="/app/admin?tab=planificaciones"
          className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 transition ${
            activeTab === "planificaciones"
              ? "border-emerald-400 text-emerald-300"
              : "border-transparent text-white/50 hover:text-white/80"
          }`}
        >
          Planificaciones
        </Link>
      </div>

      {activeTab === "roles" ? (
        <UserRoleTable myRole={myRole} />
      ) : activeTab === "membresias" ? (
        <MembershipTable />
      ) : activeTab === "tienda" ? (
        <ShopManager />
      ) : (
        <PlanificacionesManager />
      )}
    </div>
  );
}
