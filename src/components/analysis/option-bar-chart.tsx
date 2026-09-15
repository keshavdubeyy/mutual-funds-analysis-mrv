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

export interface LabeledOption {
  label: string
  n: number
  pct: number
}

/**
 * Generic single-select option chart/table — for any `WhoField`/`DemographicField`-shaped
 * question (QRT, Q10M, Q11M, Q12M, Q20AM/CM/DM/E/F): one answer per respondent, `pct` already
 * computed against that field's own answered count. Distinct from `QuestionBarChart`, which is
 * for the multi-select AA*_DD* fields (percentages sum to ~300%, different source shape).
 */
export function OptionBarChart({ options, total, sort = true }: { options: LabeledOption[]; total: number; sort?: boolean }) {
  const sorted = sort ? [...options].sort((a, b) => b.pct - a.pct) : options
  return (
    <div className="space-y-2.5">
      {sorted.map((o) => (
        <StatBar key={o.label} label={o.label} value={o.n} total={total} />
      ))}
    </div>
  )
}

export function OptionsTable({
  options,
  optionHeader = "Response",
  sort = true,
}: {
  options: LabeledOption[]
  optionHeader?: string
  sort?: boolean
}) {
  const sorted = sort ? [...options].sort((a, b) => b.pct - a.pct) : options
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{optionHeader}</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Percent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((o) => (
            <TableRow key={o.label}>
              <TableCell className="max-w-md whitespace-normal">{o.label}</TableCell>
              <TableCell className="text-right tabular-nums">{formatN(o.n)}</TableCell>
              <TableCell className="text-right tabular-nums">{o.pct}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
