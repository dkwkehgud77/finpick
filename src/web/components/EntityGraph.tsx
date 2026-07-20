"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { getCoreEdges } from "@/lib/graph";
import { getEntity } from "@/lib/mock-data";
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

const NODE_R = 22;
const ROOT_R = 26;
const SLOT_W = 100;
const ROW_H = 92;
const PAD_X = 54;
const PAD_TOP = 40;
const PAD_BOTTOM = 24;

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

type PositionedNode = {
  key: string;
  entity: Entity;
  relation: Relation | null;
  x: number;
  y: number;
  isRoot: boolean;
  canToggle: boolean;
  isExpanded: boolean;
  children: PositionedNode[];
};

function layout(
  entityId: string,
  relation: Relation | null,
  depth: number,
  xStart: number,
  ancestors: Set<string>,
  expandedIds: Set<string>,
  parentKey: string
): { node: PositionedNode; width: number } | null {
  const entity = getEntity(entityId);
  if (!entity) return null;

  const key = `${parentKey}>${entityId}`;
  const expandableEdges = getCoreEdges(entityId).filter(
    (edge) => !ancestors.has(edge.entity.id)
  );
  const isExpanded = depth === 0 || expandedIds.has(key);

  if (!isExpanded || expandableEdges.length === 0) {
    const x = xStart + SLOT_W / 2;
    const y = depth * ROW_H;
    return {
      node: {
        key,
        entity,
        relation,
        x,
        y,
        isRoot: depth === 0,
        canToggle: expandableEdges.length > 0,
        isExpanded,
        children: [],
      },
      width: SLOT_W,
    };
  }

  let cursor = xStart;
  const children: PositionedNode[] = [];
  for (const edge of expandableEdges) {
    const result = layout(
      edge.entity.id,
      edge.relation,
      depth + 1,
      cursor,
      new Set(ancestors).add(edge.entity.id),
      expandedIds,
      key
    );
    if (!result) continue;
    children.push(result.node);
    cursor += result.width;
  }
  const width = Math.max(cursor - xStart, SLOT_W);
  const x = xStart + width / 2;
  const y = depth * ROW_H;
  return {
    node: {
      key,
      entity,
      relation,
      x,
      y,
      isRoot: depth === 0,
      canToggle: true,
      isExpanded: true,
      children,
    },
    width,
  };
}

function flattenNodes(node: PositionedNode, acc: PositionedNode[] = []) {
  acc.push(node);
  node.children.forEach((child) => flattenNodes(child, acc));
  return acc;
}

function collectEdges(
  node: PositionedNode,
  acc: { parent: PositionedNode; child: PositionedNode }[] = []
) {
  node.children.forEach((child) => {
    acc.push({ parent: node, child });
    collectEdges(child, acc);
  });
  return acc;
}

export function EntityGraph({ rootEntityId }: { rootEntityId: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const result = layout(
    rootEntityId,
    null,
    0,
    PAD_X,
    new Set([rootEntityId]),
    expandedIds,
    "root"
  );

  if (!result) {
    return null;
  }

  const { node: root, width: treeWidth } = result;
  const nodes = flattenNodes(root);
  const edges = collectEdges(root);
  const maxY = Math.max(...nodes.map((n) => n.y));
  const svgWidth = treeWidth + PAD_X * 2;
  const svgHeight = maxY + PAD_TOP + PAD_BOTTOM;

  const presentStatuses = LEGEND_ORDER.filter((status) =>
    edges.some((e) => e.child.relation?.status === status)
  );

  function toggle(key: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-foreground">핵심 관계도</h2>
        {expandedIds.size > 0 && (
          <button
            type="button"
            onClick={() => setExpandedIds(new Set())}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            전체 접기
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        노드를 누르면 그 종목의 핵심 관계가 아래로 펼쳐져요.
      </p>

      <div className="overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width: svgWidth, height: svgHeight }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            className="absolute inset-0"
          >
            {edges.map(({ parent, child }) => {
              const dx = child.x - parent.x;
              const dy = child.y - parent.y + PAD_TOP;
              const dist = Math.hypot(dx, dy) || 1;
              const ux = dx / dist;
              const uy = dy / dist;
              const parentR = parent.isRoot ? ROOT_R : NODE_R;
              const x1 = parent.x + ux * parentR;
              const y1 = parent.y + PAD_TOP + uy * parentR;
              const x2 = child.x - ux * NODE_R;
              const y2 = child.y + PAD_TOP - uy * NODE_R;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const status = child.relation?.status ?? "inferred";
              const label = child.relation
                ? RELATION_LABELS[child.relation.type]
                : "";
              const labelWidth = label.length * 12 + 8;
              return (
                <g
                  key={child.key}
                  className="animate-in fade-in-0 zoom-in-95 duration-300"
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={2}
                    className={CLAIM_STATUS_STROKE[status]}
                    strokeDasharray={status === "disputed" ? "4 3" : undefined}
                  >
                    {child.relation && (
                      <title>
                        {child.entity.name} · {label} ·{" "}
                        {CLAIM_STATUS_LABELS[status]}{" "}
                        {Math.round(child.relation.confidence * 100)}%
                      </title>
                    )}
                  </line>
                  {label && (
                    <>
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
                    </>
                  )}
                </g>
              );
            })}

            {nodes.map((n) => (
              <circle
                key={n.key}
                cx={n.x}
                cy={n.y + PAD_TOP}
                r={n.isRoot ? ROOT_R : NODE_R}
                strokeWidth={2}
                className={cn(
                  "animate-in fade-in-0 zoom-in-95 duration-300",
                  n.isRoot ? "fill-primary stroke-primary" : ENTITY_NODE_STYLE[n.entity.type]
                )}
              >
                <title>{n.entity.name}</title>
              </circle>
            ))}
          </svg>

          {nodes.map((n) => (
            <button
              key={n.key}
              type="button"
              disabled={!n.canToggle}
              onClick={() => toggle(n.key)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 px-1 text-center text-[10px] font-bold transition-colors animate-in fade-in-0 zoom-in-95 duration-300",
                n.isRoot
                  ? "text-primary-foreground"
                  : "text-foreground",
                n.canToggle && !n.isRoot && "hover:text-primary",
                n.canToggle ? "cursor-pointer" : "cursor-default"
              )}
              style={{ left: n.x, top: n.y + PAD_TOP }}
            >
              {n.entity.name}
              {n.canToggle && (
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1.5 flex size-3.5 items-center justify-center rounded-full border border-card text-white",
                    n.isExpanded ? "bg-muted-foreground" : "bg-primary"
                  )}
                >
                  {n.isExpanded ? (
                    <Minus className="size-2" strokeWidth={3} />
                  ) : (
                    <Plus className="size-2" strokeWidth={3} />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
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
