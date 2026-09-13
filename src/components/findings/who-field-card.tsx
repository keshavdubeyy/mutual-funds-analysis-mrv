"use client"

import * as React from "react"
import { cn } from "cn"
import * as RechartsPrimitive from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StatBar } from "@/components/dataset-method/stat-bar"
import type { FieldOption, WhoField } from "@/lib/who-is-in-sample-data"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

// Percentages become misleading (and can approach identifying a handful of
// people) below this many answered respondents — shown as counts only, with
// this rule stated plainly rather than silently suppressing anything.
export const SMALL_GROUP_MIN = 20

function OptionBars({ options, answered }: { options: FieldOption[]; answered: number }) {
  const suppressPct = answered < SMALL_GROUP_MIN
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <StatBar
          key={o.label}
          label={o.label}
          value={o.n}
          total={answered}
          valueLabel={suppressPct ? `${o.n.toLocaleString("en-IN")} (count only)` : undefined}
        />
      ))}
    </div>
  )
}

const MAX_PIE_SLICES = 5
// Shades of the theme's primary color, darkest (the primary itself) to
// lightest — same color-mix approach and range as the funnel steps in
// selection-path.tsx, so the lightest slice stays visible against the card.
const PIE_MAX_WHITE_MIX = 60

function pieShade(index: number, total: number) {
  if (total <= 1) return "var(--primary)"
  const whiteMix = Math.round((index / (total - 1)) * PIE_MAX_WHITE_MIX)
  return `color-mix(in oklch, var(--primary) ${100 - whiteMix}%, white)`
}

function buildPieSlices(options: FieldOption[]) {
  const sorted = [...options].sort((a, b) => b.n - a.n)
  const withOther =
    sorted.length <= MAX_PIE_SLICES + 1
      ? sorted
      : [
          ...sorted.slice(0, MAX_PIE_SLICES),
          {
            label: `Other (${sorted.length - MAX_PIE_SLICES})`,
            n: sorted.slice(MAX_PIE_SLICES).reduce((sum, o) => sum + o.n, 0),
            pct: Math.round(sorted.slice(MAX_PIE_SLICES).reduce((sum, o) => sum + o.pct, 0) * 10) / 10,
          },
        ]
  return withOther.map((o, i) => ({ ...o, fill: pieShade(i, withOther.length) }))
}

function PieTooltip({
  active,
  payload,
  suppressPct,
}: {
  active?: boolean
  payload?: { payload: { label: string; n: number; pct: number; fill: string } }[]
  suppressPct: boolean
}) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      <p className="flex items-center gap-1.5 font-medium text-foreground">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: slice.fill }} />
        {slice.label}
      </p>
      <p className="mt-0.5 text-muted-foreground">
        {suppressPct ? slice.n.toLocaleString("en-IN") : `${slice.pct}% (${slice.n.toLocaleString("en-IN")})`}
      </p>
    </div>
  )
}

function OptionPie({ options, answered }: { options: FieldOption[]; answered: number }) {
  const suppressPct = answered < SMALL_GROUP_MIN
  const slices = buildPieSlices(options)

  return (
    <div className="flex flex-col items-center gap-4">
      <ChartContainer config={{}} className="mx-auto aspect-square h-[180px] w-[180px] shrink-0">
        <RechartsPrimitive.PieChart>
          <RechartsPrimitive.Tooltip content={<PieTooltip suppressPct={suppressPct} />} />
          <RechartsPrimitive.Pie
            data={slices}
            dataKey="n"
            nameKey="label"
            innerRadius="55%"
            outerRadius="100%"
            strokeWidth={2}
            stroke="var(--card)"
          >
            {slices.map((s) => (
              <RechartsPrimitive.Cell key={s.label} fill={s.fill} />
            ))}
          </RechartsPrimitive.Pie>
        </RechartsPrimitive.PieChart>
      </ChartContainer>
      <ul className="w-full space-y-1.5 text-xs">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.fill }} />
              <span className="truncate text-foreground/80">{s.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {suppressPct
                ? `${s.n.toLocaleString("en-IN")} (count only)`
                : `${s.pct}% (${s.n.toLocaleString("en-IN")})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OptionTable({ options, answered }: { options: FieldOption[]; answered: number }) {
  const suppressPct = answered < SMALL_GROUP_MIN
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Option</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Percent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((o) => (
            <TableRow key={o.label}>
              <TableCell className="max-w-xs whitespace-normal">{o.label}</TableCell>
              <TableCell className="text-right tabular-nums">{o.n.toLocaleString("en-IN")}</TableCell>
              <TableCell className="text-right tabular-nums">{suppressPct ? "—" : `${o.pct}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function EmptyOptions() {
  return <p className="text-sm text-muted-foreground">No respondents match the current filters for this question.</p>
}

function CardFooterCounts({ answered, denominator, blank }: { answered: number; denominator: number; blank: number }) {
  return (
    <p className="text-xs text-muted-foreground">
      Answered {answered.toLocaleString("en-IN")} / {denominator.toLocaleString("en-IN")} in current selection ·{" "}
      {blank.toLocaleString("en-IN")} missing/unknown
      {answered < SMALL_GROUP_MIN && answered > 0 ? (
        <span className="ml-1 font-medium text-foreground">— fewer than {SMALL_GROUP_MIN} answered, counts only</span>
      ) : null}
    </p>
  )
}

type FieldView = "bar" | "pie" | "table"

export function FieldBarCard({
  field,
  className,
  defaultView = "bar",
  showViewToggle = true,
}: {
  field: WhoField
  className?: string
  defaultView?: FieldView
  showViewToggle?: boolean
}) {
  const [view, setView] = React.useState<FieldView>(defaultView)

  function handleViewChange(values: string[]) {
    const newest = values.find((v) => v !== view) ?? values[0]
    if (newest) setView(newest as FieldView)
  }

  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm">
          {field.label}
          <TooltipProvider delay={150} closeDelay={0}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label="Question wording"
                    className="text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
                  >
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5" />
                  </button>
                }
              />
              <TooltipContent className="text-left">&ldquo;{field.question_wording}&rdquo;</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        {field.options.length > 0 && showViewToggle ? (
          <CardAction>
            <ToggleGroup value={[view]} onValueChange={handleViewChange} variant="outline" size="sm" spacing={0}>
              <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
              <ToggleGroupItem value="pie">Pie</ToggleGroupItem>
              <ToggleGroupItem value="table">Table</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {field.options.length === 0 ? (
          <EmptyOptions />
        ) : view === "table" ? (
          <OptionTable options={field.options} answered={field.n_answered} />
        ) : view === "pie" ? (
          <OptionPie options={field.options} answered={field.n_answered} />
        ) : (
          <OptionBars options={field.options} answered={field.n_answered} />
        )}

        <CardFooterCounts answered={field.n_answered} denominator={field.denominator} blank={field.n_blank} />
      </CardContent>
    </Card>
  )
}

export function SectionEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center")}>
      <p className="text-sm font-medium text-foreground">No respondents match these filters</p>
      <p className="text-xs text-muted-foreground">Try removing one or more filters.</p>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  )
}
