import { supabaseServer } from "./server";
import { supabaseAdmin } from "./admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export type UserRole = 'fundador' | 'administrador' | 'socio' | 'no_socio';

export const ROLE_LABELS: Record<UserRole, string> = {
  fundador: 'Fundador',
  administrador: 'Administrador',
  socio: 'Socio',
  no_socio: 'No Socio',
};

export async function getCurrentUserRole(client?: SupabaseClient): Promise<UserRole> {
  const supabase = client ?? (await supabaseServer());
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 'no_socio';

  // Usamos admin client para bypassear RLS y leer el rol correctamente
  const admin = supabaseAdmin();
  const { data } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .single();

  return (data?.role as UserRole) ?? 'no_socio';
}

export async function hasAdminAccess(client?: SupabaseClient): Promise<boolean> {
  const role = await getCurrentUserRole(client);
  return role === 'administrador';
}

export async function getUserRoleById(userId: string): Promise<UserRole> {
  const admin = supabaseAdmin();
  const { data } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return (data?.role as UserRole) ?? 'no_socio';
}

// Solo administradores pueden asignar roles. Fundadores no tienen permisos de gestión.
export function canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
  if (assignerRole === 'administrador') return true;
  return false;
}
