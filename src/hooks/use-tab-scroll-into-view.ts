import * as React from "react"

/**
 * Whichever tab becomes active should land centered in a horizontally-scrolling tab strip —
 * a single, whole-row scroll that brings the surrounding tabs into view with it, not a
 * one-pixel nudge that only just barely reveals it. `inline: "center"` scrolls only the strip
 * itself (its nearest scrollable ancestor), never the page. Attach the returned ref to the
 * scroll container and put `data-tab-id={value}` on each trigger.
 */
export function useTabScrollIntoView(activeTab: string | undefined) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!activeTab) return
    const trigger = scrollRef.current?.querySelector(`[data-tab-id="${activeTab}"]`)
    trigger?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeTab])

  return scrollRef
}
