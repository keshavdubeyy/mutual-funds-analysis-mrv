import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { EncouragementFactorsTab } from "@/components/analysis/encouragement-factors-tab"

export const metadata = {
  title: "Encouragement factors — Reaching and engaging — SEBI Investor Survey 2025",
  description: "What the focused group reports would encourage them to consider investing in mutual funds/ETFs.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="encouragement-factors">
      <EncouragementFactorsTab />
    </AnalysisTopicPage>
  )
}
