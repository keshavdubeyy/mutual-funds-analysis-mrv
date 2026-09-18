// One fixed, restrained color per *role* in the hierarchy (not per theme) — every KPI card
// looks the same as every other KPI card regardless of which theme it's in, and likewise for
// questions and metrics. Hierarchy is read from the role badge each card carries, not from
// which of many colors it happens to be.
export type CardRole = "kpi" | "question" | "metric" | "excluded"

const ROLE_COLOR_VAR: Record<CardRole, string> = {
  kpi: "var(--primary)",
  question: "var(--chart-4)",
  metric: "var(--chart-3)",
  excluded: "var(--muted-foreground)",
}

export const ROLE_LABEL: Record<CardRole, string> = {
  kpi: "Industry KPI",
  question: "Research question",
  metric: "Metric",
  excluded: "Excluded",
}

export function roleColor(role: CardRole): string {
  return ROLE_COLOR_VAR[role]
}
