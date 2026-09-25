import { AnalysisTopicPage } from "@/components/analysis/analysis-topic-page"
import { GroupDifferencesTab } from "@/components/analysis/group-differences-tab"

export const metadata = {
  title: "Group differences — Understanding the barriers — SEBI Investor Survey 2025",
  description: "How reported barriers, encouragement, and knowledge differ by previous investment experience, income, and risk preference.",
}

export default function Page() {
  return (
    <AnalysisTopicPage topicKey="group-differences">
      <GroupDifferencesTab />
    </AnalysisTopicPage>
  )
}
