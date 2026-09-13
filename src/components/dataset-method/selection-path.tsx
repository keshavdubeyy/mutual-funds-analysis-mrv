"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
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
import type { FunnelStep, OccupationRow } from "@/lib/dataset-method-data"
import { formatN } from "@/lib/dataset-method-data"

// Schematic funnel widths (percent of the graphic's own width) at each boundary —
// five trapezoids (the starting 109,430 total, then the result of each of the four
// filters), six boundaries. These control layout only; they are not derived from the
// counts and never displayed as if they were proportional to them (a true 109,430 -> 553
// taper would render the final block as an invisible sliver).
const FUNNEL_WIDTHS = [100, 90, 78, 66, 54, 42]

// Presentation-only text layered on top of the verified step data (entering/retained/
// excluded/unknown_or_ambiguous, rule, why, detail all come from sample_selection.json —
// nothing here changes a count, a filter, or the order they're applied in). Notes are
// kept short deliberately so they read in at most two lines beside the funnel.
const STEP_COPY: Record<number, { name: string; excludedNote?: string; unknownNote?: string }> = {
  1: { name: "Completed the main survey", excludedNote: "Listing-only records" },
  2: { name: "Gen Z (ages 18–28)", excludedNote: "Outside the Gen Z age band" },
  3: {
    name: "Salaried occupation",
    excludedNote: "Documented non-salaried category",
    unknownNote: "Occupation not clearly classifiable",
  },
  4: {
    name: "Selected respondents",
    excludedNote: "Didn’t select mutual funds",
    unknownNote: "Consideration answer missing",
  },
}

function shadeStyle(i: number, total: number) {
  const whiteMix = Math.round((i / (total - 1)) * 60) // 0% .. 60% white mixed into primary
  return { backgroundColor: `color-mix(in oklch, var(--primary) ${100 - whiteMix}%, white)` }
}

