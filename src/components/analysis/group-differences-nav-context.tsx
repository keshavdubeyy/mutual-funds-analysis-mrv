"use client"

import * as React from "react"

/**
 * Lets something outside GroupDifferencesTab (a Finding's "View evidence" link) request a
 * specific comparison be selected — a same-page state change, not a real navigation, so a
 * plain anchor href wouldn't do anything (the page never remounts). GroupDifferencesTab is
 * `keepMounted`, so it never remounts either; its own mount-only hash effect only catches a
 * fresh page load, not a request that arrives after it's already showing something else —
 * that's what `requestedKey` is for.
 */
export interface GroupDifferencesNav {
  selectComparison: (key: string) => void
  requestedKey: string | null
}

export const GroupDifferencesNavContext = React.createContext<GroupDifferencesNav | null>(null)

/** Returns null outside the provider (e.g. in a test or a future page reusing this tab
 * component standalone) rather than throwing — callers that don't need it can ignore it. */
export function useGroupDifferencesNav(): GroupDifferencesNav | null {
  return React.useContext(GroupDifferencesNavContext)
}
