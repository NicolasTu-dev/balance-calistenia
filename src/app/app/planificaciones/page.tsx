import Link from "next/link";
import { requireActiveMembership } from "@/app/lib/supabase/access";

type PlanCard = {
  slug: string;
  title: string;
  subtitle?: string;
};

const PLANS: PlanCard[] = [
  {
    slug: "mes-6",
    title: "Sexto mes — Descenso de peso",
    subtitle: "Fuerza + skills + volumen controlado",
  },
  // Más planes cuando quieras:
  // { slug: "mes-7", title: "Séptimo mes — ...", subtitle: "..." },
];

export default async function PlanificacionesPage() {
  const membership = await requireActiveMembership();

  if (!membership.ok) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-gray-600 mt-2">
          Necesitás membresía activa para ver tus planificaciones.
        </p>

        <Link
          href="/tienda"
          className="inline-block mt-4 rounded-xl bg-black text-white px-4 py-2 text-sm"
        >
          Activar membresía
        </Link>

        <div className="mt-6">
          <Link href="/app" className="text-sm underline">
            Volver al dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-600">Área de alumno</p>
          <h1 className="text-2xl font-semibold">Planificaciones</h1>
        </div>

        <Link href="/app" className="text-sm underline">
          Volver
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {PLANS.map((p) => (
          <Link
            key={p.slug}
            href={`/app/planificaciones/${p.slug}`}
            className="rounded-2xl border p-5 hover:shadow-sm"
          >
            <div className="font-semibold">{p.title}</div>
            {p.subtitle && (
              <div className="text-sm text-gray-600 mt-1">{p.subtitle}</div>
            )}
            <div className="text-sm underline mt-4">Ver planificación</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
