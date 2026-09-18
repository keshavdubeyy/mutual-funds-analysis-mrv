import { demographics, type DemographicField } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"

function field(code: string): DemographicField {
  const f = demographics.fields.find((d) => d.field_code === code)
  if (!f) throw new Error(`Missing demographic field ${code}`)
  return f
}

function DemographicFieldCard({ id, title, code, measureId }: { id: string; title: string; code: string; measureId: string }) {
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

export function LearningPreferencesTab() {
  const q20am = field("Q20AM")

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        What format, medium, language and topics this group prefers for investor education, and whether it has
        attended an education program before.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EqualHeightChartsProvider expectedCount={2}>
          <DemographicFieldCard id="learning-format" title="Preferred format for investor education" code="Q20DM" measureId="learning-preference-fields" />
          <DemographicFieldCard id="learning-topics" title="Preferred investor-education topics" code="Q20F" measureId="learning-preference-fields" />
        </EqualHeightChartsProvider>

        <EqualHeightChartsProvider expectedCount={2}>
          <DemographicFieldCard id="learning-medium" title="Preferred medium for investor education" code="Q20CM" measureId="learning-preference-fields" />
          <DemographicFieldCard id="learning-language" title="Preferred language for investor education" code="Q20E" measureId="learning-preference-fields" />
        </EqualHeightChartsProvider>

        <AnalysisChartCard
          id="education-attendance"
          className="lg:col-span-2"
          title="Has the focused group attended an investor-education program?"
          scopeLine={answeredLine(q20am.n_answered, q20am.denominator)}
          measureId="education-attendance"
          observation={getMeasureById("education-attendance")?.meaning}
          chart={<OptionBarChart options={q20am.options} total={q20am.n_answered} />}
          table={<OptionsTable options={q20am.options} />}
        />
      </div>
    </div>
  )
}
