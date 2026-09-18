import { Badge } from "@/components/ui/badge"
import { motivations, financialGoals } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
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

export function MotivationsFinancialGoalsTab() {
  const goalOptions = financialGoals.goals.map((g) => ({ label: g.goal, n: g.n_ranked_in_top3, pct: g.pct_of_553 }))

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Two separate questions, each with its own respondent group and answer base — shown independently, not
        pooled into one ranking.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      </div>

      <FindingsSection themeId="motivations-financial-goals" />
    </div>
  )
}
