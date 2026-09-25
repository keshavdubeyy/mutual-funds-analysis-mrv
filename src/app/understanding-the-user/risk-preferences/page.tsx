import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { RiskPreferencesTab } from "@/components/analysis/risk-preferences-tab"

export const metadata = {
  title: "Risk preferences and reactions — Understanding the user — SEBI Investor Survey 2025",
  description: "Self-reported risk/return preferences and how respondents say they'd react to a market downturn.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="risk-preferences">
      <RiskPreferencesTab />
    </AnalysisTopicPage>
  )
}
