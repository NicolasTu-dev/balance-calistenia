import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";
import { hasAdminAccess } from "@/app/lib/supabase/roles";

export async function GET() {
  const supabase = await supabaseRoute();
  const isAdmin = await hasAdminAccess(supabase);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = supabaseAdmin();

  // List all auth users
  const { data: authData, error } = await admin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get all roles
  const { data: rolesData } = await admin.from('user_roles').select('user_id, role, assigned_at');
  const rolesMap = new Map((rolesData ?? []).map((r: { user_id: string; role: string; assigned_at: string }) => [r.user_id, r]));

  const users = authData.users.map((u) => {
    const roleRow = rolesMap.get(u.id) as { role: string; assigned_at: string } | undefined;
    return {
      id: u.id,
      email: u.email ?? '',
      role: (roleRow?.role ?? 'no_socio') as string,
      assigned_at: roleRow?.assigned_at ?? null,
      created_at: u.created_at,
    };
  });

  return NextResponse.json({ users });
}
