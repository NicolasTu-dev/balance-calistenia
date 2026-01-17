import { supabaseServer } from "@/app/lib/supabase/server";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  kind: "recorded" | "live" | "call";
  content_url: string | null;
  active: boolean;
  requires_membership: boolean;
  sort_order: number;
  created_at: string;
};

export async function listCourses(): Promise<Course[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,description,kind,content_url,active,requires_membership,sort_order,created_at")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,description,kind,content_url,active,requires_membership,sort_order,created_at")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Course;
}

export async function isMembershipActive(): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data } = await supabase
    .from("memberships")
    .select("status,expires_at")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!data) return false;
  if (data.status !== "active") return false;
  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) return false;
  return true;
}
