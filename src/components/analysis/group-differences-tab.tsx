"use client"

import * as React from "react"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { formatN } from "@/lib/dataset-method-data"
import { comparisonByExperience, comparisonByIncome, relationships } from "@/lib/findings-data"
import {
  normalizeBarriersByExperience,
  normalizeEncouragementByExperience,
  normalizeBarriersByIncome,
  normalizeRelationship,
  relationshipReportableRange,
  type NormalizedComparisonRow,
  type GroupMeta,
} from "@/lib/analysis-comparisons"
import { getMeasureById } from "@/lib/research-plan-data"
import { AnalysisChartCard } from "./analysis-chart-card"
import { ComparisonRowsCard, ComparisonRowsTable } from "./comparison-rows"

interface ComparisonOption {
  key: string
  label: string
  measureId: string
  rows: NormalizedComparisonRow[]
  groupMeta: GroupMeta[]
  rangeNote?: string
}

function buildComparisons(): ComparisonOption[] {
  const barriersByExperience = normalizeBarriersByExperience(comparisonByExperience)
  const encouragementByExperience = normalizeEncouragementByExperience(comparisonByExperience)
  const barriersByIncome = normalizeBarriersByIncome(comparisonByIncome)
  const riskFearOfLoss = normalizeRelationship(relationships.qrt_fear_of_loss)
  const knowledgeEducation = normalizeRelationship(relationships.knowledge_item1_education)
  const kycSimpleProcess = normalizeRelationship(relationships.kyc_simple_process)
  const riskRange = relationshipReportableRange(relationships.qrt_fear_of_loss)
  const knowledgeRange = relationshipReportableRange(relationships.knowledge_item1_education)

  return [
    {
      key: "barriers-by-experience",
      label: "Barriers by previous MF experience",
      measureId: "barriers-by-experience-comparison",
      rows: barriersByExperience.rows,
      groupMeta: barriersByExperience.groupMeta,
    },
    {
      key: "encouragement-by-experience",
      label: "Encouragement by previous MF experience",
      measureId: "encouragement-by-experience-comparison",
      rows: encouragementByExperience.rows,
      groupMeta: encouragementByExperience.groupMeta,
    },
    {
      key: "barriers-by-income",
      label: "Barriers by income tier",
      measureId: "barriers-by-income-comparison",
      rows: barriersByIncome.rows,
      groupMeta: barriersByIncome.groupMeta,
    },
    {
      key: "risk-fear-of-loss",
      label: "Risk preference and fear of losing money",
      measureId: "relationship-risk-fear-of-loss",
      rows: [riskFearOfLoss.row],
      groupMeta: riskFearOfLoss.groupMeta,
      rangeNote: riskRange ? `Range across reportable groups: ${(Math.round((riskRange.max - riskRange.min) * 10) / 10).toFixed(1)} pp.` : undefined,
    },
    {
      key: "knowledge-education",
      label: "Fund-fee knowledge and demand for education",
      measureId: "relationship-knowledge-education-demand",
      rows: [knowledgeEducation.row],
      groupMeta: knowledgeEducation.groupMeta,
      rangeNote: knowledgeRange
        ? `Range across reportable groups: ${(Math.round((knowledgeRange.max - knowledgeRange.min) * 10) / 10).toFixed(1)} pp.`
        : undefined,
    },
    {
      key: "kyc-simple-process",
      label: "Online-KYC knowledge and preference for a simple process",
      measureId: "relationship-kyc-simple-process",
      rows: [kycSimpleProcess.row],
      groupMeta: kycSimpleProcess.groupMeta,
    },
  ]
}

export function GroupDifferencesTab() {
  const comparisons = React.useMemo(() => buildComparisons(), [])
  const [key, setKey] = React.useState(comparisons[0].key)

  // Only the selected comparison's chart card is in the DOM at any time (this is a select,
  // not a set of tabs), so a deep link like #group-differences-kyc-simple-process needs to
  // pick that comparison before "Analysis"'s own hash-scroll effect can find it. This only
  // fires once, at mount — it catches a fresh page load with the hash already in the URL.
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#group-differences-/, "")
    if (hash && comparisons.some((c) => c.key === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL hash, which only exists client-side
      setKey(hash)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, [])

  const selected = comparisons.find((c) => c.key === key) ?? comparisons[0]
  const measure = getMeasureById(selected.measureId)

  const totalAnswered = selected.groupMeta.reduce((sum, g) => sum + g.n_answered, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="group-differences-select" className="text-xs font-medium text-muted-foreground">
          Comparison
        </label>
        <NativeSelect
          id="group-differences-select"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="max-w-sm"
        >
          {comparisons.map((c) => (
            <NativeSelectOption key={c.key} value={c.key}>
              {c.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <AnalysisChartCard
        id={`group-differences-${selected.key}`}
        title={selected.label}
        scopeLine={`${formatN(totalAnswered)} people, split across ${selected.groupMeta.length} groups.`}
        measureId={selected.measureId}
        observation={selected.rangeNote ? `${measure?.meaning ?? ""} ${selected.rangeNote}`.trim() : measure?.meaning}
        chart={<ComparisonRowsCard rows={selected.rows} groupMeta={selected.groupMeta} />}
        table={<ComparisonRowsTable rows={selected.rows} groupMeta={selected.groupMeta} />}
      />
    </div>
  )
}
