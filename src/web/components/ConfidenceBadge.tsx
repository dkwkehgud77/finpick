import {
  AlertTriangle,
  CircleHelp,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_STYLE,
  type ClaimStatus,
} from "@/lib/types";

const STATUS_ICON: Record<ClaimStatus, typeof ShieldCheck> = {
  confirmed: ShieldCheck,
  "highly-likely": ShieldCheck,
  inferred: CircleHelp,
  unverified: ShieldAlert,
  disputed: AlertTriangle,
};

export function ConfidenceBadge({
  status,
  confidence,
  className,
}: {
  status: ClaimStatus;
  confidence: number;
  className?: string;
}) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
        CLAIM_STATUS_STYLE[status],
        className
      )}
    >
      <Icon className="size-3" />
      {CLAIM_STATUS_LABELS[status]} {Math.round(confidence * 100)}%
    </span>
  );
}
