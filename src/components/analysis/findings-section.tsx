"use client"

import * as React from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { findingsForTheme, type Finding, type EvidenceTarget } from "@/lib/findings-register"
import { goToEvidenceElement, setHoverHighlight } from "@/lib/dom-highlight"
import { useGroupDifferencesNav } from "./group-differences-nav-context"

function sameTarget(a: EvidenceTarget, b: EvidenceTarget): boolean {
  return a.chartId === b.chartId && a.comparisonKey === b.comparisonKey
}

function uniqueTargets(finding: Finding): EvidenceTarget[] {
  const out: EvidenceTarget[] = []
  for (const sn of finding.supportingNumbers) {
    if (!out.some((t) => sameTarget(t, sn.evidence))) out.push(sn.evidence)
  }
  return out
}

function FindingRow({ finding }: { finding: Finding }) {
  const nav = useGroupDifferencesNav()
  const [expanded, setExpanded] = React.useState(false)
  const [choosing, setChoosing] = React.useState(false)
  const rowRef = React.useRef<HTMLLIElement>(null)
  const [active, setActive] = React.useState(false)
  const targets = React.useMemo(() => uniqueTargets(finding), [finding])

  function setChartHighlight(on: boolean) {
    for (const t of targets) {
      const el = document.getElementById(t.chartId)
      // getClientRects().length === 0 for an element hidden via an ancestor's `hidden`
      // attribute (an inactive tab's own charts, since every tab stays mounted) — this is
      // what keeps hover from "highlighting" something the reader can't currently see.
      if (el && el.getClientRects().length > 0) setHoverHighlight(el, on)
    }
  }

  function activate() {
    setActive(true)
    setChartHighlight(true)
  }
  function deactivate() {
    setActive(false)
    setChartHighlight(false)
  }

  function goToTarget(target: EvidenceTarget) {
    setChoosing(false)
    if (target.comparisonKey) nav?.selectComparison(target.comparisonKey)
    // One frame is usually enough for Group Differences to re-render with the requested
    // comparison; a second covers a slower first paint. For every other theme the target
    // already exists, so this just resolves on the first check.
    requestAnimationFrame(() => {
      if (!goToEvidenceElement(target.chartId)) {
        requestAnimationFrame(() => goToEvidenceElement(target.chartId))
      }
    })
  }

  function handleViewEvidence() {
    if (targets.length <= 1) {
      if (targets[0]) goToTarget(targets[0])
      return
    }
    setChoosing((v) => !v)
  }

  return (
    <li
      ref={rowRef}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={(e) => {
        if (!rowRef.current?.contains(e.relatedTarget as Node)) deactivate()
      }}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        active ? "border-primary bg-primary/5" : "border-border bg-card"
      )}
    >
      <p className="text-sm font-medium text-foreground">{finding.finding}</p>

      <ul className="flex flex-col gap-1">
        {finding.supportingNumbers.map((sn, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => goToTarget(sn.evidence)}
              className="text-left text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline focus-visible:outline-none"
            >
              {sn.text}
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-foreground/80">{finding.interpretation}</p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Button variant="outline" size="xs" onClick={handleViewEvidence} aria-expanded={targets.length > 1 ? choosing : undefined}>
            View evidence
          </Button>
          {choosing ? (
            <ul className="absolute top-full left-0 z-10 mt-1 w-max min-w-40 rounded-lg border border-border bg-popover p-1 shadow-md">
              {targets.map((t) => (
                <li key={`${t.chartId}-${t.comparisonKey ?? ""}`}>
                  <button
                    type="button"
                    onClick={() => goToTarget(t)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
        >
          What this means and what to check
          <HugeiconsIcon icon={expanded ? ArrowUp01Icon : ArrowDown01Icon} strokeWidth={2} className="size-3.5" />
        </button>
      </div>

      {expanded ? (
        <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Limitation — </span>
            {finding.limitation}
          </p>
          <p>
            <span className="font-medium text-foreground">Worth checking next — </span>
            {finding.proposedInvestigation}
          </p>
        </div>
      ) : null}
    </li>
  )
}

/**
 * Renders beneath a theme's existing charts (never a new tab) — one collapsible finding row
 * per Finding in the register for this theme, "View evidence" and the number links pointing
 * back at the charts above via the same scroll-and-highlight mechanism the Deliverables page
 * already uses. Returns null when a theme genuinely has no findings, rather than showing an
 * empty section.
 */
export function FindingsSection({ themeId }: { themeId: string }) {
  const findings = React.useMemo(() => findingsForTheme(themeId), [themeId])
  if (findings.length === 0) return null

  return (
    <section aria-labelledby={`findings-${themeId}-heading`} className="mt-8 border-t border-border pt-5">
      <h3 id={`findings-${themeId}-heading`} className="text-sm font-semibold text-foreground">
        Findings
      </h3>
      <ul className="mt-3 flex flex-col gap-3">
        {findings.map((f) => (
          <FindingRow key={f.id} finding={f} />
        ))}
      </ul>
    </section>
  )
}
