import { NextResponse } from "next/server";
import { supabaseRoute } from "@/app/lib/supabase/route";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const nextParam = url.searchParams.get("next") ?? "/app";
  const next = nextParam.startsWith("/") ? nextParam : `/${nextParam}`;

  if (!code) return NextResponse.redirect(new URL("/login", url));

  const supabase = await supabaseRoute();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(new URL("/login?error=auth", url));

  return NextResponse.redirect(new URL(next, url));
}
