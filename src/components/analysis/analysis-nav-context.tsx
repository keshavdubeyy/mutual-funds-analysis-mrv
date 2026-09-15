"use client"

import * as React from "react"

/**
 * Lets a component inside the Analysis tab (e.g. Overview's "View chart" links) switch to
 * another of the 5 topics and scroll to a specific chart — a same-page state change, not a
 * real navigation, so a plain `next/link` href wouldn't do anything (the page never remounts,
 * so nothing would re-read the URL). `AnalysisTab` provides the real implementation.
 */
export interface AnalysisNavTarget {
  topic: string
  chartId?: string
}

export interface AnalysisNav {
  goTo: (topic: string, chartId?: string) => void
  /**
   * The most recent `goTo` call, so a topic component that itself picks *which* chart to show
   * (e.g. Group Differences' comparison dropdown) can react to being navigated to after it has
   * already mounted — reading `window.location.hash` once on mount only catches a fresh page
   * load with the hash already in the URL, not an in-app link clicked later in the same
   * session (since `keepMounted` topics never remount, and `goTo` updates the URL via
   * `history.replaceState`, which does not fire a `hashchange` event).
   */
  target: AnalysisNavTarget | null
}

export const AnalysisNavContext = React.createContext<AnalysisNav | null>(null)

export function useAnalysisNav(): AnalysisNav {
  const ctx = React.useContext(AnalysisNavContext)
  if (!ctx) throw new Error("useAnalysisNav must be used within AnalysisTab")
  return ctx
}
