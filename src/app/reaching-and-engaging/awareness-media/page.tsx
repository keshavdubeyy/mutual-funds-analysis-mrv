import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { AwarenessMediaTab } from "@/components/analysis/awareness-media-tab"

export const metadata = {
  title: "Awareness sources and media — Reaching and engaging — SEBI Investor Survey 2025",
  description: "Where the focused group reports hearing about mutual funds/ETFs, and through which media.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="awareness-media">
      <AwarenessMediaTab />
    </AnalysisTopicPage>
  )
}
