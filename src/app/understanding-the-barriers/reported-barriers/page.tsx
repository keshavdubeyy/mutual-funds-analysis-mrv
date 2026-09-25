import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { ReportedBarriersTab } from "@/components/analysis/reported-barriers-tab"

export const metadata = {
  title: "Reported barriers — Understanding the barriers — SEBI Investor Survey 2025",
  description: "Reasons the focused group reports for not currently investing in mutual funds/ETFs.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="reported-barriers">
      <ReportedBarriersTab />
    </AnalysisTopicPage>
  )
}
