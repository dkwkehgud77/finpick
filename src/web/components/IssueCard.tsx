import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { getEntity, getIssueConfidenceSummary } from "@/lib/mock-data";
import { ENTITY_TYPE_CHIP } from "@/lib/entity-style";
import { cn } from "@/lib/utils";
import type { Issue } from "@/lib/types";

export function IssueCard({ issue }: { issue: Issue }) {
  const affectedEntityIds = Array.from(
    new Set([issue.rootEntityId, ...issue.chain.map((step) => step.entityId)])
  );
  const confidenceSummary = getIssueConfidenceSummary(issue);

  return (
    <Link
      href={`/issues/${issue.id}`}
      className="block rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)] transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-snug text-foreground">
          {issue.title}
        </h3>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {issue.summary}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="text-xs font-medium text-muted-foreground/70">
          종합 신뢰도
        </span>
        <ConfidenceBadge
          status={confidenceSummary.status}
          confidence={confidenceSummary.confidence}
        />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {affectedEntityIds.slice(0, 4).map((id) => {
          const entity = getEntity(id);
          if (!entity) return null;
          return (
            <span
              key={id}
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                ENTITY_TYPE_CHIP[entity.type]
              )}
            >
              {entity.name}
            </span>
          );
        })}
        <span className="ml-auto text-xs font-medium text-muted-foreground/70">
          {issue.publishedAt}
        </span>
      </div>
    </Link>
  );
}
