import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { KPI_AND_MARKETING_GROUPS, analysisHref } from "@/lib/deliverables-data"

export function KpiMappingTable() {
  return (
    <div className="rounded-lg border border-border">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-64 border-r border-border">KPIs</TableHead>
            <TableHead className="border-r border-border">Research question</TableHead>
            <TableHead>Measure / Metric</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {KPI_AND_MARKETING_GROUPS.flatMap((group, groupIndex) =>
            group.rows.map((row, rowIndex) => (
              <TableRow key={`${group.name}-${rowIndex}`}>
                {rowIndex === 0 ? (
                  <TableCell
                    rowSpan={group.rows.length}
                    className="border-r border-border align-top font-medium whitespace-normal text-foreground"
                  >
                    <Link
                      href={analysisHref(group.topicKey)}
                      className="hover:text-primary hover:underline hover:underline-offset-2"
                    >
                      {groupIndex + 1}. {group.name}
                    </Link>
                  </TableCell>
                ) : null}
                <TableCell className="border-r border-border whitespace-normal text-muted-foreground">
                  {row.chartId ? (
                    <Link
                      href={analysisHref(group.topicKey, row.chartId)}
                      className="hover:text-primary hover:underline hover:underline-offset-2"
                    >
                      {row.question}
                    </Link>
                  ) : (
                    row.question
                  )}
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {row.metric}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
