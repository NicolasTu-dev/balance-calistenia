"use client";
import { useEffect, useState, useTransition } from "react";

type UserMembership = {
  id: string;
  email: string;
  hasActiveMembership: boolean;
  membershipEndsAt: string | null;
};

export default function MembershipTable() {
  const [users, setUsers] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/entitlements")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setLoading(false); });
  }, []);

  function doAction(userId: string, endpoint: string) {
    startTransition(async () => {
      setFeedback((f) => ({ ...f, [userId]: "Guardando..." }));
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, hasActiveMembership: endpoint.includes("grant"), membershipEndsAt: data.endsAt ?? null }
              : u
          )
        );
        setFeedback((f) => ({ ...f, [userId]: "Guardado" }));
        setTimeout(() => setFeedback((f) => { const n = { ...f }; delete n[userId]; return n; }), 2000);
      } else {
        setFeedback((f) => ({ ...f, [userId]: "Error" }));
      }
    });
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40 text-sm">Cargando...</div>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40 text-left">
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Vence</th>
            <th className="px-4 py-3 font-medium text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/2 transition">
              <td className="px-4 py-3 font-medium text-white/90">{user.email}</td>
              <td className="px-4 py-3">
                {user.hasActiveMembership ? (
                  <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">Activa</span>
                ) : (
                  <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium bg-white/5 text-white/40 border border-white/10">Sin membresía</span>
                )}
              </td>
              <td className="px-4 py-3 text-white/40 hidden md:table-cell">
                {user.membershipEndsAt ? new Date(user.membershipEndsAt).toLocaleDateString("es-AR") : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {feedback[user.id] && (
                    <span className={`text-xs ${feedback[user.id] === "Error" ? "text-red-400" : "text-emerald-400"}`}>
                      {feedback[user.id]}
                    </span>
                  )}
                  {user.hasActiveMembership ? (
                    <button
                      onClick={() => doAction(user.id, "/api/admin/revoke-membership")}
                      className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20 transition"
                    >
                      Revocar
                    </button>
                  ) : (
                    <button
                      onClick={() => doAction(user.id, "/api/admin/grant-membership")}
                      className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/20 transition"
                    >
                      Dar acceso (30 días)
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
