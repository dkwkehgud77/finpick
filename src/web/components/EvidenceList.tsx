import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getEvidenceList } from "@/lib/mock-data";
import { SOURCE_TYPE_LABELS } from "@/lib/types";

export function EvidenceList({ evidenceIds }: { evidenceIds: string[] }) {
  const evidenceList = getEvidenceList(evidenceIds);

  if (evidenceList.length === 0) {
    return <p className="text-xs text-muted-foreground">근거 없음</p>;
  }

  return (
    <Accordion>
      <AccordionItem value="evidence" className="border-none">
        <AccordionTrigger className="py-1 text-xs font-bold text-primary no-underline hover:no-underline **:data-[slot=accordion-trigger-icon]:size-3.5 **:data-[slot=accordion-trigger-icon]:text-primary">
          근거 {evidenceList.length}건 보기
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 pt-1">
            {evidenceList.map((evidence) => (
              <a
                key={evidence.id}
                href={evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-0.5 rounded-xl bg-muted p-3 transition-colors hover:bg-secondary"
              >
                <span className="text-xs font-bold text-foreground">
                  {evidence.title}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {evidence.source} · {evidence.publishedAt}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground/80">
                  {SOURCE_TYPE_LABELS[evidence.sourceType]} · 출처 신뢰도{" "}
                  {Math.round(evidence.sourceReliability * 100)}%
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {evidence.snippet}
                </span>
              </a>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
