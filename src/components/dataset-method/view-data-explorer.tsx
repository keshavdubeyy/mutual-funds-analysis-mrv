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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RespondentFlags } from "@/lib/dataset-method-data"
import { formatN } from "@/lib/dataset-method-data"

const PAGE_SIZE = 50

const OCCUPATION_LABELS: Record<string, string> = {
  included_salaried_documented: "Salaried",
  excluded_business: "Business owner",
  excluded_self_employed: "Self-employed",
  excluded_agriculture: "Farmer / agricultural work",
  excluded_unskilled_worker: "Unskilled worker",
  excluded_skilled_worker: "Skilled worker",
  excluded_non_worker: "Not working (student, homemaker, unemployed, or retired)",
  ambiguous_documentation_gap: "Other / unclear",
  ambiguous_catchall: "Other / unclear",
}

const CONSIDERS_MF_LABELS: Record<string, string> = {
  no: "No",
  unknown: "Not asked / unclear",
  yes: "Yes",
}

const MF_HOLDING_LABELS: Record<string, string> = {
  does_not_hold: "No",
  holds: "Yes",
  unknown: "Not asked / unclear",
}

type TriState = "any" | "yes" | "no"

const FOCUSED_GROUP_RULE = {
  completedMain: "yes" as TriState,
  lifeStage: "Gen Z",
  occupationClass: "included_salaried_documented",
  considersMf: "yes",
  mfHolding: "does_not_hold",
}

