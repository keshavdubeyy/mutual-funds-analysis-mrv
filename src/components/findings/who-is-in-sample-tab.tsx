"use client"

import * as React from "react"
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
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
  type Zone,
} from "@/lib/who-is-in-sample-data"
import { FieldBarCard, SectionEmptyState } from "@/components/findings/who-field-card"
import { IndiaStateMap } from "@/components/findings/india-state-map"
import { demographics, awarenessSources, incomeAllocation, financialGoals } from "@/lib/findings-data"

/** Adapts this project's various `{option/label, n, pct_of_answered/pct}` result shapes into
 * the WhoField shape FieldBarCard already knows how to render, so new measures reuse the same
 * bar/pie/table card instead of a bespoke one. */
function toWhoField(params: {
  code: string
  label: string
  question_wording: string
  denominator: number
  n_answered: number
  n_blank: number
  options: { label: string; n: number; pct: number }[]
}): WhoField {
  return {
    field_code: params.code,
    label: params.label,
    question_wording: params.question_wording,
    section: "knowledge",
    kind: "single",
    denominator: params.denominator,
    n_answered: params.n_answered,
    n_blank: params.n_blank,
    options: params.options,
  }
}

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

// Q12M states its own numbers (5% return vs. 6% inflation), so the correct answer follows
// from arithmetic in the question itself — real value falls, making "Less than today" the
// only correct option. This is not an external answer key being invented (unlike the
// undocumented GRIDxQ15AM battery, which is deliberately never scored — see
// scripts/export_who_is_in_sample.py). "Wrong numeric answer," "Do not know" and "Refuse to
// answer" all count as incorrect for the numeracy score, but are kept as their own rows —
// never folded together — so a reader can see they aren't the same kind of response.
const Q12M_CORRECT_LABEL = "Less than today"
const Q12M_DONT_KNOW_LABEL = "Do not know"
const Q12M_REFUSE_LABEL = "Refuse to answer"

