import { Badge } from "@/components/ui/badge"
import { awarenessSources } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { QuestionBarChart, QuestionAnswersTable } from "./question-answers-card"

const MF_ETF_BADGE = (
  <Badge variant="secondary" className="font-normal">
    MF+ETF combined scope
  </Badge>
)

export function AwarenessMediaTab() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Where the focused group says it hears about MF/ETF — shown as channel context, not as what caused anyone
        to invest.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalysisChartCard
          id="awareness-sources-media"
          className="lg:col-span-2"
          title="What sources and media does the focused group report for awareness of MF/ETF?"
          badges={MF_ETF_BADGE}
          scopeLine={answeredLine(awarenessSources.denominator, awarenessSources.focused_group_size)}
          measureId="awareness-sources-media"
          observation={getMeasureById("awareness-sources-media")?.meaning}
          chart={
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Sources</p>
                <QuestionBarChart options={awarenessSources.sources} denominator={awarenessSources.denominator} />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Media</p>
                <QuestionBarChart options={awarenessSources.media} denominator={awarenessSources.denominator} />
              </div>
            </div>
          }
          table={
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Sources</p>
                <QuestionAnswersTable options={awarenessSources.sources} />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Media</p>
                <QuestionAnswersTable options={awarenessSources.media} />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
