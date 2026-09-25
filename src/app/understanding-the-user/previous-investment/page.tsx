import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { PreviousInvestmentTab } from "@/components/analysis/previous-investment-tab"

export const metadata = {
  title: "Previous investment and stopping reasons — Understanding the user — SEBI Investor Survey 2025",
  description: "Who in the focused group has invested before, and why some report having stopped.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="previous-investment">
      <PreviousInvestmentTab />
    </AnalysisTopicPage>
  )
}
