import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANALYZER_LABELS, type AnalyzerState } from "@/lib/types";

export function AnalyzerStatusList({
  analyzers,
}: {
  analyzers: AnalyzerState[];
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-foreground">AI 분석 상태</h2>
        <span className="text-[11px] text-muted-foreground">
          완료된 분석은 0.1초 내 조회돼요
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {analyzers.map((analyzer) => (
          <span
            key={analyzer.key}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              analyzer.status === "complete"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {analyzer.status === "complete" ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Loader2 className="size-3.5 animate-spin" />
            )}
            {ANALYZER_LABELS[analyzer.key]}
            {analyzer.status === "complete"
              ? " · 완료"
              : ` · 분석중${analyzer.etaMinutes ? ` · 약 ${analyzer.etaMinutes}분 남음` : ""}`}
          </span>
        ))}
      </div>
    </div>
  );
}
