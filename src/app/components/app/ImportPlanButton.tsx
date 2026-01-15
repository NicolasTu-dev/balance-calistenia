"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";

export default function ImportPlanButton({ disabled }: { disabled?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function open() {
    if (disabled) return;
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black
                   bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition
                   disabled:opacity-50"
        title={disabled ? "Requiere membresía activa" : "Importar planificación XLSX"}
      >
        <Upload className="h-4 w-4" />
        Importar (XLSX)
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/70 rounded-3xl border border-white/10 bg-[#0b0b0b] text-white p-0 w-[min(680px,92vw)]"
      >
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-white/60">Importación</div>
            <div className="text-xl font-semibold">Subir planificación (XLSX)</div>
            <p className="mt-2 text-sm text-white/60">
              V1 acepta únicamente archivos .xlsx exportados desde Google Sheets.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
            <div className="text-sm text-white/70 font-medium">Arrastrá tu archivo acá</div>
            <div className="text-xs text-white/55 mt-1">o seleccioná desde tu PC</div>

            <div className="mt-5">
              <input
                type="file"
                accept=".xlsx"
                className="block w-full text-sm text-white/70
                           file:mr-4 file:rounded-2xl file:border file:border-white/10 file:bg-white/5
                           file:px-4 file:py-2 file:text-sm file:font-semibold
                           hover:file:bg-white/10"
              />
            </div>

            <div className="mt-4 text-xs text-white/55">
              Tip: en Google Sheets → Archivo → Descargar → <b>Microsoft Excel (.xlsx)</b>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            En Sprint 2 esto va a parsear el XLSX y crear tu plan automáticamente.
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-2xl px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
