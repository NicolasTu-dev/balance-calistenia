import { supabaseServer } from "@/app/lib/supabase/server";
import type { Program } from "./types";

export async function listPrograms(): Promise<Program[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("programs")
    .select("id,name,level,description,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Program[];
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("programs")
    .select("id,name,level,description,created_at")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Program;
}
