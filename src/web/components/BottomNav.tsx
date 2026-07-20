"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/stocks", label: "종목", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-[0_-1px_2px_rgba(15,23,42,0.04),0_-4px_16px_-4px_rgba(15,23,42,0.06)] md:hidden">
      <div className="mx-auto flex w-full max-w-6xl gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-colors",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
