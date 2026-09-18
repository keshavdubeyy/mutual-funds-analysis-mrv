/**
 * Structured "Findings" content for the Analysis page (one FindingsSection per theme tab,
 * src/components/analysis/findings-section.tsx). Every supporting number is computed here
 * from the same verified aggregate exports the charts already read — never retyped as a
 * literal string — so this file can't drift into a second copy of the counts/percentages.
 *
 * Reviewed against every measure in each of the 9 themes; not every measure produces a
 * finding — several (e.g. financial-goal ranking beyond its top two, most of the 9-item
 * knowledge battery) are already fully described by their own chart and don't support a
 * further conclusion worth stating here.
 */
import {
  motivations,
  barriers,
  encouragement,
  stoppingReasons,
  awarenessSources,
  financialGoals,
  demographics,
  comparisonByExperience,
  comparisonByIncome,
  relationships,
  type BarrierField,
  type DemographicField,
  type OptionCount,
  type FinancialGoals,
} from "./findings-data"
import { whoIsInSampleBase, type WhoField } from "./who-is-in-sample-data"
import {
  normalizeBarriersByExperience,
  normalizeEncouragementByExperience,
  normalizeBarriersByIncome,
  type NormalizedComparisonRow,
} from "./analysis-comparisons"
import { buildBatteryRows } from "./knowledge-battery"

// ---------------------------------------------------------------------------
// Generic option lookup — every dataset shape normalized to the same
// {label, n, pct, denominator}, so every finding below reads through one path.
// ---------------------------------------------------------------------------

interface NormOption {
  label: string
  n: number
  pct: number
  denominator: number
}

function fromBarrierField(f: BarrierField): NormOption[] {
  return f.options.map((o) => ({ label: o.option, n: o.n, pct: o.pct_of_answered, denominator: f.denominator }))
}
function fromDemographicField(f: DemographicField | WhoField): NormOption[] {
  return f.options.map((o) => ({ label: o.label, n: o.n, pct: o.pct, denominator: f.denominator }))
}
function fromOptionCounts(options: OptionCount[], denominator: number): NormOption[] {
  return options.map((o) => ({ label: o.option, n: o.n, pct: o.pct_of_answered, denominator }))
}
function fromFinancialGoals(f: FinancialGoals): NormOption[] {
  return f.goals.map((g) => ({ label: g.goal, n: g.n_ranked_in_top3, pct: g.pct_of_553, denominator: f.focused_group_size }))
}

function findOpt(options: NormOption[], label: string): NormOption {
  const found = options.find((o) => o.label === label)
  if (!found) throw new Error(`findings-register: option not found — "${label}"`)
  return found
}

function fmtOpt(o: NormOption): string {
  return `${o.n} of ${o.denominator} (${o.pct.toFixed(1)}%)`
}

function fmtStat(label: string, o: NormOption): string {
  return `${label}: ${fmtOpt(o)}`
}

function whoField(code: string): WhoField {
  const f = whoIsInSampleBase.fields.find((d) => d.field_code === code)
  if (!f) throw new Error(`findings-register: who-is-in-sample field not found — "${code}"`)
  return f
}
function demographicField(code: string): DemographicField {
  const f = demographics.fields.find((d) => d.field_code === code)
  if (!f) throw new Error(`findings-register: demographics field not found — "${code}"`)
  return f
}

/** One comparison row's group value, formatted — used for the group-differences findings. */
function fmtGroup(rows: NormalizedComparisonRow[], optionLabel: string, groupKey: string, groupLabelPrefix: string): string {
  const row = rows.find((r) => r.option === optionLabel)
  if (!row) throw new Error(`findings-register: comparison option not found — "${optionLabel}"`)
  const g = row.groups.find((x) => x.key === groupKey)
  if (!g) throw new Error(`findings-register: comparison group not found — "${groupKey}"`)
  if (g.countOnly || g.pct === null) return `${groupLabelPrefix}: ${g.n} of ${g.denominator} (below reporting minimum — count only)`
  return `${groupLabelPrefix}: ${g.n} of ${g.denominator} (${g.pct.toFixed(1)}%)`
}

/** Same lookup as `fmtGroup`, but returns the raw numbers instead of a formatted string — for
 * callers (like the reported-problems stats below) that build their own sentence around the
 * figure instead of using this file's "Label: N of D (X%)" phrasing. */
function groupStat(rows: NormalizedComparisonRow[], optionLabel: string, groupKey: string): ReportedProblemStat {
  const row = rows.find((r) => r.option === optionLabel)
  if (!row) throw new Error(`findings-register: comparison option not found — "${optionLabel}"`)
  const g = row.groups.find((x) => x.key === groupKey)
  if (!g) throw new Error(`findings-register: comparison group not found — "${groupKey}"`)
  if (g.countOnly || g.pct === null) throw new Error(`findings-register: group "${groupKey}" is below the reporting minimum`)
  return { n: g.n, denominator: g.denominator, pct: g.pct }
}

