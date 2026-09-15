import { Badge } from "@/components/ui/badge"
import { encouragement, demographics, awarenessSources, type DemographicField } from "@/lib/findings-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { QuestionBarChart, QuestionAnswersTable } from "./question-answers-card"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"

const MF_ETF_BADGE = (
  <Badge variant="secondary" className="font-normal">
    MF+ETF combined scope
  </Badge>
)

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

export function WhatCouldHelpTab() {
  const q20am = field("Q20AM")

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        What respondents say would encourage them to invest, and what they say would help them learn — shown
        together as candidate directions, not validated fixes.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Each row pair gets its own height-matching group — EqualHeightChartsProvider
            renders no DOM element of its own, so pairing cards like this doesn't affect the
            grid's 2-column CSS layout. Only the taller card in a given row ever gets
            capped/scrolls; the row's shorter card stays completely untouched. */}
        <EqualHeightChartsProvider expectedCount={2}>
          <AnalysisChartCard
            id="encouragement-selection-pct"
            title="What would encourage respondents to invest?"
            badges={MF_ETF_BADGE}
            scopeLine={answeredLine(encouragement.denominator, encouragement.focused_group_size)}
            measureId="encouragement-selection-pct"
            observation={getMeasureById("encouragement-selection-pct")?.meaning}
            chart={<QuestionBarChart options={encouragement.options} denominator={encouragement.denominator} />}
            table={<QuestionAnswersTable options={encouragement.options} />}
          />

          <AnalysisChartCard
            id="education-attendance"
            title="Has the focused group attended an investor-education program?"
            scopeLine={answeredLine(q20am.n_answered, q20am.denominator)}
            measureId="education-attendance"
            observation={getMeasureById("education-attendance")?.meaning}
            chart={<OptionBarChart options={q20am.options} total={q20am.n_answered} />}
            table={<OptionsTable options={q20am.options} />}
          />
        </EqualHeightChartsProvider>

        <EqualHeightChartsProvider expectedCount={2}>
          <DemographicFieldCard id="learning-format" title="Preferred format for investor education" code="Q20DM" measureId="learning-preference-fields" />
          <DemographicFieldCard id="learning-topics" title="Preferred investor-education topics" code="Q20F" measureId="learning-preference-fields" />
        </EqualHeightChartsProvider>

        <EqualHeightChartsProvider expectedCount={2}>
          <DemographicFieldCard id="learning-medium" title="Preferred medium for investor education" code="Q20CM" measureId="learning-preference-fields" />
          <DemographicFieldCard id="learning-language" title="Preferred language for investor education" code="Q20E" measureId="learning-preference-fields" />
        </EqualHeightChartsProvider>

        {/* Spans the full row — Sources and Media side by side rather than stacked, so this
            card isn't part of the row-pairing height match above. */}
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
