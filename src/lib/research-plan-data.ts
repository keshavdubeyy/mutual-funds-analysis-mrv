/**
 * Content for the "Research Objectives and Key Measures" page.
 *
 * Authored plan/documentation content, not a data export — consolidates definitions from
 * docs/research_and_measurement_plan.md, docs/analysis_coverage_checklist.md,
 * docs/research_synthesis.md, docs/barrier_coverage.md, docs/segment_findings.md,
 * docs/survey_schema_reference.md, and analysis/05_supplementary_measures.ipynb. Numbers
 * here are restated from those sources or from the JSON exports in public/data/findings —
 * nothing is computed inline. Worked examples use real, already-verified values only.
 *
 * This project is defined around what the SEBI survey data supports. Company-side data
 * (INDmoney's own activity/conversion records) is out of scope by design, not a pending
 * task — see LIMITATIONS below, not a separate "future KPIs" section.
 */

export type MeasureStatus = "calculated" | "needs_clarification"

export interface MeasureResult {
  /** One plain sentence stating the result, e.g. "Fear of losing money: 81 of 266 (30.5%)." */
  summary: string
  count?: number
  denominatorLabel?: string
  /** True when the real result is many answers (a chart/table), not one headline number. */
  isMultiAnswer?: boolean
}

export interface FieldWording {
  code: string
  wording: string
}

export interface MeasureDetails {
  fields: string[]
  /** Original question wording per field code, for the sheet's expandable "source details." */
  fieldWordings: FieldWording[]
  /** Simple numbered steps, plain language, no formulas or field codes. */
  calculationSteps?: string[]
  /** A verified, concrete walkthrough using real values — never a fabricated example. */
  workedExample?: string
  eligibleGroup: string
  productScope: string
  missingHandling: string
  selectionRules?: string
  limitations: string
}

export interface Measure {
  id: string
  /** Short, plain name — the table's "Key research measure" column. */
  name: string
  /** One sentence, phrased as a question — used for search and as light framing. */
  question: string
  /** One sentence, phrased as a statement — the sheet's "one-sentence definition." */
  definition: string
  /** One sentence — the table's "Why it matters" column. */
  whyItMatters: string
  status: MeasureStatus
  result?: MeasureResult
  /** One sentence — the table's "What it tells us" column. */
  meaning: string
  /** Exact one-sentence reason, only set for "needs_clarification" (shown as "Why unavailable"). */
  unresolvedReason?: string
  /** A working deep link — only set where the target page/anchor genuinely exists and scrolls correctly. */
  analysisHref?: string
  /** Plain-text pointer to where this is shown, used when a reliable anchor isn't available (e.g. a tab that isn't URL-addressable). */
  analysisLocation?: string
  details: MeasureDetails
}

export interface KeyResearchIndicator {
  id: string
  name: string
  /** What we want to understand from this indicator — one sentence. */
  description: string
  measureIds: string[]
}

// ---------------------------------------------------------------------------
// What we want to understand
// ---------------------------------------------------------------------------

export const RESEARCH_QUESTION =
  "What motivations, barriers and encouragement factors do salaried Gen Z respondents report when they consider mutual funds but do not currently hold them?"

export const ORIGINAL_BUSINESS_QUESTION =
  "Why might young salaried users consider a first mutual-fund SIP but not complete it on INDmoney?"

export const FUTURE_BUSINESS_GOAL =
  "Help INDmoney identify and test changes that support informed first-SIP completion and continued payments."

export interface Objective {
  n: number
  title: string
  description: string
}

export const OBJECTIVES: Objective[] = [
  { n: 1, title: "Understand the barriers", description: "What concerns, motivations and encouragement factors do respondents report?" },
  { n: 2, title: "Understand differences", description: "Do answers differ by income, previous experience, or related characteristics?" },
  { n: 3, title: "Identify what to investigate", description: "Which explanations and future company changes need testing?" },
]

// ---------------------------------------------------------------------------
// Key research indicators (table row groups)
// ---------------------------------------------------------------------------