function fmtPpDiff(rows: NormalizedComparisonRow[], optionLabel: string): string {
  const row = rows.find((r) => r.option === optionLabel)
  const ppDiff = row?.ppDiff
  if (ppDiff == null) return "Difference: not reportable (a compared group is below the minimum)."
  return `Difference: ${ppDiff > 0 ? "+" : ""}${ppDiff.toFixed(1)} percentage points.`
}

const PREV_INVESTMENT_LABEL: Record<string, string> = {
  past_mf_investor: "Past MF investor",
  explicit_no_prior_investment: "None of the 7 listed products",
  past_investor_other_product_only: "Other listed product only (not MF)",
}

/** comparison_by_experience.json's `group_sizes` is the live source for this 3-way split —
 * denominator is the sum of all three, not a separate field on the parent object. */
function fmtGroupSize(groupKey: string): string {
  const n = comparisonByExperience.group_sizes[groupKey] ?? 0
  const total = Object.values(comparisonByExperience.group_sizes).reduce((sum, v) => sum + v, 0)
  const pct = total > 0 ? (n / total) * 100 : 0
  return `${PREV_INVESTMENT_LABEL[groupKey] ?? groupKey}: ${n} of ${total} (${pct.toFixed(1)}%)`
}

function fmtRelationshipGroup(
  target: { rows: { category: string; n: number; n_selecting: number; pct_selecting: number | null; meets_small_group_min: boolean }[] },
  category: string,
  displayLabel: string
): string {
  const row = target.rows.find((r) => r.category === category)
  if (!row) throw new Error(`findings-register: relationship category not found — "${category}"`)
  if (!row.meets_small_group_min || row.pct_selecting === null) {
    return `${displayLabel}: ${row.n_selecting} of ${row.n} (below reporting minimum — count only)`
  }
  return `${displayLabel}: ${row.n_selecting} of ${row.n} (${row.pct_selecting.toFixed(1)}%)`
}

// ---------------------------------------------------------------------------
// Evidence destinations
// ---------------------------------------------------------------------------

/** Where a supporting number (or a whole finding) points on the Analysis page. `chartId`
 * must match an existing `AnalysisChartCard`'s `id` prop exactly — never guessed from
 * visible text or DOM position. `comparisonKey` is set only for Group Differences, whose
 * chart card only exists in the DOM once that specific comparison is selected. */
export interface EvidenceTarget {
  chartId: string
  comparisonKey?: string
  label: string
}

export interface SupportingNumber {
  text: string
  evidence: EvidenceTarget
}

export interface Finding {
  id: string
  themeId: string
  finding: string
  supportingNumbers: SupportingNumber[]
  interpretation: string
  limitation: string
  proposedInvestigation: string
}

function oneEvidence(sn: Omit<SupportingNumber, "evidence">[], evidence: EvidenceTarget): SupportingNumber[] {
  return sn.map((s) => ({ ...s, evidence }))
}

// ---------------------------------------------------------------------------
// Findings, grouped by theme (1–3 per theme, only where genuinely supported)
// ---------------------------------------------------------------------------

const motivationsOpts = fromBarrierField(motivations)
const barriersOpts = fromBarrierField(barriers)
const encouragementOpts = fromBarrierField(encouragement)
const stoppingOpts = fromBarrierField(stoppingReasons)
const goalsOpts = fromFinancialGoals(financialGoals)
const awarenessSourceOpts = fromOptionCounts(awarenessSources.sources, awarenessSources.denominator)
const awarenessMediaOpts = fromOptionCounts(awarenessSources.media, awarenessSources.denominator)
const riskPrefOpts = fromDemographicField(whoField("QRT"))
const downturnOpts = fromDemographicField(whoField("Q10M"))
const inflationOpts = fromDemographicField(whoField("Q12M"))
const stockFamiliarityOpts = fromDemographicField(whoField("Q11M"))
const attendanceOpts = fromDemographicField(demographicField("Q20AM"))
const formatOpts = fromDemographicField(demographicField("Q20DM"))
const topicsOpts = fromDemographicField(demographicField("Q20F"))
const languageOpts = fromDemographicField(demographicField("Q20E"))

const barriersByExperience = normalizeBarriersByExperience(comparisonByExperience).rows
const encouragementByExperience = normalizeEncouragementByExperience(comparisonByExperience).rows
const barriersByIncome = normalizeBarriersByIncome(comparisonByIncome).rows

