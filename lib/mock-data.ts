import type { Entity, Evidence, Issue, Relation } from "./types";

export const entities: Entity[] = [
  {
    id: "nvidia",
    name: "엔비디아",
    ticker: "NVDA",
    type: "company",
    description: "AI 가속기·GPU를 설계하는 미국 반도체 기업",
  },
  {
    id: "sk-hynix",
    name: "SK하이닉스",
    ticker: "000660",
    type: "company",
    description: "HBM·D램 등 메모리 반도체를 생산하는 국내 기업",
  },
  {
    id: "samsung",
    name: "삼성전자",
    ticker: "005930",
    type: "company",
    description: "메모리·파운드리·완제품을 아우르는 종합 반도체·전자 기업",
  },
  {
    id: "hanmi-semi",
    name: "한미반도체",
    ticker: "042700",
    type: "company",
    description: "HBM 후공정용 TC 본더 등을 공급하는 반도체 장비 기업",
  },
  {
    id: "amd",
    name: "AMD",
    ticker: "AMD",
    type: "company",
    description: "GPU·CPU를 설계하는 엔비디아의 경쟁 반도체 기업",
  },
  {
    id: "hbm",
    name: "HBM",
    type: "product",
    description: "고대역폭 메모리. AI 가속기에 필수적인 적층형 D램",
  },
  {
    id: "memory-sector",
    name: "메모리 반도체",
    type: "sector",
    description: "D램·낸드 등 메모리 반도체 산업 섹터",
  },
  {
    id: "soxx-etf",
    name: "KODEX 반도체",
    ticker: "091160",
    type: "etf",
    description: "국내 반도체 관련주에 분산 투자하는 상장지수펀드",
  },
];

export const evidences: Evidence[] = [
  {
    id: "ev-1",
    title: "엔비디아, 차세대 AI GPU 생산량 확대 발표",
    source: "로이터",
    publishedAt: "2026-07-18",
    url: "https://example.com/news/nvidia-gpu-expansion",
    snippet:
      "엔비디아는 실적발표에서 차세대 GPU 생산 능력을 대폭 확대한다고 밝혔다. 이에 따라 GPU에 탑재되는 HBM 수요도 함께 늘어날 전망이다.",
  },
  {
    id: "ev-2",
    title: "SK하이닉스·삼성전자, HBM 공급 물량 확대 협의",
    source: "한국경제",
    publishedAt: "2026-07-19",
    url: "https://example.com/news/hbm-supply-deal",
    snippet:
      "SK하이닉스와 삼성전자가 엔비디아向 HBM 공급 물량을 늘리기 위한 추가 계약을 협의 중인 것으로 확인됐다.",
  },
  {
    id: "ev-3",
    title: "한미반도체, HBM용 TC본더 수주 잔고 역대 최고",
    source: "매일경제",
    publishedAt: "2026-07-19",
    url: "https://example.com/news/hanmi-backlog",
    snippet:
      "한미반도체의 HBM 후공정 장비 수주 잔고가 역대 최고치를 기록했다고 공시했다. HBM 생산 확대의 직접적인 수혜로 분석된다.",
  },
  {
    id: "ev-4",
    title: "반도체 ETF, HBM 훈풍에 동반 강세",
    source: "서울경제",
    publishedAt: "2026-07-20",
    url: "https://example.com/news/semiconductor-etf-rally",
    snippet:
      "HBM 관련주 강세에 힘입어 국내 반도체 ETF들이 일제히 상승 마감했다.",
  },
  {
    id: "ev-5",
    title: "AMD, GPU 시장 점유율 방어 위해 가격 조정 검토",
    source: "블룸버그",
    publishedAt: "2026-07-19",
    url: "https://example.com/news/amd-price-review",
    snippet:
      "경쟁사 엔비디아의 생산 확대 소식에 AMD가 가격 정책 조정을 검토하는 것으로 알려졌다. 단기적으로 마진 압박 우려가 제기된다.",
  },
  {
    id: "ev-6",
    title: "SK하이닉스, 엔비디아 HBM4 품질 테스트 통과",
    source: "전자신문",
    publishedAt: "2026-07-15",
    url: "https://example.com/news/hynix-hbm4-qualification",
    snippet:
      "SK하이닉스가 엔비디아의 차세대 HBM4 품질 인증을 통과했다고 밝혔다. 차세대 제품 공급망에 우선 진입할 전망이다.",
  },
  {
    id: "ev-7",
    title: "삼성전자, HBM4 인증 절차 막바지",
    source: "전자신문",
    publishedAt: "2026-07-17",
    url: "https://example.com/news/samsung-hbm4-qualification",
    snippet:
      "삼성전자도 엔비디아向 HBM4 품질 인증 마지막 단계에 있는 것으로 전해졌다.",
  },
];

