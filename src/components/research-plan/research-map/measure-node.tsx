import { Handle, Position, type NodeProps } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { cn } from "cn"
import { MeasureDetailSheet } from "@/components/research-plan/measure-detail-sheet"
import { getMeasureById } from "@/lib/research-plan-data"
import { RoleBadge } from "./role-badge"
import type { MapNode } from "./layout"

export function MeasureNode({ data }: NodeProps<MapNode>) {
  if (data.kind !== "measure") return null
  const { measureId, name, excluded, highlighted } = data
  const measure = getMeasureById(measureId)
  if (!measure) return null

  return (
    <div className="relative w-56">
      <Handle type="target" position={Position.Left} />
      <RoleBadge role={excluded ? "excluded" : "metric"} />
      <MeasureDetailSheet
        measure={measure}
        trigger={
          <button
            type="button"
            aria-label={excluded ? `${name} — excluded from analysis, view why` : `${name} — view measure details`}
            className={cn(
              "flex w-full items-start gap-1.5 rounded-lg bg-card px-3 py-2 text-left text-xs shadow-sm transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2",
              excluded ? "border border-dashed border-muted-foreground/40 text-muted-foreground" : "border border-border text-foreground",
              highlighted ? "border-transparent shadow-[0_0_0_2px_var(--ring)]" : ""
            )}
          >
            {excluded ? (
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="mt-0.5 size-3.5 shrink-0" />
            ) : null}
            <span className="min-w-0 flex-1 hyphens-auto break-words font-medium">{name}</span>
          </button>
        }
      />
    </div>
  )
}
