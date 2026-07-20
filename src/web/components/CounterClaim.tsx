import { AlertTriangle } from "lucide-react";
import { EvidenceList } from "@/components/EvidenceList";
import type { CounterClaim as CounterClaimType } from "@/lib/types";

export function CounterClaim({
  counterClaim,
}: {
  counterClaim: CounterClaimType;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-500/20 dark:bg-rose-500/10">
      <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-300">
        <AlertTriangle className="size-3.5" />
        상충하는 근거
      </div>
      <p className="text-xs leading-relaxed text-rose-700 dark:text-rose-200">
        {counterClaim.description}
      </p>
      <EvidenceList evidenceIds={counterClaim.evidenceIds} />
    </div>
  );
}
