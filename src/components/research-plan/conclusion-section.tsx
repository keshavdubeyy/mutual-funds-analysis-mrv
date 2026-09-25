import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/dataset-method/section-heading"
import {
  CONCLUSION_INTRO,
  CONCLUSION_PROPOSALS,
  FUTURE_COMPANY_KPIS_INTRO,
  FUTURE_COMPANY_KPIS,
} from "@/lib/research-plan-data"
import { analysisHref, TOPICS } from "@/lib/analysis-topics"

export function ConclusionSection() {
  return (
    <section id="research-plan-conclusion" className="scroll-mt-20 space-y-6">
      <SectionHeading id="research-plan-conclusion-heading" title="Conclusion" description={CONCLUSION_INTRO} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONCLUSION_PROPOSALS.map((p) => (
          <Card key={p.title} size="sm">
            <CardHeader>
              <CardTitle className="text-sm">{p.title}</CardTitle>
              <CardDescription>{p.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Link
        href={analysisHref(TOPICS[0].key)}
        className="inline-block text-sm text-primary underline underline-offset-2 dark:text-white"
      >
        See the full evidence behind these proposals →
      </Link>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            Future company KPIs
            <Badge variant="outline" className="font-normal">
              Not calculable from this dataset
            </Badge>
          </CardTitle>
          <CardDescription>{FUTURE_COMPANY_KPIS_INTRO}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {FUTURE_COMPANY_KPIS.map((k) => (
            <div key={k.name} className="rounded-2xl border border-border p-3">
              <p className="text-sm font-medium text-foreground">{k.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.definition}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