export const relations: Relation[] = [
  {
    id: "rel-1",
    sourceId: "nvidia",
    targetId: "hbm",
    type: "USES",
    evidenceIds: ["ev-1"],
  },
  {
    id: "rel-2",
    sourceId: "hbm",
    targetId: "sk-hynix",
    type: "SUPPLIED_BY",
    evidenceIds: ["ev-2"],
  },
  {
    id: "rel-3",
    sourceId: "hbm",
    targetId: "samsung",
    type: "SUPPLIED_BY",
    evidenceIds: ["ev-2"],
  },
  {
    id: "rel-4",
    sourceId: "sk-hynix",
    targetId: "samsung",
    type: "COMPETES_WITH",
    evidenceIds: [],
  },
  {
    id: "rel-5",
    sourceId: "sk-hynix",
    targetId: "nvidia",
    type: "QUALIFICATION_TEST_WITH",
    evidenceIds: ["ev-6"],
  },
  {
    id: "rel-6",
    sourceId: "samsung",
    targetId: "nvidia",
    type: "QUALIFICATION_TEST_WITH",
    evidenceIds: ["ev-7"],
  },
  {
    id: "rel-7",
    sourceId: "sk-hynix",
    targetId: "hanmi-semi",
    type: "SUPPLIED_BY",
    evidenceIds: ["ev-3"],
  },
  {
    id: "rel-8",
    sourceId: "sk-hynix",
    targetId: "memory-sector",
    type: "BELONGS_TO",
    evidenceIds: [],
  },
  {
    id: "rel-9",
    sourceId: "samsung",
    targetId: "memory-sector",
    type: "BELONGS_TO",
    evidenceIds: [],
  },
  {
    id: "rel-10",
    sourceId: "sk-hynix",
    targetId: "soxx-etf",
    type: "HELD_BY",
    evidenceIds: ["ev-4"],
  },
  {
    id: "rel-11",
    sourceId: "hanmi-semi",
    targetId: "soxx-etf",
    type: "HELD_BY",
    evidenceIds: ["ev-4"],
  },
  {
    id: "rel-12",
    sourceId: "amd",
    targetId: "nvidia",
    type: "COMPETES_WITH",
    evidenceIds: ["ev-5"],
  },
];

