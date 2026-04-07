"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/app/lib/supabase/client";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Completá todos los campos.");
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setLoading(true);
    const supabase = supabaseBrowser();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(
          error.message.includes("Invalid login")
            ? "Email o contraseña incorrectos."
            : error.message
        );
        setLoading(false);
        return;
      }

      router.push("/app/planificaciones");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(
          error.message.includes("already registered")
            ? "Este email ya está registrado. Iniciá sesión."
            : error.message
        );
        setLoading(false);
        return;
      }

      // Auto sign in after register
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginErr) {
        setSuccess("Cuenta creada. Ya podés iniciar sesión.");
        setMode("login");
        setPassword("");
        setLoading(false);
        return;
      }

      router.push("/app/planificaciones");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition border-b-2 ${
              mode === "login"
                ? "border-emerald-400 text-emerald-300 bg-emerald-400/5"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition border-b-2 ${
              mode === "register"
                ? "border-emerald-400 text-emerald-300 bg-emerald-400/5"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Registrarse
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-1">
            {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
          </h1>
          <p className="text-sm text-white/50 mb-5">
            {mode === "login"
              ? "Ingresá con tu email y contraseña."
              : "Completá tus datos para acceder a la plataforma."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Mínimo 6 caracteres" : "••••••••"}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Confirmar contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí tu contraseña"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-white/25"
                />
              </div>
            )}

            {/* Error / success */}
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
              {loading
                ? mode === "login" ? "Ingresando…" : "Creando cuenta…"
                : mode === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
          </form>

          {mode === "login" && (
            <p className="mt-4 text-center text-xs text-white/40">
              ¿Primera vez?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                Creá tu cuenta
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
