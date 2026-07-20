"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getCoreEdges } from "@/lib/graph";
import { getEntity } from "@/lib/mock-data";
import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_STROKE,
  RELATION_LABELS,
  type ClaimStatus,
  type EntityType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

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

export function EntityGraph({ rootEntityId }: { rootEntityId: string }) {
  const [path, setPath] = useState<string[]>([rootEntityId]);
  const centerId = path[path.length - 1];
  const center = getEntity(centerId);

  if (!center) {
    return null;
  }

  const core = getCoreEdges(centerId);

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
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-foreground">핵심 관계도</h2>
        {path.length > 1 && (
          <button
            type="button"
            onClick={() => setPath((p) => p.slice(0, -1))}
            className="flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            뒤로
          </button>
        )}
      </div>

      {path.length > 1 && (
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {path.map((id, i) => {
            const pathEntity = getEntity(id);
            if (!pathEntity) return null;
            const isLast = i === path.length - 1;
            return (
              <span key={id} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground/50">›</span>}
                {isLast ? (
                  <span className="font-bold text-foreground">
                    {pathEntity.name}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPath(path.slice(0, i + 1))}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    {pathEntity.name}
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      <div
        key={centerId}
        className="relative mx-auto aspect-square w-full max-w-[300px] animate-in fade-in-0 zoom-in-95 duration-300"
      >
        {core.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary px-1 text-center text-xs font-bold text-primary-foreground">
              {center.name}
            </span>
            <p className="text-xs text-muted-foreground">
              더 확장할 핵심 관계가 없어요.
            </p>
          </div>
        ) : (
          <>
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
                        {edge.entity.name} · {RELATION_LABELS[edge.relation.type]}{" "}
                        · {CLAIM_STATUS_LABELS[edge.relation.status]}{" "}
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
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 px-1 text-center text-[10px] font-bold text-primary-foreground"
              style={{
                left: `${(CENTER / VIEW_SIZE) * 100}%`,
                top: `${(CENTER / VIEW_SIZE) * 100}%`,
              }}
            >
              {center.name}
            </span>

            {nodes.map(({ edge, x, y }) => (
              <button
                key={edge.entity.id}
                type="button"
                onClick={() => setPath((p) => [...p, edge.entity.id])}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-1 text-center text-[10px] font-bold text-foreground transition-colors hover:text-primary"
                style={{
                  left: `${(x / VIEW_SIZE) * 100}%`,
                  top: `${(y / VIEW_SIZE) * 100}%`,
                }}
              >
                {edge.entity.name}
              </button>
            ))}
          </>
        )}
      </div>

      {presentStatuses.length > 0 && (
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
      )}
    </div>
  );
}
