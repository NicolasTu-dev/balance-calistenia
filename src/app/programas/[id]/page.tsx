import { notFound, redirect } from "next/navigation";
import { getCourseById, isMembershipActive } from "@/app/lib/courses/queries";

export const dynamic = "force-dynamic";

export default async function CursoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await getCourseById(id);
  if (!course) return notFound();

  const hasMembership = await isMembershipActive();
  if (course.requires_membership && !hasMembership) {
    redirect("/tienda");
  }

  const kindLabel =
    course.kind === "recorded"
      ? "Curso grabado"
      : course.kind === "live"
      ? "Clase en vivo"
      : "Llamada / mentoría";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">
        {kindLabel}
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        {course.title}
      </h1>

      {course.description && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Descripción</h2>
          <p className="mt-3 text-sm opacity-80">{course.description}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Acceso</h2>

        {course.content_url ? (
          <div className="mt-3">
            <a
              href={course.content_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Abrir contenido
            </a>
            <p className="mt-3 text-xs opacity-70">
              El link puede ser un video grabado, Drive, Zoom/Meet o material complementario.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm opacity-80">
            Este curso todavía no tiene un link cargado.
          </p>
        )}
      </div>

      {/* Espacios listos para crecer */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Materiales</h3>
          <p className="mt-2 text-sm opacity-80">
            (v2) PDF, rutinas, checklist, progresiones y recursos descargables.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Seguimiento</h3>
          <p className="mt-2 text-sm opacity-80">
            (v2) link a llamada / agenda / turnero + historial de sesiones.
          </p>
        </div>
      </div>
    </div>
  );
}
