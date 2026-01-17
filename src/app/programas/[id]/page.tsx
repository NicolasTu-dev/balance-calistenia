import { notFound } from "next/navigation";
import { getProgramById } from "@/app/lib/programs/queries";
import { getLevelBlurb, getLevelLabel } from "@/app/lib/programs/ui";

export const dynamic = "force-dynamic";

export default async function ProgramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const program = await getProgramById(id);
  if (!program) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">
        {getLevelLabel(program.level)}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        {program.name}
      </h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Descripción</h2>
        <p className="mt-3 text-sm opacity-80">
          {program.description?.trim() ||
            getLevelBlurb(program.level) ||
            "Sin descripción."}
        </p>
      </div>

      {/* Espacios listos para crecer */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Para quién es</h3>
          <p className="mt-2 text-sm opacity-80">
            (v2) Si querés, sumamos campos en DB como{" "}
            <code>audience</code> / <code>requirements</code>.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Qué vas a lograr</h3>
          <p className="mt-2 text-sm opacity-80">
            (v2) Sumamos <code>outcomes</code> y lo listamos con bullets.
          </p>
        </div>
      </div>
    </div>
  );
}
