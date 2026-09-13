import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionHeading } from "./section-heading"

const POINTS = [
  {
    title: "What the data supports",
    body: "Unweighted, self-reported shares within a defined SEBI respondent sample: awareness, consideration, current holding, past securities-market investment, and — for the subset asked — selected barriers and encouragement factors, each with its own denominator. It also supports descriptive differences in those shares across income or previous-investment subgroups, reported as observed patterns in this specific sample.",
  },
  {
    title: "Why current non-holders include previous investors",
    body: "The focused group (n = 553) is defined by current non-holding of mutual funds only — it is not a “never invested” or “first-time SIP” sample. 136 of 553 (24.6%) report previous mutual-fund investment; 382 (69.1%) report none of 7 specific securities-market products; 35 (6.3%) report prior investment in another securities-market product but not MF.",
  },
  {
    title: "Why results are unweighted sample descriptions",
    body: "No survey weight (WeightMainM2, Weight_to_Sample) is applied anywhere in this study. Every share describes this specific unweighted sample, not a population-representative estimate — a deliberate, standing design choice for this stage's academic analysis.",
  },
  {
    title: "Why MF+ETF barriers cannot be presented as MF-only",
    body: "Every barrier and encouragement field (A11_D11–A15_D15, AA1_DD1–AA4_DD4) is asked only at the combined mutual-fund-plus-ETF level. No field in this workbook reports barriers or encouragement for mutual funds in isolation from ETFs/Gold ETFs.",
  },
  {
    title: "What this dataset cannot establish",
    body: "It cannot establish INDmoney conversion, any observed INDmoney app journey, or the cause of any reported barrier. This is a SEBI national household survey, with no link to INDmoney's own users, product funnel, or telemetry — it supports hypotheses worth investigating in INDmoney's own product research, not conclusions about INDmoney itself.",
  },
]

export function StudyScopeSection() {
  return (
    <section id="what-this-allows" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="what-this-allows-heading"
        title="What this dataset allows us to study"
        description="The research question this data can answer, and the boundaries around it."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            “What barriers and encouragement factors are reported by salaried Gen Z respondents who have
            considered mutual funds but do not currently hold them, and how do these differ by income and
            previous investment experience?”
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {POINTS.map((p) => (
            <div key={p.title}>
              <p className="font-medium text-foreground">{p.title}</p>
              <p className="mt-1 text-sm text-foreground/90">{p.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
