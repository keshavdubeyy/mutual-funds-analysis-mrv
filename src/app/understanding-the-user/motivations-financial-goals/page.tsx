import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { MotivationsFinancialGoalsTab } from "@/components/analysis/motivations-financial-goals-tab"

export const metadata = {
  title: "Motivations and financial goals — Understanding the user — SEBI Investor Survey 2025",
  description: "Reported reasons for considering mutual funds and the financial goals this group ranks highest.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="motivations-financial-goals">
      <MotivationsFinancialGoalsTab />
    </AnalysisTopicPage>
  )
}
