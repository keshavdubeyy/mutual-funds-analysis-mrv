import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { overview, formatN } from "@/lib/dataset-method-data"
import { SectionHeading } from "./section-heading"

export function DatasetOverviewSection() {
  return (
    <section id="dataset-introduction" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="dataset-introduction-heading"
        title="Dataset introduction"
        description="What this data is, who published it, and which of its two workbooks this study actually uses."
      />

      <Card>
        <CardHeader>
          <CardTitle>{overview.dataset_name}</CardTitle>
          <CardDescription>
            Publisher: {overview.publisher}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Official source:{" "}
            <a
              href={overview.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-3 hover:text-primary/80 dark:text-white dark:hover:text-white/80"
            >
              sebi.gov.in — Investor Survey 2025
            </a>
          </p>
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Survey year vs. publication date
            </p>
            <p className="mt-1.5 text-foreground/90">{overview.survey_vs_publication_note}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              What it investigates
            </p>
            <p className="mt-1.5 text-foreground/90">{overview.what_it_investigates}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              What a respondent record is
            </p>
            <p className="mt-1.5 text-foreground/90">{overview.record_definition}</p>
          </div>
          <p className="rounded-2xl border border-border px-4 py-3 text-foreground/90">
            {overview.not_indmoney_data}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two workbooks, two different units of analysis</CardTitle>
          <CardDescription>{overview.header_structure}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workbook</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Used here?</TableHead>
                <TableHead>What it covers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview.workbooks.map((wb) => (
                <TableRow key={wb.file}>
                  <TableCell className="font-medium whitespace-normal">
                    {wb.file}
                    <div className="text-xs text-muted-foreground">sheet “{wb.sheet}”</div>
                  </TableCell>
                  <TableCell className="tabular-nums">{formatN(wb.records)}</TableCell>
                  <TableCell className="tabular-nums">{formatN(wb.columns)}</TableCell>
                  <TableCell>
                    {wb.used_in_this_study ? (
                      <Badge>Used</Badge>
                    ) : (
                      <Badge variant="outline">Kept separate</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                    {wb.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-sm text-foreground/90">{overview.why_respondent_workbook_only}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Throughout this page, workbook rows are called <strong>records</strong> and workbook fields are
            called <strong>columns</strong> — not “automatically completed surveys” or “questions.” Section 3
            explains which columns are genuine survey questions versus metadata or derived fields.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
