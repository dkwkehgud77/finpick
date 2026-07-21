export type EntityType = "company" | "sector" | "product" | "etf";

export type AnalyzerKey = "news" | "earnings" | "summary";

export type AnalyzerState = {
  key: AnalyzerKey;
  status: "complete" | "analyzing";
  etaMinutes?: number;
};

export type Entity = {
  id: string;
  name: string;
  ticker?: string;
  type: EntityType;
  description: string;
  analyzers?: AnalyzerState[];
};

export type RelationType =
  | "PRODUCES"
  | "COMPETES_WITH"
  | "SUPPLIED_BY"
  | "USES"
  | "QUALIFICATION_TEST_WITH"
  | "BELONGS_TO"
  | "HELD_BY";

export type ClaimStatus =
  | "confirmed"
  | "highly-likely"
  | "inferred"
  | "unverified"
  | "disputed";

export type CounterClaim = {
  description: string;
  evidenceIds: string[];
};

export type Relation = {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  evidenceIds: string[];
  confidence: number;
  status: ClaimStatus;
  counterClaim?: CounterClaim;
};

export type SourceType =
  | "disclosure"
  | "ir"
  | "wire"
  | "press"
  | "brokerage"
  | "youtube"
  | "community";

export type Evidence = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  snippet: string;
  sourceType: SourceType;
  sourceReliability: number;
};

export type ImpactLevel = "direct" | "indirect-1" | "indirect-2";

export type ChainStep = {
  entityId: string;
  /** Entity this step's impact flows from. Omitted = flows from the issue's rootEntityId. */
  causeEntityId?: string;
  level: ImpactLevel;
  relationType: RelationType;
  description: string;
  evidenceIds: string[];
  confidence: number;
  status: ClaimStatus;
  counterClaim?: CounterClaim;
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

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  confirmed: "확정",
  "highly-likely": "유력",
  inferred: "추정",
  unverified: "미검증",
  disputed: "상충",
};

export const CLAIM_STATUS_STYLE: Record<ClaimStatus, string> = {
  confirmed:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  "highly-likely":
    "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  inferred: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  unverified:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  disputed: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
};

export const CLAIM_STATUS_STROKE: Record<ClaimStatus, string> = {
  confirmed: "stroke-emerald-500 dark:stroke-emerald-600",
  "highly-likely": "stroke-blue-500 dark:stroke-blue-600",
  inferred: "stroke-amber-500 dark:stroke-amber-600",
  unverified: "stroke-orange-500 dark:stroke-orange-600",
  disputed: "stroke-rose-500 dark:stroke-rose-600",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  disclosure: "공시",
  ir: "기업 IR",
  wire: "통신사",
  press: "언론",
  brokerage: "증권사",
  youtube: "유튜브",
  community: "커뮤니티",
};

export const ANALYZER_LABELS: Record<AnalyzerKey, string> = {
  news: "뉴스 분석",
  earnings: "실적 분석",
  summary: "종합 리포트",
};
