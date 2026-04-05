"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

type NavItem = { href: string; label: string };

interface NavbarMobileProps {
  isAuthed: boolean;
  hasMembership: boolean;
  navItems: NavItem[];
}

export default function NavbarMobile({
  isAuthed,
  hasMembership,
  navItems,
}: NavbarMobileProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl px-6 py-5 flex flex-col gap-4">
          {/* Nav links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="text-base text-white/80 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}

          {isAuthed && (
            <Link
              href="/app/planificaciones"
              onClick={close}
              className="text-base text-white/80 hover:text-white transition"
            >
              Mi panel
            </Link>
          )}

          <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
            {!isAuthed && (
              <Link
                href="/login"
                onClick={close}
                className={cn(
                  "flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium",
                  "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                )}
              >
                Ingresar
              </Link>
            )}

            {(!isAuthed || !hasMembership) && (
              <Link
                href="/precios"
                onClick={close}
                className={cn(
                  "flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold",
                  "text-black bg-linear-to-r from-emerald-300 via-cyan-300 to-sky-300 hover:opacity-90 transition"
                )}
              >
                Hacerme Socio
              </Link>
            )}

            {isAuthed && (
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className={cn(
                    "w-full flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium",
                    "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                  )}
                >
                  Cerrar sesión
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
