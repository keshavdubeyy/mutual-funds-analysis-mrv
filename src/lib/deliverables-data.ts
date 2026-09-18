/**
 * Data for the combined "Industry KPIs and Marketing metrics" table/graph on the Deliverables
 * page (src/app/deliverables/page.tsx) — shared so both view components read the same source
 * instead of two copies drifting apart. Groups 1–6 answer "Industry KPIs" (how the segment
 * behaves); groups 7–9 answer "Marketing metrics" (how to reach/persuade it).
 */

export interface DeliverableRow {
  question: string
  metric: string
  /** The chart card's `id` on the Analysis page, if this row corresponds to an actual chart —
   * lets the question link straight to it (and briefly highlight it). Two rows have none: the
   * A15_D15 lapser-detail field (never rendered anywhere) and the percentage-point-gaps row
   * (a property of the comparisons above it, not its own chart). */
  chartId?: string
}

export interface DeliverableGroup {
  name: string
  /** This group's category, for the graph view's coloring — matches which of the two
   * deliverables (Industry KPIs vs Marketing metrics) this group answers. */
  category: "kpi" | "marketing"
  /** This group's tab key on /findings/analysis (see TOPICS in analysis-tab.tsx) — kept in
   * sync manually since the two files can't share a runtime import (one is a page, this is
   * data), but every key here is asserted to exist in that list where it's consumed. */
  topicKey: string
  rows: DeliverableRow[]
}

export const KPI_AND_MARKETING_GROUPS: DeliverableGroup[] = [
  {
    name: "Motivations and financial goals",
    category: "kpi",
    topicKey: "motivations-financial-goals",
    rows: [
      { question: "Why do respondents consider investing?", metric: "Percentage selecting each MF/ETF motivation", chartId: "motivations-selection-pct" },
      { question: "Which financial goals do they prioritize?", metric: "Percentage including each goal in their top three", chartId: "financial-goal-ranking" },
    ],
  },
  {
    name: "Reported barriers",
    category: "kpi",
    topicKey: "reported-barriers",
    rows: [
      { question: "Why do respondents report not investing?", metric: "Percentage selecting each MF/ETF barrier", chartId: "barriers-selection-pct" },
    ],
  },
  {
    name: "Previous investment and stopping reasons",
    category: "kpi",
    topicKey: "previous-investment",
    rows: [
      { question: "Who has invested before?", metric: "Percentage in each previous-investment category", chartId: "previous-investment-shares" },
      { question: "Why did respondents stop investing?", metric: "Percentage selecting each stopping reason among those who answered", chartId: "stopping-reasons-selection-pct" },
      { question: "Is more specific information available about lapsing?", metric: "Excluded from substantive analysis: the additional field has only one answer and unclear routing" },
    ],
  },
  {
    name: "Risk preferences and reactions",
    category: "kpi",
    topicKey: "risk-preferences",
    rows: [
      { question: "What risk/return preferences do respondents report?", metric: "Percentage selecting each preference", chartId: "risk-preference-distribution" },
      { question: "How would they react to a downturn?", metric: "Percentage selecting each hypothetical reaction", chartId: "downturn-reaction-distribution" },
    ],
  },
  {
    name: "Reported uncertainty",
    category: "kpi",
    topicKey: "reported-uncertainty",
    rows: [
      { question: "Which statements receive more “Not Aware” answers?", metric: "Percentage selecting “Not Aware” for each statement", chartId: "knowledge-battery-distributions" },
    ],
  },
  {
    name: "Group differences",
    category: "kpi",
    topicKey: "group-differences",
    rows: [
      { question: "Do barriers differ by previous experience?", metric: "Barrier percentages within each experience group and the gaps between them", chartId: "group-differences-barriers-by-experience" },
      { question: "Does encouragement differ by previous experience?", metric: "Encouragement percentages within each experience group and the gaps", chartId: "group-differences-encouragement-by-experience" },
      { question: "Do barriers differ by income?", metric: "Barrier percentages within each income tier and the gaps", chartId: "group-differences-barriers-by-income" },
      { question: "How large are these differences?", metric: "Already included above: percentage-point gaps, not another independent finding" },
      { question: "Does reported fear differ by risk preference?", metric: "Percentage selecting fear of loss within each risk-preference group", chartId: "group-differences-risk-fear-of-loss" },
      { question: "Does education demand differ by expense-ratio response?", metric: "Percentage selecting education within the True, False and Not Aware groups", chartId: "group-differences-knowledge-education" },
      { question: "Does preference for a simple process differ by online-KYC response?", metric: "Percentage selecting a simple process within the True, False and Not Aware groups", chartId: "group-differences-kyc-simple-process" },
    ],
  },
  {
    name: "Awareness sources and media",
    category: "marketing",
    topicKey: "awareness-media",
    rows: [
      { question: "What sources does the focused group report for awareness of MF/ETF?", metric: "Percentage citing each awareness source", chartId: "awareness-sources-media" },
      { question: "What media does the focused group report for awareness of MF/ETF?", metric: "Percentage citing each awareness medium", chartId: "awareness-sources-media" },
    ],
  },
  {
    name: "Encouragement factors",
    category: "marketing",
    topicKey: "encouragement-factors",
    rows: [
      { question: "What would encourage respondents to invest?", metric: "Percentage selecting each encouragement factor", chartId: "encouragement-selection-pct" },
    ],
  },
  {
    name: "Learning preferences",
    category: "marketing",
    topicKey: "learning-preferences",
    rows: [
      { question: "What format does the focused group prefer for investor education?", metric: "Percentage selecting each format", chartId: "learning-format" },
      { question: "What medium does the focused group prefer for investor education?", metric: "Percentage selecting each medium", chartId: "learning-medium" },
      { question: "What language does the focused group prefer for investor education?", metric: "Percentage selecting each language", chartId: "learning-language" },
      { question: "What topics does the focused group prefer for investor education?", metric: "Percentage selecting each topic", chartId: "learning-topics" },
    ],
  },
]

/** `?topic=<key>` opens the right Analysis tab; adding `#<chartId>` also scrolls to and
 * briefly highlights that specific chart (see the hash effect in analysis-tab.tsx). */
export function analysisHref(topicKey: string, chartId?: string): string {
  return `/findings/analysis?topic=${topicKey}${chartId ? `#${chartId}` : ""}`
}