export const KEY_RESEARCH_INDICATORS: KeyResearchIndicator[] = [
  {
    id: "motivation-percentages",
    name: "Motivation percentages",
    description: "Why respondents consider investing.",
    measureIds: ["motivations-selection-pct"],
  },
  {
    id: "barrier-percentages",
    name: "Barrier percentages",
    description: "Which concerns they report.",
    measureIds: ["barriers-selection-pct"],
  },
  {
    id: "encouragement-percentages",
    name: "Encouragement percentages",
    description: "What they say could help.",
    measureIds: ["encouragement-selection-pct"],
  },
  {
    id: "previous-investment-stopping",
    name: "Previous investment and stopping reasons",
    description: "How experience differs within the group.",
    measureIds: ["previous-investment-shares", "stopping-reasons-selection-pct", "a15-d15-lapser-detail"],
  },
  {
    id: "risk-preference-distributions",
    name: "Risk-preference distributions",
    description: "How respondents describe their preferences and reactions.",
    measureIds: ["risk-preference-distribution", "downturn-reaction-distribution"],
  },
  {
    id: "not-aware-percentages",
    name: "“Not Aware” percentages",
    description: "Which knowledge statements attract more reported uncertainty.",
    measureIds: ["knowledge-battery-distributions"],
  },
  {
    id: "differences-between-groups",
    name: "Differences between groups",
    description: "How responses vary by income, experience and other supported characteristics.",
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
  {
    id: "learning-preferences",
    name: "Learning preferences",
    description: "Which education topics, formats and channels respondents prefer.",
    measureIds: ["learning-preference-fields"],
  },
]

/** Sample-context measures: not one of the primary research indicators above, but still
 * calculated and useful for reading the indicators in context (e.g. income as a grouping
 * variable). Income and the validated income-allocation measure are the clearest examples. */
export const CONTEXT_MEASURE_IDS = [
  "personal-income-distribution",
  "income-allocation-corrected",
  "financial-goal-ranking",
  "awareness-sources-media",
  "education-attendance",
  "stock-market-familiarity",
  "q12m-inflation-numeracy",
  "broader-group-mf-holding-share",
]

export const HOW_TO_READ_RESULTS =
  "Every result below shows how many people answered and out of how many — never a full 553 unless everyone answered that specific question. A similar answer rate across two groups is a necessary check before comparing them, but it does not by itself rule out selection bias."

// ---------------------------------------------------------------------------
// Measures — the complete register. Every measure from the prior pass is kept;
// none are omitted, and no calculation has changed.
// ---------------------------------------------------------------------------

export const MEASURES: Measure[] = [
  {
    id: "motivations-selection-pct",
    name: "Reasons for considering investing",
    question: "What reasons do respondents give for considering mutual funds?",
    definition: "The share of respondents who selected each reason for considering investing in MF/ETF, out of everyone who answered this question.",
    whyItMatters: "Shows which reasons are already top-of-mind, so messaging can reinforce them rather than guess.",
    status: "calculated",
    result: { summary: "See chart — 19 reasons, ranked by how often selected.", isMultiAnswer: true, denominatorLabel: "240 of 553 answered" },
    meaning: "Shows which reasons this group reports most often for considering MF/ETF.",
    analysisHref: "/understanding-the-user/motivations-financial-goals#motivations-selection-pct",
    analysisLocation: "Understanding the user → Motivations and financial goals → “Reasons for considering investing.”",
    details: {
      fields: ["AA1_DD1"],
      fieldWordings: [{ code: "AA1_DD1", wording: "Top 3 Primary reasons for considering investing in MF/ETFs" }],
      calculationSteps: [
        "Start with the 553 people in the focused group.",
        "Keep only the 240 who gave a substantive answer to this question.",
        "For each reason, count how many of those 240 selected it (respondents could pick up to 3).",
        "Divide that count by 240 and multiply by 100 for a percentage.",
      ],
      workedExample: "The top reason, “Long-term growth (building wealth over time),” was selected by 62 of the 240 answerers: 62 ÷ 240 × 100 = 25.8%.",
      eligibleGroup: "Focused group, substantive answerers only.",
      productScope: "MF+ETF combined — not mutual funds in isolation.",
      missingHandling: "313 blank = missing/unknown, never “no reason.”",
      selectionRules: "Multi-select, up to 3 per respondent; percentages sum to roughly 300%.",
      limitations: "Who exactly was meant to answer this is a reasonable inference, not confirmed against a published table.",
    },
  },
  {
    id: "barriers-selection-pct",
    name: "Reasons for not investing",
    question: "What reasons do respondents give for not investing today?",
    definition: "The share of respondents who selected each reason for not currently investing in MF/ETF, out of everyone who answered this question.",
    whyItMatters: "Identifies which concerns are most common, so risk communication or onboarding content can address the right ones first.",
    status: "calculated",
    result: { summary: "Fear of losing money due to market risks: 81 of 266 (30.5%), the single most-cited reason.", count: 81, denominatorLabel: "266" },
    meaning: "Shows which barriers this group reports most often.",
    analysisHref: "/understanding-the-barriers/reported-barriers#barriers-selection-pct",
    analysisLocation: "Understanding the barriers → Reported barriers → “Reasons for not investing.”",
    details: {
      fields: ["AA2_DD2"],
      fieldWordings: [{ code: "AA2_DD2", wording: "Top 3 Reasons for not investing in MF/ETF" }],
      calculationSteps: [
        "Start with the 553 people in the focused group.",
        "Keep only the 266 who gave a substantive answer to this question.",
        "For each reason, count how many of those 266 selected it (respondents could pick up to 3).",
        "Divide that count by 266 and multiply by 100 for a percentage.",
      ],
      workedExample: "The top barrier, “Fear of losing money due to market risks,” was selected by 81 of the 266 answerers: 81 ÷ 266 × 100 = 30.5%.",
      eligibleGroup: "Focused group, substantive answerers only — the same population SEBI calls Non-Investors.",
      productScope: "MF+ETF combined — not mutual funds in isolation.",
      missingHandling: "287 blank = missing/unknown. A documented survey rule (“each respondent asked on 2 products”) explains the overall response rate.",
      selectionRules: "Multi-select, exactly 3 per respondent when answered; percentages sum to roughly 300%.",
      limitations: "Similar response rates across groups don't rule out selection bias — it only means the non-response rate is similar, not that who answered is representative.",
    },
  },
  {
    id: "encouragement-selection-pct",
    name: "Encouragement factors",
    question: "What would encourage respondents to invest?",
    definition: "The share of respondents who selected each encouragement factor, out of everyone who answered this question.",
    whyItMatters: "Points to what respondents themselves say would help, as a starting point for product or content ideas.",
    status: "calculated",
    result: { summary: "“Simple and easy process for investing”: 117 of 266 (44.0%), the top-ranked factor.", count: 117, denominatorLabel: "266" },
    meaning: "Shows which encouragement themes this group reports most often.",
    analysisHref: "/reaching-and-engaging/encouragement-factors#encouragement-selection-pct",
    analysisLocation: "Reaching and engaging → Encouragement factors.",
    details: {
      fields: ["AA3_DD3"],
      fieldWordings: [{ code: "AA3_DD3", wording: "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in" }],
      calculationSteps: [
        "Start with the 553 people in the focused group.",
        "Keep only the 266 who gave a substantive answer to this question — the identical answer base as the barriers question.",
        "For each factor, count how many of those 266 selected it (respondents could pick up to 3).",
        "Divide that count by 266 and multiply by 100 for a percentage.",
      ],
      workedExample: "The top factor, “Simple and easy process for investing,” was selected by 117 of the 266 answerers: 117 ÷ 266 × 100 = 44.0%.",
      eligibleGroup: "Focused group, substantive answerers only.",
      productScope: "MF+ETF combined — not mutual funds in isolation.",
      missingHandling: "287 blank = missing/unknown, same routing rule as the barriers question.",
      selectionRules: "Multi-select, up to 3 per respondent; percentages sum to roughly 300%.",
      limitations: "Stated preference only — doesn't show whether building it would change completion.",
    },
  },
  {
    id: "previous-investment-shares",
    name: "Previous investment experience",
    question: "Who in the focused group has invested before?",
    definition: "The share of the focused group falling into each of 3 previous-investment categories.",
    whyItMatters: "Shows the group is not a single homogeneous “never invested” audience — messaging may need to differ by experience.",
    status: "calculated",
    result: { summary: "136 of 553 (24.6%) are past mutual-fund investors — this is not a “first-time SIP users” sample.", count: 136, denominatorLabel: "553" },
    meaning: "The focused group mixes three different investment histories; not a single undifferentiated “non-holder” group.",
    analysisHref: "/understanding-the-user/previous-investment#previous-investment-shares",
    analysisLocation: "Understanding the user → Previous investment and stopping reasons.",
    details: {
      fields: ["Q24A"],
      fieldWordings: [{ code: "Q24A", wording: "Could you please tell me if you have ever invested in these products in the past" }],
      calculationSteps: [
        "Start with the full 553-person focused group.",
        "Sort each respondent into one of 3 categories: previously invested in mutual funds, no prior investment in any of the 7 listed securities products, or invested in another product but not mutual funds.",
        "Divide each category's count by 553 and multiply by 100.",
      ],
      workedExample: "136 of 553 report previous mutual-fund investment: 136 ÷ 553 × 100 = 24.6%.",
      eligibleGroup: "Full focused group, all 553 answered.",
      productScope: "Q24A's own 7-item securities-market product list — not the fuller product list used elsewhere.",
      missingHandling: "0 blank.",
      limitations: "“None of the above” means none of these 7 securities-market products — not “no prior investment in anything” (FDs, insurance, EPF, gold aren't asked about here).",
    },
  },
  {
    id: "stopping-reasons-selection-pct",
    name: "Reasons for stopping investment",
    question: "Why did respondents stop investing in MF/ETF?",
    definition: "The share of a small group of respondents who selected each reason for stopping investment, out of everyone who answered this question.",
    whyItMatters: "Surfaces candidate reasons people lapse, while being upfront that the answer base is small and its population uncertain.",
    status: "calculated",
    result: { summary: "See chart — a small group of 64 respondents, 16 reasons.", isMultiAnswer: true, denominatorLabel: "64 of 553 answered" },
    meaning: "The 64 counts themselves are verified; it's who exactly was asked this question that's uncertain, not the counts.",
    analysisHref: "/understanding-the-user/previous-investment#stopping-reasons-selection-pct",
    analysisLocation: "Understanding the user → Previous investment and stopping reasons → “Reasons for stopping investment.”",
    details: {
      fields: ["AA4_DD4"],
      fieldWordings: [{ code: "AA4_DD4", wording: "What were the Top 3 reasons you stopped investing in MF/ETF" }],
      calculationSteps: [
        "Start with the 553 people in the focused group.",
        "Keep only the 64 who gave a substantive answer to this question.",
        "For each reason, count how many of those 64 selected it (respondents could pick up to 3).",
        "Divide that count by 64 and multiply by 100 for a percentage.",
      ],
      workedExample: "The joint top reasons, “News of geopolitical uncertainty and fear of market fall” and “Lower than expected returns,” were each selected by 22 of the 64 answerers: 22 ÷ 64 × 100 = 34.4%.",
      eligibleGroup: "Focused group, substantive answerers only.",
      productScope: "MF+ETF combined.",
      missingHandling: "489 blank = missing/unknown, cause unresolved.",
      selectionRules: "Multi-select, up to 3 per respondent; percentages sum to roughly 300%.",
      limitations: "Read as its own small answer base of 64 — not confirmed to be a subset of the 136 past MF investors. A related, more strictly-defined question (A15_D15) has only 1 answer across all 553, so routing to this question doesn't track prior-investment status in any simple way.",
    },
  },
  {
    id: "a15-d15-lapser-detail",
    name: "Further detail on why investors stopped",
    question: "Is there more specific detail on why investors lapsed?",
    definition: "A more narrowly defined follow-up question on reasons for not investing, intended for respondents who lapsed in roughly the last year.",
    whyItMatters: "Would give more specific detail on lapsing, if it turns out to be usable.",
    status: "needs_clarification",
    unresolvedReason: "Only 1 of 553 respondents answered this related, already-available field, so who it was meant for — and whether it can be used at all — is unclear.",
    meaning: "Not usable as a measure until that's resolved.",
    details: {
      fields: ["A15_D15"],
      fieldWordings: [{ code: "A15_D15", wording: "You have not invested in MF/ETF in the last 1 year. Top 3 Reasons are for not investing" }],
      eligibleGroup: "Unclear.",
      productScope: "MF+ETF combined.",
      missingHandling: "552 of 553 blank.",
      limitations: "Excluded from substantive interpretation anywhere on this dashboard.",
    },
  },
  {
    id: "risk-preference-distribution",
    name: "Risk / return preference",
    question: "What risk/return preference does the focused group report?",
    definition: "The share of the focused group selecting each risk/return preference option.",
    whyItMatters: "Gives context on how cautious or growth-oriented this group says it is, useful alongside the fear-of-loss barrier finding.",
    status: "calculated",
    result: { summary: "38.2% say “preservation of capital is more important to me than returns.”", count: 211, denominatorLabel: "553" },
    meaning: "Context on how this sample describes its own risk appetite.",
    analysisHref: "/understanding-the-user/risk-preferences#risk-preference-distribution",
    analysisLocation: "Understanding the user → Risk preferences and reactions — also on the “Who is in our sample?” page.",
    details: {
      fields: ["QRT"],
      fieldWordings: [{ code: "QRT", wording: "Which of the following best describes your preference when considering returns from investments?" }],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered this question.",
        "For each risk-preference option, count how many chose it.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "211 of 553 chose “Preservation of capital is more important to me than returns”: 211 ÷ 553 × 100 = 38.2%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific — a general risk/return self-description.",
      missingHandling: "No blanks observed.",
      limitations: "Self-described preference, not observed investing behavior.",
    },
  },
  {
    id: "downturn-reaction-distribution",
    name: "Reaction to a market downturn",
    question: "How does the focused group say it would react to a downturn?",
    definition: "The share of the focused group selecting each hypothetical downturn-reaction option.",
    whyItMatters: "Shows how this group says it would react under stress, as context for the fear-of-loss barrier finding.",
    status: "calculated",
    result: { summary: "36.2% say they'd stay invested and wait for recovery; 22.8% say they'd be very worried and might stop investing.", denominatorLabel: "553" },
    meaning: "Context on self-reported downturn sensitivity, alongside the fear-of-loss barrier finding.",
    analysisHref: "/understanding-the-user/risk-preferences#downturn-reaction-distribution",
    analysisLocation: "Understanding the user → Risk preferences and reactions — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q10M"],
      fieldWordings: [{ code: "Q10M", wording: "Reaction to Market Downturn" }],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered this question.",
        "For each reaction option, count how many chose it.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "200 of 553 chose “I understand these things happen. I'll keep my money invested and wait for the market to recover”: 200 ÷ 553 × 100 = 36.2%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific — a general hypothetical reaction.",
      missingHandling: "No blanks observed.",
      limitations: "A stated hypothetical reaction, not observed behavior during an actual downturn.",
    },
  },
  {
    id: "knowledge-battery-distributions",
    name: "Financial-knowledge battery",
    question: "Which financial topics carry the most reported uncertainty?",
    definition: "The share of the focused group selecting “Not Aware” for each of 9 financial-knowledge statements.",
    whyItMatters: "Flags which topics carry the most reported uncertainty — candidates for investor-education content.",
    status: "calculated",
    result: { summary: "See chart — 9 statements, ranked by share selecting “Not Aware.”", isMultiAnswer: true, denominatorLabel: "553 per item" },
    meaning: "Ranks topics by reported uncertainty — never confidence, accuracy, or a literacy score.",
    analysisHref: "/understanding-the-barriers/reported-uncertainty#knowledge-battery-distributions",
    analysisLocation: "Understanding the barriers → Reported uncertainty.",
    details: {
      fields: Array.from({ length: 9 }, (_, i) => `GRIDxQ15AM[{_${i + 1}}].Q15AM`),
      fieldWordings: [
        { code: "GRIDxQ15AM[{_1}].Q15AM", wording: "Direct plans in mutual funds have a lower expense ratio than regular plans" },
        { code: "GRIDxQ15AM[{_2}].Q15AM", wording: "A portion of investments in pension/provident funds is invested in the stock market" },
        { code: "GRIDxQ15AM[{_3}].Q15AM", wording: "The concept of compounding is beneficial in the short term" },
        { code: "GRIDxQ15AM[{_4}].Q15AM", wording: "KYC can be completed online" },
        { code: "GRIDxQ15AM[{_5}].Q15AM", wording: "Need to open a Demat account to invest in securities in addition to trading account" },
        { code: "GRIDxQ15AM[{_6}].Q15AM", wording: "Investment options that offer high returns are also associated with high-risk" },
        { code: "GRIDxQ15AM[{_7}].Q15AM", wording: "Investments across different asset classes increase risk" },
        { code: "GRIDxQ15AM[{_8}].Q15AM", wording: "CAS (Consolidated Account statement) provides overview of investments in Securities/stock market — Equity, Mutual Funds, Bonds, Government Securities, NPS, NIR, etc. held in demat and folio form" },
        { code: "GRIDxQ15AM[{_9}].Q15AM", wording: "BSDA (Basic service demat account) allows you to have a demat account with nil or negligible charges when your investment holdings are below a certain amount" },
      ],
      calculationSteps: [
        "Keep all 553 respondents for each of the 9 statements — everyone answered every item.",
        "For a given statement, count how many selected “Not Aware.”",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "The statement with the most reported uncertainty, “Investments across different asset classes increase risk,” had 261 of 553 select “Not Aware”: 261 ÷ 553 × 100 = 47.2%.",
      eligibleGroup: "Full focused group.",
      productScope: "General financial-knowledge statements — not product-specific.",
      missingHandling: "“Not Aware” is an explicit selected response, kept as its own category. No documented answer key exists for this battery, so no item is scored correct/incorrect.",
      limitations: "Cannot establish overall financial literacy or why any respondent hasn't invested. Distinct from Q12M (see context measures), which has one arithmetically correct answer.",
    },
  },
  {
    id: "barriers-by-experience-comparison",
    name: "Barriers by previous experience",
    question: "Do reported barriers differ by previous investing experience?",
    definition: "A comparison of barrier-selection percentages across the three previous-investment groups.",
    whyItMatters: "Tests whether one barrier message fits everyone, or whether experience-based segments need different messaging.",
    status: "calculated",
    result: {
      summary: "“Lack of trust in fund managers” ranks top among past MF investors but mid-ranked among those with no prior investment.",
      isMultiAnswer: true,
      denominatorLabel: "61 / 188 / 17 (counts only)",
    },
    meaning: "Suggests barrier messaging could be segmented by prior experience rather than treated as one group.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-barriers-by-experience",
    analysisLocation: "Understanding the barriers → Differences between groups → “Barriers by previous MF experience.”",
    details: {
      fields: ["AA2_DD2", "Q24A"],
      fieldWordings: [
        { code: "AA2_DD2", wording: "Top 3 Reasons for not investing in MF/ETF" },
        { code: "Q24A", wording: "Could you please tell me if you have ever invested in these products in the past" },
      ],
      calculationSteps: [
        "Split the focused group into 3 experience groups based on Q24A.",
        "Within each group, keep only those who substantively answered the barriers question.",
        "For a given barrier, divide its count within a group by that group's own answerer count and multiply by 100.",
      ],
      workedExample: "“Lack of trust in fund managers”: 19 of 61 past MF investors (19 ÷ 61 × 100 = 31.1%) vs. 39 of 188 with no prior investment (39 ÷ 188 × 100 = 20.7%).",
      eligibleGroup: "Focused group, split by previous-investment class.",
      productScope: "MF+ETF combined.",
      missingHandling: "Response rates checked before comparing (44.9–49.2% for the two reportable groups).",
      limitations: "No significance test; similar response rates are a precondition, not proof either group is representative.",
    },
  },
  {
    id: "encouragement-by-experience-comparison",
    name: "Encouragement by previous experience",
    question: "Do encouragement factors differ by previous investing experience?",
    definition: "A comparison of encouragement-selection percentages across the three previous-investment groups.",
    whyItMatters: "Shows where encouragement content might need to differ by prior experience.",
    status: "calculated",
    result: {
      summary: "“Better education on how mutual funds work” shows the largest gap: 40.4% (no prior investment) vs. 24.6% (past MF investors).",
      isMultiAnswer: true,
      denominatorLabel: "188 / 61",
    },
    meaning: "Education content may matter more to respondents with no prior securities-market investment.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-encouragement-by-experience",
    analysisLocation: "Understanding the barriers → Differences between groups → “Encouragement by previous MF experience.”",
    details: {
      fields: ["AA3_DD3", "Q24A"],
      fieldWordings: [
        { code: "AA3_DD3", wording: "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in" },
        { code: "Q24A", wording: "Could you please tell me if you have ever invested in these products in the past" },
      ],
      calculationSteps: [
        "Split the focused group into the same 3 experience groups used for the barriers comparison.",
        "Within each group, keep only those who substantively answered the encouragement question.",
        "For a given factor, divide its count within a group by that group's own answerer count and multiply by 100.",
      ],
      workedExample: "“Better education on how mutual funds work”: 76 of 188 with no prior investment (76 ÷ 188 × 100 = 40.4%) vs. 15 of 61 past MF investors (15 ÷ 61 × 100 = 24.6%).",
      eligibleGroup: "Focused group, split by previous-investment class.",
      productScope: "MF+ETF combined.",
      missingHandling: "Same response-rate caveats as the barriers-by-experience comparison.",
      limitations: "No significance test; descriptive only.",
    },
  },
  {
    id: "barriers-by-income-comparison",
    name: "Barriers by income",
    question: "Do reported barriers differ by income?",
    definition: "A comparison of barrier-selection percentages across three income bands.",
    whyItMatters: "Checks whether a barrier's importance changes with income, which could inform who sees which messaging.",
    status: "calculated",
    result: {
      summary: "Fear of losing money rises with income tier: 25.8% → 32.4% → 42.5% across the three income bands.",
      isMultiAnswer: true,
      denominatorLabel: "120 / 74 / 40",
    },
    meaning: "The only barrier with a clear, step-by-step gap across income bands in this sample.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-barriers-by-income",
    analysisLocation: "Understanding the barriers → Differences between groups → “Barriers by income tier.”",
    details: {
      fields: ["AA2_DD2", "Q10A"],
      fieldWordings: [
        { code: "AA2_DD2", wording: "Top 3 Reasons for not investing in MF/ETF" },
        { code: "Q10A", wording: "And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall?" },
      ],
      calculationSteps: [
        "Group the focused group into income bands, decided before any barrier result was examined.",
        "Within each band, keep only those who substantively answered the barriers question.",
        "For a given barrier, divide its count within a band by that band's own answerer count and multiply by 100.",
      ],
      workedExample: "“Fear of losing money due to market risks”: 31 of 120 in the “Up to ₹20,000” band (31 ÷ 120 × 100 = 25.8%) vs. 17 of 40 in the “Above ₹40,000” band (17 ÷ 40 × 100 = 42.5%).",
      eligibleGroup: "Focused group, grouped into income bands decided before any result was examined.",
      productScope: "MF+ETF combined.",
      missingHandling: "Response rates are more uneven across income bands (39.2–55.0%) than across experience groups (44.9–49.2%) — stated plainly, not smoothed over.",
      limitations: "One reasonable income grouping among others; no significance test; uneven response rates across bands.",
    },
  },
  {
    id: "pp-differences-supported-groups",
    name: "Percentage-point differences between groups",
    question: "How large are the gaps between groups in the comparisons above?",
    definition: "The arithmetic gap, in percentage points, between two groups' percentages for the same option.",
    whyItMatters: "Turns a comparison into one plain number that's easy to scan and compare across rows.",
    status: "calculated",
    result: { summary: "See each comparison — e.g. +15.8pp for the education-demand gap by experience.", isMultiAnswer: true },
    meaning: "Quantifies the size of a gap already shown in a comparison — descriptive only.",
    analysisHref: "/understanding-the-barriers/group-differences",
    analysisLocation: "Understanding the barriers → Differences between groups (attached to each comparison row).",
    details: {
      fields: ["AA2_DD2", "AA3_DD3", "Q24A", "Q10A"],
      fieldWordings: [],
      calculationSteps: [
        "Take two group percentages from a comparison above that both have at least 30 answerers.",
        "Subtract the smaller percentage from the larger one.",
        "The result is the gap in percentage points (pp) — not a percent change.",
      ],
      workedExample: "For “Better education on how mutual funds work”: 40.4% − 24.6% = 15.8 percentage points.",
      eligibleGroup: "Same as the underlying comparison.",
      productScope: "MF+ETF combined.",
      missingHandling: "No difference shown for any pair where either side is counts-only.",
      limitations: "No significance test; does not imply either group's characteristic causes the difference.",
    },
  },
  {
    id: "relationship-risk-fear-of-loss",
    name: "Risk preference and fear of losing money",
    question: "Do respondents with different risk preferences select “fear of losing money” at different rates?",
    definition: "A cross-tabulation of risk-preference groups against selection of “fear of losing money” as a barrier, among the same respondents.",
    whyItMatters: "Checks whether a respondent's own stated risk preference lines up with reporting this specific barrier.",
    status: "calculated",
    result: {
      summary: "Weak, inconsistent pattern — no clear gradient by stated risk preference (28.0%–35.4% across groups).",
      isMultiAnswer: true,
      denominatorLabel: "266",
    },
    meaning: "The share selecting fear of losing money ranges from 28.0% to 35.4% across the reportable risk-preference groups, with no consistent rise or fall from more to less risk-averse groups.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-risk-fear-of-loss",
    analysisLocation: "Understanding the barriers → Relationships between reported answers.",
    details: {
      fields: ["QRT", "AA2_DD2"],
      fieldWordings: [
        { code: "QRT", wording: "Which of the following best describes your preference when considering returns from investments?" },
        { code: "AA2_DD2", wording: "Top 3 Reasons for not investing in MF/ETF" },
      ],
      calculationSteps: [
        "Keep the 266 respondents who substantively answered the barriers question.",
        "Split them by their own risk-preference answer.",
        "Within each risk-preference group, count how many also selected “fear of losing money,” and divide by that group's size.",
      ],
      workedExample: "Among the 48 respondents who said they aim for higher returns but couldn't accept significant losses, 17 also selected “fear of losing money”: 17 ÷ 48 × 100 = 35.4%.",
      eligibleGroup: "The 266 substantive AA2_DD2 answerers.",
      productScope: "MF+ETF combined for the barrier question; risk preference is not product-specific.",
      missingHandling: "Restricted to respondents who substantively answered the barriers question; no blanks in the risk-preference field itself.",
      limitations: "Describes an association observed in this sample, not a cause. The group expressing some risk tolerance selected this barrier slightly more (35.4%) than the two more risk-averse groups (28.0%, 28.1%) — the opposite of what a simple story would predict, so read as inconclusive rather than a trend.",
    },
  },
  {
    id: "relationship-knowledge-education-demand",
    name: "Fund-fee knowledge and demand for education",
    question: "Do respondents less sure about mutual-fund expense ratios ask for more education?",
    definition: "A cross-tabulation of one knowledge-item response against selection of “better education” as an encouragement factor, among the same respondents.",
    whyItMatters: "Tests one specific, pre-chosen knowledge gap against demand for education, rather than a general literacy claim.",
    status: "calculated",
    result: {
      summary: "Weak, mixed pattern: respondents who selected Not Aware ask for education slightly more (40.0%) than those who selected True (37.8%), but those who selected False ask for it least (25.6%).",
      isMultiAnswer: true,
      denominatorLabel: "266",
    },
    meaning: "No consistent knowledge-gap pattern for this specific fact.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-knowledge-education",
    analysisLocation: "Understanding the barriers → Relationships between reported answers.",
    details: {
      fields: ["GRIDxQ15AM[{_1}].Q15AM", "AA3_DD3"],
      fieldWordings: [
        { code: "GRIDxQ15AM[{_1}].Q15AM", wording: "Direct plans in mutual funds have a lower expense ratio than regular plans" },
        { code: "AA3_DD3", wording: "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in" },
      ],
      calculationSteps: [
        "Keep the 266 respondents who substantively answered the encouragement question.",
        "Split them by their answer to one knowledge-battery item, chosen before looking at any result.",
        "Within each response group, count how many also selected “better education,” and divide by that group's size.",
      ],
      workedExample: "Among the 172 respondents who selected True for direct plans having a lower expense ratio, 65 also selected “better education”: 65 ÷ 172 × 100 = 37.8%.",
      eligibleGroup: "The 266 substantive AA3_DD3 answerers.",
      productScope: "MF+ETF combined for the encouragement question; the knowledge item is not product-specific.",
      missingHandling: "No blanks in the knowledge item; restricted to substantive AA3_DD3 answerers.",
      selectionRules: "This one item was chosen before looking at any result, as the single item most specifically about mutual-fund product mechanics, rather than testing all 9 items and reporting the largest gap.",
      limitations: "Describes an association in this sample, not a cause; only this one item was tested, not general financial knowledge.",
    },
  },
  {
    id: "relationship-kyc-simple-process",
    name: "Online-KYC knowledge and a simpler process",
    question: "Do respondents who know KYC can be done online ask for a simpler process at a different rate?",
    definition: "A cross-tabulation of the online-KYC knowledge item against selection of “simple and easy process” as an encouragement factor, among the same respondents.",
    whyItMatters: "Checks whether awareness that KYC can be completed online is associated with a different rate of asking for a simpler process.",
    status: "calculated",
    result: { summary: "45.2% who selected True asked for a simpler process, vs. 43.3% who selected False — a 1.9pp gap.", isMultiAnswer: true, denominatorLabel: "266" },
    meaning: "In this sample, 45.2% of respondents who selected True asked for a simpler process, compared with 43.3% who selected False — a 1.9 percentage-point difference (True minus False), too small to call a meaningful pattern.",
    analysisHref: "/understanding-the-barriers/group-differences#group-differences-kyc-simple-process",
    analysisLocation: "Understanding the barriers → Relationships between reported answers.",
    details: {
      fields: ["GRIDxQ15AM[{_4}].Q15AM", "AA3_DD3"],
      fieldWordings: [
        { code: "GRIDxQ15AM[{_4}].Q15AM", wording: "KYC can be completed online" },
        { code: "AA3_DD3", wording: "Factors would encourage you to consider investing in MF/ETF that you currently do not invest in" },
      ],
      calculationSteps: [
        "Keep the 266 respondents who substantively answered the encouragement question.",
        "Split them by their answer on the online-KYC knowledge item.",
        "Within each response group, count how many also selected “simple and easy process,” and divide by that group's size.",
      ],
      workedExample: "Among the 208 respondents who knew KYC can be done online, 94 also selected “simple and easy process”: 94 ÷ 208 × 100 = 45.2%.",
      eligibleGroup: "The 266 substantive AA3_DD3 answerers.",
      productScope: "MF+ETF combined for the encouragement question; the KYC item is not product-specific.",
      missingHandling: "No blanks in the knowledge item; restricted to substantive AA3_DD3 answerers.",
      limitations: "Describes an association in this sample, not a cause; the gap is small enough to be inconclusive.",
    },
  },
  {
    id: "learning-preference-fields",
    name: "Learning preferences",
    question: "What format, medium, language and topics does the focused group prefer for investor education?",
    definition: "The share of the focused group selecting each preferred medium, format, language and topic for investor education.",
    whyItMatters: "Guides format/channel choices if INDmoney builds investor-education content.",
    status: "calculated",
    result: { summary: "Videos (72.5%) and social-media posts (59.9%) are the top-selected formats; Hindi (34.0%) and English (25.5%) the top languages.", isMultiAnswer: true, denominatorLabel: "553" },
    meaning: "Candidate format/channel/topic choices if INDmoney builds education content.",
    analysisHref: "/reaching-and-engaging/learning-preferences#learning-format",
    analysisLocation: "Reaching and engaging → Learning preferences (format, topics, medium, language) — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q20CM", "Q20DM", "Q20E", "Q20F"],
      fieldWordings: [
        { code: "Q20CM", wording: "Please let me know what your preferred medium would be to receive the investor education program (top 3)" },
        { code: "Q20DM", wording: "Could you please share your preferred format for receiving the investor education program (top 3)" },
        { code: "Q20E", wording: "In which language would you prefer investor education programmes to be conducted?" },
        { code: "Q20F", wording: "Which topics should be covered in these investor education programs to enhance financial awareness and decision-making?" },
      ],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered these fields.",
        "For a given format, medium, language or topic, count how many selected it (medium/format/topic allow up to 3 selections).",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "The top format, “Videos,” was selected by 401 of 553: 401 ÷ 553 × 100 = 72.5%.",
      eligibleGroup: "Full focused group.",
      productScope: "Investor-education content preferences, not product-specific.",
      missingHandling: "No blanks observed.",
      limitations: "Stated preference only — not evidence of which format would be most effective.",
    },
  },
  {
    id: "personal-income-distribution",
    name: "Personal income",
    question: "What is the focused group's personal income?",
    definition: "The share of the focused group falling into each personal-income band.",
    whyItMatters: "Provides the grouping variable used in the income-based barrier comparison, and general sample context.",
    status: "calculated",
    result: { summary: "See chart — income bands, ₹15,001–₹20,000/month is the largest single band (18.8%).", isMultiAnswer: true, denominatorLabel: "553" },
    meaning: "Sample context, and the grouping variable for the income-based barrier comparison.",
    analysisLocation: "“Who is in our sample?” page → Education, work and household circumstances.",
    details: {
      fields: ["Q10A"],
      fieldWordings: [{ code: "Q10A", wording: "And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall?" }],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered.",
        "For each income band, count how many respondents fall into it.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "The largest single band, “₹15,001–₹20,000,” was reported by 104 of 553: 104 ÷ 553 × 100 = 18.8%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific.",
      missingHandling: "“Do not wish to disclose” and “No current income” kept as their own categories, never folded into a numeric band.",
      limitations: "This is personal income (all sources, before tax), never household income or “salary,” and not disposable income.",
    },
  },
  {
    id: "income-allocation-corrected",
    name: "Income allocation",
    question: "How does the focused group say it allocates its income?",
    definition: "The share of answerers reporting each percentage-of-income band, separately for 5 budget categories.",
    whyItMatters: "Gives a validated, blank-aware picture of reported budgeting — useful context, not a combined budget total.",
    status: "calculated",
    result: {
      summary: "See chart — 5 separate distributions (expenses, savings, loans, investments, other), each with its own real blank rate.",
      isMultiAnswer: true,
      denominatorLabel: "517–534 of 553 per category",
    },
    meaning: "Each category's distribution is now individually reliable — but the five are not validated as one consistent personal budget.",
    analysisLocation: "“Who is in our sample?” page → Income allocation.",
    details: {
      fields: [
        "Q1MXGrid[{_1}].Q1M",
        "Q1MXGrid[{_2}].Q1M",
        "Q1MXGrid[{_3}].Q1M",
        "Q1MXGrid[{_4}].Q1M",
        "Q1MXGrid[{_5}].Q1M",
      ],
      fieldWordings: [
        { code: "Q1MXGrid[{_1}].Q1M", wording: "Monthly Expenses (e.g., rent, utilities, groceries, transportation, medical)" },
        { code: "Q1MXGrid[{_2}].Q1M", wording: "Savings (e.g., savings accounts, emergency funds)" },
        { code: "Q1MXGrid[{_3}].Q1M", wording: "Loan Repayments (e.g., home loan EMIs, personal loan repayments, car loan installments, credit card)" },
        { code: "Q1MXGrid[{_4}].Q1M", wording: "Investments (e.g., stocks, mutual funds, real estate, gold, retirement products)" },
        { code: "Q1MXGrid[{_5}].Q1M", wording: "Other Expenses (e.g., dining out, travel, hobbies, entertainment, luxury purchases)" },
      ],
      calculationSteps: [
        "For one category (e.g. savings), start from the raw percentage-of-income answer, keeping blanks as blank rather than as “0%.”",
        "Group the non-blank answers into 10-point bands (1–10%, 11–20%, and so on).",
        "For a given band, divide its count by the number who answered that category (not 553) and multiply by 100.",
      ],
      workedExample: "For “savings,” 253 of the 532 who answered reported allocating 11–20% of income: 253 ÷ 532 × 100 = 47.6%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific — general monthly budget categories.",
      missingHandling: "Recomputed from the raw numeric field, not the derived Q1M_DP field, which silently converted “not administered” into a “0%” category (confirmed: e.g. the investments category shows 32 genuinely blank vs. 75 previously shown as “0%”).",
      limitations: "Do not sum or subtract these five bands to estimate disposable income — no check exists that a respondent's five answers are jointly consistent as a single budget.",
    },
  },
  {
    id: "financial-goal-ranking",
    name: "Financial goals",
    question: "Which financial goals does the focused group prioritize?",
    definition: "The share of the focused group ranking each financial goal anywhere in their top 3 priorities.",
    whyItMatters: "Shows which financial goals this group ranks as priorities — useful context, not a motivation for MF specifically.",
    status: "calculated",
    result: {
      summary: "Growing wealth (42.5%) and supporting family members (37.3%) are the two most commonly top-3-ranked goals.",
      isMultiAnswer: true,
      denominatorLabel: "553 of 553 answered",
    },
    meaning: "Shows which financial goals this group ranks as priorities — useful context, not a motivation for MF specifically.",
    analysisHref: "/understanding-the-user/motivations-financial-goals#financial-goal-ranking",
    analysisLocation: "Understanding the user → Motivations and financial goals — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q6_RANK_GRID.Q6_RANK"],
      fieldWordings: [
        { code: "Q6_RANK_GRID.Q6_RANK", wording: "13 ranked goal items, e.g. “Buying a house,” “Growing wealth,” “Supporting family members” (each respondent ranks up to 3)" },
      ],
      calculationSteps: [
        "Keep all 553 respondents — everyone ranked at least one goal.",
        "For a given goal, count how many respondents placed it anywhere in their top 3.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "The top goal, “Growing wealth,” was ranked in the top 3 by 235 of 553: 235 ÷ 553 × 100 = 42.5%.",
      eligibleGroup: "Full focused group; all 553 have at least one non-blank slot.",
      productScope: "Not product-specific — general financial goals.",
      missingHandling: "0 respondents used the free-text “Others” 13th slot; shown as its own separate 0% row.",
      selectionRules: "Each respondent ranks up to 3 goals (1st/2nd/3rd); reported here as “ranked in top 3,” not by rank position.",
      limitations: "Does not test whether a respondent's ranked goals connect to their reported MF motivations — that comparison wasn't run.",
    },
  },
  {
    id: "awareness-sources-media",
    name: "Awareness sources and media",
    question: "What sources and media does the focused group report for awareness of MF/ETF?",
    definition: "The share of a subset of the focused group reporting each awareness source and medium.",
    whyItMatters: "Shows which channels already reach this group — useful for placing future content, though it can't show what caused anyone to invest.",
    status: "calculated",
    result: {
      summary: "“Friends, Family, and Colleagues” (57.9%) and social media (57.5%) are the top-reported source and medium.",
      isMultiAnswer: true,
      denominatorLabel: "266",
    },
    meaning: "Shows which channels are already reaching this group — not whether that source caused them to invest.",
    analysisHref: "/reaching-and-engaging/awareness-media#awareness-sources-media",
    analysisLocation: "Reaching and engaging → Awareness sources and media — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q4_Q5_NONInv_Filt[{_1_2}].Q4M", "Q4_Q5_NONInv_Filt[{_1_2}].Q5M"],
      fieldWordings: [
        { code: "Q4_Q5_NONInv_Filt[{_1_2}].Q4M", wording: "MF+ETF — Sources of Awareness" },
        { code: "Q4_Q5_NONInv_Filt[{_1_2}].Q5M", wording: "MF+ETF — Media of Awareness" },
      ],
      calculationSteps: [
        "Keep only respondents who gave a valid (non-blank) answer to this specific awareness question — 266 of 553.",
        "For a given source or medium, count how many of those 266 selected it.",
        "Divide that count by 266 and multiply by 100.",
      ],
      workedExample: "The top source, “Friends, Family, and Colleagues,” was selected by 154 of 266: 154 ÷ 266 × 100 = 57.9%.",
      eligibleGroup: "Focused group, restricted to valid answerers of this awareness question — independently confirmed (by comparing exact respondent sets) to be the identical 266 who answer the barriers question, not assumed from it.",
      productScope: "MF+ETF combined — this is the only slot the survey offers for this population; there is no MF-only breakout.",
      missingHandling: "287 blank = not part of this answer base, same routing as the barriers question.",
      selectionRules: "Multi-select, open-ended count per respondent; percentages sum to more than 100%.",
      limitations: "Cannot show whether a reported source caused investment consideration, and cannot separate mutual funds from ETFs for this population — the survey has no mutual-fund-only version of this question for non-holders.",
    },
  },
  {
    id: "education-attendance",
    name: "Investor-education attendance",
    question: "Has the focused group attended an investor-education program?",
    definition: "The share of the focused group reporting each level of investor-education program attendance.",
    whyItMatters: "Gives a baseline for any future investor-education proposal.",
    status: "calculated",
    result: { summary: "527 of 553 (95.3%) report not having attended any investor-education program.", count: 527, denominatorLabel: "553" },
    meaning: "Baseline context for any future education-content proposal.",
    analysisHref: "/reaching-and-engaging/learning-preferences#education-attendance",
    analysisLocation: "Reaching and engaging → Learning preferences — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q20AM"],
      fieldWordings: [
        {
          code: "Q20AM",
          wording:
            "There are Investor Education Programmes run by prominent institutions/Industry Associations (SEBI, NISM, Stock Exchanges, Depositories, AMFI, etc.) Please let me know if you have attended any of these investor education programs",
        },
      ],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered.",
        "Count how many selected each attendance option.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "527 of 553 selected “Have not attended any investor education program”: 527 ÷ 553 × 100 = 95.3%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific.",
      missingHandling: "No blanks observed.",
      limitations: "Independently reconfirmed directly from the raw survey data.",
    },
  },
  {
    id: "stock-market-familiarity",
    name: "Self-reported stock-market familiarity",
    question: "How familiar does the focused group say it is with stock markets?",
    definition: "The share of the focused group selecting each level of self-reported stock-market familiarity.",
    whyItMatters: "Context for interpreting the knowledge-battery results.",
    status: "calculated",
    result: { summary: "41.0% say they're “familiar… and update myself periodically”; 8.1% say “Don't Know.”", denominatorLabel: "553" },
    meaning: "Context alongside the knowledge-battery findings.",
    analysisHref: "/understanding-the-barriers/reported-uncertainty#stock-market-familiarity",
    analysisLocation: "Understanding the barriers → Reported uncertainty — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q11M"],
      fieldWordings: [{ code: "Q11M", wording: "How familiar are you with investing in stock markets?" }],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered.",
        "Count how many selected each familiarity option.",
        "Divide that count by 553 and multiply by 100.",
      ],
      workedExample: "227 of 553 selected “I am familiar with the stock markets and update myself periodically on its movements”: 227 ÷ 553 × 100 = 41.0%.",
      eligibleGroup: "Full focused group.",
      productScope: "Stock markets generally, not MF/ETF specifically.",
      missingHandling: "No blanks observed.",
      limitations: "A self-rating, not a tested measure of familiarity or competence.",
    },
  },
  {
    id: "q12m-inflation-numeracy",
    name: "Inflation numeracy check",
    question: "Can respondents work out that a return below inflation is a real-terms loss?",
    definition: "The share of the focused group correctly recognizing that a return below inflation is a real-terms loss.",
    whyItMatters: "A simple, distinct numeracy check to compare against the undocumented 9-item battery.",
    status: "calculated",
    result: { summary: "245 of 553 (44.3%) answer correctly (“Less than today”).", count: 245, denominatorLabel: "553" },
    meaning: "A distinct, simple numeracy check — separate from the 9-item knowledge battery, which has no correct-answer key at all.",
    analysisHref: "/understanding-the-barriers/reported-uncertainty#q12m-inflation-numeracy",
    analysisLocation: "Understanding the barriers → Reported uncertainty — also on the “Who is in our sample?” page.",
    details: {
      fields: ["Q12M"],
      fieldWordings: [
        {
          code: "Q12M",
          wording:
            "Suppose the rate of return on your savings is 5% per year and inflation is 6% per year — after a year, will you be able to buy more, less, or the same as today with this money?",
        },
      ],
      calculationSteps: [
        "Keep all 553 respondents — everyone answered.",
        "Mark “Less than today” as correct (the only arithmetically correct answer, since a 5% return is below 6% inflation) and every other answer as incorrect.",
        "Divide the correct count by 553 and multiply by 100.",
      ],
      workedExample: "245 of 553 answered correctly: 245 ÷ 553 × 100 = 44.3%.",
      eligibleGroup: "Full focused group.",
      productScope: "Not product-specific.",
      missingHandling: "“Do not know” and “Refuse to answer” are scored incorrect, not treated as missing.",
      limitations: "One numeracy question, not a general literacy score; distinct from the undocumented 9-item battery, which is never scored.",
    },
  },
  {
    id: "broader-group-mf-holding-share",
    name: "Current MF holding (broader group)",
    question: "How many of the broader survey group of salaried Gen Z respondents already hold mutual funds?",
    definition: "The share of the broader 4,346-person salaried-Gen-Z group who currently hold mutual funds, among those with a known holding status.",
    whyItMatters: "Gives context on how common MF holding already is beyond the focused (non-holder) group this page otherwise studies.",
    status: "calculated",
    result: { summary: "Context: 32.9% of the 4,346-person broader group hold mutual funds — this is not the 553-person focused group.", denominatorLabel: "4,346 (broader group, not focused group)" },
    meaning: "Context only — describes the broader survey group, not the non-holders this page otherwise studies.",
    analysisHref: "/dataset-and-method#how-we-selected-the-sample",
    analysisLocation: "Dataset and Method → How we narrowed the dataset (sample-selection funnel).",
    details: {
      fields: ["Q22A_All"],
      fieldWordings: [{ code: "Q22A_All", wording: "Which of the following financial products do you currently hold investments in" }],
      calculationSteps: [
        "Start with the 4,346-person broader group (salaried Gen Z, regardless of MF consideration).",
        "Exclude the 3 respondents with an unknown/unrecorded holding status, leaving 4,343 with a known status.",
        "Divide the number holding mutual funds by 4,343 and multiply by 100.",
      ],
      workedExample: "1,427 of 4,343 with a known status hold mutual funds: 1,427 ÷ 4,343 × 100 = 32.9%.",
      eligibleGroup: "Broader group (salaried Gen Z, n = 4,346) — not the focused group this page otherwise studies.",
      productScope: "Mutual funds specifically.",
      missingHandling: "Unknown/not-answered status excluded from the denominator, never counted as not-holding.",
      limitations: "Not a market-wide MF penetration estimate; unweighted.",
    },
  },
]

