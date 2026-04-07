"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/app/lib/supabase/client";
import { KeyRound } from "lucide-react";

export default function CuentaPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!next || !confirm) { setError("Completá todos los campos."); return; }
    if (next.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (next !== confirm) { setError("Las contraseñas no coinciden."); return; }

    setLoading(true);
    const supabase = supabaseBrowser();

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError("No se pudo verificar tu sesión."); setLoading(false); return; }

    if (current) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInErr) {
        setError("La contraseña actual es incorrecta.");
        setLoading(false);
        return;
      }
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: next });

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess("Contraseña actualizada correctamente.");
      setCurrent("");
      setNext("");
      setConfirm("");
    }

    setLoading(false);
  }

  return (
    <main className="max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <KeyRound className="h-5 w-5 text-white/60" />
        </span>
        <div>
          <h1 className="text-lg font-bold">Mi cuenta</h1>
          <p className="text-xs text-white/40">Cambiá tu contraseña</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Contraseña actual</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Tu contraseña actual"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la nueva contraseña"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-3 font-semibold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </main>
  );
}
