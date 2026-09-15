import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatN } from "@/lib/dataset-method-data"
import type { NormalizedComparisonRow, GroupMeta } from "@/lib/analysis-comparisons"

const GROUP_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]

function PpBadge({ ppDiff }: { ppDiff: number | null }) {
  if (ppDiff === null) return null
  const sign = ppDiff > 0 ? "+" : ""
  return (
    <Badge variant="outline" className="shrink-0 font-mono font-normal tabular-nums">
      {sign}
      {ppDiff.toFixed(1)} pp
    </Badge>
  )
}

/**
 * One option's side-by-side percentage bars across the percentage-bearing groups, plus any
 * count-only groups shown as plain text — never as a bar (a bar would visually imply a
 * comparable percentage that the reporting-minimum rule says isn't reliable here).
 */
function ComparisonRow({ row }: { row: NormalizedComparisonRow }) {
  const barGroups = row.groups.filter((g) => !g.countOnly)
  const countOnlyGroups = row.groups.filter((g) => g.countOnly)

  return (
    <div className="space-y-2 border-b border-border py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{row.option}</p>
        <PpBadge ppDiff={row.ppDiff} />
      </div>
      <div className="space-y-1.5">
        {barGroups.map((g, i) => (
          <div key={g.key} className="flex items-center gap-2">
            <span className="w-36 shrink-0 truncate text-xs text-muted-foreground" title={g.label}>
              {g.label}
            </span>
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, g.pct ?? 0))}%`,
                  backgroundColor: GROUP_COLORS[i % GROUP_COLORS.length],
                }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {formatN(g.n)} ({g.pct}%)
            </span>
          </div>
        ))}
      </div>
      {countOnlyGroups.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          {countOnlyGroups.map((g) => `${g.label}: ${formatN(g.n)} (count only)`).join(" · ")}
        </p>
      ) : null}
    </div>
  )
}

export function ComparisonRowsCard({
  rows,
  groupMeta,
}: {
  rows: NormalizedComparisonRow[]
  groupMeta: GroupMeta[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        {groupMeta.map((g, i) => (
          <span key={g.key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: g.meets_small_group_min ? GROUP_COLORS[i % GROUP_COLORS.length] : "var(--muted-foreground)",
              }}
            />
            {g.label}: {formatN(g.n_answered)} of {formatN(g.n_group)} answered ({g.coverage_pct}%)
            {!g.meets_small_group_min ? " — below reporting minimum, counts only" : ""}
          </span>
        ))}
      </div>
      <div>{rows.map((row) => <ComparisonRow key={row.option} row={row} />)}</div>
    </div>
  )
}

/** The accessible table view for the same comparison — one row per option, one column per group. */
export function ComparisonRowsTable({ rows, groupMeta }: { rows: NormalizedComparisonRow[]; groupMeta: GroupMeta[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Option</TableHead>
            {groupMeta.map((g) => (
              <TableHead key={g.key} className="text-right">
                {g.label}
              </TableHead>
            ))}
            <TableHead className="text-right">pp diff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.option}>
              <TableCell className="max-w-md whitespace-normal">{row.option}</TableCell>
              {row.groups.map((g) => (
                <TableCell key={g.key} className="text-right tabular-nums">
                  {g.countOnly ? `${formatN(g.n)} (count only)` : `${formatN(g.n)} (${g.pct}%)`}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums">
                {row.ppDiff === null ? "—" : `${row.ppDiff > 0 ? "+" : ""}${row.ppDiff.toFixed(1)} pp`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
