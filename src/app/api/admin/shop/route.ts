import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function GET() {
  if (!(await hasAdminAccess())) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { data, error } = await supabaseAdmin()
    .from("shop_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req: Request) {
  if (!(await hasAdminAccess())) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { data, error } = await supabaseAdmin()
    .from("shop_products")
    .insert({
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      original_price: body.original_price ? Number(body.original_price) : null,
      badge: body.badge || null,
      colors: body.colors ?? [],
      sizes: body.sizes ?? [],
      extra_images: body.extra_images ?? [],
      active: body.active ?? true,
      sort_order: Number(body.sort_order ?? 0),
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
