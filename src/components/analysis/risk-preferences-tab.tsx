import { whoIsInSampleBase, type WhoField } from "@/lib/who-is-in-sample-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"

function field(code: string): WhoField {
  const f = whoIsInSampleBase.fields.find((d) => d.field_code === code)
  if (!f) throw new Error(`Missing field ${code}`)
  return f
}

function FieldCard({ id, title, code, measureId }: { id: string; title: string; code: string; measureId: string }) {
  const f = field(code)
  return (
    <AnalysisChartCard
      id={id}
      title={title}
      scopeLine={answeredLine(f.n_answered, f.denominator)}
      measureId={measureId}
      observation={getMeasureById(measureId)?.meaning}
      chart={<OptionBarChart options={f.options} total={f.n_answered} />}
      table={<OptionsTable options={f.options} />}
    />
  )
}

export function RiskPreferencesTab() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Self-reported risk preference and reactions to a hypothetical downturn — shown as context, not as a
        prediction of actual behavior.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EqualHeightChartsProvider expectedCount={2}>
          <FieldCard id="risk-preference-distribution" title="What risk/return preference does the focused group report?" code="QRT" measureId="risk-preference-distribution" />
          <FieldCard id="downturn-reaction-distribution" title="How does the focused group say it would react to a downturn?" code="Q10M" measureId="downturn-reaction-distribution" />
        </EqualHeightChartsProvider>
      </div>
    </div>
  )
}
