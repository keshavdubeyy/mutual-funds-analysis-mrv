"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import {
  whoIsInSampleBase,
  formatN,
  PREV_INVESTMENT_LABEL,
} from "@/lib/who-is-in-sample-data"

function FactsTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="text-sm font-normal">Field</TableHead>
            <TableHead className="text-right text-sm font-normal">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="text-sm">{r.label}</TableCell>
              <TableCell className="text-right text-sm font-medium tabular-nums">{r.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function BreakdownTable({
  title,
  rows,
}: {
  title: string
  rows: { label: string; n: number }[]
}) {
  return (
    <div>
      <p className="mb-2 text-base font-medium text-foreground">{title}</p>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="text-sm font-normal">Category</TableHead>
              <TableHead className="text-right text-sm font-normal">Count</TableHead>
              <TableHead className="text-right text-sm font-normal">Percent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="text-sm">{r.label}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{formatN(r.n)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {((100 * r.n) / whoIsInSampleBase.focused_group_size).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/**
 * Dataset-level "who is this sample" summary — always the full, unfiltered
 * 553-respondent baseline (public/data/findings/who_is_in_sample.json), shown
 * regardless of which Findings tab or filter is active. Not the "Who is in
 * our sample?" tab's live filtered count — this is fixed context about the
 * study's sample, not a chart.
 */
export function SampleOverviewSheet() {
  const { sample_overview, filter_options, focused_group_size } = whoIsInSampleBase

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} data-icon="inline-start" />
            Sample overview
          </Button>
        }
      />
      <SheetContent side="right" className="overflow-y-auto sm:max-w-[33.6rem]!">
        <SheetHeader>
          <SheetTitle>Sample overview</SheetTitle>
          <SheetDescription className="text-sm">
            A quick look at the 553 people in this research group — who they are, where they live, and their
            investing experience.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-6 pb-6">
          <FactsTable
            rows={[
              { label: "Respondents", value: formatN(focused_group_size) },
              { label: "Age band", value: sample_overview.age_band },
            ]}
          />

          <p className="text-sm leading-relaxed text-foreground">
            Everyone in this sample works in a documented salaried occupation, and was included because they said
            they&apos;d consider mutual funds but don&apos;t currently hold any.
          </p>

          <BreakdownTable
            title="Urban / Rural"
            rows={filter_options.urbanrural.map((o) => ({ label: o.value, n: o.n }))}
          />

          <BreakdownTable
            title="Personal-income group"
            rows={filter_options.income_tier.map((o) => ({ label: o.tier, n: o.n }))}
          />

          <BreakdownTable
            title="Previous MF investment experience"
            rows={filter_options.prev_mf_investment_class.map((o) => ({
              label: PREV_INVESTMENT_LABEL[o.cls] ?? o.cls,
              n: o.n,
            }))}
          />

          <p className="text-sm text-muted-foreground">
            This describes the selected survey sample only — not a persona, a typical respondent, or any
            individual&apos;s exact age.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
