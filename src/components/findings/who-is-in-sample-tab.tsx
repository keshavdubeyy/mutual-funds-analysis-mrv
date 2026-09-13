"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { StatBar } from "@/components/dataset-method/stat-bar"
import {
  whoIsInSampleBase,
  formatN,
  PREV_INVESTMENT_LABEL,
  PREV_INVESTMENT_ORDER,
  STATE_TO_ZONE,
  ZONE_LABELS,
  type WhoIsInSampleData,
  type WhoField,
  type KnowledgeItem,
  type Zone,
} from "@/lib/who-is-in-sample-data"
import { FieldBarCard, SectionEmptyState } from "@/components/findings/who-field-card"
import { IndiaStateMap } from "@/components/findings/india-state-map"

interface Filters {
  state: string | null
  urbanrural: string | null
  incomeTier: string | null
  prevInvestment: string | null
}

const EMPTY_FILTERS: Filters = { state: null, urbanrural: null, incomeTier: null, prevInvestment: null }

// The State/UT, Urban-Rural, Personal-income and Previous-MF-investment filter bar is
// hidden per request — not needed for now. Flip to true to bring it back.
const SHOW_TOP_FILTER_BAR = false

function getField(data: WhoIsInSampleData, code: string): WhoField | undefined {
  return data.fields.find((f) => f.field_code === code)
}

function anyActive(f: Filters) {
  return Boolean(f.state || f.urbanrural || f.incomeTier || f.prevInvestment)
}

type UrbanRuralView = "ALL" | "URBAN" | "RURAL"
const UR_VIEWS: UrbanRuralView[] = ["ALL", "URBAN", "RURAL"]
const UR_VIEW_LABEL: Record<UrbanRuralView, string> = { ALL: "All", URBAN: "Urban", RURAL: "Rural" }

const ZONE_TABS = ["ALL", "NORTH", "SOUTH", "EAST", "WEST"] as const
type ZoneTab = (typeof ZONE_TABS)[number]

/**
 * Merges the map and the ranked state list into one card, sharing one pair
 * of filters (zone, urban/rural) between them so the two panes always show
 * the same slice of the data instead of being filtered independently.
 */
