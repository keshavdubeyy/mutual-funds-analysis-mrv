import { Handle, Position, type NodeProps } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { RoleBadge } from "./role-badge"
import type { MapNode } from "./layout"

export function ThemeNode({ data }: NodeProps<MapNode>) {
  if (data.kind !== "theme") return null
  const { name, questionCount, expanded, highlighted, onToggle } = data

  return (
    <div className="relative w-64">
      <Handle type="target" position={Position.Left} />
      {expanded ? <Handle type="source" position={Position.Right} /> : null}
      <RoleBadge role="kpi" />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`${name} theme, ${questionCount} question${questionCount === 1 ? "" : "s"} — ${expanded ? "collapse" : "expand"}`}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border bg-card px-4 py-2.5 text-left text-sm font-medium text-foreground shadow-sm transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2",
          highlighted ? "shadow-[0_0_0_3px_var(--ring)]" : "border-border"
        )}
      >
        <span>{name}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {!expanded ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {questionCount}
            </span>
          ) : null}
          <HugeiconsIcon
            icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </span>
      </button>
    </div>
  )
}
