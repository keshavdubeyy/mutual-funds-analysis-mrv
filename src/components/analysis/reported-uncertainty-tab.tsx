"use client"

import * as React from "react"
import { whoIsInSampleBase, type WhoField } from "@/lib/who-is-in-sample-data"
import { getMeasureById } from "@/lib/research-plan-data"
import { answeredLine } from "@/lib/format-pct"
import { buildBatteryRows } from "@/lib/knowledge-battery"
import { AnalysisChartCard } from "./analysis-chart-card"
import { EqualHeightChartsProvider } from "./equal-height-context"
import { OptionBarChart, OptionsTable } from "./option-bar-chart"
import {
  KnowledgeBatteryChart,
  KnowledgeTable,
  KnowledgeWordingSheet,
  KnowledgeFilterToggle,
  type BatteryFilter,
} from "./knowledge-battery-card"

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

export function ReportedUncertaintyTab() {
  const [batteryFilter, setBatteryFilter] = React.useState<BatteryFilter>("all")
  const { knowledge_grid, focused_group_size } = whoIsInSampleBase
  const batteryRows = React.useMemo(() => buildBatteryRows(knowledge_grid.items), [knowledge_grid.items])
  const q12m = field("Q12M")

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Reported knowledge and numeracy — shown as context, not as a literacy score.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spans the full row — the 9-item battery chart plus its filter/wording controls
            needs the extra width, and isn't part of any row-pairing height match. */}
        <AnalysisChartCard
          id="knowledge-battery-distributions"
          className="lg:col-span-2"
          title="Which financial topics carry the most reported uncertainty?"
          scopeLine={`${answeredLine(focused_group_size, focused_group_size)} Sorted by most-unsure first.`}
          measureId="knowledge-battery-distributions"
          observation={getMeasureById("knowledge-battery-distributions")?.meaning}
          controls={
            <>
              <KnowledgeFilterToggle value={batteryFilter} onChange={setBatteryFilter} />
              <KnowledgeWordingSheet rows={batteryRows} />
            </>
          }
          chart={<KnowledgeBatteryChart rows={batteryRows} filter={batteryFilter} />}
          table={<KnowledgeTable rows={batteryRows} />}
        />

        <EqualHeightChartsProvider expectedCount={2}>
          <AnalysisChartCard
            id="q12m-inflation-numeracy"
            title="Can respondents work out that a return below inflation is a real-terms loss?"
            scopeLine={answeredLine(q12m.n_answered, q12m.denominator)}
            measureId="q12m-inflation-numeracy"
            observation={`${getMeasureById("q12m-inflation-numeracy")?.meaning} Only “Less than today” is correct — the other answers are shown as given, not merged into one “wrong” group.`}
            chart={<OptionBarChart options={q12m.options} total={q12m.n_answered} sort={false} />}
            table={<OptionsTable options={q12m.options} sort={false} />}
          />

          <FieldCard id="stock-market-familiarity" title="How familiar does the focused group say it is with stock markets?" code="Q11M" measureId="stock-market-familiarity" />
        </EqualHeightChartsProvider>
      </div>
    </div>
  )
}
