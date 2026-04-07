"use client";
import { useEffect, useState, useTransition } from "react";
import { KeyRound } from "lucide-react";

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
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>({});
  const [showPasswordFor, setShowPasswordFor] = useState<string | null>(null);
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
        const errData = await res.json().catch(() => ({}));
        setFeedback((f) => ({ ...f, [userId]: `Error ${res.status}: ${errData?.error ?? "desconocido"}` }));
      }
    });
  }

  function setPassword(userId: string) {
    const password = passwordInputs[userId]?.trim();
    if (!password || password.length < 6) {
      setFeedback((f) => ({ ...f, [userId]: "Mínimo 6 caracteres" }));
      return;
    }
    startTransition(async () => {
      setFeedback((f) => ({ ...f, [userId]: "Guardando..." }));
      const res = await fetch("/api/admin/set-default-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      if (res.ok) {
        setFeedback((f) => ({ ...f, [userId]: "Contraseña seteada" }));
        setShowPasswordFor(null);
        setPasswordInputs((p) => { const n = { ...p }; delete n[userId]; return n; });
        setTimeout(() => setFeedback((f) => { const n = { ...f }; delete n[userId]; return n; }), 2500);
      } else {
        const errData = await res.json().catch(() => ({}));
        setFeedback((f) => ({ ...f, [userId]: `Error: ${errData?.error ?? "desconocido"}` }));
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
            <th className="px-4 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/2 transition">
              <td className="px-4 py-3 max-w-40 md:max-w-none">
                <span className="font-medium text-white/90 truncate block">{user.email}</span>
              </td>
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
              <td className="px-4 py-3">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center justify-end gap-2">
                    {feedback[user.id] && (
                      <span className={`text-xs ${feedback[user.id].startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>
                        {feedback[user.id]}
                      </span>
                    )}
                    {/* Password button */}
                    <button
                      onClick={() => setShowPasswordFor(showPasswordFor === user.id ? null : user.id)}
                      className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/50 hover:bg-white/10 transition flex items-center gap-1"
                      title="Setear contraseña"
                    >
                      <KeyRound className="h-3 w-3" />
                    </button>
                    {/* Membership action */}
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

                  {/* Inline password setter */}
                  {showPasswordFor === user.id && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nueva contraseña"
                        value={passwordInputs[user.id] ?? ""}
                        onChange={(e) => setPasswordInputs((p) => ({ ...p, [user.id]: e.target.value }))}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-white/20 w-40"
                      />
                      <button
                        onClick={() => setPassword(user.id)}
                        className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-300 hover:bg-sky-400/20 transition"
                      >
                        Guardar
                      </button>
                    </div>
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
