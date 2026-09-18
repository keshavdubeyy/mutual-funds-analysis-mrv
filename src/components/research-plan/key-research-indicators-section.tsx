"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUp01Icon, TableIcon, MapsIcon } from "@hugeicons/core-free-icons"
import { SectionHeading } from "@/components/dataset-method/section-heading"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MeasureDetailSheet } from "./measure-detail-sheet"
import { ResearchMap } from "./research-map/research-map"
import { RESEARCH_MAP_KPI_THEMES } from "@/lib/research-map-data"
import {
  MEASURES,
  KEY_RESEARCH_INDICATORS,
  CONTEXT_MEASURE_IDS,
  HOW_TO_READ_RESULTS,
  type Measure,
} from "@/lib/research-plan-data"

interface RowGroup {
  id: string
  name: string
  description: string
  measures: Measure[]
}

function measuresFor(ids: string[]): Measure[] {
  return ids.map((id) => MEASURES.find((m) => m.id === id)).filter((m): m is Measure => Boolean(m))
}

function groupIdForMeasure(groups: RowGroup[], measureId: string): string | undefined {
  return groups.find((g) => g.measures.some((m) => m.id === measureId))?.id
}

const GROUPS: RowGroup[] = [
  ...KEY_RESEARCH_INDICATORS.map((k) => ({
    id: k.id,
    name: k.name,
    description: k.description,
    measures: measuresFor(k.measureIds),
  })),
  {
    id: "context-measures",
    name: "Context measures",
    description: "Calculated, but describing the sample rather than a primary research indicator.",
    measures: measuresFor(CONTEXT_MEASURE_IDS),
  },
].filter((g) => g.measures.length > 0)

export function KeyResearchIndicatorsSection() {
  // Every measure in the register appears exactly once, grouped by theme — no filter
  // gates access to any row; the whole register is reachable, one tab per theme.
  const accountedFor = new Set(GROUPS.flatMap((g) => g.measures.map((m) => m.id)))
  const missing = MEASURES.filter((m) => !accountedFor.has(m.id))
  if (missing.length > 0 && process.env.NODE_ENV !== "production") {
    // Defensive check only — every measure should be assigned to a group above.
    console.warn("Measures missing from a Key Research Indicators group:", missing.map((m) => m.id))
  }

  const [activeTab, setActiveTab] = React.useState<string | undefined>(GROUPS[0]?.id)
  const tabScrollRef = React.useRef<HTMLDivElement>(null)
  const [view, setView] = React.useState<"table" | "map">("table")

  function handleViewChange(values: string[]) {
    const newest = values.find((v) => v !== view) ?? values[0]
    if (newest) setView(newest as "table" | "map")
  }

  // Existing "Metric definition →" links elsewhere on the dashboard point straight at a
  // measure's row id (e.g. /research-plan#relationship-risk-fear-of-loss). Since a measure
  // now lives inside one tab's hidden panel until selected, the URL hash can only be read
  // after mount (same one-time client-only sync pattern as theme-toggle.tsx's localStorage
  // read) — jump to the right tab, then scroll the row into view once it has mounted.
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    const groupId = groupIdForMeasure(GROUPS, hash)
    if (!groupId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL hash, which only exists client-side
    setActiveTab(groupId)
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "center" })
    })
  }, [])

  // Whichever tab becomes active (a click, or the hash-sync above) should land centered in
  // the strip — a single, whole-row scroll that brings the surrounding tabs into view with
  // it, not a one-pixel nudge that only just barely reveals it. `inline: "center"` scrolls
  // only the strip itself (its nearest scrollable ancestor), never the page.
  React.useEffect(() => {
    if (!activeTab) return
    const trigger = tabScrollRef.current?.querySelector(`[data-tab-id="${activeTab}"]`)
    trigger?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeTab])

  return (
    <section id="research-plan-indicators" className="min-w-0 scroll-mt-20 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeading
          id="research-plan-indicators-heading"
          title="Key research indicators"
          description={HOW_TO_READ_RESULTS}
        />
        <ToggleGroup value={[view]} onValueChange={handleViewChange} variant="outline" size="sm" spacing={0}>
          <ToggleGroupItem value="table" aria-label="Table view">
            <HugeiconsIcon icon={TableIcon} strokeWidth={2} data-icon="inline-start" />
            Table
          </ToggleGroupItem>
          <ToggleGroupItem value="map" aria-label="Map view">
            <HugeiconsIcon icon={MapsIcon} strokeWidth={2} data-icon="inline-start" />
            Map
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "map" ? (
        <ResearchMap themes={RESEARCH_MAP_KPI_THEMES} rootLabel="Investment research measures" />
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="min-w-0">
          <div
            ref={tabScrollRef}
            className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <TabsList className="w-max justify-start">
              {GROUPS.map((g) => (
                <TabsTrigger
                  key={g.id}
                  value={g.id}
                  data-tab-id={g.id}
                  className="flex-none shrink-0 whitespace-nowrap"
                >
                  {g.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {GROUPS.map((g) => (
            <TabsContent key={g.id} value={g.id} className="pt-4">
              <p className="mb-3 text-xs text-muted-foreground">
                {g.description} {g.measures.length} measure{g.measures.length === 1 ? "" : "s"}.
              </p>
              <div className="rounded-2xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-40">Key research measure</TableHead>
                      <TableHead className="hidden min-w-56 md:table-cell">What it tells us</TableHead>
                      <TableHead className="hidden min-w-56 md:table-cell">Why it matters</TableHead>
                      <TableHead className="w-1 whitespace-nowrap">&nbsp;</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {g.measures.map((m) => (
                      <MeasureRow key={m.id} measure={m} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  )
}

function MeasureRow({ measure: m }: { measure: Measure }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <TableRow id={m.id} className="scroll-mt-24">
        <TableCell className="max-w-2xs align-top whitespace-normal">
          <button
            type="button"
            className="flex items-start gap-1.5 text-left font-medium text-foreground"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-label={`${m.name} — show what it tells us and why it matters`}
          >
            <span>{m.name}</span>
            <HugeiconsIcon
              icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
              strokeWidth={2}
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground md:hidden"
            />
          </button>
        </TableCell>
        <TableCell className="hidden max-w-md align-top whitespace-normal text-muted-foreground md:table-cell">
          {m.meaning}
        </TableCell>
        <TableCell className="hidden max-w-md align-top whitespace-normal text-muted-foreground md:table-cell">
          {m.whyItMatters}
        </TableCell>
        <TableCell className="align-top">
          <MeasureDetailSheet measure={m} />
        </TableCell>
      </TableRow>
      {expanded ? (
        <TableRow className="md:hidden">
          <TableCell colSpan={4} className="space-y-1.5 bg-muted/20 whitespace-normal text-xs">
            <p>
              <span className="font-medium text-foreground">What it tells us: </span>
              <span className="text-muted-foreground">{m.meaning}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Why it matters: </span>
              <span className="text-muted-foreground">{m.whyItMatters}</span>
            </p>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  )
}
