import type { KnowledgeItem } from "./who-is-in-sample-data"

// Short axis/topic labels for the GRIDxQ15AM battery, keyed by field_code — presentation
// only. The full original statement is never replaced by this label: it stays available via
// the chart's tooltip, the wording sheet, and the accessible table.
const BATTERY_TOPIC_LABELS: Record<string, string> = {
  "GRIDxQ15AM[{_1}].Q15AM": "expense ratio (direct plans)",
  "GRIDxQ15AM[{_2}].Q15AM": "PF in stock market",
  "GRIDxQ15AM[{_3}].Q15AM": "compounding (short-term)",
  "GRIDxQ15AM[{_4}].Q15AM": "online KYC",
  "GRIDxQ15AM[{_5}].Q15AM": "demat requirement",
  "GRIDxQ15AM[{_6}].Q15AM": "risk vs. return",
  "GRIDxQ15AM[{_7}].Q15AM": "diversification",
  "GRIDxQ15AM[{_8}].Q15AM": "CAS statement",
  "GRIDxQ15AM[{_9}].Q15AM": "BSDA",
}

export interface BatteryRow {
  code: string
  topic: string
  statement: string
  answered: number
  TRUE_pct: number
  FALSE_pct: number
  NOT_AWARE_pct: number
  TRUE_n: number
  FALSE_n: number
  NOT_AWARE_n: number
}

export function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

// Sorted by "Not Aware" share, highest first — the one ordering rule the battery supports
// without inventing a correct/incorrect score.
export function buildBatteryRows(items: KnowledgeItem[]): BatteryRow[] {
  return items
    .map((item) => {
      const byLabel = new Map(item.options.map((o) => [o.label, o]))
      return {
        code: item.field_code,
        topic: BATTERY_TOPIC_LABELS[item.field_code] ?? item.label,
        statement: item.label,
        answered: item.n_answered,
        TRUE_pct: byLabel.get("TRUE")?.pct ?? 0,
        FALSE_pct: byLabel.get("FALSE")?.pct ?? 0,
        NOT_AWARE_pct: byLabel.get("Not Aware")?.pct ?? 0,
        TRUE_n: byLabel.get("TRUE")?.n ?? 0,
        FALSE_n: byLabel.get("FALSE")?.n ?? 0,
        NOT_AWARE_n: byLabel.get("Not Aware")?.n ?? 0,
      }
    })
    .sort((a, b) => b.NOT_AWARE_pct - a.NOT_AWARE_pct)
}