export const FINDINGS: Finding[] = [
  // 1. Motivations and financial goals ---------------------------------------------------
  {
    id: "motivations-no-single-dominant-reason",
    themeId: "motivations-financial-goals",
    finding: "The two most commonly reported reasons for considering investing — long-term growth and short-term gains — are separated by less than one percentage point, so neither stands out as the dominant reason.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Long-term growth (building wealth over time)", findOpt(motivationsOpts, "Long-term growth (building wealth over time)")) },
        { text: fmtStat("Good for short term investments", findOpt(motivationsOpts, "Good for short term investments")) },
      ],
      { chartId: "motivations-selection-pct", label: "Reasons for considering investing" }
    ),
    interpretation: "Motivations for considering MF/ETF are spread across many reasons, not concentrated in one.",
    limitation: "This ranking doesn't show which single motivation, if reinforced in messaging, would actually change behavior.",
    proposedInvestigation: "Ask a smaller group of considerers directly which one factor mattered most to them.",
  },
  {
    id: "financial-goals-are-general-not-mf-specific",
    themeId: "motivations-financial-goals",
    finding: "Growing wealth and supporting family lead financial goals — but these are general priorities, not motivations specific to mutual funds.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Growing wealth", findOpt(goalsOpts, "Growing wealth")) },
        { text: fmtStat("Supporting family members", findOpt(goalsOpts, "Supporting family members")) },
      ],
      { chartId: "financial-goal-ranking", label: "Financial goals" }
    ),
    interpretation: "This shows what this group generally prioritizes financially, not why they'd choose mutual funds specifically.",
    limitation: "Whether a respondent's ranked goals connect to their reported MF motivations was not tested.",
    proposedInvestigation: "Ask directly whether a specific goal (e.g. buying a house) is what's driving interest in mutual funds, as opposed to a general savings habit.",
  },

  // 2. Reported barriers ------------------------------------------------------------------
  {
    id: "fear-of-loss-top-barrier",
    themeId: "reported-barriers",
    finding: "Fear of losing money is the most commonly reported barrier, among the roughly half of the group who answered this question.",
    supportingNumbers: oneEvidence(
      [{ text: fmtStat("Fear of losing money due to market risks", findOpt(barriersOpts, "Fear of losing money due to market risks")) }],
      { chartId: "barriers-selection-pct", label: "Reasons for not investing" }
    ),
    interpretation: "Among those who answered, concern about losing money is the single most common reason given for not currently investing.",
    limitation: "The 287 who didn't answer are unknown, not assumed to share or lack this concern.",
    proposedInvestigation: "A short follow-up asking what specifically respondents fear (volatility vs. total loss) would separate a risk-aversion story from a knowledge-gap story.",
  },
  {
    id: "barriers-cluster-not-one-dominant",
    themeId: "reported-barriers",
    finding: "Several distinct concerns — perceived risk, not knowing how mutual funds work, and not knowing how to start — are reported at similar rates just behind fear of loss.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("It’s for long term investment", findOpt(barriersOpts, "It’s for long term investment")) },
        { text: fmtStat("Lack of knowledge about how mutual funds work", findOpt(barriersOpts, "Lack of knowledge about how mutual funds work")) },
        { text: fmtStat("I don't know how to start investing in Mutual funds", findOpt(barriersOpts, "I don't know how to start investing in Mutual funds")) },
      ],
      { chartId: "barriers-selection-pct", label: "Reasons for not investing" }
    ),
    interpretation: "This isn't one dominant barrier — knowledge gaps and not knowing where to start are reported almost as often as the top concern.",
    limitation: "This descriptive ranking doesn't show which barrier, if resolved, would most increase investment.",
    proposedInvestigation: "Test which single barrier resolution (e.g. a plain-language 'how to start' guide) most changes stated intent in a small usability study.",
  },
  {
    id: "trust-is-a-third-barrier-theme",
    themeId: "reported-barriers",
    finding: "Distrust — of fund managers and of mutual funds generally — is a third, distinct barrier theme, reported by about 1 in 5.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Lack of trust in fund managers", findOpt(barriersOpts, "Lack of trust in fund managers")) },
        { text: fmtStat("Lack of trust in the mutual funds", findOpt(barriersOpts, "Lack of trust in the mutual funds")) },
      ],
      { chartId: "barriers-selection-pct", label: "Reasons for not investing" }
    ),
    interpretation: "Alongside perceived risk and knowledge gaps, a meaningful share separately cite not trusting fund managers or mutual funds as institutions — a different kind of concern from \"I don't understand this yet.\"",
    limitation: "This doesn't distinguish distrust of the specific product from general institutional or market distrust.",
    proposedInvestigation: "Ask what specifically drives the distrust (past scandals, lack of transparency, fee structures) to see whether it's addressable with information or is a deeper skepticism.",
  },

  // 3. Previous investment and stopping reasons -------------------------------------------
  {
    id: "not-a-first-time-investor-sample",
    themeId: "previous-investment",
    finding: "A quarter of the focused group has invested in mutual funds before — this is not a first-time-investor sample.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtGroupSize("past_mf_investor") },
        { text: fmtGroupSize("explicit_no_prior_investment") },
        { text: fmtGroupSize("past_investor_other_product_only") },
      ],
      { chartId: "previous-investment-shares", label: "Previous investment experience" }
    ),
    interpretation: "This group mixes people with real MF experience who stopped, and people who report none of these 7 specific securities products — not one uniform 'non-holder' group.",
    limitation: "\"None of the 7 listed products\" does not mean no financial experience at all — FDs, insurance, EPF, and gold aren't asked about here, so these respondents cannot be called \"never invested.\"",
    proposedInvestigation: "Ask directly about a fuller set of financial products (FDs, insurance, gold) to see whether the 382 have other financial experience.",
  },
  {
    id: "stopping-reasons-overlap-past-investors",
    themeId: "previous-investment",
    finding: "Most people who answered why they stopped investing are confirmed to be past mutual-fund investors.",
    // These three counts are a verified respondent-level computation (docs/analysis_pages_
    // report.md §2.4, scripts/compute_followup_checks.py) that predates this Findings
    // feature — they are not yet in public/data/findings/*.json, so unlike every other
    // supporting number in this file they can't be read live here. Flagged rather than
    // silently treated as equivalent; extending the export pipeline to add them is a
    // reasonable follow-up, not done in this pass.
    supportingNumbers: oneEvidence(
      [
        { text: "Past MF investment: 62 of 64 stopping-question answerers" },
        { text: "Other listed products, but no MF: 2 of 64" },
        { text: "None of the seven listed products: 0 of 64" },
      ],
      { chartId: "stopping-reasons-selection-pct", label: "Reasons for stopping investment" }
    ),
    interpretation: "The \"stopped investing\" group (64 people) and the \"past MF investor\" group (136 people) substantially overlap in this sample — they are not two disconnected populations.",
    limitation: "This is an observed overlap in this data, not a documented survey routing rule — the survey does not state that this question is gated on prior MF investment.",
    proposedInvestigation: "A short follow-up with this specific small group on what would bring them back would build directly on a now-confirmed, not merely assumed, population.",
  },
  {
    id: "stopping-reasons-market-not-product",
    themeId: "previous-investment",
    finding: "Among those who stopped, market conditions and returns are cited far more often than product complaints like fees or hidden costs.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("News of geopolitical uncertainty and fear of market fall", findOpt(stoppingOpts, "News of geopolitical uncertainty and fear of market fall")) },
        { text: fmtStat("Lower than expected returns", findOpt(stoppingOpts, "Lower than expected returns")) },
        { text: fmtStat("Hidden or unexpected transaction costs", findOpt(stoppingOpts, "Hidden or unexpected transaction costs")) },
      ],
      { chartId: "stopping-reasons-selection-pct", label: "Reasons for stopping investment" }
    ),
    interpretation: "Among this small group, external market conditions and disappointing returns are reported far more than complaints about the product itself (fees, hidden costs) — suggesting timing/expectations may matter more here than product design.",
    limitation: "Only 64 of 553 answered this question — these reasons may not represent everyone who has stopped investing.",
    proposedInvestigation: "A short follow-up with lapsed investors on what would bring them back would test whether return/market-conditions framing (not product fixes) is really the right lever.",
  },

  // 4. Risk preferences and reactions ------------------------------------------------------
  {
    id: "majority-lean-cautious",
    themeId: "risk-preferences",
    finding: "Most respondents lean cautious: over seventy percent prioritize capital preservation or stable returns over higher growth.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Preservation of capital is more important than returns", findOpt(riskPrefOpts, "Preservation of capital (amount invested) is more important to me than returns.")) },
        { text: fmtStat("Wants good but stable, reliable returns with minimal losses", findOpt(riskPrefOpts, "I need to have good but stable and reliable returns with minimal losses")) },
      ],
      { chartId: "risk-preference-distribution", label: "Risk/return preference" }
    ),
    interpretation: "This group leans cautious about risk/return tradeoffs — useful context alongside the fear-of-loss barrier finding.",
    limitation: "This is a self-described preference, not observed investing behavior.",
    proposedInvestigation: "Test whether presenting risk-mitigation features (e.g. diversification, systematic/staged investing) changes how respondents describe their own risk preference.",
  },
  {
    id: "downturn-reaction-split",
    themeId: "risk-preferences",
    finding: "Reactions to a hypothetical downturn are split — most say they'd hold or worry a little, but almost a quarter say they might stop investing.",
    supportingNumbers: oneEvidence(
      [
        {
          text: fmtStat(
            "Would keep money invested and wait for recovery",
            findOpt(downturnOpts, "I understand these things happen. I’ll keep my money invested and wait for the market to recover.")
          ),
        },
        {
          text: fmtStat(
            "Very worried, might stop investing and move to safer options (FDs)",
            findOpt(downturnOpts, "I would be very worried. I might stop investing in the market and move my money to safer options like fixed deposits.")
          ),
        },
      ],
      { chartId: "downturn-reaction-distribution", label: "Reaction to a market downturn" }
    ),
    interpretation: "This is a stated hypothetical reaction, suggesting a meaningful minority may be at risk of abandoning investing under stress, alongside a majority who say they'd hold steady.",
    limitation: "This is what people say they would do, not observed behavior during an actual downturn.",
    proposedInvestigation: "A behavioral study (e.g. reactions to a simulated portfolio dip) would test whether stated intentions match actual behavior.",
  },

  // 5. Reported uncertainty -----------------------------------------------------------------
  {
    id: "most-uncertain-topic-is-general-risk-concept",
    themeId: "reported-uncertainty",
    finding: "The topic with the most reported uncertainty is a general risk-diversification idea, not a mutual-fund-specific mechanic.",
    supportingNumbers: [
      {
        text: "Investments across different asset classes increase risk — Not Aware: 261 of 553 (47.2%)",
        evidence: { chartId: "knowledge-battery-distributions", label: "Financial-knowledge battery" },
      },
      {
        text: "KYC can be completed online — Not Aware: 45 of 553 (8.1%)",
        evidence: { chartId: "knowledge-battery-distributions", label: "Financial-knowledge battery" },
      },
    ],
    interpretation: "The single most-uncertain topic here is about risk across asset classes generally, not something narrowly MF-specific like KYC or demat accounts (both under 15% Not Aware).",
    limitation: "\"Not Aware\" is a selected response category, not a measured knowledge failure — there is no documented answer key scoring these right or wrong.",
    proposedInvestigation: "Test whether brief educational content on this specific topic (diversification and risk) measurably changes self-reported confidence.",
  },
  {
    id: "inflation-numeracy-gap",
    themeId: "reported-uncertainty",
    finding: "Fewer than half of respondents correctly worked out that a return below inflation is a real loss.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Less than today (correct)", findOpt(inflationOpts, "Less than today")) },
        { text: fmtStat("Do not know", findOpt(inflationOpts, "Do not know")) },
      ],
      { chartId: "q12m-inflation-numeracy", label: "Inflation numeracy check" }
    ),
    interpretation: "Unlike the 9-item battery, this is the one place a response can be scored correct — and fewer than half got it right, pointing to a real numeracy gap on this specific calculation.",
    limitation: "This is one single numeracy question — it does not establish broader financial literacy.",
    proposedInvestigation: "A short interview testing whether this specific misunderstanding (nominal vs. real returns) affects how people evaluate investment options.",
  },
  {
    id: "self-reported-familiarity-vs-demonstrated-uncertainty",
    themeId: "reported-uncertainty",
    finding: "Most respondents describe themselves as at least somewhat familiar with stock markets — in tension with the uncertainty shown on the knowledge battery and inflation check above.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Very familiar, follow regularly", findOpt(stockFamiliarityOpts, "I am very familiar with the stock markets. I follow them on a regular basis")) },
        { text: fmtStat("Familiar, update myself periodically", findOpt(stockFamiliarityOpts, "I am familiar with the stock markets and update myself periodically on its movements.")) },
      ],
      { chartId: "stock-market-familiarity", label: "Self-reported stock-market familiarity" }
    ),
    interpretation: "Self-rated familiarity is high, but sits alongside under-half correct on the one scoreable numeracy question and high \"Not Aware\" shares on several battery items — self-assessed and demonstrated understanding tell different stories here.",
    limitation: "Self-rated familiarity is one general question, not validated against any specific knowledge check — the two measures were not tested against each other at the respondent level.",
    proposedInvestigation: "Cross-tabulate self-rated familiarity against the inflation-numeracy answer at the respondent level to see whether confidence and correctness actually align.",
  },

  // 6. Group differences ---------------------------------------------------------------------
  {
    id: "education-gap-by-experience",
    themeId: "group-differences",
    finding: "People with no prior investment experience want more education, notably more than past mutual-fund investors.",
    supportingNumbers: [
      {
        text: fmtGroup(encouragementByExperience, "Better education on how mutual funds work", "explicit_no_prior_investment", "No prior investment in the 7 products"),
        evidence: { chartId: "group-differences-encouragement-by-experience", comparisonKey: "encouragement-by-experience", label: "Encouragement by previous MF experience" },
      },
      {
        text: fmtGroup(encouragementByExperience, "Better education on how mutual funds work", "past_mf_investor", "Past MF investor"),
        evidence: { chartId: "group-differences-encouragement-by-experience", comparisonKey: "encouragement-by-experience", label: "Encouragement by previous MF experience" },
      },
      {
        text: fmtPpDiff(encouragementByExperience, "Better education on how mutual funds work"),
        evidence: { chartId: "group-differences-encouragement-by-experience", comparisonKey: "encouragement-by-experience", label: "Encouragement by previous MF experience" },
      },
    ],
    interpretation: "Education content may matter more to people with no prior securities-market experience than to past investors.",
    limitation: "This does not show whether providing education would increase investment completion.",
    proposedInvestigation: "Ask people in both groups directly what specific information they'd need before deciding whether to invest.",
  },
  {
    id: "fear-of-loss-rises-with-income",
    themeId: "group-differences",
    finding: "Fear of losing money rises steadily with income tier — the one barrier with a clear step-by-step gradient.",
    supportingNumbers: [
      {
        text: fmtGroup(barriersByIncome, "Fear of losing money due to market risks", "Up to Rs.20,000", "Up to ₹20,000"),
        evidence: { chartId: "group-differences-barriers-by-income", comparisonKey: "barriers-by-income", label: "Barriers by income tier" },
      },
      {
        text: fmtGroup(barriersByIncome, "Fear of losing money due to market risks", "Rs.20,001-Rs.40,000", "₹20,001–₹40,000"),
        evidence: { chartId: "group-differences-barriers-by-income", comparisonKey: "barriers-by-income", label: "Barriers by income tier" },
      },
      {
        text: fmtGroup(barriersByIncome, "Fear of losing money due to market risks", "Above Rs.40,000", "Above ₹40,000"),
        evidence: { chartId: "group-differences-barriers-by-income", comparisonKey: "barriers-by-income", label: "Barriers by income tier" },
      },
    ],
    interpretation: "Among the barriers tested, this is the only one with a step-by-step gradient across income — higher earners report this concern more often.",
    limitation: "This is an observed pattern across 3 chosen income tiers in this sample, not a proven income effect — coverage is uneven (39–55%) across tiers, and no significance test was run.",
    proposedInvestigation: "Test loss-aversion-specific messaging for higher-income prospects and see whether concern framing changes.",
  },
  {
    id: "trust-in-fund-managers-by-experience",
    themeId: "group-differences",
    finding: "Distrust of fund managers is reported notably more by past MF investors than by people with no prior investment.",
    supportingNumbers: [
      {
        text: fmtGroup(barriersByExperience, "Lack of trust in fund managers", "past_mf_investor", "Past MF investor"),
        evidence: { chartId: "group-differences-barriers-by-experience", comparisonKey: "barriers-by-experience", label: "Barriers by previous MF experience" },
      },
      {
        text: fmtGroup(barriersByExperience, "Lack of trust in fund managers", "explicit_no_prior_investment", "No prior investment in the 7 products"),
        evidence: { chartId: "group-differences-barriers-by-experience", comparisonKey: "barriers-by-experience", label: "Barriers by previous MF experience" },
      },
      {
        text: fmtPpDiff(barriersByExperience, "Lack of trust in fund managers"),
        evidence: { chartId: "group-differences-barriers-by-experience", comparisonKey: "barriers-by-experience", label: "Barriers by previous MF experience" },
      },
    ],
    interpretation: "Having previously invested and stopped is associated with reporting more distrust of fund managers specifically, not just general market fear (which both groups report at similar rates).",
    limitation: "This is a descriptive gap in this sample, not a causal claim that the investing experience itself caused the distrust.",
    proposedInvestigation: "Ask lapsed investors directly what happened that shaped this view, rather than assuming it's about fund-manager conduct broadly.",
  },
  {
    id: "three-relationships-no-strong-pattern",
    themeId: "group-differences",
    finding: "Three specific respondent-level relationships were tested — risk preference vs. fear of loss, expense-ratio knowledge vs. wanting education, and online-KYC knowledge vs. wanting a simpler process — and none shows a strong or consistent pattern.",
    supportingNumbers: [
      {
        text: "Risk preference and fear of loss: reportable groups range from 28.0% to 35.4%, with no consistent rise or fall by risk aversion",
        evidence: { chartId: "group-differences-risk-fear-of-loss", comparisonKey: "risk-fear-of-loss", label: "Risk preference and fear of losing money" },
      },
      {
        text: fmtRelationshipGroup(relationships.knowledge_item1_education, "TRUE", "Knows direct plans have a lower expense ratio, wants education"),
        evidence: { chartId: "group-differences-knowledge-education", comparisonKey: "knowledge-education", label: "Fund-fee knowledge and demand for education" },
      },
      {
        text: fmtRelationshipGroup(relationships.knowledge_item1_education, "FALSE", "Does not know, wants education"),
        evidence: { chartId: "group-differences-knowledge-education", comparisonKey: "knowledge-education", label: "Fund-fee knowledge and demand for education" },
      },
      {
        text: fmtRelationshipGroup(relationships.kyc_simple_process, "TRUE", "Knows KYC can be done online, wants a simpler process"),
        evidence: { chartId: "group-differences-kyc-simple-process", comparisonKey: "kyc-simple-process", label: "Online-KYC knowledge and a simpler process" },
      },
      {
        text: fmtRelationshipGroup(relationships.kyc_simple_process, "FALSE", "Does not know, wants a simpler process"),
        evidence: { chartId: "group-differences-kyc-simple-process", comparisonKey: "kyc-simple-process", label: "Online-KYC knowledge and a simpler process" },
      },
    ],
    interpretation: "These three specific, pre-chosen hypotheses (risk preference vs. fear of loss, one knowledge item vs. wanting education, KYC awareness vs. wanting simplicity) were each tested directly — none produced a gap large or consistent enough to call a real pattern.",
    limitation: "A weak or inconsistent result does not prove no relationship exists — it means this sample didn't show a clear one for these three specific pairings. Only these three were tested, not a general claim about knowledge or risk preference.",
    proposedInvestigation: "If any of these three is still worth pursuing, test it directly (e.g. show simplified KYC messaging to one group) rather than inferring from this descriptive association.",
  },

  // 7. Awareness sources and media -----------------------------------------------------------
  {
    id: "informal-channels-lead-awareness",
    themeId: "awareness-media",
    finding: "Friends, family, and social-media influencers are the two leading awareness sources — formal/professional channels lag far behind.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Friends, Family, and Colleagues", findOpt(awarenessSourceOpts, "Friends, Family, and Colleagues")) },
        {
          text: fmtStat(
            "Financial influencers on social media",
            findOpt(awarenessSourceOpts, "Financial Influencers on social media (YouTube, Instagram, Facebook, LinkedIn, Twitter)")
          ),
        },
        {
          text: fmtStat(
            "Financial professionals (advisors/planners, bank reps)",
            findOpt(awarenessSourceOpts, "Financial Professionals - Financial advisors/planners, bank representatives")
          ),
        },
      ],
      { chartId: "awareness-sources-media", label: "Awareness sources and media" }
    ),
    interpretation: "Informal, social channels reach this group far more than professional or institutional ones — relevant to where educational content might be placed.",
    limitation: "This shows exposure, not what caused anyone to invest — someone can be aware via a channel without it influencing their decision.",
    proposedInvestigation: "If planning content placement, test whether content distributed via these top channels actually reaches and is acted on by this audience.",
  },
  {
    id: "social-media-and-tv-lead-media",
    themeId: "awareness-media",
    finding: "Among media (as opposed to sources), social media and television lead by a wide margin — print and radio lag far behind.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Social media (YouTube, Instagram reels, X posts)", findOpt(awarenessMediaOpts, "Social media (YouTube videos, Instagram reels, Twitter/X posts)")) },
        { text: fmtStat("Television", findOpt(awarenessMediaOpts, "Television")) },
      ],
      { chartId: "awareness-sources-media", label: "Awareness sources and media" }
    ),
    interpretation: "This is a separate question from \"sources\" above (who/what told them) — for the medium itself, social platforms and TV dominate over print, radio, or regulator websites.",
    limitation: "Reflects reported exposure to a medium, not that content on it was noticed, understood, or acted on.",
    proposedInvestigation: "If producing content, test the same message on social media vs. TV to see whether reach on the top medium translates to actual engagement.",
  },

  // 8. Encouragement factors -----------------------------------------------------------------
  {
    id: "simpler-process-top-encouragement",
    themeId: "encouragement-factors",
    finding: "A simpler process is the single most-selected encouragement factor — ahead of reducing the minimum investment or better education.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Simple and easy process for investing (e.g. account opening, documentation, etc.)", findOpt(encouragementOpts, "Simple and easy process for investing (e.g. account opening, documentation, etc.)")) },
        { text: fmtStat("Reducing the minimum investment requirement", findOpt(encouragementOpts, "Reducing the minimum investment requirement")) },
      ],
      { chartId: "encouragement-selection-pct", label: "Encouragement factors" }
    ),
    interpretation: "Process friction is reported as the most common thing that would help, more so than cost-related factors.",
    limitation: "This is a stated preference, not a validated fix — whether simplifying the process would actually increase completion is untested.",
    proposedInvestigation: "A moderated usability study on an actual onboarding flow would test whether perceived complexity is really the friction point.",
  },

  // 9. Learning preferences ------------------------------------------------------------------
  {
    id: "video-format-preferred",
    themeId: "learning-preferences",
    finding: "Video is the clearly preferred format for investor-education content, well ahead of any other format.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Videos", findOpt(formatOpts, "Videos")) },
        { text: fmtStat("Social media post", findOpt(formatOpts, "Social media post")) },
      ],
      { chartId: "learning-format", label: "Preferred format for investor education" }
    ),
    interpretation: "If building education content, video format has the broadest stated appeal in this group.",
    limitation: "This is a stated preference, not evidence that video content is actually watched or effective.",
    proposedInvestigation: "Test engagement or completion rates for a short video against a written article covering the same topic.",
  },
  {
    id: "little-prior-education-exposure",
    themeId: "learning-preferences",
    finding: "Very few respondents have attended any investor-education program before.",
    supportingNumbers: oneEvidence(
      [{ text: fmtStat("Have not attended any investor education program", findOpt(attendanceOpts, "Have not attended any investor education program")) }],
      { chartId: "education-attendance", label: "Investor-education attendance" }
    ),
    interpretation: "This group has very little existing exposure to formal investor education — content would likely be reaching most of them for the first time.",
    limitation: "This does not tell us whether they would choose to attend if content were offered in their preferred format.",
    proposedInvestigation: "Pilot a short, opt-in educational module in the top-preferred format (video) and measure voluntary uptake.",
  },
  {
    id: "practical-protection-topics-most-wanted",
    themeId: "learning-preferences",
    finding: "The most-wanted education topics are practical protection (spotting fraud, knowing investor rights) — not product mechanics.",
    supportingNumbers: oneEvidence(
      [
        {
          text: fmtStat(
            "How to identify financial frauds & scams",
            findOpt(topicsOpts, "How to Identify Financial Frauds & Scams (protecting against Ponzi schemes, phishing, and fraud)")
          ),
        },
        {
          text: fmtStat(
            "Investor rights & SEBI regulations",
            findOpt(topicsOpts, "Investor Rights & SEBI Regulations (understanding legal protections and grievance redressal mechanisms)")
          ),
        },
      ],
      { chartId: "learning-topics", label: "Preferred investor-education topics" }
    ),
    interpretation: "The top two requested topics are about protection and rights, ahead of topics like fund mechanics or fact sheets — suggesting content should lead with safety and legal protection, not product features.",
    limitation: "This is a stated preference among listed topic options, not evidence that this content would be watched or would change behavior.",
    proposedInvestigation: "Test a short fraud-awareness or rights-focused module first, and measure voluntary completion against a product-mechanics module.",
  },
  {
    id: "language-long-tail",
    themeId: "learning-preferences",
    finding: "Hindi leads as a preferred language, but no single language dominates — over a third want something other than Hindi or English.",
    supportingNumbers: oneEvidence(
      [
        { text: fmtStat("Hindi", findOpt(languageOpts, "Hindi")) },
        { text: fmtStat("English", findOpt(languageOpts, "English")) },
      ],
      { chartId: "learning-language", label: "Preferred language for investor education" }
    ),
    interpretation: "Hindi and English together account for under 60% of stated preference — the remaining 40%-plus is spread across many regional languages, none individually large, pointing to a real localization need rather than a two-language solution.",
    limitation: "This is a single-select stated preference, not evidence that content in a given language would be used or effective.",
    proposedInvestigation: "Before localizing into many languages, test whether content in a respondent's stated preferred language actually gets more engagement than the same content in English or Hindi.",
  },
]

