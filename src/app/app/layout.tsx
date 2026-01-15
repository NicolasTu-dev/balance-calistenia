import type { ReactNode } from "react";
import AppSidebar from "@/app/components/app/AppSidebar";
import AppTopbar from "@/app/components/app/AppTopbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-120px)]">
            <AppSidebar />
          </aside>

          <section className="space-y-6">
            <AppTopbar />
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-6">
                {children}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
