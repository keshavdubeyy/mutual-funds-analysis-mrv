"use client"

import * as React from "react"
import { cn } from "cn"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MeasureDetailSheet } from "@/components/research-plan/measure-detail-sheet"
import { getMeasureById } from "@/lib/research-plan-data"
import { useEqualHeightCharts } from "./equal-height-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

/**
 * The one shared chart-card shape used everywhere on the Analysis tab: a question-style
 * title, a scope/denominator line, the chart itself (with an optional table view toggled
 * in, never a second copy stacked underneath), one observation sentence, and a footer that
 * opens the same `MeasureDetailSheet` used on the Research Plan page — so "what it tells us"
 * / "why it matters" / calculation detail lives in exactly one place, not repeated here.
 */
export function AnalysisChartCard({
  id,
  title,
  badges,
  scopeLine,
  measureId,
  observation,
  extraCaveat,
  chart,
  table,
  controls,
  chartAreaClassName,
  className,
}: {
  id: string
  title: string
  badges?: React.ReactNode
  scopeLine: React.ReactNode
  measureId: string
  observation?: string
  extraCaveat?: React.ReactNode
  chart: React.ReactNode
  table?: React.ReactNode
  /** Extra per-chart controls (e.g. an "All / Not Aware only" filter) shown beside the chart/table toggle. */
  controls?: React.ReactNode
  /**
   * Optional class for the wrapper around the chart/table content only (never the header,
   * observation sentence, or footer) — a fixed max-height plus `overflow-y-auto` so a long
   * option list scrolls internally instead of making its whole card far taller than shorter
   * cards next to it. Takes priority over an ancestor `EqualHeightChartsProvider`, if any —
   * use this for a manually-chosen cap; omit it and wrap the grid in that provider instead to
   * have the cap computed dynamically from the shortest sibling card.
   */
  chartAreaClassName?: string
  /** Extra class on the outer card itself — e.g. `lg:col-span-2` to span a full grid row. */
  className?: string
}) {
  const [view, setView] = React.useState<"chart" | "table">("chart")
  const measure = getMeasureById(measureId)
  const equalHeight = useEqualHeightCharts()
  const isDynamicHeight = !chartAreaClassName && Boolean(equalHeight)
  // The one card that *is* the shortest keeps measuring (so the shared minimum stays correct
  // if its own content reflows) but is never itself capped or given a scroll area — its own
  // natural height is the target every other card gets capped to, not an average of everyone.
  const isShortestCard = isDynamicHeight && equalHeight?.shortestId === id
  const hasCap = Boolean(chartAreaClassName) || isDynamicHeight

  // A "Scroll for more" hint for the capped/scrollable variant only, and only once its content
  // actually overflows the cap. It fades out as soon as the user scrolls away from the top
  // (they've found the scroll area) and fades back in on return to the top, rather than
  // staying on screen the whole time. Re-checked on resize, on chart/table toggle (each view
  // has its own content height), and whenever the shared dynamic cap itself changes.
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)
  const [isAtTop, setIsAtTop] = React.useState(true)

  React.useEffect(() => {
    if (!hasCap) return
    const el = scrollAreaRef.current
    if (!el) return
    const checkOverflow = () => {
      // scrollHeight is the element's full natural content height regardless of any
      // max-height/overflow already applied to it — safe to both report to the shared
      // equal-height provider (the un-clipped "hug" height) and compare against clientHeight
      // (the currently-visible, possibly-capped height) to know whether it's actually clipped.
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
      if (isDynamicHeight) equalHeight!.registerHeight(id, el.scrollHeight)
    }
    const checkScrollTop = () => setIsAtTop(el.scrollTop < 8)
    // Deferred rather than called synchronously here, so the initial measurement (which needs
    // layout to have happened) doesn't set state directly inside the effect body.
    const raf = requestAnimationFrame(() => {
      checkOverflow()
      checkScrollTop()
    })
    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(el)
    el.addEventListener("scroll", checkScrollTop, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      el.removeEventListener("scroll", checkScrollTop)
    }
  }, [hasCap, isDynamicHeight, equalHeight, id, view])

  function handleScrollHintClick() {
    const el = scrollAreaRef.current
    if (!el) return
    el.scrollBy({ top: el.clientHeight * 0.75, behavior: "smooth" })
  }

  function handleViewChange(values: string[]) {
    const newest = values.find((v) => v !== view) ?? values[0]
    if (newest) setView(newest as "chart" | "table")
  }

  return (
    <Card size="sm" id={id} className={cn("scroll-mt-24", className)}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-sm">{title}{badges}</CardTitle>
        <CardDescription>{scopeLine}</CardDescription>
        {table || controls ? (
          <CardAction className="flex flex-wrap items-center gap-2">
            {controls}
            {table ? (
              <ToggleGroup value={[view]} onValueChange={handleViewChange} variant="outline" size="sm" spacing={0}>
                <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
                <ToggleGroupItem value="table">Table</ToggleGroupItem>
              </ToggleGroup>
            ) : null}
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {extraCaveat}
        <div
          ref={scrollAreaRef}
          className={
            chartAreaClassName
              ? cn("relative", chartAreaClassName)
              : isDynamicHeight && !isShortestCard
                ? "relative overflow-y-auto pr-1"
                : undefined
          }
          style={
            isDynamicHeight && !isShortestCard && equalHeight?.capPx != null
              ? { maxHeight: equalHeight.capPx }
              : undefined
          }
        >
          {table ? (view === "table" ? table : chart) : chart}
          {isOverflowing ? (
            <button
              type="button"
              onClick={handleScrollHintClick}
              aria-hidden={!isAtTop}
              tabIndex={isAtTop ? 0 : -1}
              className={cn(
                "absolute inset-x-0 bottom-1 mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-300 ease-out hover:text-foreground",
                isAtTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1.5 opacity-0"
              )}
            >
              Scroll for more
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          ) : null}
        </div>
        {observation ? <p className="text-sm text-foreground/90">{observation}</p> : null}
      </CardContent>
      {measure ? (
        <CardFooter className="justify-end border-t border-border">
          <MeasureDetailSheet measure={measure} />
        </CardFooter>
      ) : null}
    </Card>
  )
}
