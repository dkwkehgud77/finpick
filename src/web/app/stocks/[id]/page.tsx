import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RelationList } from "@/components/RelationList";
import { IssueCard } from "@/components/IssueCard";
import { ENTITY_TYPE_CHIP, ENTITY_TYPE_LABELS } from "@/lib/entity-style";
import {
  entities,
  getEntity,
  getIssuesForEntity,
  getRelationsFrom,
  getRelationsTo,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return entities.map((entity) => ({ id: entity.id }));
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = getEntity(id);

  if (!entity) {
    notFound();
  }

  const outgoing = getRelationsFrom(entity.id);
  const incoming = getRelationsTo(entity.id);
  const relatedIssues = getIssuesForEntity(entity.id);

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <Link
        href="/stocks"
        className="flex w-fit items-center gap-1 rounded-full py-1.5 pr-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        종목 목록
      </Link>

      <header className="flex flex-col gap-2.5 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-extrabold text-foreground">
            {entity.name}
          </h1>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${ENTITY_TYPE_CHIP[entity.type]}`}
          >
            {entity.ticker ?? ENTITY_TYPE_LABELS[entity.type]}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {entity.description}
        </p>
      </header>

      <div className="flex flex-col gap-2.5">
        <h2 className="px-1 text-[15px] font-bold text-foreground">
          이 종목이 영향을 주는 관계
        </h2>
        <RelationList relations={outgoing} direction="outgoing" />
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className="px-1 text-[15px] font-bold text-foreground">
          이 종목이 영향을 받는 관계
        </h2>
        <RelationList relations={incoming} direction="incoming" />
      </div>

      {relatedIssues.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-1 text-[15px] font-bold text-foreground">
            관련 이슈
          </h2>
          <div className="flex flex-col gap-3">
            {relatedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
