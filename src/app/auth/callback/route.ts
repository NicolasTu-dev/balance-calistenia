import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  if (!code) {
    return NextResponse.redirect(new URL("/login", url));
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", url));
  }

  return NextResponse.redirect(new URL(next, url));
}
