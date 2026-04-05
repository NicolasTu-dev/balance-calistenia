import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { getCurrentUserRole, canAssignRole, type UserRole } from "@/app/lib/supabase/roles";
import { supabaseServer } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const assignerRole = await getCurrentUserRole();
  if (assignerRole !== 'fundador' && assignerRole !== 'administrador') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { userId, role } = body as { userId: string; role: UserRole };

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
  }

  if (!canAssignRole(assignerRole, role)) {
    return NextResponse.json({ error: "No permission to assign this role" }, { status: 403 });
  }

  const admin = supabaseAdmin();
  const { error } = await admin
    .from('user_roles')
    .upsert({ user_id: userId, role, assigned_by: userData.user.id, assigned_at: new Date().toISOString() }, { onConflict: 'user_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
