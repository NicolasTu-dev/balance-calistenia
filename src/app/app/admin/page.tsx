import { getCurrentUserRole } from "@/app/lib/supabase/roles";
import UserRoleTable from "./components/UserRoleTable";

export default async function AdminPage() {
  const myRole = await getCurrentUserRole();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Panel de administración</h1>
        <p className="text-sm text-white/50 mt-1">
          Gestioná los roles de los usuarios de la plataforma.
        </p>
      </div>
      <UserRoleTable myRole={myRole} />
    </div>
  );
}
