/**
 * Structure-only mapping for the interactive research map component
 * (src/components/research-plan/research-map/) — used on both the Research Plan page
 * (KPI themes only) and the Deliverables page (all 9, KPI + marketing). Deliberately holds
 * no question text, measure names, or results — every display field is read live from
 * `MEASURES` in research-plan-data.ts via `getMeasureById`, so this file can't drift into a
 * second, manually-written copy of the research content. Editing a measure's wording in the
 * register is enough; nothing here needs to change to match.
 *
 * No `side` (left/right) field here on purpose — which half of the map a theme renders on
 * depends on which *other* themes it's being shown alongside (6 for Research Plan, 9 for
 * Deliverables), so `computeLayout` derives it from array position at render time instead.
 */

export interface ResearchMapTheme {
  id: string
  name: string
  /** Ordered measure IDs (each an id in MEASURES) — one research question per ID, in display order. */
  measureIds: string[]
}

// The "Industry KPI" 6 — how the segment behaves. Matches the Research Plan page's Key
// Research Indicators register (minus encouragement/learning-preferences, which describe
// reaching the segment rather than its behavior — see the marketing themes below).
export const RESEARCH_MAP_KPI_THEMES: ResearchMapTheme[] = [
  {
    id: "motivations-financial-goals",
    name: "Motivations and financial goals",
    measureIds: ["motivations-selection-pct", "financial-goal-ranking"],
  },
  {
    id: "reported-barriers",
    name: "Reported barriers",
    measureIds: ["barriers-selection-pct"],
  },
  {
    id: "previous-investment",
    name: "Previous investment and stopping reasons",
    measureIds: ["previous-investment-shares", "stopping-reasons-selection-pct", "a15-d15-lapser-detail"],
  },
  {
    id: "risk-preferences",
    name: "Risk preferences and reactions",
    measureIds: ["risk-preference-distribution", "downturn-reaction-distribution"],
  },
  {
    id: "reported-uncertainty",
    name: "Reported uncertainty",
    measureIds: ["knowledge-battery-distributions"],
  },
  {
    id: "group-differences",
    name: "Group differences and more",
    measureIds: [
      "barriers-by-experience-comparison",
      "encouragement-by-experience-comparison",
      "barriers-by-income-comparison",
      "pp-differences-supported-groups",
      "relationship-risk-fear-of-loss",
      "relationship-knowledge-education-demand",
      "relationship-kyc-simple-process",
    ],
  },
]

// The "Marketing metrics" 3 — how to reach/persuade the segment. Same 3 groups as the
// Deliverables table's rows 7–9. Each measure's own `.question` already covers its full
// scope in one sentence (e.g. sources *and* media; format, medium, language *and* topics) —
// shown as one question/measure node each, not split into sub-questions the register itself
// doesn't ask separately.
export const RESEARCH_MAP_MARKETING_THEMES: ResearchMapTheme[] = [
  {
    id: "awareness-media",
    name: "Awareness sources and media",
    measureIds: ["awareness-sources-media"],
  },
  {
    id: "encouragement-factors",
    name: "Encouragement factors",
    measureIds: ["encouragement-selection-pct"],
  },
  {
    id: "learning-preferences",
    name: "Learning preferences",
    measureIds: ["learning-preference-fields"],
  },
]

export const RESEARCH_MAP_ALL_THEMES: ResearchMapTheme[] = [
  ...RESEARCH_MAP_KPI_THEMES,
  ...RESEARCH_MAP_MARKETING_THEMES,
]
