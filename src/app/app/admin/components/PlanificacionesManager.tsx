"use client";

import { useEffect, useRef, useState } from "react";

type Plan = {
  id: number;
  title: string;
  created_at: string;
  active: boolean;
  owner_user_id: string;
  owner_email: string;
};

type UserGroup = {
  user_id: string;
  email: string;
  plans: Plan[];
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <span className="font-bold text-white">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function PlanificacionesManager() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Import state
  const [importingFor, setImportingFor] = useState<{ id: string; email: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // User search
  const [allUsers, setAllUsers] = useState<{ id: string; email: string }[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  async function fetchPlans() {
    setLoading(true);
    const res = await fetch("/api/admin/plans");
    if (!res.ok) { setLoading(false); return; }
    const plans: Plan[] = await res.json();

    // Group by user
    const map = new Map<string, UserGroup>();
    for (const p of plans) {
      const key = p.owner_user_id;
      if (!map.has(key)) {
        map.set(key, { user_id: key, email: p.owner_email, plans: [] });
      }
      map.get(key)!.plans.push(p);
    }
    setGroups(Array.from(map.values()));
    setLoading(false);
  }

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.users ?? []);
    setAllUsers(list.map((u: { id: string; email: string }) => ({ id: u.id, email: u.email })));
  }

  useEffect(() => {
    fetchPlans();
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete(planId: number, title: string) {
    if (!confirm(`¿Eliminar la planificación "${title}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/plans/${planId}`, { method: "DELETE" });
    if (res.ok || res.status === 204) fetchPlans();
  }

  async function handleUpload() {
    if (!importingFor) return;
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadError("Seleccioná un archivo .xlsx"); return; }
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setUploadError("Solo se permite .xlsx");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadOk(false);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("target_user_id", importingFor.id);

    const res = await fetch("/api/plans/import", { method: "POST", body: fd });
    const data = await res.json();

    setUploading(false);

    if (!res.ok || !data.ok) {
      setUploadError(data?.details ?? data?.error ?? "Error importando");
      return;
    }

    setUploadOk(true);
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => {
      setImportingFor(null);
      setUploadOk(false);
      fetchPlans();
    }, 1500);
  }

  const filteredUsers = search.trim()
    ? allUsers.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    : allUsers;

  // ── Import panel ────────────────────────────────────────────────────────────
  if (importingFor) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Importar planificación</h2>
            <p className="text-sm text-white/50 mt-0.5">Para: <span className="text-emerald-300">{importingFor.email}</span></p>
          </div>
          <button
            onClick={() => { setImportingFor(null); setUploadError(null); setUploadOk(false); }}
            className="text-sm text-white/50 hover:text-white"
          >
            ← Volver
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <p className="text-sm text-white/60">
            Subí el archivo <b>.xlsx</b> exportado desde Google Sheets. Se creará el plan en la cuenta del usuario seleccionado.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="block flex-1 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/15"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="shrink-0 rounded-xl bg-linear-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Importando…" : "Importar"}
            </button>
          </div>

          {uploadError && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {uploadError}
            </div>
          )}
          {uploadOk && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300">
              ✓ Planificación importada correctamente
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Main list ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header + user picker */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <p className="text-sm text-white/50">
          {groups.length} usuario{groups.length !== 1 ? "s" : ""} con planificaciones
        </p>

        {/* Quick user picker to import for someone */}
        <div className="flex gap-2 w-full sm:w-auto" ref={searchRef}>
          <div className="relative flex-1 sm:w-72">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Buscar usuario para importar plan…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 transition"
            />

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-white/40">Sin resultados</p>
                ) : (
                  <>
                    {!search.trim() && (
                      <p className="px-3 pt-2.5 pb-1 text-xs text-white/30 uppercase tracking-wider">
                        Todos los usuarios ({allUsers.length})
                      </p>
                    )}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredUsers.slice(0, 10).map((u) => {
                        const hasPlans = groups.some((g) => g.user_id === u.id);
                        return (
                          <button
                            key={u.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setImportingFor(u);
                              setSearch("");
                              setDropdownOpen(false);
                              setUploadError(null);
                              setUploadOk(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-white/10 transition"
                          >
                            <span className="truncate text-white/70">
                              <HighlightMatch text={u.email} query={search} />
                            </span>
                            <span className="ml-auto shrink-0 flex items-center gap-2">
                              {hasPlans && (
                                <span className="text-xs text-white/30">
                                  {groups.find((g) => g.user_id === u.id)?.plans.length} plan{groups.find((g) => g.user_id === u.id)?.plans.length !== 1 ? "es" : ""}
                                </span>
                              )}
                              <span className="text-xs text-emerald-400">Importar →</span>
                            </span>
                          </button>
                        );
                      })}
                      {filteredUsers.length > 10 && (
                        <p className="px-3 py-2 text-xs text-white/30 text-center border-t border-white/5">
                          +{filteredUsers.length - 10} más — escribí para filtrar
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-white/40 py-8 text-center">Cargando…</div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50 text-sm">Ningún usuario tiene planificaciones todavía.</p>
          <p className="text-white/30 text-xs mt-1">Buscá un usuario arriba para importarle su primera planificación.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.user_id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {/* User header */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 bg-white/5 border-b border-white/10">
                <div>
                  <p className="text-sm font-medium text-white truncate">{group.email}</p>
                  <p className="text-xs text-white/40 mt-0.5">{group.plans.length} planificación{group.plans.length !== 1 ? "es" : ""}</p>
                </div>
                <button
                  onClick={() => {
                    setImportingFor({ id: group.user_id, email: group.email });
                    setUploadError(null);
                    setUploadOk(false);
                  }}
                  className="shrink-0 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/20 transition"
                >
                  + Importar plan
                </button>
              </div>

              {/* Plans list */}
              <div className="divide-y divide-white/5">
                {group.plans.map((plan) => (
                  <div key={plan.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{plan.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        Importado: {new Date(plan.created_at).toLocaleDateString("es-AR")}
                        {" · "}
                        <span className={plan.active ? "text-emerald-400" : "text-white/30"}>
                          {plan.active ? "Activo" : "Inactivo"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/app/planificaciones/${plan.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition"
                      >
                        Ver
                      </a>
                      <button
                        onClick={() => handleDelete(plan.id, plan.title)}
                        className="rounded-lg border border-red-400/20 text-red-400/70 px-3 py-1.5 text-xs hover:bg-red-400/10 hover:text-red-400 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
