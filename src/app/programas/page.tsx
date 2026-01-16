import Link from "next/link";
import { listPrograms } from "@/app/lib/programs/queries";
import { getLevelBlurb, getLevelLabel } from "@/app/lib/programs/ui";

export const dynamic = "force-dynamic";

export default async function ProgramasPage() {
  const programs = await listPrograms();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Programas</h1>
        <p className="mt-3 max-w-2xl text-base opacity-80">
          Acá vas a encontrar programas y niveles (fuerza, skills, adultos/salud).
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="opacity-80">Todavía no hay programas cargados.</p>
          <p className="mt-2 text-sm opacity-70">
            Cargalos en Supabase (tabla <code>programs</code>) y aparecen acá automáticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                    {getLevelLabel(p.level)}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{p.name}</h2>
                </div>

                <Link
                  href={`/programas/${p.id}`}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                >
                  Ver
                </Link>
              </div>

              <p className="mt-4 text-sm opacity-80">
                {p.description?.trim() || getLevelBlurb(p.level)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
