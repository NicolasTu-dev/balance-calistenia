"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ImportClient() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onUpload() {
    setError(null);
    setOk(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo .xlsx");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Solo se permite .xlsx (exportado desde Google Sheets).");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/plans/import", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data?.details ?? data?.error ?? "Error importando XLSX");
        return;
      }

      setOk(data.planId);
      // redirección al plan importado
      window.location.href = `/app/planificaciones/${data.planId}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-semibold">Importar XLSX</h1>
      <p className="mt-2 text-sm text-white/70">
        Exportá tu Google Sheet como <b>.xlsx</b> y subilo. Se creará un plan en tu cuenta.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center gap-3">
          <UploadCloud className="h-5 w-5 text-emerald-200" />
          <div className="text-sm font-semibold">Archivo</div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white hover:file:bg-white/15"
          />
          <button
            onClick={onUpload}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-black
                       bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Importando..." : "Importar"}
          </button>
        </div>

        {error && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {ok && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Importado (Plan #{ok})
          </div>
        )}
      </div>
    </div>
  );
}
