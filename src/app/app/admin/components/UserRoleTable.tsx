"use client";

import { useEffect, useState, useTransition } from "react";

type UserRole = 'fundador' | 'administrador' | 'socio' | 'no_socio';

type UserRow = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  fundador: 'Fundador',
  administrador: 'Administrador',
  socio: 'Socio',
  no_socio: 'No Socio',
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  fundador: "bg-amber-400/10 text-amber-300 border border-amber-400/20",
  administrador: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
  socio: "bg-sky-400/10 text-sky-300 border border-sky-400/20",
  no_socio: "bg-white/5 text-white/40 border border-white/10",
};

const ALL_ROLES: UserRole[] = ['fundador', 'administrador', 'socio', 'no_socio'];

// Solo administradores pueden gestionar roles, y pueden asignar cualquiera
function canAssignRole(assignerRole: UserRole): boolean {
  return assignerRole === 'administrador';
}

export default function UserRoleTable({ myRole }: { myRole: UserRole }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setLoading(false); });
  }, []);

  function handleRoleChange(userId: string, newRole: UserRole) {
    startTransition(async () => {
      setFeedback((f) => ({ ...f, [userId]: "Guardando..." }));
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        setFeedback((f) => ({ ...f, [userId]: "Guardado" }));
        setTimeout(() => setFeedback((f) => { const n = { ...f }; delete n[userId]; return n; }), 2000);
      } else {
        setFeedback((f) => ({ ...f, [userId]: "Error" }));
      }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40 text-sm">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40 text-left">
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Registrado</th>
            <th className="px-4 py-3 font-medium text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/2 transition">
              <td className="px-4 py-3 max-w-40 md:max-w-none">
                <span className="font-medium text-white/90 truncate block">{user.email}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${ROLE_BADGE_CLASSES[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </td>
              <td className="px-4 py-3 text-white/40 hidden md:table-cell">
                {new Date(user.created_at).toLocaleDateString('es-AR')}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {feedback[user.id] && (
                    <span className={`text-xs ${feedback[user.id] === 'Error' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {feedback[user.id]}
                    </span>
                  )}
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    disabled={!canAssignRole(myRole) || pending}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-emerald-400/40 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r} className="bg-zinc-900">
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
