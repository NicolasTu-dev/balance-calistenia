import { supabaseServer } from "@/app/lib/supabase/server";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import ImportPlanButton from "@/app/components/app/ImportPlanButton";

export default async function AppTopbar() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user ?? null;

  const membership = user ? await requireActiveMembership() : { ok: false as const };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs text-white/60">Dashboard</div>
          <div className="text-lg font-semibold">Mi panel</div>
          <div className="text-sm text-white/60 mt-1">
            {user?.email ?? "Sin sesión"}
            {membership.ok && (
              <span className="ml-2 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-200">
                Membresía activa
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ImportPlanButton disabled={!membership.ok} />

          <form
            action={async () => {
              "use server";
              const supabase = await supabaseServer();
              await supabase.auth.signOut();
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium
                         bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
