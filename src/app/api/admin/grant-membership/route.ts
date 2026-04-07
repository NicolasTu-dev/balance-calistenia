import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";
import { hasAdminAccess } from "@/app/lib/supabase/roles";

export async function POST(req: Request) {
  const supabase = await supabaseRoute();
  const isAdmin = await hasAdminAccess(supabase);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId } = await req.json() as { userId: string };
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const admin = supabaseAdmin();
  const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  // Upsert entitlement
  const { error } = await admin
    .from("entitlements")
    .upsert({ user_id: userId, status: "active", ends_at: endsAt }, { onConflict: "user_id" });

  if (error) {
    console.error("[grant-membership] upsert error:", error);
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  // Set role to 'socio' if they don't already have a higher role
  const { data: existingRole } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (!existingRole || existingRole.role === "no_socio") {
    await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "socio", assigned_at: new Date().toISOString() }, { onConflict: "user_id" });
  }

  return NextResponse.json({ ok: true, endsAt });
}
