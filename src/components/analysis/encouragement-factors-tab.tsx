import { Badge } from "@/components/ui/badge"
import { encouragement } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { QuestionBarChart, QuestionAnswersTable } from "./question-answers-card"
import { FindingsSection } from "./findings-section"

const MF_ETF_BADGE = (
  <Badge variant="secondary" className="font-normal">
    MF+ETF combined scope
  </Badge>
)

export function EncouragementFactorsTab() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        What respondents say would encourage them to invest — shown as a candidate direction, not a validated fix.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalysisChartCard
          id="encouragement-selection-pct"
          className="lg:col-span-2"
          title="What would encourage respondents to invest?"
          badges={MF_ETF_BADGE}
          scopeLine={answeredLine(encouragement.denominator, encouragement.focused_group_size)}
          measureId="encouragement-selection-pct"
          observation={getMeasureById("encouragement-selection-pct")?.meaning}
          chart={<QuestionBarChart options={encouragement.options} denominator={encouragement.denominator} />}
          table={<QuestionAnswersTable options={encouragement.options} />}
        />
      </div>

      <FindingsSection themeId="encouragement-factors" />
    </div>
  )
}
