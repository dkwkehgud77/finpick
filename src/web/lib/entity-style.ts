import type { EntityType } from "./types";

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  company: "종목",
  sector: "섹터",
  product: "제품",
  etf: "ETF",
};

export const ENTITY_TYPE_CHIP: Record<EntityType, string> = {
  company: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  sector:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  product:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  etf: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
};
