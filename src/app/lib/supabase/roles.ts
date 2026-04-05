import { supabaseServer } from "./server";
import { supabaseAdmin } from "./admin";

export type UserRole = 'fundador' | 'administrador' | 'socio' | 'no_socio';

export const ROLE_LABELS: Record<UserRole, string> = {
  fundador: 'Fundador',
  administrador: 'Administrador',
  socio: 'Socio',
  no_socio: 'No Socio',
};

export async function getCurrentUserRole(): Promise<UserRole> {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 'no_socio';

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .single();

  return (data?.role as UserRole) ?? 'no_socio';
}

export async function hasAdminAccess(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'administrador' || role === 'fundador';
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

export function canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
  if (assignerRole === 'fundador') return true;
  if (assignerRole === 'administrador') return targetRole !== 'fundador';
  return false;
}
