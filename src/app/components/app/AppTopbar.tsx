import { supabaseServer } from "@/app/lib/supabase/server";
import { requireActiveMembership } from "@/app/lib/supabase/access";
import ImportPlanButton from "@/app/components/app/ImportPlanButton";

export default async function AppTopbar() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user ?? null;

  const membership = user ? await requireActiveMembership() : { ok: false as const };

  const email = user?.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="px-5 py-4 flex items-center justify-between gap-4">

        {/* Left: avatar + info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-linear-to-br from-emerald-400/30 to-sky-400/30 border border-white/10 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{initial}</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{email}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {membership.ok ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  Membresía activa
                </span>
              ) : (
                <span className="text-xs text-white/40">Sin membresía</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ImportPlanButton disabled={!membership.ok} />

          <form
            action={async () => {
              "use server";
              const { redirect } = await import("next/navigation");
              const supabase = await supabaseServer();
              await supabase.auth.signOut();
              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Salir
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
