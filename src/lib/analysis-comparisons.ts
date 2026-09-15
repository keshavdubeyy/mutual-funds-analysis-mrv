/**
 * Normalizes the three verified group-comparison exports
 * (public/data/findings/comparison_by_experience.json,
 * public/data/findings/comparison_by_income.json) into one common shape for the
 * Analysis page's §D "Differences between groups" section.
 *
 * The three source CSVs this data was exported from were built at different times in
 * `analysis/03_descriptive_analysis.ipynb` / `analysis/04_segment_comparisons.ipynb` and use
 * three different column-naming conventions for the same kind of value (a group's n, pct and
 * denominator for one option). This module is the single place that resolves those naming
 * differences — every accessor below points at a real, already-verified field from the
 * corresponding JSON file; nothing here recomputes a percentage.
 */
import type { ComparisonByExperience, ComparisonByIncome, RelationshipBlock } from "./findings-data"

export interface ComparisonGroupValue {
  key: string
  label: string
  n: number
  pct: number | null
  denominator: number
  countOnly: boolean
}

export interface NormalizedComparisonRow {
  option: string
  groups: ComparisonGroupValue[]
  /** Percentage-point difference between the two named "primary" groups, when both have a pct. */
  ppDiff: number | null
}

export interface GroupMeta {
  key: string
  label: string
  n_group: number
  n_answered: number
  coverage_pct: number
  meets_small_group_min: boolean
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/** AA2_DD2 by previous MF experience — comparison_AA2_DD2_by_prev_investment.csv naming. */
export function normalizeBarriersByExperience(
  data: ComparisonByExperience
): { rows: NormalizedComparisonRow[]; groupMeta: GroupMeta[] } {
  const labels: Record<string, string> = {
    past_mf_investor: "Past MF investor",
    explicit_no_prior_investment: "None of the 7 listed products",
    past_investor_other_product_only: "Other product only (not MF)",
  }
  const groupMeta: GroupMeta[] = data.coverage.map((c) => ({
    key: c.group,
    label: labels[c.group] ?? c.group,
    n_group: c.n_group,
    n_answered: c.n_answered,
    coverage_pct: c.coverage_pct,
    meets_small_group_min: c.meets_small_group_min,
  }))

  const rows: NormalizedComparisonRow[] = data.barriers_AA2_DD2.map((row) => {
    const pastMfN = Number(row["past_mf_investor_n"] ?? 0)
    const pastMfPct = row["past_mf_investor_pct"] == null ? null : Number(row["past_mf_investor_pct"])
    const pastMfDenom = Number(row["denominator_past_mf_investor"] ?? 0)
    const noPriorN = Number(row["explicit_no_prior_investment_n"] ?? 0)
    const noPriorPct =
      row["explicit_no_prior_investment_pct"] == null ? null : Number(row["explicit_no_prior_investment_pct"])
    const noPriorDenom = Number(row["denominator_explicit_no_prior_investment"] ?? 0)
    // This comparison's CSV names the count-only third group's count column "..._n_only"
    // (not "..._n" like the other two groups) — verified directly against
    // data/processed/analysis/comparison_AA2_DD2_by_prev_investment.csv.
    const otherN = Number(row["past_investor_other_product_only_n_only"] ?? 0)

    const groups: ComparisonGroupValue[] = [
      {
        key: "past_mf_investor",
        label: labels.past_mf_investor,
        n: pastMfN,
        pct: pastMfPct,
        denominator: pastMfDenom,
        countOnly: false,
      },
      {
        key: "explicit_no_prior_investment",
        label: labels.explicit_no_prior_investment,
        n: noPriorN,
        pct: noPriorPct,
        denominator: noPriorDenom,
        countOnly: false,
      },
      {
        key: "past_investor_other_product_only",
        label: labels.past_investor_other_product_only,
        n: otherN,
        pct: null,
        denominator: Number(row["denominator_past_investor_other_product_only"] ?? 0),
        countOnly: true,
      },
    ]

    // Fixed, named direction: "None of the 7 listed products" minus "Past MF investor" —
    // computed from raw n/denominator (never from the already-rounded *_pct fields) so
    // rounding-then-subtracting never introduces a spurious final-digit error.
    const ppDiff =
      noPriorPct !== null && pastMfPct !== null && noPriorDenom > 0 && pastMfDenom > 0
        ? round1((noPriorN / noPriorDenom - pastMfN / pastMfDenom) * 100)
        : null

    return { option: String(row["option"]), groups, ppDiff }
  })

  rows.sort((a, b) => Math.abs(b.ppDiff ?? 0) - Math.abs(a.ppDiff ?? 0))
  return { rows, groupMeta }
}

/** AA3_DD3 by previous MF experience — comparison_AA3_DD3_by_prev_investment.csv naming (its own per-group suffix convention). */
export function normalizeEncouragementByExperience(
  data: ComparisonByExperience
): { rows: NormalizedComparisonRow[]; groupMeta: GroupMeta[] } {
  const labels: Record<string, string> = {
    past_mf_investor: "Past MF investor",
    explicit_no_prior_investment: "None of the 7 listed products",
    past_investor_other_product_only: "Other product only (not MF)",
  }
  const groupMeta: GroupMeta[] = data.coverage.map((c) => ({
    key: c.group,
    label: labels[c.group] ?? c.group,
    n_group: c.n_group,
    n_answered: c.n_answered,
    coverage_pct: c.coverage_pct,
    meets_small_group_min: c.meets_small_group_min,
  }))

  const rows: NormalizedComparisonRow[] = data.encouragement_AA3_DD3.map((row) => {
    const pastMfN = Number(row["past_mf_investor_n"] ?? 0)
    const pastMfPct = row["past_mf_investor_pct"] == null ? null : Number(row["past_mf_investor_pct"])
    const pastMfDenom = Number(row["past_mf_investor_denominator"] ?? 0)
    const noPriorN = Number(row["explicit_no_prior_investment_n"] ?? 0)
    const noPriorPct =
      row["explicit_no_prior_investment_pct"] == null ? null : Number(row["explicit_no_prior_investment_pct"])
    const noPriorDenom = Number(row["explicit_no_prior_investment_denominator"] ?? 0)

    const groups: ComparisonGroupValue[] = [
      {
        key: "past_mf_investor",
        label: labels.past_mf_investor,
        n: pastMfN,
        pct: pastMfPct,
        denominator: pastMfDenom,
        countOnly: false,
      },
      {
        key: "explicit_no_prior_investment",
        label: labels.explicit_no_prior_investment,
        n: noPriorN,
        pct: noPriorPct,
        denominator: noPriorDenom,
        countOnly: false,
      },
      {
        key: "past_investor_other_product_only",
        label: labels.past_investor_other_product_only,
        n: Number(row["past_investor_other_product_only_n"] ?? 0),
        pct: null,
        denominator: Number(row["past_investor_other_product_only_denominator"] ?? 0),
        countOnly: true,
      },
    ]

    // Fixed, named direction: "None of the 7 listed products" minus "Past MF investor" —
    // computed from raw n/denominator, never from the already-rounded *_pct fields.
    const ppDiff =
      noPriorPct !== null && pastMfPct !== null && noPriorDenom > 0 && pastMfDenom > 0
        ? round1((noPriorN / noPriorDenom - pastMfN / pastMfDenom) * 100)
        : null

    return { option: String(row["option"]), groups, ppDiff }
  })

  rows.sort((a, b) => Math.abs(b.ppDiff ?? 0) - Math.abs(a.ppDiff ?? 0))
  return { rows, groupMeta }
}

const INCOME_NUMERIC_TIERS = ["Up to Rs.20,000", "Rs.20,001-Rs.40,000", "Above Rs.40,000"] as const
const INCOME_SPECIAL_TIERS = ["Do not wish to disclose", "No current income"] as const
const INCOME_LABELS: Record<string, string> = {
  "Up to Rs.20,000": "Up to ₹20,000",
  "Rs.20,001-Rs.40,000": "₹20,001–₹40,000",
  "Above Rs.40,000": "Above ₹40,000",
  "Do not wish to disclose": "Do not wish to disclose",
  "No current income": "No current income",
}

/** AA2_DD2 by income tier — comparison_AA2_DD2_by_income_tier.csv naming (per-tier "{tier}_n"/"_pct"/"_denominator"). */
export function normalizeBarriersByIncome(
  data: ComparisonByIncome
): { rows: NormalizedComparisonRow[]; groupMeta: GroupMeta[] } {
  const tierOrder = [...INCOME_NUMERIC_TIERS, ...INCOME_SPECIAL_TIERS]
  const groupMeta: GroupMeta[] = [...data.coverage]
    .sort((a, b) => tierOrder.indexOf(a.group as (typeof tierOrder)[number]) - tierOrder.indexOf(b.group as (typeof tierOrder)[number]))
    .map((c) => ({
      key: c.group,
      label: INCOME_LABELS[c.group] ?? c.group,
      n_group: c.n_group,
      n_answered: c.n_answered,
      coverage_pct: c.coverage_pct,
      meets_small_group_min: c.meets_small_group_min,
    }))

  const rows: NormalizedComparisonRow[] = data.barriers_AA2_DD2.map((row) => {
    const groups: ComparisonGroupValue[] = [...INCOME_NUMERIC_TIERS, ...INCOME_SPECIAL_TIERS].map((tier) => {
      const pctRaw = row[`${tier}_pct`]
      const pct = pctRaw === null || pctRaw === undefined ? null : Number(pctRaw)
      const countOnly = (INCOME_SPECIAL_TIERS as readonly string[]).includes(tier) || pct === null
      return {
        key: tier,
        label: INCOME_LABELS[tier] ?? tier,
        n: Number(row[`${tier}_n`] ?? 0),
        pct: countOnly ? null : pct,
        denominator: Number(row[`${tier}_denominator`] ?? 0),
        countOnly,
      }
    })

    // Fixed, named direction: "Above ₹40,000" minus "Up to ₹20,000" — computed from raw
    // n/denominator, never from the already-rounded *_pct fields.
    const above40 = groups.find((g) => g.key === "Above Rs.40,000")
    const upTo20 = groups.find((g) => g.key === "Up to Rs.20,000")
    const ppDiff =
      above40?.pct != null && upTo20?.pct != null && above40.denominator > 0 && upTo20.denominator > 0
        ? round1((above40.n / above40.denominator - upTo20.n / upTo20.denominator) * 100)
        : null

    return { option: String(row["option"]), groups, ppDiff }
  })

  rows.sort((a, b) => Math.abs(b.ppDiff ?? 0) - Math.abs(a.ppDiff ?? 0))
  return { rows, groupMeta }
}

/** The 9-item knowledge battery's raw stored category values ("TRUE"/"FALSE"/"Not Aware") —
 * relabeled everywhere they're shown as a category, so a reader never sees a bare "True"/
 * "False" and mistakes it for a correctness judgement. This battery has no documented
 * answer key; "Selected X" only ever describes what was chosen, never whether it was right. */
const KNOWLEDGE_CATEGORY_LABEL: Record<string, string> = {
  TRUE: "Selected True",
  FALSE: "Selected False",
  "Not Aware": "Selected Not Aware",
}

export function knowledgeCategoryLabel(category: string): string {
  return KNOWLEDGE_CATEGORY_LABEL[category] ?? category
}

/**
 * Adapts one of the three respondent-level relationships (public/data/findings/relationships.json)
 * into the same NormalizedComparisonRow/GroupMeta shape used by the group comparisons above, so
 * the "Differences between groups" tab can render all six comparisons through one path. Each
 * relationship becomes exactly one row (there is only one target option being cross-tabulated)
 * with one group per response category.
 */
export function normalizeRelationship(block: RelationshipBlock): {
  row: NormalizedComparisonRow
  groupMeta: GroupMeta[]
} {
  const groups: ComparisonGroupValue[] = block.rows.map((r) => ({
    key: r.category,
    label: knowledgeCategoryLabel(r.category),
    n: r.n_selecting,
    pct: r.meets_small_group_min ? r.pct_selecting : null,
    denominator: r.n,
    countOnly: !r.meets_small_group_min,
  }))

  const groupMeta: GroupMeta[] = block.rows.map((r) => ({
    key: r.category,
    label: knowledgeCategoryLabel(r.category),
    n_group: r.n,
    n_answered: r.n,
    coverage_pct: 100,
    meets_small_group_min: r.meets_small_group_min,
  }))

  // A signed pp-diff only has one unambiguous, fixed direction when there are exactly two
  // reportable categories (e.g. the KYC relationship: "Selected True" minus "Selected
  // False"). With three or more reportable categories (QRT; the expense-ratio item), no
  // single pair is more entitled to be "the" difference than another — picking one would
  // be arbitrary, so this case reports a range instead (see `reportableRange` below).
  // Computed from raw n_selecting/n, never from the already-rounded pct_selecting.
  const reportable = block.rows.filter((r) => r.meets_small_group_min)
  const ppDiff =
    reportable.length === 2
      ? round1((reportable[0].n_selecting / reportable[0].n - reportable[1].n_selecting / reportable[1].n) * 100)
      : null

  return {
    row: { option: block.target_option, groups, ppDiff },
    groupMeta,
  }
}

/** For a relationship with 3+ reportable categories, where no single pairwise difference
 * is uniquely "the" comparison, report the spread instead — computed from raw counts. */
export function relationshipReportableRange(block: RelationshipBlock): { min: number; max: number } | null {
  const reportable = block.rows.filter((r) => r.meets_small_group_min)
  if (reportable.length < 2) return null
  const pcts = reportable.map((r) => round1((r.n_selecting / r.n) * 100))
  return { min: Math.min(...pcts), max: Math.max(...pcts) }
}
