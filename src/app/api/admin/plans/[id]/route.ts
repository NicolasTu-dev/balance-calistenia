import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await supabaseRoute();
  if (!(await hasAdminAccess(supabase))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const planId = Number(id);
  if (isNaN(planId)) return Response.json({ error: "invalid id" }, { status: 400 });

  const admin = supabaseAdmin();

  // Delete exercises first
  await admin.from("plan_exercises").delete().eq("plan_id", planId);

  // Get week IDs for this plan
  const { data: weeks } = await admin
    .from("plan_weeks")
    .select("id")
    .eq("plan_id", planId);

  if (weeks && weeks.length > 0) {
    const weekIds = weeks.map((w) => w.id);
    await admin.from("plan_blocks").delete().in("plan_week_id", weekIds);
    await admin.from("plan_weeks").delete().eq("plan_id", planId);
  }

  // Delete the plan itself
  const { error } = await admin.from("plans").delete().eq("id", planId);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return new Response(null, { status: 204 });
}
