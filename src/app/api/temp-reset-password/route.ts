import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const SECRET = "balance-reset-2025";

export async function POST(req: Request) {
  const { secret, email, password } = await req.json();

  if (secret !== SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  const { data: user, error: findErr } = await admin
    .from("auth.users")
    .select("id")
    .eq("email", email)
    .single();

  // Use auth admin API to find user by email
  const { data: listData, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

  const found = listData.users.find((u) => u.email === email);
  if (!found) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { error: updateErr } = await admin.auth.admin.updateUserById(found.id, { password });
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, userId: found.id });
}
