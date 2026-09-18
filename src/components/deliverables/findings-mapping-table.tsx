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
import { findingsForTheme } from "@/lib/findings-register"

export function FindingsMappingTable() {
  return (
    <div className="rounded-lg border border-border">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-64 border-r border-border">KPIs</TableHead>
            <TableHead>Finding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {KPI_AND_MARKETING_GROUPS.flatMap((group, groupIndex) => {
            const findings = findingsForTheme(group.topicKey)
            return findings.map((f, findingIndex) => (
              <TableRow key={f.id}>
                {findingIndex === 0 ? (
                  <TableCell
                    rowSpan={findings.length}
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
                <TableCell className="whitespace-normal text-muted-foreground">
                  <Link
                    href={analysisHref(group.topicKey, f.supportingNumbers[0]?.evidence.chartId)}
                    className="hover:text-primary hover:underline hover:underline-offset-2"
                  >
                    {f.finding}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          })}
        </TableBody>
      </Table>
    </div>
  )
}
