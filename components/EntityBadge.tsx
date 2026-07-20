import Link from "next/link";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_CHIP, ENTITY_TYPE_LABELS } from "@/lib/entity-style";
import type { Entity } from "@/lib/types";

export function EntityBadge({ entity }: { entity: Entity }) {
  return (
    <Link
      href={`/stocks/${entity.id}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-80",
        ENTITY_TYPE_CHIP[entity.type]
      )}
    >
      {entity.name}
      <span className="font-medium opacity-60">
        {entity.ticker ?? ENTITY_TYPE_LABELS[entity.type]}
      </span>
    </Link>
  );
}