function ExclusionLine({ tone, n, label }: { tone: "grey" | "amber"; n: number; label?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${tone === "amber" ? "bg-chart-4" : "bg-muted-foreground/50"}`}
      />
      <div>
        <p className={`text-sm leading-tight font-semibold tabular-nums ${tone === "amber" ? "text-chart-4" : "text-foreground"}`}>
          {formatN(n)} {tone === "amber" ? "unknown" : "left out"}
        </p>
        {label ? <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{label}</p> : null}
      </div>
    </div>
  )
}

function StepDetailSheet({
  step,
  stepName,
  style,
  occupationTable,
  children,
}: {
  step: FunnelStep
  stepName: string
  style: React.CSSProperties
  occupationTable?: OccupationRow[]
  children: React.ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger
        className="group relative mx-auto flex w-full max-w-[300px] cursor-pointer flex-col items-center justify-start pt-5 pb-4 text-center transition-[filter] outline-none hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={style}
        aria-label={`Why this filter — ${stepName}`}
      >
        {children}
        <HugeiconsIcon
          icon={InformationCircleIcon}
          strokeWidth={2}
          className="absolute top-2 right-2 size-3.5 text-white/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Step {step.step} · {stepName}
          </SheetTitle>
          <SheetDescription>What this filter does, and why, in plain terms — then the exact rule and evidence behind it.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 text-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {formatN(step.entering)} entering
            </Badge>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />
            <Badge className="font-normal">{formatN(step.retained)} retained</Badge>
          </div>
          {step.excluded > 0 || step.unknown_or_ambiguous > 0 ? (
            <div className="space-y-3 rounded-2xl border border-border p-4">
              {step.excluded > 0 ? (
                <ExclusionLine tone="grey" n={step.excluded} label={STEP_COPY[step.step]?.excludedNote} />
              ) : null}
              {step.unknown_or_ambiguous > 0 ? (
                <ExclusionLine tone="amber" n={step.unknown_or_ambiguous} label={STEP_COPY[step.step]?.unknownNote} />
              ) : null}
            </div>
          ) : null}
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">In plain terms</p>
            <p className="mt-1.5 text-foreground/90">{step.why}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Exact selection rule</p>
            <p className="mt-1.5 text-foreground/90">{step.rule}</p>
          </div>
          {step.detail?.excluded_breakdown ? <p className="text-foreground/80">{step.detail.excluded_breakdown}</p> : null}
          {step.detail?.ambiguous_breakdown ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Ambiguous breakdown</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>n</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {step.detail.ambiguous_breakdown.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="max-w-md whitespace-normal">{row.label}</TableCell>
                      <TableCell className="tabular-nums">{formatN(row.n)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {step.detail.ambiguous_note ? <p className="mt-2 text-muted-foreground">{step.detail.ambiguous_note}</p> : null}
            </div>
          ) : null}
          {occupationTable ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Full occupation classification (Q14), all 34 values</p>
              <div className="max-h-64 overflow-y-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Classification</TableHead>
                      <TableHead>Q14 value</TableHead>
                      <TableHead>n</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occupationTable.map((row) => (
                      <TableRow key={row.Q14}>
                        <TableCell>
                          <Badge
                            variant={row.class.startsWith("included") ? "default" : row.class.startsWith("ambiguous") ? "outline" : "secondary"}
                            className="font-normal"
                          >
                            {row.class.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs whitespace-normal">{row.Q14}</TableCell>
                        <TableCell className="tabular-nums">{formatN(row.n)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-2 text-muted-foreground">
                Sourced from the SEBI Investor Survey 2025 Main Report Annexure, pp.104–106 — not this study&apos;s own
                grouping.
              </p>
            </div>
          ) : null}
          {step.detail?.unknown_breakdown ? <p className="text-foreground/80">{step.detail.unknown_breakdown}</p> : null}
          {step.detail?.unknown_comparison ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Blank vs. answered comparison</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>n</TableHead>
                    <TableHead>QFL Investor %</TableHead>
                    <TableHead>Holds MF %</TableHead>
                    <TableHead>Q25A also blank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {step.detail.unknown_comparison.map((row) => (
                    <TableRow key={String(row.group)}>
                      <TableCell className="max-w-xs whitespace-normal">{row.group}</TableCell>
                      <TableCell className="tabular-nums">{row.n}</TableCell>
                      <TableCell className="tabular-nums">{row.QFL_INVESTOR_pct}%</TableCell>
                      <TableCell className="tabular-nums">{row.holds_mf_pct}%</TableCell>
                      <TableCell className="tabular-nums">
                        {row.Q25A_also_blank} ({row.Q25A_also_blank_pct}%)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface FunnelBox {
  value: number
  label: string
  clickableStep: FunnelStep | null
  exclusionStep: FunnelStep | null
}

export function SelectionPath({ steps, occupationTable }: { steps: FunnelStep[]; occupationTable: OccupationRow[] }) {
  // Steps 1-4 narrow the sample; step 5 (Q22A_All interpretability) retains everyone
  // (553 of 553, 0 excluded, 0 unknown) — a consistency check, not a further reduction —
  // so it is noted under the funnel rather than drawn as its own segment.
  const funnelSteps = steps.filter((s) => s.step <= 4)
  const checkStep = steps.find((s) => s.step === 5)

  const boxes: FunnelBox[] = [
    { value: funnelSteps[0]?.entering ?? 0, label: "Total respondent records", clickableStep: null, exclusionStep: funnelSteps[0] ?? null },
    ...funnelSteps.map((step, i) => ({
      value: step.retained,
      label: STEP_COPY[step.step]?.name ?? step.label,
      clickableStep: step,
      exclusionStep: funnelSteps[i + 1] ?? null,
    })),
  ]

  return (
    <div>
      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-2 xl:grid-cols-[minmax(0,300px)_1fr]">
        {boxes.map((box, i) => {
          const copy = box.clickableStep ? STEP_COPY[box.clickableStep.step] : undefined
          const topPct = FUNNEL_WIDTHS[i]
          const bottomPct = FUNNEL_WIDTHS[i + 1]
          const whiteMix = Math.round((i / (boxes.length - 1)) * 60)
          const useDarkText = whiteMix > 35
          const isLast = i === boxes.length - 1

          const boxStyle: React.CSSProperties = {
            ...shadeStyle(i, boxes.length),
            clipPath: `polygon(${(100 - topPct) / 2}% 0, ${(100 + topPct) / 2}% 0, ${(100 + bottomPct) / 2}% 100%, ${(100 - bottomPct) / 2}% 100%)`,
          }
          const boxInner = (
            <>
              <p className={`font-bold tabular-nums ${isLast ? "text-3xl" : "text-2xl"} ${useDarkText ? "text-foreground" : "text-white"}`}>
                {formatN(box.value)}
              </p>
              <p className={`mt-0.5 line-clamp-2 text-xs font-medium ${useDarkText ? "text-foreground/80" : "text-white/90"}`}>
                {box.label}
              </p>
            </>
          )

          return (
            <React.Fragment key={i}>
              {box.clickableStep && copy ? (
                <StepDetailSheet
                  step={box.clickableStep}
                  stepName={copy.name}
                  style={boxStyle}
                  occupationTable={box.clickableStep.step === 3 ? occupationTable : undefined}
                >
                  {boxInner}
                </StepDetailSheet>
              ) : (
                <div
                  className="mx-auto flex w-full max-w-[300px] flex-col items-center justify-start pt-5 pb-4 text-center"
                  style={boxStyle}
                >
                  {boxInner}
                </div>
              )}

              {box.exclusionStep && box.exclusionStep.excluded > 0 ? (
                <div className="flex flex-col justify-center py-1">
                  <ExclusionLine
                    tone="grey"
                    n={box.exclusionStep.excluded}
                    label={STEP_COPY[box.exclusionStep.step]?.excludedNote}
                  />
                </div>
              ) : (
                <div />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Schematic widths — counts show actual sample sizes. Tap a funnel stage for why that filter is applied.
      </p>

      <div className="mt-4 border-t border-border pt-4 text-center text-sm text-foreground/80">
        <p>
          <span className="font-medium text-foreground">Selected respondents</span> — salaried Gen Z who considered
          mutual funds and do not currently hold them.
        </p>
        {checkStep ? (
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Confirmed by a final consistency check: all {formatN(checkStep.retained)} of {formatN(checkStep.entering)}{" "}
            have an interpretable, MF-free holdings answer (0 excluded, 0 unknown — this step doesn&apos;t narrow the
            group further).
          </p>
        ) : null}
      </div>
    </div>
  )
}
