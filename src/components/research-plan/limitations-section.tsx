import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/components/dataset-method/section-heading"
import { LIMITATIONS } from "@/lib/research-plan-data"

export function LimitationsSection() {
  return (
    <section id="research-plan-limitations" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="research-plan-limitations-heading"
        title="Limitations"
        description="What this project is not, and cannot show — stated once here rather than as a pending task."
      />

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">This project studies survey responses, not INDmoney&apos;s own performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {LIMITATIONS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
