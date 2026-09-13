import { cn } from "cn"

interface StatBarProps {
  label: string
  value: number
  total: number
  valueLabel?: string
  className?: string
  barClassName?: string
}

/**
 * A horizontal bar with the label, count and percentage always printed as text —
 * never conveyed only through a hover tooltip.
 */
export function StatBar({ label, value, total, valueLabel, className, barClassName }: StatBarProps) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {valueLabel ?? `${value.toLocaleString("en-IN")} (${pct.toFixed(1)}%)`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-primary", barClassName)}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  )
}
