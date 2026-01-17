import Link from "next/link";
import { listCourses, isMembershipActive } from "@/app/lib/courses/queries";

export const dynamic = "force-dynamic";

export default async function ProgramasPage() {
  const [courses, hasMembership] = await Promise.all([
    listCourses(),
    isMembershipActive(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Cursos</h1>
        <p className="mt-3 max-w-2xl text-base opacity-80">
          Cursos grabados, material formativo y enlaces a clases o llamadas en vivo.
          Algunos requieren membresía activa.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="opacity-80">Todavía no hay cursos publicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => {
            const locked = c.requires_membership && !hasMembership;

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur"
              >
                <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                  {c.kind === "recorded"
                    ? "Curso grabado"
                    : c.kind === "live"
                    ? "Clase en vivo"
                    : "Llamada / mentoría"}
                </p>

                <h2 className="mt-2 text-xl font-semibold">{c.title}</h2>

                {c.description && (
                  <p className="mt-3 text-sm opacity-80 line-clamp-3">
                    {c.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-xs opacity-70">
                    {locked ? "Requiere membresía" : "Disponible"}
                  </span>

                  <Link
                    href={locked ? "/tienda" : `/programas/${c.id}`}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                  >
                    {locked ? "Activar membresía" : "Ver curso"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