function GeographyCard({
  stateField,
  crosstab,
  selectedState,
  onSelectState,
}: {
  stateField: WhoField
  crosstab: { state: string; urban_n: number; rural_n: number }[]
  selectedState: string | null
  onSelectState: (v: string | null) => void
}) {
  const [zoneTab, setZoneTab] = React.useState<ZoneTab>("ALL")
  const [urView, setUrView] = React.useState<UrbanRuralView>("ALL")
  const zone: Zone | null = zoneTab === "ALL" ? null : zoneTab

  const crosstabByState = new Map(crosstab.map((c) => [c.state, c]))

  // The state field, recomputed for the active Urban/Rural view — both the
  // map and the ranked list read from this so they always agree.
  const effectiveField: WhoField = React.useMemo(() => {
    if (urView === "ALL") return stateField
    const options = stateField.options.map((o) => {
      const c = crosstabByState.get(o.label)
      const n = urView === "URBAN" ? (c?.urban_n ?? 0) : (c?.rural_n ?? 0)
      return { label: o.label, n, pct: 0 }
    })
    const total = options.reduce((sum, o) => sum + o.n, 0)
    return {
      ...stateField,
      n_answered: total,
      options: options.map((o) => ({ ...o, pct: total ? Math.round((o.n / total) * 1000) / 10 : 0 })),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- crosstabByState is rebuilt from crosstab every render; keying off crosstab is equivalent and stable
  }, [stateField, crosstab, urView])

  const rankedRows = effectiveField.options
    .filter((o) => !zone || STATE_TO_ZONE[o.label] === zone)
    .sort((a, b) => b.n - a.n)
  const rankedTotal = rankedRows.reduce((sum, r) => sum + r.n, 0)

  const summaryLine = (() => {
    if (zone && urView !== "ALL") {
      return `${formatN(rankedTotal)} ${UR_VIEW_LABEL[urView]} respondents are from ${ZONE_LABELS[zone]} India`
    }
    if (zone) {
      const pct = stateField.n_answered > 0 ? Math.round((rankedTotal / stateField.n_answered) * 1000) / 10 : 0
      return `${formatN(rankedTotal)} respondents (${pct}%) are from ${ZONE_LABELS[zone]} India`
    }
    if (urView !== "ALL") {
      return `${formatN(rankedTotal)} ${UR_VIEW_LABEL[urView]} respondents across ${rankedRows.length} states/UTs`
    }
    return null
  })()

  function handleZoneChange(values: string[]) {
    const newest = values.find((v) => v !== zoneTab) ?? values[0] ?? "ALL"
    setZoneTab(newest as ZoneTab)
  }

  function handleUrViewChange(values: string[]) {
    const newest = values.find((v) => v !== urView) ?? values[0] ?? "ALL"
    setUrView(newest as UrbanRuralView)
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Where respondents live: by state</CardTitle>
        <CardDescription>
          {summaryLine ?? "The map and the ranked list share the same zone and urban/rural filters."}
        </CardDescription>
        <CardAction className="flex flex-wrap items-center gap-2">
          <ToggleGroup value={[zoneTab]} onValueChange={handleZoneChange} variant="outline" size="sm" spacing={0}>
            {ZONE_TABS.map((z) => (
              <ToggleGroupItem key={z} value={z}>
                {z === "ALL" ? "All" : ZONE_LABELS[z]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup value={[urView]} onValueChange={handleUrViewChange} variant="outline" size="sm" spacing={0}>
            {UR_VIEWS.map((v) => (
              <ToggleGroupItem key={v} value={v}>
                {UR_VIEW_LABEL[v]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="lg:h-[480px]">
            <IndiaStateMap field={effectiveField} zone={zone} selected={selectedState} onSelect={onSelectState} />
          </div>
          <div className="lg:h-[480px] lg:overflow-y-auto">
            {rankedTotal === 0 ? (
              <p className="text-sm text-muted-foreground">No respondents match the current filters.</p>
            ) : (
              <div className="space-y-2">
                {rankedRows.map((r) => (
                  <StatBar key={r.label} label={r.label} value={r.n} total={rankedTotal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Q12M states its own numbers (5% return vs. 6% inflation), so the correct
// answer follows from arithmetic in the question itself — real value falls,
// making "Less than today" the only correct option. This is not an external
// answer key being invented (unlike the undocumented GRIDxQ15AM battery,
// which is deliberately never scored — see scripts/export_who_is_in_sample.py).
// "Do not know" and "Refuse to answer" are folded into Incorrect here (a
// simple correct/not-correct binary), rather than shown as their own rows.
const Q12M_CORRECT_LABEL = "Less than today"

function Q12MCorrectnessCard({ field }: { field: WhoField }) {
  let correct = 0
  let incorrect = 0
  for (const o of field.options) {
    if (o.label === Q12M_CORRECT_LABEL) correct += o.n
    else incorrect += o.n
  }
  const total = field.n_answered
  const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 1000) / 10}%` : "—")

  const rows = [
    { label: "Correct", n: correct, emphasize: true },
    { label: "Incorrect", n: incorrect, emphasize: false },
  ].filter((r) => r.n > 0)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Financial literacy: correct vs. incorrect</CardTitle>
        <CardDescription>
          The question states a 5% return against 6% inflation, so real value falls — &ldquo;Less than
          today&rdquo; is the only arithmetically correct answer. Every other answer (including &ldquo;Do not
          know&rdquo; and &ldquo;Refuse to answer&rdquo;) is scored incorrect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className={r.emphasize ? "font-medium text-foreground" : undefined}>{r.label}</TableCell>
                <TableCell className="text-right tabular-nums">{formatN(r.n)}</TableCell>
                <TableCell className="text-right tabular-nums">{pct(r.n)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">
          Answered {formatN(total)} / {formatN(field.denominator)} in current selection · {formatN(field.n_blank)}{" "}
          missing/unknown
        </p>
      </CardContent>
    </Card>
  )
}

// Short axis/topic labels for the GRIDxQ15AM battery, keyed by field_code —
// presentation only. The full original statement is never replaced by this
// label: it stays available via the chart's tooltip and the "full wording"
// disclosure below it.
const BATTERY_TOPIC_LABELS: Record<string, string> = {
  "GRIDxQ15AM[{_1}].Q15AM": "expense ratio (direct plans)",
  "GRIDxQ15AM[{_2}].Q15AM": "PF in stock market",
  "GRIDxQ15AM[{_3}].Q15AM": "compounding (short-term)",
  "GRIDxQ15AM[{_4}].Q15AM": "online KYC",
  "GRIDxQ15AM[{_5}].Q15AM": "demat requirement",
  "GRIDxQ15AM[{_6}].Q15AM": "risk vs. return",
  "GRIDxQ15AM[{_7}].Q15AM": "diversification",
  "GRIDxQ15AM[{_8}].Q15AM": "CAS statement",
  "GRIDxQ15AM[{_9}].Q15AM": "BSDA",
}

function capitalize(s: string) {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

interface BatteryRow {
  code: string
  topic: string
  statement: string
  answered: number
  TRUE_pct: number
  FALSE_pct: number
  NOT_AWARE_pct: number
  TRUE_n: number
  FALSE_n: number
  NOT_AWARE_n: number
}

// Sorted by "Not Aware" share, highest first — the one ordering rule the
// battery supports without inventing a correct/incorrect score.
function buildBatteryRows(items: KnowledgeItem[]): BatteryRow[] {
  return items
    .map((item) => {
      const byLabel = new Map(item.options.map((o) => [o.label, o]))
      return {
        code: item.field_code,
        topic: BATTERY_TOPIC_LABELS[item.field_code] ?? item.label,
        statement: item.label,
        answered: item.n_answered,
        TRUE_pct: byLabel.get("TRUE")?.pct ?? 0,
        FALSE_pct: byLabel.get("FALSE")?.pct ?? 0,
        NOT_AWARE_pct: byLabel.get("Not Aware")?.pct ?? 0,
        TRUE_n: byLabel.get("TRUE")?.n ?? 0,
        FALSE_n: byLabel.get("FALSE")?.n ?? 0,
        NOT_AWARE_n: byLabel.get("Not Aware")?.n ?? 0,
      }
    })
    .sort((a, b) => b.NOT_AWARE_pct - a.NOT_AWARE_pct)
}

function BatteryTooltip({ active, payload }: { active?: boolean; payload?: { payload: BatteryRow }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="max-w-xs rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium text-foreground">&ldquo;{row.statement}&rdquo;</p>
      <div className="space-y-0.5 text-muted-foreground">
        <div className="flex justify-between gap-3">
          <span>True</span>
          <span>
            {formatN(row.TRUE_n)} ({row.TRUE_pct}%)
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>False</span>
          <span>
            {formatN(row.FALSE_n)} ({row.FALSE_pct}%)
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Not Aware</span>
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

/**
 * One chart for all 9 GRIDxQ15AM items — replaces a grid of 9 separate
 * mini-charts (hard to compare across items) with a single stacked bar per
 * item, sorted by "Not Aware" share so the pattern across topics reads at a
 * glance. True/False/Not Aware keep the same colors and order in every row.
 */
function KnowledgeBatteryChart({ items }: { items: KnowledgeItem[] }) {
  const rows = React.useMemo(() => buildBatteryRows(items), [items])
  const commonAnswered = rows[0]?.answered ?? 0

  return (
    <div className="space-y-3">
      <ChartContainer
        config={{
          TRUE_pct: { label: "True", color: "var(--primary)" },
          FALSE_pct: { label: "False", color: "var(--chart-4)" },
          NOT_AWARE_pct: { label: "Not Aware", color: "var(--muted-foreground)" },
        }}
        className="aspect-auto h-[380px] w-full"
      >
        <RechartsPrimitive.BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <RechartsPrimitive.XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <RechartsPrimitive.YAxis type="category" dataKey="topic" width={140} tick={{ fontSize: 11 }} />
          <RechartsPrimitive.Tooltip content={<BatteryTooltip />} cursor={{ fill: "var(--muted)" }} />
          <RechartsPrimitive.Bar dataKey="TRUE_pct" stackId="a" fill="var(--primary)" name="True" />
          <RechartsPrimitive.Bar dataKey="FALSE_pct" stackId="a" fill="var(--chart-4)" name="False" />
          <RechartsPrimitive.Bar dataKey="NOT_AWARE_pct" stackId="a" fill="var(--muted-foreground)" name="Not Aware" />
        </RechartsPrimitive.BarChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <LegendDot color="var(--primary)" label="True" />
        <LegendDot color="var(--chart-4)" label="False" />
        <LegendDot color="var(--muted-foreground)" label="Not Aware" />
      </div>
      <p className="text-xs text-muted-foreground">
        {formatN(commonAnswered)} respondents answered each item. &ldquo;Not Aware&rdquo; is an explicit response,
        not missing data.
      </p>
    </div>
  )
}

function KnowledgeWordingSheet({ items }: { items: KnowledgeItem[] }) {
  const rows = React.useMemo(() => buildBatteryRows(items), [items])

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

/**
 * "Not Aware" is a selected response, not a direct measure of confidence —
 * choosing True or False doesn't establish understanding either. What the
 * data does support is a ranking of reported uncertainty by topic; this
 * section states that distinction plainly rather than overclaiming it.
 */
function KnowledgeTakeaway({ items }: { items: KnowledgeItem[] }) {
  const rows = buildBatteryRows(items)
  const highest = rows.slice(0, 3)
  const lowest = [...rows].reverse().slice(0, 3)
  const bottom = lowest[0]

  return (
    <Card size="sm" className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">Reported uncertainty by topic</CardTitle>
        <CardDescription>
          &ldquo;Not Aware&rdquo; is a selected response, not a direct measure of confidence or accuracy — it
          cannot tell us respondents&apos; overall financial knowledge or why they haven&apos;t invested. What it
          does show is which topics carry the most reported uncertainty, and that varies sharply.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Highest share selecting &ldquo;Not Aware&rdquo;
            </p>
            <ol className="space-y-1.5 text-sm">
              {highest.map((r, i) => (
                <li key={r.code} className="flex items-baseline gap-2">
                  <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                  <span className="flex-1 text-foreground/90">{r.topic}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{r.NOT_AWARE_pct}%</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Lowest share selecting &ldquo;Not Aware&rdquo;
            </p>
            <ol className="space-y-1.5 text-sm">
              {lowest.map((r, i) => (
                <li key={r.code} className="flex items-baseline gap-2">
                  <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                  <span className="flex-1 text-foreground/90">{r.topic}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{r.NOT_AWARE_pct}%</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {highest.length === 3 && bottom ? (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground/90">
            <span className="font-medium text-foreground">Reported uncertainty differs by topic.</span> The
            largest share selected &ldquo;Not Aware&rdquo; for the statement about {highest[0].topic} (
            {highest[0].NOT_AWARE_pct}%), followed by {highest[1].topic} ({highest[1].NOT_AWARE_pct}%) and{" "}
            {highest[2].topic} ({highest[2].NOT_AWARE_pct}%). {capitalize(bottom.topic)} had the lowest share (
            {bottom.NOT_AWARE_pct}%). These responses identify topics for further investigation; they do not
            establish knowledge accuracy or explain non-investment.
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function WhoIsInSampleTab({ filteringEnabled }: { filteringEnabled: boolean }) {
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS)
  // Only ever written inside the fetch's async callbacks below (never
  // synchronously in the effect body) — `key` lets render derive "is this
  // result for the currently-selected filters" without a separate loading
  // flag that would need resetting from the effect.
  const [result, setResult] = React.useState<
    { key: string; status: "ready"; data: WhoIsInSampleData } | { key: string; status: "error" } | null
  >(null)

  const active = anyActive(filters)
  const filterKey = JSON.stringify(filters)

  React.useEffect(() => {
    if (!filteringEnabled || !active) return
    const controller = new AbortController()
    const key = filterKey
    const params = new URLSearchParams()
    if (filters.state) params.set("state", filters.state)
    if (filters.urbanrural) params.set("urbanrural", filters.urbanrural)
    if (filters.incomeTier) params.set("incomeTier", filters.incomeTier)
    if (filters.prevInvestment) params.set("prevInvestment", filters.prevInvestment)

    fetch(`/api/dev/who-is-in-sample?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((data: WhoIsInSampleData) => setResult({ key, status: "ready", data }))
      .catch((err) => {
        if (err.name !== "AbortError") setResult({ key, status: "error" })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filterKey is the canonical, stable serialization of filters
  }, [filteringEnabled, active, filterKey])

  const resultIsCurrent = active && result?.key === filterKey
  const data: WhoIsInSampleData =
    resultIsCurrent && result?.status === "ready" ? result.data : whoIsInSampleBase
  const matchedN = resultIsCurrent && result?.status === "ready" ? (data.matched_n ?? 0) : 553
  const isLoading = filteringEnabled && active && !resultIsCurrent
  const hasFetchError = resultIsCurrent && result?.status === "error"

  const stateField = getField(data, "SELECTED_STATE")

  const stateOptions = [...whoIsInSampleBase.fields.find((f) => f.field_code === "SELECTED_STATE")!.options]
    .map((o) => o.label)
    .sort((a, b) => a.localeCompare(b))

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
  }

  function set<K extends keyof Filters>(key: K, value: string | null) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const chips: { key: keyof Filters; label: string }[] = [
    filters.state ? { key: "state", label: `State: ${filters.state}` } : null,
    filters.urbanrural ? { key: "urbanrural", label: filters.urbanrural } : null,
    filters.incomeTier ? { key: "incomeTier", label: `Income: ${filters.incomeTier}` } : null,
    filters.prevInvestment
      ? { key: "prevInvestment", label: PREV_INVESTMENT_LABEL[filters.prevInvestment] ?? filters.prevInvestment }
      : null,
  ].filter((c): c is { key: keyof Filters; label: string } => c !== null)

  const showEmptyState = resultIsCurrent && result?.status === "ready" && matchedN === 0

  return (
    <div className="space-y-6">
      {/* Filter bar — hidden for now; re-enable by flipping SHOW_TOP_FILTER_BAR to true */}
      {SHOW_TOP_FILTER_BAR ? (
      <Card size="sm">
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="wis-state">
                State / UT
              </label>
              <NativeSelect
                id="wis-state"
                size="sm"
                disabled={!filteringEnabled}
                value={filters.state ?? ""}
                onChange={(e) => set("state", e.target.value || null)}
              >
                <NativeSelectOption value="">All states</NativeSelectOption>
                {stateOptions.map((s) => (
                  <NativeSelectOption key={s} value={s}>
                    {s}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="wis-urbanrural">
                Urban / Rural
              </label>
              <NativeSelect
                id="wis-urbanrural"
                size="sm"
                disabled={!filteringEnabled}
                value={filters.urbanrural ?? ""}
                onChange={(e) => set("urbanrural", e.target.value || null)}
              >
                <NativeSelectOption value="">All</NativeSelectOption>
                {whoIsInSampleBase.filter_options.urbanrural.map((o) => (
                  <NativeSelectOption key={o.value} value={o.value}>
                    {o.value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="wis-income">
                Personal-income group
              </label>
              <NativeSelect
                id="wis-income"
                size="sm"
                disabled={!filteringEnabled}
                value={filters.incomeTier ?? ""}
                onChange={(e) => set("incomeTier", e.target.value || null)}
              >
                <NativeSelectOption value="">All income groups</NativeSelectOption>
                {whoIsInSampleBase.filter_options.income_tier.map((o) => (
                  <NativeSelectOption key={o.tier} value={o.tier}>
                    {o.tier}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="wis-prev">
                Previous MF investment
              </label>
              <NativeSelect
                id="wis-prev"
                size="sm"
                disabled={!filteringEnabled}
                value={filters.prevInvestment ?? ""}
                onChange={(e) => set("prevInvestment", e.target.value || null)}
              >
                <NativeSelectOption value="">All</NativeSelectOption>
                {PREV_INVESTMENT_ORDER.map((cls) => (
                  <NativeSelectOption key={cls} value={cls}>
                    {PREV_INVESTMENT_LABEL[cls]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} disabled={!active}>
              Clear filters
            </Button>
          </div>

          {!filteringEnabled ? (
            <p className="text-xs text-muted-foreground">
              Filtering requires local development data access and is unavailable in this deployment — showing the
              full 553-respondent sample below.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <Badge key={c.key} variant="secondary" className="gap-1.5">
                {c.label}
                <button
                  type="button"
                  aria-label={`Remove filter ${c.label}`}
                  onClick={() => set(c.key, null)}
                  className="opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Updating…" : `Showing ${formatN(matchedN)} of 553 respondents`}
            </span>
          </div>
        </CardContent>
      </Card>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : showEmptyState ? (
        <SectionEmptyState onClear={clearFilters} />
      ) : hasFetchError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load filtered results. Showing the full sample instead.
        </div>
      ) : (
        <>

          {/* 2. Where respondents live */}
          {stateField ? (
            <GeographyCard
              stateField={stateField}
              crosstab={data.state_urbanrural_crosstab}
              selectedState={filters.state}
              onSelectState={(v) => filteringEnabled && set("state", v)}
            />
          ) : null}

          {/* 3. Education, work and household circumstances */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Education, work and household circumstances</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {["Q3D", "Q14"].map((code) => {
                const f = getField(data, code)
                return f ? <FieldBarCard key={code} field={f} defaultView="bar" showViewToggle={false} /> : null
              })}
              {/* Income and chief wage earner grouped in one column — both about who earns and how much. */}
              <div className="flex flex-col gap-4">
                {["Q10A", "CWE"].map((code) => {
                  const f = getField(data, code)
                  return f ? <FieldBarCard key={code} field={f} defaultView="bar" showViewToggle={false} /> : null
                })}
              </div>
              {/* Gender, marital status and family type grouped in one column — related "who they are at home" facts, kept together rather than scattered across the grid. */}
              <div className="flex flex-col gap-4">
                {["Q1", "Q13", "Q5A"].map((code) => {
                  const f = getField(data, code)
                  const defaultView = code === "Q1" || code === "Q5A" ? "pie" : "bar"
                  return f ? <FieldBarCard key={code} field={f} defaultView={defaultView} showViewToggle={false} /> : null
                })}
              </div>
            </div>
          </div>

          {/* 4. Investment preferences and reactions */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Investment preferences and reactions</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              These are reported preferences and hypothetical reactions to a scenario, not observed trading behaviour.
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {["QRT", "Q10M", "Q11M"].map((code) => {
                const f = getField(data, code)
                return f ? <FieldBarCard key={code} field={f} defaultView="bar" showViewToggle={false} /> : null
              })}
            </div>
          </div>

          {/* 5. Knowledge and learning preferences */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Knowledge and learning preferences</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {getField(data, "Q12M") ? (
                <FieldBarCard field={getField(data, "Q12M")!} defaultView="bar" showViewToggle={false} />
              ) : null}
              {getField(data, "Q12M") ? <Q12MCorrectnessCard field={getField(data, "Q12M")!} /> : null}

              <Card size="sm" className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">{data.knowledge_grid.field_family} — financial-knowledge battery</CardTitle>
                  <CardDescription>{data.knowledge_grid.note}</CardDescription>
                  <CardAction>
                    <KnowledgeWordingSheet items={data.knowledge_grid.items} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <KnowledgeBatteryChart items={data.knowledge_grid.items} />
                </CardContent>
              </Card>

              <KnowledgeTakeaway items={data.knowledge_grid.items} />

              {["Q20CM", "Q20DM", "Q20E", "Q20F"].map((code) => {
                const f = getField(data, code)
                return f ? <FieldBarCard key={code} field={f} /> : null
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Preferred medium, format and topics are multi-select (top 3) — percentages can add up to more than 100%.
              &ldquo;Not aware&rdquo;, &ldquo;Don&apos;t know&rdquo;, missing, and explicit negative answers are kept
              as separate categories, never folded together.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
