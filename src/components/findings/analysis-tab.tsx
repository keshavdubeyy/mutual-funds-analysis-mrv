"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabScrollIntoView } from "@/hooks/use-tab-scroll-into-view"
import { MotivationsFinancialGoalsTab } from "@/components/analysis/motivations-financial-goals-tab"
import { ReportedBarriersTab } from "@/components/analysis/reported-barriers-tab"
import { PreviousInvestmentTab } from "@/components/analysis/previous-investment-tab"
import { RiskPreferencesTab } from "@/components/analysis/risk-preferences-tab"
import { ReportedUncertaintyTab } from "@/components/analysis/reported-uncertainty-tab"
import { GroupDifferencesTab } from "@/components/analysis/group-differences-tab"
import { AwarenessMediaTab } from "@/components/analysis/awareness-media-tab"
import { EncouragementFactorsTab } from "@/components/analysis/encouragement-factors-tab"
import { LearningPreferencesTab } from "@/components/analysis/learning-preferences-tab"
import { formatN } from "@/lib/dataset-method-data"
import { demographics } from "@/lib/findings-data"

const DEFAULT_TOPIC = "motivations-financial-goals"

// One tab per group in the Deliverables page's combined KPI/marketing-metric table
// (src/app/deliverables/page.tsx) — kept in the same order and using the same names, so the
// two stay directly traceable to each other.
const TOPICS = [
  { key: "motivations-financial-goals", label: "Motivations and financial goals" },
  { key: "reported-barriers", label: "Reported barriers" },
  { key: "previous-investment", label: "Previous investment and stopping reasons" },
  { key: "risk-preferences", label: "Risk preferences and reactions" },
  { key: "reported-uncertainty", label: "Reported uncertainty" },
  { key: "group-differences", label: "Group differences" },
  { key: "awareness-media", label: "Awareness sources and media" },
  { key: "encouragement-factors", label: "Encouragement factors" },
  { key: "learning-preferences", label: "Learning preferences" },
] as const

const BASE_PATH = "/findings/analysis"

/** Fades only the edges that actually have more tabs beyond them — a solid clipped edge with
 * no cue is what makes an overflowing strip look broken; fading only where there's something
 * to reveal (never both edges when everything already fits) is what makes it read as
 * intentional. */
function edgeFadeMask(canScrollLeft: boolean, canScrollRight: boolean): string | undefined {
  if (canScrollLeft && canScrollRight) {
    return "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)"
  }
  if (canScrollRight) {
    return "linear-gradient(to right, black calc(100% - 24px), transparent)"
  }
  if (canScrollLeft) {
    return "linear-gradient(to right, transparent, black 24px)"
  }
  return undefined
}

/** Briefly rings a chart card in the primary color via an inline box-shadow — not Tailwind's
 * `ring-*` classes, which would collide with the Card component's own permanent `ring-1`
 * (added via classList, not through `cn()`, so nothing would merge the two) — so a reader
 * who clicked a specific measure (from the Deliverables table, or any other deep link) can
 * immediately see which card that was, not just that the page scrolled somewhere. */
function flashHighlight(el: HTMLElement) {
  el.style.transition = "box-shadow 200ms ease-out"
  el.style.boxShadow = "0 0 0 2px var(--primary), 0 0 0 5px var(--background)"
  window.setTimeout(() => {
    el.style.boxShadow = ""
  }, 2200)
}

/**
 * This page's own 9 topic tabs, synced to a `?topic=` query param so a "View analysis" link
 * from the Research Plan page lands on the right topic *and* can carry a `#chart-id` hash
 * straight to the right chart (e.g. `/findings/analysis?topic=reported-barriers#barriers-
 * selection-pct`). Reads/writes the URL via plain `window.location`/`history.replaceState`
 * (same pattern as `key-research-indicators-section.tsx`), not `useSearchParams`, so this
 * stays a normal client component with no Suspense boundary and no effect on static
 * prerendering of the page shell. All 9 panels stay mounted (`keepMounted`) — inactive ones
 * are hidden via the native `hidden` attribute (see globals.css's print override), which is
 * also what lets a deep link to a chart in a topic that isn't yet active scroll correctly
 * once that topic becomes active, and what lets "show all sections" print mode render every
 * topic at once.
 */
export function AnalysisTab() {
  const [topic, setTopic] = React.useState(DEFAULT_TOPIC)
  const tabScrollRef = useTabScrollIntoView(topic)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateEdgeFade = React.useCallback(() => {
    const el = tabScrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [tabScrollRef])

  // Recomputed on scroll and on any resize of the strip itself — a sidebar toggle, window
  // resize, or browser zoom (which changes the same client/scroll-width metrics this reads) —
  // so the fade (and therefore how many tabs visibly fit) stays correct at any zoom level
  // instead of only being right for whatever width the page happened to load at.
  React.useEffect(() => {
    const el = tabScrollRef.current
    if (!el) return
    updateEdgeFade()
    el.addEventListener("scroll", updateEdgeFade, { passive: true })
    const observer = new ResizeObserver(updateEdgeFade)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", updateEdgeFade)
      observer.disconnect()
    }
  }, [tabScrollRef, updateEdgeFade])

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

  // A deep link like /findings/analysis?topic=reported-barriers#barriers-selection-pct
  // already lands on the right topic via the query param above — this only needs to scroll
  // to (and briefly highlight) the specific chart once that topic's panel is active in the
  // DOM. The hash is captured into a local const, then cleared from the URL immediately —
  // scrolling/highlighting happens later regardless (the rAF callback closes over the
  // captured value, not a live read of the URL), but clearing it now means manually
  // switching tabs afterward won't keep re-triggering it for a chart already visited.
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    requestAnimationFrame(() => {
      const el = document.getElementById(hash)
      el?.scrollIntoView({ block: "center" })
      if (el) flashHighlight(el)
    })
    window.history.replaceState(null, "", window.location.pathname + window.location.search)
  }, [topic])

  return (
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
          className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain"
          style={{
            maskImage: edgeFadeMask(canScrollLeft, canScrollRight),
            WebkitMaskImage: edgeFadeMask(canScrollLeft, canScrollRight),
          }}
        >
          <TabsList className="w-max justify-start">
            {TOPICS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} data-tab-id={t.key} className="flex-none shrink-0 whitespace-nowrap">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="motivations-financial-goals" className="pt-4" keepMounted>
          <MotivationsFinancialGoalsTab />
        </TabsContent>
        <TabsContent value="reported-barriers" className="pt-4" keepMounted>
          <ReportedBarriersTab />
        </TabsContent>
        <TabsContent value="previous-investment" className="pt-4" keepMounted>
          <PreviousInvestmentTab />
        </TabsContent>
        <TabsContent value="risk-preferences" className="pt-4" keepMounted>
          <RiskPreferencesTab />
        </TabsContent>
        <TabsContent value="reported-uncertainty" className="pt-4" keepMounted>
          <ReportedUncertaintyTab />
        </TabsContent>
        <TabsContent value="group-differences" className="pt-4" keepMounted>
          <GroupDifferencesTab />
        </TabsContent>
        <TabsContent value="awareness-media" className="pt-4" keepMounted>
          <AwarenessMediaTab />
        </TabsContent>
        <TabsContent value="encouragement-factors" className="pt-4" keepMounted>
          <EncouragementFactorsTab />
        </TabsContent>
        <TabsContent value="learning-preferences" className="pt-4" keepMounted>
          <LearningPreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
