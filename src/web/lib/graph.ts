import { getEntity, getRelationsFrom, getRelationsTo } from "@/lib/mock-data";
import type { ClaimStatus, Entity, Relation } from "@/lib/types";

export type GraphEdge = {
  entity: Entity;
  relation: Relation;
  direction: "outgoing" | "incoming";
};

const CORE_STATUSES: ClaimStatus[] = ["confirmed", "highly-likely", "disputed"];
const MAX_NODES = 6;

function buildEdges(entityId: string): GraphEdge[] {
  const outgoing = getRelationsFrom(entityId).map((relation) => ({
    relation,
    entity: getEntity(relation.targetId),
    direction: "outgoing" as const,
  }));
  const incoming = getRelationsTo(entityId).map((relation) => ({
    relation,
    entity: getEntity(relation.sourceId),
    direction: "incoming" as const,
  }));
  return [...outgoing, ...incoming].filter(
    (edge): edge is GraphEdge => !!edge.entity
  );
}

export function getCoreEdges(entityId: string): GraphEdge[] {
  return buildEdges(entityId)
    .filter((edge) => CORE_STATUSES.includes(edge.relation.status))
    .sort((a, b) => b.relation.confidence - a.relation.confidence)
    .slice(0, MAX_NODES);
}
