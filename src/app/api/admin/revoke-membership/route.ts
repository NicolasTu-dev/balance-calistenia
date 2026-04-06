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
  const { error } = await admin
    .from("entitlements")
    .update({ status: "inactive" })
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
