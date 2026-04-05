import Link from "next/link";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-emerald-400 tracking-widest uppercase mb-4">
        Error 404
      </p>
      <h1 className="text-5xl font-bold tracking-tight">Página no encontrada</h1>
      <p className="mt-5 max-w-md text-white/60">
        La dirección que buscás no existe o fue movida. Podés volver al inicio
        o consultar nuestros planes.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="rounded-xl px-5 py-3 text-sm font-semibold text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
        >
          Volver al inicio
        </Link>
        <Link
          href="/precios"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10 transition"
        >
          Ver precios
        </Link>
      </div>
    </main>
  );
}
