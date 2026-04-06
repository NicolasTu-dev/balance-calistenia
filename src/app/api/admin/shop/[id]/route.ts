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
  const body = await req.json();

  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.price !== undefined) update.price = Number(body.price);
  if ("original_price" in body) update.original_price = body.original_price ? Number(body.original_price) : null;
  if ("badge" in body) update.badge = body.badge || null;
  if (body.colors !== undefined) update.colors = body.colors;
  if (body.sizes !== undefined) update.sizes = body.sizes;
  if (body.extra_images !== undefined) update.extra_images = body.extra_images;
  if (body.active !== undefined) update.active = body.active;
  if (body.sort_order !== undefined) update.sort_order = Number(body.sort_order);

  const { data, error } = await supabaseAdmin()
    .from("shop_products")
    .update(update)
    .eq("id", id)
    .select()
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
  const { error } = await supabaseAdmin()
    .from("shop_products")
    .delete()
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
