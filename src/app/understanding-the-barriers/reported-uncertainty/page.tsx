import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { ReportedUncertaintyTab } from "@/components/analysis/reported-uncertainty-tab"

export const metadata = {
  title: "Reported uncertainty — Understanding the barriers — SEBI Investor Survey 2025",
  description: "The financial-knowledge battery, the inflation numeracy check, and self-reported stock-market familiarity.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="reported-uncertainty">
      <ReportedUncertaintyTab />
    </AnalysisTopicPage>
  )
}
