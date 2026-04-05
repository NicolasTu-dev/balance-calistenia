import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { hasAdminAccess } from "@/app/lib/supabase/roles";

export async function GET() {
  const isAdmin = await hasAdminAccess();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = supabaseAdmin();

  const { data: authData, error } = await admin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: entitlements } = await admin
    .from("entitlements")
    .select("user_id, status, ends_at")
    .eq("status", "active");

  const entMap = new Map((entitlements ?? []).map((e: { user_id: string; status: string; ends_at: string | null }) => [e.user_id, e]));

  const users = authData.users.map((u) => {
    const ent = entMap.get(u.id) as { status: string; ends_at: string | null } | undefined;
    const isActive = ent ? (!ent.ends_at || new Date(ent.ends_at).getTime() > Date.now()) : false;
    return {
      id: u.id,
      email: u.email ?? "",
      hasActiveMembership: isActive,
      membershipEndsAt: ent?.ends_at ?? null,
    };
  });

  return NextResponse.json({ users });
}
