export type EntityType = "company" | "sector" | "product" | "etf";

export type Entity = {
  id: string;
  name: string;
  ticker?: string;
  type: EntityType;
  description: string;
};

export type RelationType =
  | "PRODUCES"
  | "COMPETES_WITH"
  | "SUPPLIED_BY"
  | "USES"
  | "QUALIFICATION_TEST_WITH"
  | "BELONGS_TO"
  | "HELD_BY";

export type Relation = {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  evidenceIds: string[];
};

export type Evidence = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  snippet: string;
};

export type ImpactLevel = "direct" | "indirect-1" | "indirect-2";

export type ChainStep = {
  entityId: string;
  level: ImpactLevel;
  relationType: RelationType;
  description: string;
  evidenceIds: string[];
};

export type Issue = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  rootEntityId: string;
  chain: ChainStep[];
};

export const RELATION_LABELS: Record<RelationType, string> = {
  PRODUCES: "생산",
  COMPETES_WITH: "경쟁",
  SUPPLIED_BY: "공급받음",
  USES: "사용",
  QUALIFICATION_TEST_WITH: "품질테스트",
  BELONGS_TO: "소속",
  HELD_BY: "편입",
};

export const IMPACT_LEVEL_LABELS: Record<ImpactLevel, string> = {
  direct: "직접영향",
  "indirect-1": "1단계 간접영향",
  "indirect-2": "2단계 간접영향",
};
