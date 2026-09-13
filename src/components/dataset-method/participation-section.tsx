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
import { StatBar } from "./stat-bar"
import { SectionHeading } from "./section-heading"
import { participation, formatN } from "@/lib/dataset-method-data"

export function ParticipationSection() {
  const { total_respondent_records, listing_only, main_survey, qfl_split, int_type_split, notes } = participation

  return (
    <section id="survey-participation" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="survey-participation-heading"
        title="Survey participation"
        description="Every respondent went through an initial screening stage (Listing); a subset then completed the detailed Mains section this study relies on."
      />

      <Card>
        <CardHeader>
          <CardTitle>Listing vs. Mains completion</CardTitle>
          <CardDescription>
            All {formatN(total_respondent_records)} respondent records, split by how far they got.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="space-y-4 pt-4">
              <StatBar
                label="Main-survey respondents (completed Mains)"
                value={main_survey}
                total={total_respondent_records}
              />
              <StatBar
                label="Listing-only records (screened, did not proceed to Mains)"
                value={listing_only}
                total={total_respondent_records}
                barClassName="bg-muted-foreground/40"
              />
            </TabsContent>
            <TabsContent value="table" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Share of total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Main-survey respondents</TableCell>
                    <TableCell className="tabular-nums">{formatN(main_survey)}</TableCell>
                    <TableCell className="tabular-nums">
                      {((main_survey / total_respondent_records) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Listing-only records</TableCell>
                    <TableCell className="tabular-nums">{formatN(listing_only)}</TableCell>
                    <TableCell className="tabular-nums">
                      {((listing_only / total_respondent_records) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="tabular-nums font-medium">{formatN(total_respondent_records)}</TableCell>
                    <TableCell className="tabular-nums font-medium">100.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investor / Non-Investor classification (QFL)</CardTitle>
            <CardDescription>
              A separate Listing-stage classification — kept apart from survey stage below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qfl_split.map((o) => (
              <StatBar key={o.label} label={o.label} value={o.n} total={total_respondent_records} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample type (INT_TYPE)</CardTitle>
            <CardDescription>Random vs. supplementary booster sample.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {int_type_split.map((o) => (
              <StatBar key={o.label} label={o.label} value={o.n} total={total_respondent_records} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2 rounded-2xl border border-border p-4 text-sm text-foreground/90">
        {notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
      </div>
    </section>
  )
}
