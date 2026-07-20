import Link from "next/link";
import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_STROKE,
  RELATION_LABELS,
  type ClaimStatus,
  type Entity,
  type EntityType,
  type Relation,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export type GraphEdge = {
  entity: Entity;
  relation: Relation;
  direction: "outgoing" | "incoming";
};

const CORE_STATUSES: ClaimStatus[] = ["confirmed", "highly-likely", "disputed"];
const MAX_NODES = 6;
const VIEW_SIZE = 300;
const CENTER = VIEW_SIZE / 2;
const CENTER_RADIUS = 28;
const SATELLITE_RADIUS = 20;
const ORBIT_RADIUS = 108;

const ENTITY_NODE_STYLE: Record<EntityType, string> = {
  company: "fill-blue-50 stroke-blue-400 dark:fill-blue-500/20 dark:stroke-blue-300",
  sector:
    "fill-violet-50 stroke-violet-400 dark:fill-violet-500/20 dark:stroke-violet-300",
  product:
    "fill-emerald-50 stroke-emerald-400 dark:fill-emerald-500/20 dark:stroke-emerald-300",
  etf: "fill-amber-50 stroke-amber-400 dark:fill-amber-500/20 dark:stroke-amber-300",
};

const LEGEND_ORDER: ClaimStatus[] = ["confirmed", "highly-likely", "disputed"];
const LEGEND_DOT: Record<ClaimStatus, string> = {
  confirmed: "bg-emerald-500 dark:bg-emerald-600",
  "highly-likely": "bg-blue-500 dark:bg-blue-600",
  inferred: "bg-amber-500 dark:bg-amber-600",
  unverified: "bg-orange-500 dark:bg-orange-600",
  disputed: "bg-rose-500 dark:bg-rose-600",
};

export function EntityGraph({
  center,
  edges,
}: {
  center: Entity;
  edges: GraphEdge[];
}) {
  const core = edges
    .filter((edge) => CORE_STATUSES.includes(edge.relation.status))
    .sort((a, b) => b.relation.confidence - a.relation.confidence)
    .slice(0, MAX_NODES);

  if (core.length === 0) {
    return null;
  }

  const nodes = core.map((edge, i) => {
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / core.length;
    const x = CENTER + ORBIT_RADIUS * Math.cos(angle);
    const y = CENTER + ORBIT_RADIUS * Math.sin(angle);
    const lineStart = {
      x: CENTER + CENTER_RADIUS * Math.cos(angle),
      y: CENTER + CENTER_RADIUS * Math.sin(angle),
    };
    const lineEnd = {
      x: x - SATELLITE_RADIUS * Math.cos(angle),
      y: y - SATELLITE_RADIUS * Math.sin(angle),
    };
    const label = RELATION_LABELS[edge.relation.type];
    return { edge, x, y, lineStart, lineEnd, label };
  });

  const presentStatuses = LEGEND_ORDER.filter((status) =>
    core.some((edge) => edge.relation.status === status)
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]">
      <h2 className="text-[15px] font-bold text-foreground">핵심 관계도</h2>

      <div className="relative mx-auto aspect-square w-full max-w-[300px]">
        <svg
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          className="absolute inset-0 h-full w-full"
        >
          {nodes.map(({ edge, lineStart, lineEnd, label }) => {
            const midX = (lineStart.x + lineEnd.x) / 2;
            const midY = (lineStart.y + lineEnd.y) / 2;
            const labelWidth = label.length * 12 + 8;
            return (
              <g key={edge.entity.id}>
                <line
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  strokeWidth={2}
                  className={CLAIM_STATUS_STROKE[edge.relation.status]}
                  strokeDasharray={
                    edge.relation.status === "disputed" ? "4 3" : undefined
                  }
                >
                  <title>
                    {edge.entity.name} · {RELATION_LABELS[edge.relation.type]} ·{" "}
                    {CLAIM_STATUS_LABELS[edge.relation.status]}{" "}
                    {Math.round(edge.relation.confidence * 100)}%
                  </title>
                </line>
                <rect
                  x={midX - labelWidth / 2}
                  y={midY - 8}
                  width={labelWidth}
                  height={16}
                  rx={8}
                  className="fill-card"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px] font-semibold"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {nodes.map(({ edge, x, y }) => (
            <circle
              key={edge.entity.id}
              cx={x}
              cy={y}
              r={SATELLITE_RADIUS}
              strokeWidth={2}
              className={ENTITY_NODE_STYLE[edge.entity.type]}
            >
              <title>{edge.entity.name}</title>
            </circle>
          ))}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={CENTER_RADIUS}
            className="fill-primary"
          >
            <title>{center.name}</title>
          </circle>
        </svg>

        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold text-primary-foreground"
          style={{
            left: `${(CENTER / VIEW_SIZE) * 100}%`,
            top: `${(CENTER / VIEW_SIZE) * 100}%`,
          }}
        >
          {center.name}
        </span>

        {nodes.map(({ edge, x, y }) => (
          <Link
            key={edge.entity.id}
            href={`/stocks/${edge.entity.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold text-foreground hover:text-primary"
            style={{
              left: `${(x / VIEW_SIZE) * 100}%`,
              top: `${(y / VIEW_SIZE) * 100}%`,
            }}
          >
            {edge.entity.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {presentStatuses.map((status) => (
          <span
            key={status}
            className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
          >
            <span className={cn("size-2 rounded-full", LEGEND_DOT[status])} />
            {CLAIM_STATUS_LABELS[status]}
          </span>
        ))}
      </div>
    </div>
  );
}
