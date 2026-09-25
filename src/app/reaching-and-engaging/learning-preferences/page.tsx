import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { LearningPreferencesTab } from "@/components/analysis/learning-preferences-tab"

export const metadata = {
  title: "Learning preferences — Reaching and engaging — SEBI Investor Survey 2025",
  description: "Preferred investor-education format, medium, topics, and language for the focused group.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="learning-preferences">
      <LearningPreferencesTab />
    </AnalysisTopicPage>
  )
}
