import { Badge } from "@/components/ui/badge"
import { barriers } from "@/lib/findings-data"
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

export function ReportedBarriersTab() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Why respondents report not investing today, among those who answered this question.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalysisChartCard
          id="barriers-selection-pct"
          className="lg:col-span-2"
          title="What reasons do respondents give for not investing today?"
          badges={MF_ETF_BADGE}
          scopeLine={answeredLine(barriers.denominator, barriers.focused_group_size)}
          measureId="barriers-selection-pct"
          observation={getMeasureById("barriers-selection-pct")?.meaning}
          chart={<QuestionBarChart options={barriers.options} denominator={barriers.denominator} />}
          table={<QuestionAnswersTable options={barriers.options} />}
        />
      </div>

      <FindingsSection themeId="reported-barriers" />
    </div>
  )
}
