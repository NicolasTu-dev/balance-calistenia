import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { supabaseRoute } from "@/app/lib/supabase/server-route";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await supabaseRoute();
  if (!(await hasAdminAccess(supabase))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const planId = Number(id);
  if (isNaN(planId)) return Response.json({ error: "invalid id" }, { status: 400 });

  const body = await req.json() as { title?: string; admin_note?: string; active?: boolean };
  const admin = supabaseAdmin();

  // If setting active=true, deactivate all other plans for this user first
  if (body.active === true) {
    const { data: plan } = await admin
      .from("plans")
      .select("owner_user_id")
      .eq("id", planId)
      .single();

    if (plan) {
      await admin
        .from("plans")
        .update({ active: false })
        .eq("owner_user_id", plan.owner_user_id)
        .neq("id", planId);
    }
  }

  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.admin_note !== undefined) update.admin_note = body.admin_note;
  if (body.active !== undefined) update.active = body.active;

  const { data, error } = await admin
    .from("plans")
    .update(update)
    .eq("id", planId)
    .select("id, title, admin_note, active")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

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
