import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatBar } from "@/components/dataset-method/stat-bar"
import { formatN } from "@/lib/dataset-method-data"
import type { OptionCount } from "@/lib/findings-data"

/**
 * Sorted horizontal bars for one multi-select question's full answer set (AA1_DD1–AA4_DD4,
 * awareness sources/media) — the chart view inside `AnalysisChartCard`. Takes the raw
 * `options`/`denominator` pair directly (rather than a specific field type) so it works for
 * any `{option, n, pct_of_answered}[]` export.
 */
export function QuestionBarChart({ options, denominator }: { options: OptionCount[]; denominator: number }) {
  const sorted = [...options].sort((a, b) => b.pct_of_answered - a.pct_of_answered)
  return (
    <div className="space-y-2.5">
      {sorted.map((o) => (
        <StatBar key={o.option} label={o.option} value={o.n} total={denominator} />
      ))}
    </div>
  )
}

/** The accessible table view for the same question's answer set. */
export function QuestionAnswersTable({ options }: { options: OptionCount[] }) {
  const sorted = [...options].sort((a, b) => b.pct_of_answered - a.pct_of_answered)
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reason / factor</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Percent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((o) => (
            <TableRow key={o.option}>
              <TableCell className="max-w-md whitespace-normal">{o.option}</TableCell>
              <TableCell className="text-right tabular-nums">{formatN(o.n)}</TableCell>
              <TableCell className="text-right tabular-nums">{o.pct_of_answered}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
