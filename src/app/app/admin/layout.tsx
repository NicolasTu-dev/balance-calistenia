import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/app/lib/supabase/roles";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const isAdmin = await hasAdminAccess();
  if (!isAdmin) redirect("/app");
  return <>{children}</>;
}
