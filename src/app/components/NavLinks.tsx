"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

type NavItem = { href: string; label: string };

export default function NavLinks({
  items,
  isAuthed,
}: {
  items: NavItem[];
  isAuthed: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm transition relative",
            isActive(item.href)
              ? "text-white font-medium after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-emerald-400"
              : "text-white/70 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}

      {isAuthed && (
        <Link
          href="/app"
          className={cn(
            "text-sm transition relative",
            pathname.startsWith("/app")
              ? "text-white font-medium after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-emerald-400"
              : "text-white/70 hover:text-white"
          )}
        >
          Mi panel
        </Link>
      )}
    </nav>
  );
}
