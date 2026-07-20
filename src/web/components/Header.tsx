"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/stocks", label: "종목" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur md:flex md:items-center md:justify-between md:px-8 md:py-4">
      <Link href="/" className="text-base font-extrabold text-foreground">
        핀픽 <span className="font-semibold text-muted-foreground">주식한입</span>
      </Link>
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
