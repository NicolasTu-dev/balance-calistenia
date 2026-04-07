import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";
import { hasAdminAccess } from "@/app/lib/supabase/roles";

export async function POST(req: Request) {
  const supabase = await supabaseRoute();
  const isAdmin = await hasAdminAccess(supabase);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, password } = await req.json() as { userId: string; password: string };
  if (!userId || !password) return NextResponse.json({ error: "Missing userId or password" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });

  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(userId, { password });

  if (error) {
    console.error("[set-default-password] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
