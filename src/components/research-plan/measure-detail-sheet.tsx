"use client"

import type { ReactNode } from "react"
import Link from "next/link"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StatusBadge } from "./status-badge"
import type { Measure } from "@/lib/research-plan-data"

function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  )
}

/**
 * The "How calculated" (or, for an unresolved measure, "Why unavailable") detail sheet.
 * Reuses the project's existing Sheet component (base-ui Dialog underneath), which already
 * provides Escape-to-close and focus-return to the triggering button.
 */
export function MeasureDetailSheet({ measure: m }: { measure: Measure }) {
  const isCalculated = m.status === "calculated"
  const triggerLabel = isCalculated ? "How calculated" : "Why unavailable"
  const accessibleName = isCalculated ? `How “${m.name}” is calculated` : `Why “${m.name}” is unavailable`

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" aria-label={accessibleName}>
            {triggerLabel}
          </Button>
        }
      />
      <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex flex-wrap items-center gap-2">
            {m.name}
            <StatusBadge status={m.status} />
          </SheetTitle>
          <SheetDescription className="text-sm">{m.definition}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6 pb-6">
          {isCalculated ? (
            <>
              {m.details.calculationSteps ? (
                <SheetSection title="How it's calculated">
                  <ol className="list-decimal space-y-1.5 pl-5">
                    {m.details.calculationSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </SheetSection>
              ) : null}

              {m.details.workedExample ? (
                <SheetSection title="Worked example">
                  <p className="rounded-2xl border border-border bg-muted/30 p-3">{m.details.workedExample}</p>
                </SheetSection>
              ) : null}

              <SheetSection title="Who's included">
                <p>
                  {m.details.eligibleGroup} {m.details.productScope}
                </p>
                <p className="mt-1.5 text-muted-foreground">{m.details.missingHandling}</p>
              </SheetSection>

              <SheetSection title="Interpretation limits">
                <p className="text-muted-foreground">{m.details.limitations}</p>
              </SheetSection>

              {m.analysisHref ? (
                <Link href={m.analysisHref} className="text-sm text-primary underline underline-offset-2">
                  View analysis →
                </Link>
              ) : m.analysisLocation ? (
                <SheetSection title="Where this is shown">
                  <p className="text-muted-foreground">{m.analysisLocation}</p>
                </SheetSection>
              ) : null}
            </>
          ) : (
            <SheetSection title="Why this isn't available yet">
              <p>{m.unresolvedReason}</p>
              <p className="mt-1.5 text-muted-foreground">{m.details.limitations}</p>
            </SheetSection>
          )}

          <Accordion>
            <AccordionItem>
              <AccordionTrigger className="text-xs text-muted-foreground">Source details</AccordionTrigger>
              <AccordionContent className="space-y-2.5 text-xs text-muted-foreground">
                {m.details.fieldWordings.length > 0 ? (
                  m.details.fieldWordings.map((fw) => (
                    <p key={fw.code}>
                      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold text-foreground">
                        {fw.code}
                      </code>
                      <span className="ml-1.5 italic">&ldquo;{fw.wording}&rdquo;</span>
                    </p>
                  ))
                ) : (
                  <p>Field codes: {m.details.fields.join(", ")}</p>
                )}
                {m.details.selectionRules ? <p>{m.details.selectionRules}</p> : null}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
