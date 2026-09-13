import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { StatBar } from "./stat-bar"
import { SectionHeading } from "./section-heading"
import { coverage, formatN } from "@/lib/dataset-method-data"

export function CoverageSection() {
  const { focused_group_size, note, fields, previous_investment_q24a } = coverage

  return (
    <section id="how-much-information-is-available" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="how-much-information-is-available-heading"
        title="How much information is available within the selected group"
        description={`Being selected into the focused group (n = ${focused_group_size}) does not mean answering every question — each field has its own denominator.`}
      />

      <div className="rounded-2xl border border-border px-4 py-3 text-sm text-foreground/90">{note}</div>

      <Card>
        <CardHeader>
          <CardTitle>Coverage per barrier / encouragement field</CardTitle>
          <CardDescription>
            Full focused group: {formatN(focused_group_size)}. Each bar is answered-count out of 553 for that
            specific field — bars are never added together across fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.map((f) => (
            <div key={f.field_code} className="space-y-1.5">
              <StatBar
                label={`${f.field_code}`}
                value={f.n_substantive_answer}
                total={f.focused_group_size}
                valueLabel={`${formatN(f.n_substantive_answer)} of ${formatN(f.focused_group_size)} answered`}
                barClassName={f.suitable_for_descriptive_analysis ? "bg-primary" : "bg-muted-foreground/40"}
              />
              <div className="flex flex-wrap items-center gap-2 pl-0.5 text-xs text-muted-foreground">
                <Badge variant={f.suitable_for_descriptive_analysis ? "default" : "outline"} className="font-normal">
                  {f.suitable_for_descriptive_analysis ? "Used descriptively in this study" : "Not used — wrong population or unresolved routing"}
                </Badge>
                <span>{f.n_blank_unrecorded.toLocaleString("en-IN")} blank/unrecorded</span>
              </div>
              <Accordion>
                <AccordionItem>
                  <AccordionTrigger className="text-xs text-muted-foreground">
                    Routing evidence and question wording
                  </AccordionTrigger>
                  <AccordionContent className="text-xs">
                    <p className="italic">“{f.question_wording}”</p>
                    <p className="mt-2">
                      <span className="font-medium text-foreground">Intended respondent group: </span>
                      {f.intended_respondent_group}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-foreground">Evidence: </span>
                      {f.routing_evidence}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous mutual-fund investment (Q24A)</CardTitle>
          <CardDescription>
            {previous_investment_q24a.n_blank === 0
              ? `Answered by all ${formatN(previous_investment_q24a.denominator)} focused-group members (0 blank) — a 3-way grouping variable, not a summary percentage.`
              : `${previous_investment_q24a.n_blank} blank of ${formatN(previous_investment_q24a.denominator)}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {previous_investment_q24a.categories.map((c) => (
            <div key={c.category_fine} className="space-y-1">
              <StatBar
                label={c.category_fine.replace(/_/g, " ")}
                value={c.n}
                total={previous_investment_q24a.denominator}
              />
              <p className="pl-0.5 text-xs text-muted-foreground">{c.rollup}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