export function ViewDataExplorer() {
  const [data, setData] = React.useState<RespondentFlags | null>(null)
  const [error, setError] = React.useState(false)

  const [completedMain, setCompletedMain] = React.useState<TriState>("any")
  const [lifeStage, setLifeStage] = React.useState("any")
  const [occupationClass, setOccupationClass] = React.useState("any")
  const [considersMf, setConsidersMf] = React.useState("any")
  const [mfHolding, setMfHolding] = React.useState("any")
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)

  React.useEffect(() => {
    let cancelled = false
    fetch("/data/dataset-method/respondent_flags.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((json: RespondentFlags) => {
        if (!cancelled) setData(json)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matchingIndices = React.useMemo(() => {
    if (!data) return []
    const { columns, legends } = data
    const lifeStageIdx = lifeStage === "any" ? -1 : legends.life_stage.indexOf(lifeStage)
    const occClassIdx = occupationClass === "any" ? -1 : legends.occupation_class.indexOf(occupationClass)
    const considersIdx = considersMf === "any" ? -1 : legends.considers_mf.indexOf(considersMf)
    const holdingIdx = mfHolding === "any" ? -1 : legends.mf_holding_status.indexOf(mfHolding)

    const result: number[] = []
    for (let i = 0; i < data.n; i++) {
      if (completedMain !== "any" && columns.completed_main[i] !== (completedMain === "yes")) continue
      if (lifeStageIdx !== -1 && columns.life_stage[i] !== lifeStageIdx) continue
      if (occClassIdx !== -1 && columns.occupation_class[i] !== occClassIdx) continue
      if (considersIdx !== -1 && columns.considers_mf[i] !== considersIdx) continue
      if (holdingIdx !== -1 && columns.mf_holding_status[i] !== holdingIdx) continue
      result.push(i)
    }
    return result
  }, [data, completedMain, lifeStage, occupationClass, considersMf, mfHolding])

  const hasActiveFilters =
    completedMain !== "any" ||
    lifeStage !== "any" ||
    occupationClass !== "any" ||
    considersMf !== "any" ||
    mfHolding !== "any"

  const filterKey = `${completedMain}|${lifeStage}|${occupationClass}|${considersMf}|${mfHolding}`
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  function resetFilters() {
    setCompletedMain("any")
    setLifeStage("any")
    setOccupationClass("any")
    setConsidersMf("any")
    setMfHolding("any")
  }

  function jumpToFocusedGroup() {
    setCompletedMain(FOCUSED_GROUP_RULE.completedMain)
    setLifeStage(FOCUSED_GROUP_RULE.lifeStage)
    setOccupationClass(FOCUSED_GROUP_RULE.occupationClass)
    setConsidersMf(FOCUSED_GROUP_RULE.considersMf)
    setMfHolding(FOCUSED_GROUP_RULE.mfHolding)
  }

  const visible = matchingIndices.slice(0, visibleCount)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold tabular-nums text-foreground">
          {data ? formatN(matchingIndices.length) : "—"}
        </CardTitle>
        <CardDescription>
          {data
            ? `people match these filters, out of ${formatN(data.n)}`
            : "Loading…"}
        </CardDescription>
        {data ? (
          <CardAction className="flex gap-2">
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            ) : null}
            <Button variant="secondary" size="sm" onClick={jumpToFocusedGroup}>
              Show the 553 we studied
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Something went wrong loading this data. Try reloading the page.
          </p>
        ) : !data ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-3">
              <FilterField label="Finished the survey">
                <NativeSelect value={completedMain} onChange={(e) => setCompletedMain(e.target.value as TriState)} size="sm" className="w-48">
                  <NativeSelectOption value="any">Anyone</NativeSelectOption>
                  <NativeSelectOption value="yes">Yes</NativeSelectOption>
                  <NativeSelectOption value="no">No</NativeSelectOption>
                </NativeSelect>
              </FilterField>

              <FilterField label="Age group">
                <NativeSelect value={lifeStage} onChange={(e) => setLifeStage(e.target.value)} size="sm" className="w-48">
                  <NativeSelectOption value="any">Anyone</NativeSelectOption>
                  {data.legends.life_stage.map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FilterField>

              <FilterField label="Occupation">
                <NativeSelect value={occupationClass} onChange={(e) => setOccupationClass(e.target.value)} size="sm" className="w-48">
                  <NativeSelectOption value="any">Anyone</NativeSelectOption>
                  {data.legends.occupation_class.map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {OCCUPATION_LABELS[v] ?? v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FilterField>

              <FilterField label="Open to mutual funds">
                <NativeSelect value={considersMf} onChange={(e) => setConsidersMf(e.target.value)} size="sm" className="w-48">
                  <NativeSelectOption value="any">Anyone</NativeSelectOption>
                  {data.legends.considers_mf.map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {CONSIDERS_MF_LABELS[v] ?? v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FilterField>

              <FilterField label="Already invests in mutual funds">
                <NativeSelect value={mfHolding} onChange={(e) => setMfHolding(e.target.value)} size="sm" className="w-48">
                  <NativeSelectOption value="any">Anyone</NativeSelectOption>
                  {data.legends.mf_holding_status.map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {MF_HOLDING_LABELS[v] ?? v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FilterField>
            </div>

            <p className="text-xs text-muted-foreground">
              Turn on more than one filter to narrow the list further, or press &quot;Show the 553 we studied&quot;
              to jump straight to the group this research focuses on.
            </p>

            {matchingIndices.length === 0 ? (
              <p className="rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
                No one matches this combination of filters.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Finished the survey</TableHead>
                      <TableHead>Age group</TableHead>
                      <TableHead>Occupation</TableHead>
                      <TableHead>Open to mutual funds</TableHead>
                      <TableHead>Already invests in mutual funds</TableHead>
                      <TableHead>In this study</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((i) => (
                      <TableRow key={i}>
                        <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
                        <TableCell>{data.columns.completed_main[i] ? "Yes" : "No"}</TableCell>
                        <TableCell>{data.legends.life_stage[data.columns.life_stage[i]]}</TableCell>
                        <TableCell className="max-w-xs whitespace-normal">
                          {OCCUPATION_LABELS[data.legends.occupation_class[data.columns.occupation_class[i]]] ??
                            data.legends.occupation_class[data.columns.occupation_class[i]]}
                        </TableCell>
                        <TableCell>
                          {CONSIDERS_MF_LABELS[data.legends.considers_mf[data.columns.considers_mf[i]]]}
                        </TableCell>
                        <TableCell>
                          {MF_HOLDING_LABELS[data.legends.mf_holding_status[data.columns.mf_holding_status[i]]]}
                        </TableCell>
                        <TableCell>
                          {data.columns.in_focused_group[i] ? (
                            <Badge>Yes</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground">
                  Showing {formatN(visible.length)} of {formatN(matchingIndices.length)} people.
                </p>
                {visibleCount < matchingIndices.length ? (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="w-full rounded-2xl border border-border py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
                  >
                    Show {Math.min(PAGE_SIZE, matchingIndices.length - visibleCount)} more
                  </button>
                ) : null}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
    </div>
  )
}
