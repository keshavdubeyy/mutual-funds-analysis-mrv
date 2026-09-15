"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatN } from "@/lib/who-is-in-sample-data"
import { capitalize, type BatteryRow } from "@/lib/knowledge-battery"

export type BatteryFilter = "all" | "not-aware"

function BatteryTooltip({ active, payload }: { active?: boolean; payload?: { payload: BatteryRow }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="max-w-xs rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium text-foreground">&ldquo;{row.statement}&rdquo;</p>
      <div className="space-y-0.5 text-muted-foreground">
        <div className="flex justify-between gap-3">
          <span>Selected True</span>
          <span>
            {formatN(row.TRUE_n)} ({row.TRUE_pct}%)
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Selected False</span>
          <span>
            {formatN(row.FALSE_n)} ({row.FALSE_pct}%)
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Selected Not Aware</span>
          <span>
            {formatN(row.NOT_AWARE_n)} ({row.NOT_AWARE_pct}%)
          </span>
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

/** The stacked (or, filtered, single-series "Not Aware only") chart view for `AnalysisChartCard`. */
export function KnowledgeBatteryChart({ rows, filter = "all" }: { rows: BatteryRow[]; filter?: BatteryFilter }) {
  const commonAnswered = rows[0]?.answered ?? 0
  const sortedForNotAware = React.useMemo(
    () => [...rows].sort((a, b) => b.NOT_AWARE_pct - a.NOT_AWARE_pct),
    [rows]
  )

  return (
    <div className="space-y-3">
      {filter === "not-aware" ? (
        <ChartContainer
          config={{ NOT_AWARE_pct: { label: "Selected Not Aware", color: "var(--muted-foreground)" } }}
          className="aspect-auto h-[380px] w-full"
        >
          <RechartsPrimitive.BarChart
            data={sortedForNotAware}
            layout="vertical"
            margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
          >
            <RechartsPrimitive.XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <RechartsPrimitive.YAxis type="category" dataKey="topic" width={140} tick={{ fontSize: 11 }} />
            <RechartsPrimitive.Tooltip content={<BatteryTooltip />} cursor={{ fill: "var(--muted)" }} />
            <RechartsPrimitive.Bar dataKey="NOT_AWARE_pct" fill="var(--muted-foreground)" name="Selected Not Aware" />
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      ) : (
        <ChartContainer
          config={{
            TRUE_pct: { label: "Selected True", color: "var(--primary)" },
            FALSE_pct: { label: "Selected False", color: "var(--chart-4)" },
            NOT_AWARE_pct: { label: "Selected Not Aware", color: "var(--muted-foreground)" },
          }}
          className="aspect-auto h-[380px] w-full"
        >
          <RechartsPrimitive.BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
            <RechartsPrimitive.XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <RechartsPrimitive.YAxis type="category" dataKey="topic" width={140} tick={{ fontSize: 11 }} />
            <RechartsPrimitive.Tooltip content={<BatteryTooltip />} cursor={{ fill: "var(--muted)" }} />
            <RechartsPrimitive.Bar dataKey="TRUE_pct" stackId="a" fill="var(--primary)" name="Selected True" />
            <RechartsPrimitive.Bar dataKey="FALSE_pct" stackId="a" fill="var(--chart-4)" name="Selected False" />
            <RechartsPrimitive.Bar dataKey="NOT_AWARE_pct" stackId="a" fill="var(--muted-foreground)" name="Selected Not Aware" />
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      )}
      {filter === "all" ? (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <LegendDot color="var(--primary)" label="Selected True" />
          <LegendDot color="var(--chart-4)" label="Selected False" />
          <LegendDot color="var(--muted-foreground)" label="Selected Not Aware" />
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {formatN(commonAnswered)} respondents answered each item. &ldquo;Selected Not Aware&rdquo; is an explicit
        response, not missing data, and not a scored answer — this battery has no documented correct/incorrect key.
      </p>
    </div>
  )
}

export function KnowledgeTable({ rows }: { rows: BatteryRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead className="text-right">Selected True</TableHead>
            <TableHead className="text-right">Selected False</TableHead>
            <TableHead className="text-right">Selected Not Aware</TableHead>
            <TableHead className="text-right">Answered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.code}>
              <TableCell className="max-w-xs whitespace-normal">{capitalize(r.topic)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatN(r.TRUE_n)} ({r.TRUE_pct}%)
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatN(r.FALSE_n)} ({r.FALSE_pct}%)
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatN(r.NOT_AWARE_n)} ({r.NOT_AWARE_pct}%)
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatN(r.answered)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function KnowledgeWordingSheet({ rows }: { rows: BatteryRow[] }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>Show full statement wording</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Full statement wording</SheetTitle>
          <SheetDescription>The exact statement behind each short topic label above.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 text-sm">
          {rows.map((r) => (
            <div key={r.code}>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{r.topic}</p>
              <p className="mt-1 text-foreground/90">&ldquo;{r.statement}&rdquo;</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** The "All responses / Not Aware only" filter control, shown in the chart card's controls slot. */
export function KnowledgeFilterToggle({
  value,
  onChange,
}: {
  value: BatteryFilter
  onChange: (value: BatteryFilter) => void
}) {
  function handleChange(values: string[]) {
    const newest = values.find((v) => v !== value) ?? values[0]
    if (newest) onChange(newest as BatteryFilter)
  }
  return (
    <ToggleGroup value={[value]} onValueChange={handleChange} variant="outline" size="sm" spacing={0}>
      <ToggleGroupItem value="all">All responses</ToggleGroupItem>
      <ToggleGroupItem value="not-aware">Not Aware only</ToggleGroupItem>
    </ToggleGroup>
  )
}
