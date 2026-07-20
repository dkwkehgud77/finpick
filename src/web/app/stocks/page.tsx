"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ENTITY_TYPE_CHIP, ENTITY_TYPE_LABELS } from "@/lib/entity-style";
import { entities } from "@/lib/mock-data";

export default function StocksPage() {
  const [query, setQuery] = useState("");

  const filtered = entities.filter((entity) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      entity.name.toLowerCase().includes(q) ||
      entity.ticker?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-6 md:px-6">
      <header className="flex flex-col gap-1 px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">
          종목
        </h1>
        <p className="text-sm text-muted-foreground">
          온톨로지에 등록된 종목·섹터·ETF를 검색해보세요.
        </p>
      </header>

      <div className="relative md:max-w-md">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="종목명 또는 티커 검색"
          className="h-11 w-full rounded-full bg-muted pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((entity) => (
          <Link
            key={entity.id}
            href={`/stocks/${entity.id}`}
            className="flex items-center justify-between gap-2 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)] transition-transform active:scale-[0.98]"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-foreground">
                {entity.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {entity.description}
              </span>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${ENTITY_TYPE_CHIP[entity.type]}`}
            >
              {entity.ticker ?? ENTITY_TYPE_LABELS[entity.type]}
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            검색 결과가 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
