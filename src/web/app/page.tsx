import { IssueCard } from "@/components/IssueCard";
import { issues } from "@/lib/mock-data";

export default function HomePage() {
  const sortedIssues = [...issues].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-6 md:px-6">
      <header className="flex flex-col gap-1 px-1 md:max-w-xl">
        <p className="text-sm font-semibold text-primary">핀픽</p>
        <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">
          오늘의 이슈를
          <br />
          한입에 분석해드려요
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          온톨로지 기반 연쇄영향 분석으로 놓치기 쉬운 관계까지 짚어드려요.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sortedIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
