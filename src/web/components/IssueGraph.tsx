import Link from "next/link";
import { getEntity } from "@/lib/mock-data";
import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_STROKE,
  RELATION_LABELS,
  type ChainStep,
  type ClaimStatus,
  type Entity,
  type EntityType,
  type Issue,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const NODE_R = 22;
const ROOT_R = 26;
const SLOT_W = 96;
const ROW_H = 88;
const PAD_X = 50;
const PAD_TOP = 36;
const PAD_BOTTOM = 20;

const ENTITY_NODE_STYLE: Record<EntityType, string> = {
  company: "fill-blue-50 stroke-blue-400 dark:fill-blue-500/20 dark:stroke-blue-300",
  sector:
    "fill-violet-50 stroke-violet-400 dark:fill-violet-500/20 dark:stroke-violet-300",
  product:
    "fill-emerald-50 stroke-emerald-400 dark:fill-emerald-500/20 dark:stroke-emerald-300",
  etf: "fill-amber-50 stroke-amber-400 dark:fill-amber-500/20 dark:stroke-amber-300",
};

const LEGEND_ORDER: ClaimStatus[] = [
  "confirmed",
  "highly-likely",
  "inferred",
  "unverified",
  "disputed",
];
const LEGEND_DOT: Record<ClaimStatus, string> = {
  confirmed: "bg-emerald-500 dark:bg-emerald-600",
  "highly-likely": "bg-blue-500 dark:bg-blue-600",
  inferred: "bg-amber-500 dark:bg-amber-600",
  unverified: "bg-orange-500 dark:bg-orange-600",
  disputed: "bg-rose-500 dark:bg-rose-600",
};

type StoryNode = {
  entity: Entity;
  step: ChainStep | null;
  children: StoryNode[];
};

function buildStoryTree(issue: Issue): StoryNode | null {
  const root = getEntity(issue.rootEntityId);
  if (!root) return null;

  const nodeMap = new Map<string, StoryNode>();
  const rootNode: StoryNode = { entity: root, step: null, children: [] };
  nodeMap.set(root.id, rootNode);

  for (const step of issue.chain) {
    const entity = getEntity(step.entityId);
    if (!entity || nodeMap.has(entity.id)) continue;
    const parent = nodeMap.get(step.causeEntityId ?? issue.rootEntityId) ?? rootNode;
    const node: StoryNode = { entity, step, children: [] };
    parent.children.push(node);
    nodeMap.set(entity.id, node);
  }

  return rootNode;
}

type PositionedNode = {
  key: string;
  entity: Entity;
  step: ChainStep | null;
  x: number;
  y: number;
  isRoot: boolean;
  children: PositionedNode[];
};

function layout(
  node: StoryNode,
  depth: number,
  xStart: number,
  parentKey: string
): { node: PositionedNode; width: number } {
  const key = `${parentKey}>${node.entity.id}`;

  if (node.children.length === 0) {
    return {
      node: {
        key,
        entity: node.entity,
        step: node.step,
        x: xStart + SLOT_W / 2,
        y: depth * ROW_H,
        isRoot: depth === 0,
        children: [],
      },
      width: SLOT_W,
    };
  }

  let cursor = xStart;
  const children: PositionedNode[] = [];
  for (const child of node.children) {
    const result = layout(child, depth + 1, cursor, key);
    children.push(result.node);
    cursor += result.width;
  }
  const width = Math.max(cursor - xStart, SLOT_W);
  return {
    node: {
      key,
      entity: node.entity,
      step: node.step,
      x: xStart + width / 2,
      y: depth * ROW_H,
      isRoot: depth === 0,
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

export function IssueGraph({
  issue,
  showIssueLink = true,
}: {
  issue: Issue;
  showIssueLink?: boolean;
}) {
  const tree = buildStoryTree(issue);
  if (!tree) return null;

  const { node: root, width: treeWidth } = layout(tree, 0, PAD_X, "root");
  const nodes = flattenNodes(root);
  const edges = collectEdges(root);

  if (edges.length === 0) return null;

  const maxY = Math.max(...nodes.map((n) => n.y));
  const svgWidth = treeWidth + PAD_X * 2;
  const svgHeight = maxY + PAD_TOP + PAD_BOTTOM;

  const presentStatuses = LEGEND_ORDER.filter((status) =>
    edges.some((e) => e.child.step?.status === status)
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-bold text-foreground">핵심 스토리</h2>
          <p className="text-xs text-muted-foreground">{issue.title}</p>
        </div>
        {showIssueLink && (
          <Link
            href={`/issues/${issue.id}`}
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            이슈 보기
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width: svgWidth, height: svgHeight }}
        >
          <svg width={svgWidth} height={svgHeight} className="absolute inset-0">
            {edges.map(({ parent, child }) => {
              const dx = child.x - parent.x;
              const dy = child.y - parent.y;
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
              const status = child.step?.status ?? "inferred";
              const label = child.step ? RELATION_LABELS[child.step.relationType] : "";
              const labelWidth = label.length * 12 + 8;
              return (
                <g key={child.key}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={2}
                    className={CLAIM_STATUS_STROKE[status]}
                    strokeDasharray={status === "disputed" ? "4 3" : undefined}
                  >
                    {child.step && (
                      <title>
                        {child.step.description} ({CLAIM_STATUS_LABELS[status]}{" "}
                        {Math.round(child.step.confidence * 100)}%)
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
              <g key={n.key}>
                <circle
                  cx={n.x}
                  cy={n.y + PAD_TOP}
                  r={n.isRoot ? ROOT_R : NODE_R}
                  strokeWidth={2}
                  className={
                    n.isRoot
                      ? "fill-primary stroke-primary"
                      : ENTITY_NODE_STYLE[n.entity.type]
                  }
                >
                  <title>{n.step?.description ?? n.entity.name}</title>
                </circle>
                <text
                  x={n.x}
                  y={n.y + PAD_TOP + 4}
                  textAnchor="middle"
                  className={cn(
                    "pointer-events-none select-none text-[10px] font-bold",
                    n.isRoot ? "fill-primary-foreground" : "fill-foreground"
                  )}
                >
                  {n.entity.name}
                </text>
              </g>
            ))}
          </svg>
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