// ---------------------------------------------------------------------------
// Limitations — what this project cannot establish, stated once, not as a pending task
// ---------------------------------------------------------------------------

export const LIMITATIONS: string[] = [
  "No INDmoney activity records of any kind — no app opens, no screens viewed, no clicks.",
  "No observed onboarding or SIP-setup journey — where people actually stop in INDmoney's own product is unknown from this data.",
  "No first-SIP conversion or payment data — whether anyone who considered mutual funds went on to invest through INDmoney is not observable here.",
  "No evidence that any proposed change would work — the conclusions below are ideas worth testing, not validated fixes.",
  "The survey only asks non-holders about awareness sources for mutual funds and ETFs combined — there is no mutual-fund-only version of that question.",
  "Income-allocation categories are individually reliable but not validated as one consistent personal budget — never summed into a disposable-income figure.",
  "Every result is unweighted and descriptive — no significance testing, no causal claims, and not a population estimate.",
]

// ---------------------------------------------------------------------------
// Conclusion — proposals framed as ideas to investigate, not decisions
// ---------------------------------------------------------------------------

export const CONCLUSION_INTRO =
  "These are proposals informed by the indicators above — ideas for INDmoney to investigate, not conclusions this project can prove."

export interface ConclusionProposal {
  title: string
  detail: string
}

