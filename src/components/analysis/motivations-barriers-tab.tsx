import { Badge } from "@/components/ui/badge"
import { motivations, barriers, stoppingReasons, comparisonByExperience, financialGoals } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { pctOf, answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { QuestionBarChart, QuestionAnswersTable } from "./question-answers-card"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"

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

export function MotivationsBarriersTab() {
  const prevInvestment = buildPreviousInvestmentData()
  const goalOptions = financialGoals.goals.map((g) => ({ label: g.goal, n: g.n_ranked_in_top3, pct: g.pct_of_553 }))

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Four separate questions, each with its own respondent group and answer base — shown independently, not
        pooled into one ranking.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Each row pair gets its own height-matching group — EqualHeightChartsProvider
            renders no DOM element of its own, so pairing cards like this doesn't affect the
            grid's 2-column CSS layout at all. Only the taller card in a given row ever gets
            capped/scrolls; a row's shorter card stays completely untouched, and the two
            pairings never affect each other. */}
        <EqualHeightChartsProvider expectedCount={2}>
          <AnalysisChartCard
            id="motivations-selection-pct"
            title="What reasons do respondents give for considering investing?"
            badges={MF_ETF_BADGE}
            scopeLine={answeredLine(motivations.denominator, motivations.focused_group_size)}
            measureId="motivations-selection-pct"
            observation={getMeasureById("motivations-selection-pct")?.meaning}
            chart={<QuestionBarChart options={motivations.options} denominator={motivations.denominator} />}
            table={<QuestionAnswersTable options={motivations.options} />}
          />

          <AnalysisChartCard
            id="financial-goal-ranking"
            title="Which financial goals do respondents rank in their top 3?"
            scopeLine="All 553 people ranked their top 3 financial goals."
            measureId="financial-goal-ranking"
            observation={getMeasureById("financial-goal-ranking")?.meaning}
            chart={<OptionBarChart options={goalOptions} total={financialGoals.focused_group_size} />}
            table={<OptionsTable options={goalOptions} optionHeader="Financial goal" />}
          />
        </EqualHeightChartsProvider>

        <EqualHeightChartsProvider expectedCount={2}>
          <AnalysisChartCard
            id="barriers-selection-pct"
            title="What reasons do respondents give for not investing today?"
            badges={MF_ETF_BADGE}
            scopeLine={answeredLine(barriers.denominator, barriers.focused_group_size)}
            measureId="barriers-selection-pct"
            observation={getMeasureById("barriers-selection-pct")?.meaning}
            chart={<QuestionBarChart options={barriers.options} denominator={barriers.denominator} />}
            table={<QuestionAnswersTable options={barriers.options} />}
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
                These 64 people aren&apos;t confirmed to be part of the 136 past MF investors above — treat this as
                its own small group.
              </div>
            }
            chart={<QuestionBarChart options={stoppingReasons.options} denominator={stoppingReasons.denominator} />}
            table={<QuestionAnswersTable options={stoppingReasons.options} />}
          />
        </EqualHeightChartsProvider>

        {/* Odd one out — alone in its row, nothing to match against, so it renders at its own
            natural height with no cap and no scroll. */}
        <AnalysisChartCard
          id="previous-investment-shares"
          title="Who in the focused group has invested before?"
          scopeLine="All 553 people, grouped by whether they've invested before."
          measureId="previous-investment-shares"
          observation={getMeasureById("previous-investment-shares")?.meaning}
          chart={<OptionBarChart options={prevInvestment.options} total={prevInvestment.total} sort={false} />}
          table={<OptionsTable options={prevInvestment.options} sort={false} />}
        />
      </div>
    </div>
  )
}
