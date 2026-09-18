import { Badge } from "@/components/ui/badge"
import { stoppingReasons, comparisonByExperience } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { pctOf, answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { QuestionBarChart, QuestionAnswersTable } from "./question-answers-card"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"
import { FindingsSection } from "./findings-section"

const MF_ETF_BADGE = (
  <Badge variant="secondary" className="font-normal">
    MF+ETF combined scope
  </Badge>
)

function buildPreviousInvestmentData() {
  const { past_mf_investor, explicit_no_prior_investment, past_investor_other_product_only } = comparisonByExperience.group_sizes
  const total = past_mf_investor + explicit_no_prior_investment + past_investor_other_product_only
  const options = [
    { label: "None of the 7 listed products", n: explicit_no_prior_investment, pct: pctOf(explicit_no_prior_investment, total) },
    { label: "Past MF investor", n: past_mf_investor, pct: pctOf(past_mf_investor, total) },
    { label: "Other product only (not MF)", n: past_investor_other_product_only, pct: pctOf(past_investor_other_product_only, total) },
  ]
  return { options, total }
}

export function PreviousInvestmentTab() {
  const prevInvestment = buildPreviousInvestmentData()

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Who in the focused group has invested before, and why some say they stopped — two separate questions with
        their own answer bases.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EqualHeightChartsProvider expectedCount={2}>
          <AnalysisChartCard
            id="previous-investment-shares"
            title="Who in the focused group has invested before?"
            scopeLine="All 553 people, grouped by whether they've invested before."
            measureId="previous-investment-shares"
            observation={getMeasureById("previous-investment-shares")?.meaning}
            chart={<OptionBarChart options={prevInvestment.options} total={prevInvestment.total} sort={false} />}
            table={<OptionsTable options={prevInvestment.options} sort={false} />}
          />

          <AnalysisChartCard
            id="stopping-reasons-selection-pct"
            title="Why did respondents stop investing in MF/ETF?"
            badges={MF_ETF_BADGE}
            scopeLine={answeredLine(stoppingReasons.denominator, stoppingReasons.focused_group_size)}
            measureId="stopping-reasons-selection-pct"
            observation={getMeasureById("stopping-reasons-selection-pct")?.meaning}
            extraCaveat={
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-foreground/90">
                62 of these 64 are confirmed past MF investors (2 held another product, 0 held none of the 7
                listed products) — a verified respondent-level check, not a documented survey routing rule.
              </div>
            }
            chart={<QuestionBarChart options={stoppingReasons.options} denominator={stoppingReasons.denominator} />}
            table={<QuestionAnswersTable options={stoppingReasons.options} />}
          />
        </EqualHeightChartsProvider>
      </div>

      <FindingsSection themeId="previous-investment" />
    </div>
  )
}
