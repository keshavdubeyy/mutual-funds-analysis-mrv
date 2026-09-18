import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { MapNode } from "./layout"

export function CentralNode({ data }: NodeProps<MapNode>) {
  if (data.kind !== "root") return null
  return (
    <div
      className="flex w-56 items-center justify-center rounded-2xl bg-primary px-5 py-4 text-center text-sm font-semibold text-primary-foreground shadow-md"
      role="img"
      aria-label={`Central node: ${data.label}`}
    >
      {data.label}
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  )
}
