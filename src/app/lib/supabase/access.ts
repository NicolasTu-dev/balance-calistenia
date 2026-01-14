import { supabaseServer } from "@/app/lib/supabase/server";

type MembershipResult =
  | { ok: true; reason: "ok" }
  | { ok: false; reason: "no_user" | "no_membership" | "db_error" };

type EntitlementRow = {
  status: string;
  ends_at: string | null;
};

export async function requireActiveMembership(): Promise<MembershipResult> {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return { ok: false, reason: "no_user" };

  const { data, error } = await supabase
    .from("entitlements")
    .select("status, ends_at")
    .eq("user_id", userData.user.id)
    .eq("status", "active");

  if (error || !data) return { ok: false, reason: "db_error" };

  const entitlements = data as EntitlementRow[];

  const hasActive = entitlements.some((e) => {
    if (!e.ends_at) return true;
    return new Date(e.ends_at).getTime() > Date.now();
  });

  return hasActive
    ? { ok: true, reason: "ok" }
    : { ok: false, reason: "no_membership" };
}