function Q12MCorrectnessCard({ field }: { field: WhoField }) {
  let correct = 0
  let wrongNumeric = 0
  let dontKnow = 0
  let refused = 0
  for (const o of field.options) {
    if (o.label === Q12M_CORRECT_LABEL) correct += o.n
    else if (o.label === Q12M_DONT_KNOW_LABEL) dontKnow += o.n
    else if (o.label === Q12M_REFUSE_LABEL) refused += o.n
    else wrongNumeric += o.n
  }
  const total = field.n_answered
  const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 1000) / 10}%` : "—")

  const rows = [
    { label: "Correct", n: correct, scoredIncorrect: false, emphasize: true },
    { label: "Wrong numeric answer", n: wrongNumeric, scoredIncorrect: true, emphasize: false },
    { label: "Do not know", n: dontKnow, scoredIncorrect: true, emphasize: false },
    { label: "Refuse to answer", n: refused, scoredIncorrect: true, emphasize: false },
  ].filter((r) => r.n > 0)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Financial literacy: response breakdown</CardTitle>
        <CardDescription>
          The question states a 5% return against 6% inflation, so real value falls — &ldquo;Less than
          today&rdquo; is the only arithmetically correct answer. &ldquo;Wrong numeric answer,&rdquo; &ldquo;Do not
          know&rdquo; and &ldquo;Refuse to answer&rdquo; are all scored incorrect for the numeracy check, but are
          shown as separate rows since they are not the same kind of response.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Response</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percent</TableHead>
              <TableHead className="text-right">Scored</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className={r.emphasize ? "font-medium text-foreground" : undefined}>{r.label}</TableCell>
                <TableCell className="text-right tabular-nums">{formatN(r.n)}</TableCell>
                <TableCell className="text-right tabular-nums">{pct(r.n)}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {r.scoredIncorrect ? "Incorrect" : "Correct"}
                </TableCell>
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

              {["Q20CM", "Q20DM", "Q20E", "Q20F"].map((code) => {
                const f = getField(data, code)
                return f ? <FieldBarCard key={code} field={f} /> : null
              })}
              {(() => {
                const q20am = demographics.fields.find((f) => f.field_code === "Q20AM")
                if (!q20am) return null
                return (
                  <FieldBarCard
                    field={toWhoField({
                      code: "Q20AM",
                      label: "Attended an investor education program",
                      question_wording: q20am.question_wording,
                      denominator: q20am.denominator,
                      n_answered: q20am.n_answered,
                      n_blank: q20am.n_blank,
                      options: q20am.options.map((o) => ({ label: o.label, n: o.n, pct: o.pct })),
                    })}
                    defaultView="bar"
                    showViewToggle={false}
                  />
                )
              })()}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Preferred medium, format and topics are multi-select (top 3) — percentages can add up to more than 100%.
              &ldquo;Not aware&rdquo;, &ldquo;Don&apos;t know&rdquo;, missing, and explicit negative answers are kept
              as separate categories, never folded together. The 9-item financial-knowledge battery
              (&ldquo;Not Aware&rdquo; response distribution) is analyzed on the <span className="font-medium text-foreground">Analysis</span> tab.
            </p>
          </div>

          {/* 6. Financial goals */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Financial goals</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Share of the 553-respondent focused group who ranked each goal anywhere in their top 3 priorities — not
              a rank-weighted score. Multi-select (top 3), percentages add up to more than 100%.
            </p>
            <FieldBarCard
              field={toWhoField({
                code: "Q6_RANK_GRID",
                label: "Goals ranked in top 3",
                question_wording: "Which of these are among your top 3 financial goals?",
                denominator: 553,
                n_answered: 553,
                n_blank: 0,
                options: financialGoals.goals.map((g) => ({ label: g.goal, n: g.n_ranked_in_top3, pct: g.pct_of_553 })),
              })}
              defaultView="bar"
              showViewToggle={false}
            />
          </div>

          {/* 7. Income allocation */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Income allocation</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Recomputed from the raw percentage field, not the derived field that silently converted
              &ldquo;not administered&rdquo; into a &ldquo;0%&rdquo; category — blank is kept as blank here. Each
              category is its own independent distribution; these five are not validated as a joint budget and
              are not summed into a disposable-income figure.
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {incomeAllocation.categories.map((cat) => (
                <FieldBarCard
                  key={cat.slot}
                  field={toWhoField({
                    code: `Q1MXGrid_${cat.slot}`,
                    label: `Income allocation: ${cat.category.toLowerCase()}`,
                    question_wording: `What share of your monthly income goes to ${cat.category.toLowerCase()}?`,
                    denominator: cat.focused_group_size,
                    n_answered: cat.denominator,
                    n_blank: cat.n_blank,
                    options: cat.options.map((o) => ({ label: o.option, n: o.n, pct: o.pct_of_answered })),
                  })}
                  defaultView="bar"
                  showViewToggle={false}
                />
              ))}
            </div>
          </div>

          {/* 8. Awareness sources and media */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Reported awareness sources and media</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Restricted to the {formatN(awarenessSources.denominator)} of {formatN(awarenessSources.focused_group_size)}{" "}
              respondents who also answered the &ldquo;reasons for not investing&rdquo; question — the same answer
              base as that question, not the full 553. Multi-select, percentages add up to more than 100%. This shows
              where respondents report hearing about mutual funds and ETFs — it does not show whether that source
              caused them to invest.
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FieldBarCard
                field={toWhoField({
                  code: "Q4M",
                  label: "Sources of awareness",
                  question_wording: "Where did you hear about mutual funds / ETFs?",
                  denominator: awarenessSources.denominator,
                  n_answered: awarenessSources.denominator,
                  n_blank: 0,
                  options: awarenessSources.sources.map((o) => ({ label: o.option, n: o.n, pct: o.pct_of_answered })),
                })}
                defaultView="bar"
                showViewToggle={false}
              />
              <FieldBarCard
                field={toWhoField({
                  code: "Q5M",
                  label: "Media of awareness",
                  question_wording: "Through what media did you hear about mutual funds / ETFs?",
                  denominator: awarenessSources.denominator,
                  n_answered: awarenessSources.denominator,
                  n_blank: 0,
                  options: awarenessSources.media.map((o) => ({ label: o.option, n: o.n, pct: o.pct_of_answered })),
                })}
                defaultView="bar"
                showViewToggle={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
