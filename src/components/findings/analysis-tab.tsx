"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabScrollIntoView } from "@/hooks/use-tab-scroll-into-view"
import { AnalysisNavContext, type AnalysisNavTarget } from "@/components/analysis/analysis-nav-context"
import { OverviewTab } from "@/components/analysis/overview-tab"
import { MotivationsBarriersTab } from "@/components/analysis/motivations-barriers-tab"
import { WhatCouldHelpTab } from "@/components/analysis/what-could-help-tab"
import { RiskKnowledgeTab } from "@/components/analysis/risk-knowledge-tab"
import { GroupDifferencesTab } from "@/components/analysis/group-differences-tab"
import { formatN } from "@/lib/dataset-method-data"
import { demographics } from "@/lib/findings-data"

const DEFAULT_TOPIC = "overview"

const TOPICS = [
  { key: "overview", label: "Overview" },
  { key: "motivations-barriers", label: "Motivations & barriers" },
  { key: "what-could-help", label: "What could help" },
  { key: "risk-knowledge", label: "Risk & knowledge" },
  { key: "group-differences", label: "Group differences" },
] as const

const BASE_PATH = "/findings/analysis"

/**
 * This page's own 5 topic tabs, synced to a `?topic=` query param so a "View analysis" link
 * from the Research Plan page lands on the right topic *and* can carry a `#chart-id` hash
 * straight to the right chart (e.g. `/findings/analysis?topic=motivations-barriers#barriers-
 * selection-pct`). Reads/writes the URL via plain `window.location`/`history.replaceState`
 * (same pattern as `key-research-indicators-section.tsx`), not `useSearchParams`, so this
 * stays a normal client component with no Suspense boundary and no effect on static
 * prerendering of the page shell. All 5 panels stay mounted (`keepMounted`) — inactive ones
 * are hidden via the native `hidden` attribute (see globals.css's print override), which is
 * also what lets a deep link to a chart in a topic that isn't yet active scroll correctly
 * once that topic becomes active, and what lets "show all sections" print mode render every
 * topic at once.
 */
export function AnalysisTab() {
  const [topic, setTopic] = React.useState(DEFAULT_TOPIC)
  const tabScrollRef = useTabScrollIntoView(topic)

  React.useEffect(() => {
    const urlTopic = new URLSearchParams(window.location.search).get("topic")
    if (urlTopic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL, which only exists client-side
      setTopic(urlTopic)
    }
  }, [])

  function handleTopicChange(value: string) {
    setTopic(value)
    const params = new URLSearchParams(window.location.search)
    if (value === DEFAULT_TOPIC) params.delete("topic")
    else params.set("topic", value)
    const query = params.toString()
    window.history.replaceState(null, "", query ? `${BASE_PATH}?${query}` : BASE_PATH)
  }

  // A deep link like /findings/analysis?topic=motivations-barriers#barriers-selection-pct
  // already lands on the right topic via the query param above — this only needs to scroll
  // the specific chart into view once that topic's panel is active in the DOM.
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "center" })
    })
  }, [topic])

  // Lets a component nested anywhere inside (e.g. Overview's "View chart" links) switch topic
  // and jump to a specific chart with one call — see analysis-nav-context.tsx. Setting the
  // hash before the topic-change re-render means the scroll effect above (which reads the
  // hash whenever `topic` changes) picks it up without a second scroll call here. `target` is
  // also exposed so a topic that itself picks which chart to show (Group Differences' own
  // comparison dropdown) can react to a `goTo` call that happens after it has already
  // mounted — its own "read the URL hash" effect only fires once, at mount.
  const [target, setTarget] = React.useState<AnalysisNavTarget | null>(null)

  const nav = React.useMemo(
    () => ({
      goTo(nextTopic: string, chartId?: string) {
        const params = new URLSearchParams(window.location.search)
        if (nextTopic === DEFAULT_TOPIC) params.delete("topic")
        else params.set("topic", nextTopic)
        const query = params.toString()
        window.history.replaceState(null, "", `${query ? `${BASE_PATH}?${query}` : BASE_PATH}${chartId ? `#${chartId}` : ""}`)
        setTopic(nextTopic)
        setTarget({ topic: nextTopic, chartId })
      },
      target,
    }),
    [target]
  )

  return (
    <AnalysisNavContext.Provider value={nav}>
      <div className="space-y-6">
        <div className="max-w-3xl space-y-1">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">Investment research overview</h2>
          <p className="text-xs text-muted-foreground">
            {formatN(demographics.focused_group_size)} selected respondents · Unweighted survey · Answer counts vary
          </p>
        </div>

        <Tabs value={topic} onValueChange={(v) => handleTopicChange(v as string)} className="min-w-0">
          <div
            ref={tabScrollRef}
            className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <TabsList className="w-max justify-start">
              {TOPICS.map((t) => (
                <TabsTrigger key={t.key} value={t.key} data-tab-id={t.key} className="flex-none shrink-0 whitespace-nowrap">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="pt-4" keepMounted>
            <OverviewTab />
          </TabsContent>
          <TabsContent value="motivations-barriers" className="pt-4" keepMounted>
            <MotivationsBarriersTab />
          </TabsContent>
          <TabsContent value="what-could-help" className="pt-4" keepMounted>
            <WhatCouldHelpTab />
          </TabsContent>
          <TabsContent value="risk-knowledge" className="pt-4" keepMounted>
            <RiskKnowledgeTab />
          </TabsContent>
          <TabsContent value="group-differences" className="pt-4" keepMounted>
            <GroupDifferencesTab />
          </TabsContent>
        </Tabs>
      </div>
    </AnalysisNavContext.Provider>
  )
}