export const issues: Issue[] = [
  {
    id: "issue-nvidia-gpu-expansion",
    title: "엔비디아 차세대 GPU 증산, HBM 공급망 전반에 훈풍",
    summary:
      "엔비디아가 차세대 GPU 생산 확대를 발표하며 HBM 수요 증가가 예상된다. 공급사인 SK하이닉스·삼성전자부터 장비사, ETF까지 연쇄적인 영향이 예상되는 반면 경쟁사 AMD는 압박을 받을 수 있다.",
    publishedAt: "2026-07-20",
    rootEntityId: "nvidia",
    chain: [
      {
        entityId: "hbm",
        level: "direct",
        relationType: "USES",
        description:
          "엔비디아의 GPU 생산 확대로 GPU 1개당 탑재되는 HBM 수량이 늘어나며 HBM 수요가 직접적으로 증가한다.",
        evidenceIds: ["ev-1"],
      },
      {
        entityId: "sk-hynix",
        level: "indirect-1",
        relationType: "SUPPLIED_BY",
        description:
          "HBM 주요 공급사인 SK하이닉스는 물량 확대의 직접적인 수혜를 받을 것으로 예상된다.",
        evidenceIds: ["ev-2"],
      },
      {
        entityId: "samsung",
        level: "indirect-1",
        relationType: "SUPPLIED_BY",
        description:
          "삼성전자 역시 HBM 공급사로서 물량 확대 협의가 진행 중이며 수혜가 예상된다.",
        evidenceIds: ["ev-2"],
      },
      {
        entityId: "hanmi-semi",
        level: "indirect-2",
        relationType: "SUPPLIED_BY",
        description:
          "SK하이닉스의 HBM 증산은 후공정 장비를 공급하는 한미반도체의 수주 증가로 이어진다.",
        evidenceIds: ["ev-3"],
      },
      {
        entityId: "soxx-etf",
        level: "indirect-2",
        relationType: "HELD_BY",
        description:
          "SK하이닉스·한미반도체 비중이 높은 국내 반도체 ETF 전반이 동반 강세를 보였다.",
        evidenceIds: ["ev-4"],
      },
      {
        entityId: "amd",
        level: "indirect-2",
        relationType: "COMPETES_WITH",
        description:
          "경쟁사 AMD는 엔비디아의 증산 공세에 맞서 가격 정책을 조정해야 할 수 있어 단기적으로 마진 압박 우려가 있다.",
        evidenceIds: ["ev-5"],
      },
    ],
  },
  {
    id: "issue-hynix-hbm4-qualification",
    title: "SK하이닉스, 엔비디아 HBM4 품질 테스트 통과",
    summary:
      "SK하이닉스가 엔비디아의 차세대 HBM4 품질 인증을 통과하며 차세대 공급망에 우선 진입했다. 삼성전자는 아직 인증 마지막 단계에 있어 격차가 벌어질 수 있다.",
    publishedAt: "2026-07-15",
    rootEntityId: "sk-hynix",
    chain: [
      {
        entityId: "nvidia",
        level: "direct",
        relationType: "QUALIFICATION_TEST_WITH",
        description:
          "SK하이닉스가 엔비디아의 HBM4 품질 인증을 통과해 차세대 제품 공급망에 우선 진입했다.",
        evidenceIds: ["ev-6"],
      },
      {
        entityId: "samsung",
        level: "indirect-1",
        relationType: "COMPETES_WITH",
        description:
          "경쟁사인 삼성전자는 아직 인증 마지막 단계에 있어 상대적으로 공급 개시 시점이 늦어질 가능성이 있다.",
        evidenceIds: ["ev-7"],
      },
      {
        entityId: "soxx-etf",
        level: "indirect-2",
        relationType: "HELD_BY",
        description:
          "SK하이닉스 비중이 높은 반도체 ETF에 긍정적인 영향을 줄 수 있다.",
        evidenceIds: [],
      },
    ],
  },
];

export function getEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function getEntityByTicker(ticker: string): Entity | undefined {
  return entities.find((e) => e.ticker === ticker);
}

export function getEvidence(id: string): Evidence | undefined {
  return evidences.find((e) => e.id === id);
}

export function getEvidenceList(ids: string[]): Evidence[] {
  return ids.map((id) => getEvidence(id)).filter((e): e is Evidence => !!e);
}

export function getIssue(id: string): Issue | undefined {
  return issues.find((i) => i.id === id);
}

export function getIssuesForEntity(entityId: string): Issue[] {
  return issues.filter(
    (issue) =>
      issue.rootEntityId === entityId ||
      issue.chain.some((step) => step.entityId === entityId)
  );
}

export function getRelationsFrom(entityId: string): Relation[] {
  return relations.filter((r) => r.sourceId === entityId);
}

export function getRelationsTo(entityId: string): Relation[] {
  return relations.filter((r) => r.targetId === entityId);
}
