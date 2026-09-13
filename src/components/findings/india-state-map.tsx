"use client"

import * as React from "react"
import { cn } from "cn"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  INDIA_MAP,
  STATE_KEY_TO_SVG_ID,
  STATE_TO_ZONE,
  formatN,
  type WhoField,
  type Zone,
} from "@/lib/who-is-in-sample-data"

const SVG_ID_TO_STATE_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_KEY_TO_SVG_ID).map(([key, id]) => [id, key])
)

/**
 * India states/UTs shaded by respondent count, from the reputable, documented
 * @svg-maps/india boundary set (36 locations, CC-BY-4.0) — no hand-drawn or
 * approximated geometry. A state/UT with zero respondents is still valid,
 * mapped geography (shown in the muted "zero" shade); a label this survey's
 * SELECTED_STATE never resolves to a known boundary would be excluded from
 * the map and reported separately (see `unmatchedTotal`) rather than guessed.
 *
 * Pure content only (no Card/heading/filters of its own) — it's rendered as
 * one pane of the merged "Where respondents live" card, which owns the
 * shared zone / urban-rural filters and passes the already-selected `zone`
 * down so the map and the ranked list next to it always agree.
 */
export function IndiaStateMap({
  field,
  zone,
  selected,
  onSelect,
}: {
  field: WhoField
  zone: Zone | null
  selected: string | null
  onSelect: (stateKey: string | null) => void
}) {
  const countByStateKey = new Map(field.options.map((o) => [o.label, o]))
  const unmatchedTotal = field.options
    .filter((o) => !(o.label in STATE_KEY_TO_SVG_ID))
    .reduce((sum, o) => sum + o.n, 0)
  const maxN = Math.max(0, ...field.options.map((o) => o.n))

  function fillFor(n: number) {
    if (maxN === 0) return "var(--muted)"
    if (n === 0) return "var(--muted)"
    const intensity = 15 + (n / maxN) * 75
    return `color-mix(in oklch, var(--primary) ${intensity}%, white)`
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <TooltipProvider delay={100} closeDelay={0}>
        <svg
          viewBox={INDIA_MAP.viewBox}
          role="img"
          aria-label="Map of India shaded by respondent count per state/UT in the current selection"
          className="h-full w-full"
        >
          {INDIA_MAP.locations.map((loc) => {
            const stateKey = SVG_ID_TO_STATE_KEY[loc.id]
            const opt = stateKey ? countByStateKey.get(stateKey) : undefined
            const n = opt?.n ?? 0
            const pct = opt?.pct ?? 0
            const isSelected = selected === stateKey
            const isSelectable = Boolean(stateKey)
            const stateZone = stateKey ? STATE_TO_ZONE[stateKey] : undefined
            const inActiveZone = !zone || stateZone === zone

            return (
              <Tooltip key={loc.id}>
                <TooltipTrigger
                  render={
                    <path
                      d={loc.path}
                      tabIndex={isSelectable ? 0 : -1}
                      role={isSelectable ? "button" : undefined}
                      aria-pressed={isSelectable ? isSelected : undefined}
                      aria-label={`${loc.name}: ${n.toLocaleString("en-IN")} respondents (${pct}%)`}
                      className={cn(
                        "stroke-background transition-[opacity,fill-opacity] outline-none",
                        isSelectable ? "cursor-pointer hover:opacity-80 focus-visible:opacity-80" : "cursor-default"
                      )}
                      style={{
                        fill: fillFor(n),
                        fillOpacity: inActiveZone ? 1 : 0.25,
                        strokeWidth: isSelected ? 2 : zone && inActiveZone ? 1.25 : 0.5,
                        stroke: isSelected
                          ? "var(--primary)"
                          : zone && inActiveZone
                            ? "color-mix(in oklch, var(--primary) 60%, white)"
                            : undefined,
                      }}
                      onClick={() => isSelectable && onSelect(isSelected ? null : (stateKey as string))}
                      onKeyDown={(e) => {
                        if (isSelectable && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault()
                          onSelect(isSelected ? null : (stateKey as string))
                        }
                      }}
                    />
                  }
                />
                <TooltipContent>
                  {loc.name}: {formatN(n)} ({pct}%)
                </TooltipContent>
              </Tooltip>
            )
          })}
        </svg>
        </TooltipProvider>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>0</span>
        <div
          className="h-2.5 flex-1 rounded-full"
          style={{
            background: `linear-gradient(to right, var(--muted), color-mix(in oklch, var(--primary) 90%, white))`,
          }}
        />
        <span>{maxN.toLocaleString("en-IN")} (most)</span>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Shading reflects respondent counts in this sample only — not state population or market size.
        {unmatchedTotal > 0 ? ` ${unmatchedTotal} respondent(s) in geography not mapped to a boundary, excluded from the map.` : ""}
      </p>
    </div>
  )
}
