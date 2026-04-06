import { hasAdminAccess } from "@/app/lib/supabase/roles";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function POST(req: Request) {
  if (!(await hasAdminAccess())) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return Response.json({ error: "no file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = supabaseAdmin();

  // Create bucket if it doesn't exist yet
  await admin.storage.createBucket("shop", { public: true }).catch(() => {});

  const { data, error } = await admin.storage
    .from("shop")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from("shop").getPublicUrl(data.path);

  return Response.json({ url: publicUrl });
}
