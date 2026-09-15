import { Badge } from "@/components/ui/badge"
import { cn } from "cn"
import type { MeasureStatus } from "@/lib/research-plan-data"

const STATUS_LABEL: Record<MeasureStatus, string> = {
  calculated: "Calculated",
  needs_clarification: "Needs clarification",
}

// No existing green/amber status convention exists elsewhere in this codebase — this
// follows the one ad hoc amber precedent (question-answers-card.tsx), extended with a
// matching emerald treatment for "calculated."
const STATUS_CLASS: Record<MeasureStatus, string> = {
  calculated: "border-transparent bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  needs_clarification: "border-transparent bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
}

export function StatusBadge({ status, className }: { status: MeasureStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-normal", STATUS_CLASS[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
