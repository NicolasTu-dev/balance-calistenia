import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";

export async function GET() {
  const supabase = await supabaseRoute();
  if (!(await hasAdminAccess(supabase))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const admin = supabaseAdmin();

  // Get all plans
  const { data: plans, error: plansErr } = await admin
    .from("plans")
    .select("id, title, slug, created_at, active, owner_user_id")
    .order("created_at", { ascending: false });

  if (plansErr) return Response.json({ error: plansErr.message }, { status: 500 });

  // Get all auth users to resolve emails
  const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (usersErr) return Response.json({ error: usersErr.message }, { status: 500 });

  const emailById = new Map(usersData.users.map((u) => [u.id, u.email ?? u.id]));

  const result = (plans ?? []).map((p) => ({
    ...p,
    owner_email: emailById.get(p.owner_user_id) ?? p.owner_user_id,
  }));

  return Response.json(result);
}