export const CONCLUSION_PROPOSALS: ConclusionProposal[] = [
  {
    title: "Investigate onboarding friction",
    detail: "“Simple and easy process for investing” is the top-selected encouragement factor (44.0%). Worth checking against INDmoney's own onboarding funnel before assuming this is the fix.",
  },
  {
    title: "Test plainer risk information",
    detail: "“Fear of losing money” is the top-selected barrier (30.5%), rising with income tier. Worth testing whether clearer risk communication changes completion for users showing MF intent.",
  },
  {
    title: "Segment by prior investment experience",
    detail: "Barriers and encouragement factors differ between past MF investors, no-prior-investment respondents, and other-product investors — a single “non-holder” message may not fit all three.",
  },
  {
    title: "Re-examine the education proposal",
    detail: "Demand for “better education” differs by prior experience, but the knowledge-item relationships tested here are weak and mixed — a specific content gap isn't confirmed yet.",
  },
]

// ---------------------------------------------------------------------------
// Future company KPIs — proposed measures, not calculable from this dataset
// ---------------------------------------------------------------------------

export const FUTURE_COMPANY_KPIS_INTRO =
  "Proposed measures for INDmoney's own product-analytics team to define, instrument and agree — explicitly unavailable in the SEBI Investor Survey. No value, target or projected improvement is given for any of these; they require INDmoney's own event data and sign-off (see docs/research_and_measurement_plan.md §5)."

