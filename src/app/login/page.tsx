"use client";

import { useMemo, useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/app/lib/supabase/client";
import { Mail, RefreshCw, PencilLine, ExternalLink } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 5 && email.includes("@");
  }, [email]);

  async function sendLink(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowser();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=/app/planificaciones`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;
      setSentTo(email.trim());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message ?? "No se pudo enviar el link. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function openWebmail() {
    window.open("https://mail.google.com", "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] p-6">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Ingresar</h1>
            <p className="text-sm text-white/60 mt-1">
              Te enviamos un link seguro a tu email para ingresar.
            </p>
          </div>
        </div>

        {!sentTo ? (
          <form onSubmit={sendLink} className="mt-6 space-y-3">
            <label className="block text-sm text-white/70">Email</label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300/40"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-2xl py-3 font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <p className="text-xs text-white/55 mt-2">
              Tip: revisá <b>Spam</b> o <b>Promociones</b>. Puede tardar 10–30 segundos.
            </p>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/70">Link enviado a:</p>
              <p className="mt-1 font-semibold">{sentTo}</p>
              <p className="mt-2 text-xs text-white/55">
                Abrí tu correo y tocá el botón “Ingresar”. Si no llega, podés reenviar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={openWebmail}
                className="rounded-2xl py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
              >
                Abrir correo <ExternalLink className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => sendLink()}
                disabled={loading}
                className="rounded-2xl py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reenviar
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSentTo(null);
                setEmail(sentTo);
                setError(null);
              }}
              className="w-full rounded-2xl py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
            >
              <PencilLine className="h-4 w-4" />
              Cambiar email
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
