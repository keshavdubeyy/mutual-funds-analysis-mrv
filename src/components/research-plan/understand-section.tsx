import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/dataset-method/section-heading"
import { ORIGINAL_BUSINESS_QUESTION, RESEARCH_QUESTION, FUTURE_BUSINESS_GOAL, OBJECTIVES } from "@/lib/research-plan-data"

const FACT_PILLS = ["553 people", "Ages 18–28", "Considered mutual funds, don't hold them today"]

export function UnderstandSection() {
  return (
    <section id="research-plan-understand" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="research-plan-understand-heading"
        title="What we want to understand"
        description="Every result on this page describes the 553 people in our focused group, or a smaller number who answered that specific question — not INDmoney's own users, and not all of India."
      />

      <div className="space-y-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              The original question
            </CardTitle>
            <CardDescription className="text-base text-foreground">{ORIGINAL_BUSINESS_QUESTION}</CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm" className="ring-primary/20">
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              What our survey data can actually answer
            </CardTitle>
            <CardDescription className="text-base text-foreground">{RESEARCH_QUESTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FACT_PILLS.map((p) => (
                <Badge key={p} variant="secondary" className="font-normal">
                  {p}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Where this is headed
            </CardTitle>
            <CardDescription className="text-base text-foreground">{FUTURE_BUSINESS_GOAL}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OBJECTIVES.map((o) => (
          <Card key={o.n} size="sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {o.n}
                </span>
                <CardTitle className="text-sm">{o.title}</CardTitle>
              </div>
              <CardDescription>{o.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
