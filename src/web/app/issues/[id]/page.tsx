import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChainStepList } from "@/components/ChainStepList";
import { EntityBadge } from "@/components/EntityBadge";
import { IssueGraph } from "@/components/IssueGraph";
import { getEntity, getIssue, issues } from "@/lib/mock-data";

export function generateStaticParams() {
  return issues.map((issue) => ({ id: issue.id }));
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssue(id);

  if (!issue) {
    notFound();
  }

  const rootEntity = getEntity(issue.rootEntityId);

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-4 md:mx-auto md:w-full md:max-w-2xl md:px-6">
      <Link
        href="/"
        className="flex w-fit items-center gap-1 rounded-full py-1.5 pr-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        홈으로
      </Link>

      <header className="flex flex-col gap-2.5">
        {rootEntity && <EntityBadge entity={rootEntity} />}
        <h1 className="text-xl font-extrabold leading-snug tracking-tight text-foreground">
          {issue.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {issue.summary}
        </p>
        <span className="text-xs font-medium text-muted-foreground/70">
          {issue.publishedAt}
        </span>
      </header>

      <IssueGraph issue={issue} showIssueLink={false} />

      <div className="flex flex-col gap-2.5">
        <h2 className="px-1 text-[15px] font-bold text-foreground">
          연쇄영향 분석
        </h2>
        <ChainStepList chain={issue.chain} />
      </div>
    </div>
  );
}
