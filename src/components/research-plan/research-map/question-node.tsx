import { Handle, Position, type NodeProps } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { RoleBadge } from "./role-badge"
import type { MapNode } from "./layout"

export function QuestionNode({ data }: NodeProps<MapNode>) {
  if (data.kind !== "question") return null
  const { question, highlighted, onSelect } = data

  return (
    <div className="relative w-56">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <RoleBadge role="question" />
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={Boolean(highlighted)}
        aria-label={`Research question: ${question}${highlighted ? " (selected)" : ""}`}
        className={cn(
          "flex w-full items-start gap-1.5 rounded-lg border bg-card px-3 py-2 text-left text-xs text-foreground shadow-sm transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2",
          highlighted ? "border-transparent shadow-[0_0_0_2px_var(--ring)]" : "border-border"
        )}
      >
        <span className="min-w-0 flex-1 hyphens-auto break-words">{question}</span>
        {highlighted ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="mt-0.5 size-3.5 shrink-0 text-primary" />
        ) : null}
      </button>
    </div>
  )
}
