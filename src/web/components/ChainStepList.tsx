import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { CounterClaim } from "@/components/CounterClaim";
import { EntityBadge } from "@/components/EntityBadge";
import { EvidenceList } from "@/components/EvidenceList";
import { cn } from "@/lib/utils";
import { getEntity } from "@/lib/mock-data";
import {
  IMPACT_LEVEL_LABELS,
  RELATION_LABELS,
  type ChainStep,
  type ImpactLevel,
} from "@/lib/types";

const LEVEL_ORDER: ImpactLevel[] = ["direct", "indirect-1", "indirect-2"];

const LEVEL_PILL: Record<ImpactLevel, string> = {
  direct: "bg-primary text-primary-foreground",
  "indirect-1": "bg-secondary text-secondary-foreground",
  "indirect-2": "bg-muted text-muted-foreground",
};

const LEVEL_ACCENT: Record<ImpactLevel, string> = {
  direct: "border-l-blue-600",
  "indirect-1": "border-l-blue-300",
  "indirect-2": "border-l-slate-300",
};

export function ChainStepList({ chain }: { chain: ChainStep[] }) {
  const grouped = LEVEL_ORDER.map((level) => ({
    level,
    steps: chain.filter((step) => step.level === level),
  })).filter((group) => group.steps.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {grouped.map(({ level, steps }) => (
        <div key={level} className="flex flex-col gap-2.5">
          <span
            className={cn(
              "w-fit rounded-full px-2.5 py-1 text-xs font-bold",
              LEVEL_PILL[level]
            )}
          >
            {IMPACT_LEVEL_LABELS[level]}
          </span>
          <div className="flex flex-col gap-2.5">
            {steps.map((step, idx) => {
              const entity = getEntity(step.entityId);
              if (!entity) return null;
              return (
                <div
                  key={`${step.entityId}-${idx}`}
                  className={cn(
                    "flex flex-col gap-2 rounded-2xl border-l-4 bg-card p-3.5 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]",
                    LEVEL_ACCENT[level]
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <EntityBadge entity={entity} />
                      <span className="text-xs font-medium text-muted-foreground">
                        {RELATION_LABELS[step.relationType]}
                      </span>
                    </div>
                    <ConfidenceBadge
                      status={step.status}
                      confidence={step.confidence}
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {step.description}
                  </p>
                  <EvidenceList evidenceIds={step.evidenceIds} />
                  {step.status === "disputed" && step.counterClaim && (
                    <CounterClaim counterClaim={step.counterClaim} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
