"use client"

import * as React from "react"

interface EqualHeightContextValue {
  /** The shared cap, once every expected card has reported its own natural (hug) height —
   *  exactly the shortest card's own height, never an average. `null` while still measuring,
   *  meaning every card should render at its own natural height with no cap yet. */
  capPx: number | null
  /** id of the card that *is* that shortest height — it renders with no cap and no scroll at
   *  all, at its own untouched natural height. Every other card gets capped to `capPx`. */
  shortestId: string | null
  registerHeight: (id: string, height: number) => void
}

const EqualHeightContext = React.createContext<EqualHeightContextValue | null>(null)

/**
 * Wrap a grid of `AnalysisChartCard`s in this to make their chart/table areas all settle to
 * the same height: every card's own natural, uncapped ("hug") content height is measured
 * first. The single *shortest* card is left exactly as-is (no cap, no scroll) — its own
 * height becomes the shared target, not an average of everyone's heights — and every other,
 * taller card is capped to that same height and scrolls internally instead. `expectedCount`
 * must equal the number of cards inside — the cap is only published once that many distinct
 * cards have reported a height, so a partial measurement (e.g. only the first 2 of 5 cards
 * mounted so far) never gets published as the real minimum.
 */
export function EqualHeightChartsProvider({
  expectedCount,
  children,
}: {
  expectedCount: number
  children: React.ReactNode
}) {
  const heightsRef = React.useRef<Map<string, number>>(new Map())
  const [result, setResult] = React.useState<{ capPx: number; shortestId: string } | null>(null)

  const registerHeight = React.useCallback(
    (id: string, height: number) => {
      const heights = heightsRef.current
      if (heights.get(id) === height) return
      heights.set(id, height)
      if (heights.size < expectedCount) return
      let shortestId = id
      let min = height
      for (const [candidateId, candidateHeight] of heights) {
        if (candidateHeight < min) {
          min = candidateHeight
          shortestId = candidateId
        }
      }
      setResult((prev) => (prev && prev.capPx === min && prev.shortestId === shortestId ? prev : { capPx: min, shortestId }))
    },
    [expectedCount]
  )

  const value = React.useMemo(
    () => ({ capPx: result?.capPx ?? null, shortestId: result?.shortestId ?? null, registerHeight }),
    [result, registerHeight]
  )

  return <EqualHeightContext.Provider value={value}>{children}</EqualHeightContext.Provider>
}

export function useEqualHeightCharts() {
  return React.useContext(EqualHeightContext)
}