export function findingsForTheme(themeId: string): Finding[] {
  return FINDINGS.filter((f) => f.themeId === themeId)
}

// ---------------------------------------------------------------------------
// Reported problems — a plain-language "problems, not preferences" summary for the
// Deliverables page's "Analysis and visual representations" section
// (src/components/deliverables/reported-problems-sheet.tsx). A different framing of the
// same barrier/stopping-reason/encouragement/knowledge-battery data above, so every number
// here reads through the same verified option lookups as the Findings above it, rather than
// being retyped as a literal string.
// ---------------------------------------------------------------------------

export interface ReportedProblemStat {
  n: number
  denominator: number
  pct: number
}

const diversificationBatteryRow = buildBatteryRows(whoIsInSampleBase.knowledge_grid.items).find(
  (r) => r.topic === "diversification"
)
if (!diversificationBatteryRow) throw new Error("findings-register: diversification battery row not found")

/** Every number used in reported-problems-sheet.tsx, named for where each is used there. */
export const REPORTED_PROBLEMS_STATS = {
  fearOfLoss: findOpt(barriersOpts, "Fear of losing money due to market risks"),
  lackOfKnowledge: findOpt(barriersOpts, "Lack of knowledge about how mutual funds work"),
  dontKnowHowToStart: findOpt(barriersOpts, "I don't know how to start investing in Mutual funds"),
  infoOverload: findOpt(barriersOpts, "Confusion cause by information overload from different sources"),
  tooManyOptions: findOpt(barriersOpts, "There are too many options"),
  distrustFundManagers: findOpt(barriersOpts, "Lack of trust in fund managers"),
  distrustMutualFunds: findOpt(barriersOpts, "Lack of trust in the mutual funds"),
  longTermPerception: findOpt(barriersOpts, "It’s for long term investment"),
  uncertainReturns: findOpt(barriersOpts, "Uncertainty about returns and performance"),
  largeStartingAmount: findOpt(barriersOpts, "Requires large amount to start investing"),
  notEnoughMoney: findOpt(barriersOpts, "I don't have enough money to invest"),
  lowerThanExpectedReturns: findOpt(stoppingOpts, "Lower than expected returns"),
  urgentNeedForMoney: findOpt(stoppingOpts, "I needed money for other purposes (urgent requirement of funds)"),
  changingFinancialGoals: findOpt(stoppingOpts, "Changes in personal financial goals"),
  diversificationNotAware: {
    n: diversificationBatteryRow.NOT_AWARE_n,
    denominator: diversificationBatteryRow.answered,
    pct: diversificationBatteryRow.NOT_AWARE_pct,
  },
  inflationCorrect: findOpt(inflationOpts, "Less than today"),
  simplerProcessEncouragement: findOpt(
    encouragementOpts,
    "Simple and easy process for investing (e.g. account opening, documentation, etc.)"
  ),
  lowerMinimumEncouragement: findOpt(encouragementOpts, "Reducing the minimum investment requirement"),
  educationNoPriorInvestment: groupStat(
    encouragementByExperience,
    "Better education on how mutual funds work",
    "explicit_no_prior_investment"
  ),
  educationPastMfInvestor: groupStat(
    encouragementByExperience,
    "Better education on how mutual funds work",
    "past_mf_investor"
  ),
} satisfies Record<string, ReportedProblemStat>
