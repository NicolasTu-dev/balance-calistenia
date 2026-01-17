import { supabaseServer } from "@/app/lib/supabase/server";

export async function getActiveResultsMedia() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("results_media")
    .select("id, kind, title, caption, storage_path, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
