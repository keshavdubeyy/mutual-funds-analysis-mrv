import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionHeading } from "./section-heading"
import { SelectionPath } from "./selection-path"
import { sampleSelection, formatN } from "@/lib/dataset-method-data"

export function SampleSelectionSection() {
  const { steps, occupation_table, broader_group_holding_status_note } = sampleSelection

  return (
    <section id="how-we-selected-the-sample" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="how-we-selected-the-sample-heading"
        title="How we narrowed the dataset"
        description="Each step keeps the respondents relevant to our research question."
      />
      <p className="text-xs text-muted-foreground">Research selection — not investment drop-offs.</p>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Selection path</CardTitle>
          <CardDescription>109,430 total respondent records → 553 in the final focused group.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="path">
            <TabsList>
              <TabsTrigger value="path">Path</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="path" className="pt-3">
              <div className="mx-auto max-w-xl">
                <SelectionPath steps={steps} occupationTable={occupation_table} />
              </div>
            </TabsContent>
            <TabsContent value="table" className="pt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>Entering</TableHead>
                    <TableHead>Retained</TableHead>
                    <TableHead>Known excluded</TableHead>
                    <TableHead>Unknown / ambiguous</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((s) => (
                    <TableRow key={s.step}>
                      <TableCell className="max-w-xs whitespace-normal font-medium">
                        {s.step}. {s.label}
                        {s.retained === s.entering && s.excluded === 0 && s.unknown_or_ambiguous === 0 ? (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">(check)</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="tabular-nums">{formatN(s.entering)}</TableCell>
                      <TableCell className="tabular-nums">{formatN(s.retained)}</TableCell>
                      <TableCell className="tabular-nums">{formatN(s.excluded)}</TableCell>
                      <TableCell className="tabular-nums">{formatN(s.unknown_or_ambiguous)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>A separate, related count: unknown MF-holding status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/90">{broader_group_holding_status_note.text}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>n</TableHead>
                <TableHead>% of known status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {broader_group_holding_status_note.data.map((row) => (
                <TableRow key={row.status}>
                  <TableCell className="capitalize">{row.status.replace(/_/g, " ")}</TableCell>
                  <TableCell className="tabular-nums">{formatN(row.n)}</TableCell>
                  <TableCell className="tabular-nums">
                    {row.pct_of_known !== null ? `${row.pct_of_known}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