export interface FutureCompanyKpi {
  name: string
  definition: string
}

export const FUTURE_COMPANY_KPIS: FutureCompanyKpi[] = [
  {
    name: "First-SIP order placement",
    definition:
      "A user sets up/submits a SIP mandate (fund, amount, frequency, authorization). Can happen without any money moving yet.",
  },
  {
    name: "First successful SIP payment",
    definition:
      "The first scheduled debit under that mandate actually succeeds — kept as a distinct event from placement; an order can be placed and still fail here (insufficient funds, mandate not approved, technical failure).",
  },
  {
    name: "Continued scheduled payments",
    definition:
      "Among users whose first payment succeeded, the share who also complete later scheduled payments — counted only once the relevant payment's due date has passed, with cancellations and failed payments kept in the denominator, never dropped.",
  },
  {
    name: "Risk-comprehension checks",
    definition:
      "A brief comprehension check (e.g. what a SIP is, what happens if a payment fails, or a core investment-risk question) confirming that faster or higher completion isn't coming at the cost of understanding what was purchased.",
  },
]

const MEASURES_BY_ID: Record<string, Measure> = Object.fromEntries(MEASURES.map((m) => [m.id, m]))

/** Look up a measure by id for the shared `MeasureDetailSheet` — returns undefined for an unknown id rather than throwing, so a chart card can render without a sheet if a measure is ever renamed. */
export function getMeasureById(id: string): Measure | undefined {
  return MEASURES_BY_ID[id]
}
