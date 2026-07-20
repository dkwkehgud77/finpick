import { ArrowRight } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { CounterClaim } from "@/components/CounterClaim";
import { EntityBadge } from "@/components/EntityBadge";
import { EvidenceList } from "@/components/EvidenceList";
import { getEntity } from "@/lib/mock-data";
import { RELATION_LABELS, type Relation } from "@/lib/types";

export function RelationList({
  relations,
  direction,
}: {
  relations: Relation[];
  direction: "outgoing" | "incoming";
}) {
  if (relations.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">등록된 관계가 없어요.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {relations.map((relation) => {
        const otherEntity = getEntity(
          direction === "outgoing" ? relation.targetId : relation.sourceId
        );
        if (!otherEntity) return null;
        return (
          <div
            key={relation.id}
            className="flex flex-col gap-2 rounded-2xl bg-card p-3.5 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {direction === "outgoing" ? (
                  <>
                    <span>{RELATION_LABELS[relation.type]}</span>
                    <ArrowRight className="size-3.5" />
                  </>
                ) : (
                  <>
                    <ArrowRight className="size-3.5 rotate-180" />
                    <span>{RELATION_LABELS[relation.type]}</span>
                  </>
                )}
              </div>
              <ConfidenceBadge
                status={relation.status}
                confidence={relation.confidence}
              />
            </div>
            <EntityBadge entity={otherEntity} />
            <EvidenceList evidenceIds={relation.evidenceIds} />
            {relation.status === "disputed" && relation.counterClaim && (
              <CounterClaim counterClaim={relation.counterClaim} />
            )}
          </div>
        );
      })}
    </div>
  );
}
