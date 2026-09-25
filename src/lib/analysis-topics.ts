import {
  Target01Icon,
  AsteriskIcon,
  HistoryIcon,
  BrickWallShieldIcon,
  MessageQuestionIcon,
  UserGroupIcon,
  ThumbsUpIcon,
  NewspaperIcon,
  GraduationCapIcon,
} from "@hugeicons/core-free-icons"

/**
 * The 9 analysis topics, each its own real page (no more shared "Analysis" page or `?topic=`
 * query param) — grouped into the 3 top-level sidebar sections in GROUPS below. Shared between
 * every one of the 9 page.tsx files, the sidebar (src/components/app-sidebar.tsx), and anything
 * that links to a specific topic/chart (src/lib/deliverables-data.ts,
 * src/lib/research-plan-data.ts) — one source of truth so none of those can drift apart.
 */
export type TopicKey =
  | "motivations-financial-goals"
  | "reported-barriers"
  | "previous-investment"
  | "risk-preferences"
  | "reported-uncertainty"
  | "group-differences"
  | "awareness-media"
  | "encouragement-factors"
  | "learning-preferences"

export type GroupKey = "understanding-the-user" | "understanding-the-barriers" | "reaching-and-engaging"

export interface AnalysisTopic {
  key: TopicKey
  label: string
}

// Kept in the same order and using the same names as the Deliverables page's combined
// KPI/marketing-metric table (docs/deliverables.md, src/app/deliverables/page.tsx), so the two
// stay directly traceable to each other.
export const TOPICS: AnalysisTopic[] = [
  { key: "motivations-financial-goals", label: "Motivations and financial goals" },
  { key: "reported-barriers", label: "Reported barriers" },
  { key: "previous-investment", label: "Previous investment and stopping reasons" },
  { key: "risk-preferences", label: "Risk preferences and reactions" },
  { key: "reported-uncertainty", label: "Reported uncertainty" },
  { key: "group-differences", label: "Group differences" },
  { key: "awareness-media", label: "Awareness sources and media" },
  { key: "encouragement-factors", label: "Encouragement factors" },
  { key: "learning-preferences", label: "Learning preferences" },
]

/** The 3 top-level sidebar pages, each with the same 9 topics above split 3-and-3-and-3. A
 * group has no page of its own — its sidebar entry's url is just its first topic's page. */
export const GROUPS: { key: GroupKey; label: string; topics: TopicKey[] }[] = [
  { key: "understanding-the-user", label: "Understanding the user", topics: ["motivations-financial-goals", "risk-preferences", "previous-investment"] },
  { key: "understanding-the-barriers", label: "Understanding the barriers", topics: ["reported-barriers", "reported-uncertainty", "group-differences"] },
  { key: "reaching-and-engaging", label: "Reaching and engaging", topics: ["encouragement-factors", "awareness-media", "learning-preferences"] },
]

export const TOPIC_ICON: Record<TopicKey, typeof Target01Icon> = {
  "motivations-financial-goals": Target01Icon,
  "risk-preferences": AsteriskIcon,
  "previous-investment": HistoryIcon,
  "reported-barriers": BrickWallShieldIcon,
  "reported-uncertainty": MessageQuestionIcon,
  "group-differences": UserGroupIcon,
  "encouragement-factors": ThumbsUpIcon,
  "awareness-media": NewspaperIcon,
  "learning-preferences": GraduationCapIcon,
}

// One condensed line per topic, matching the "Measure / Metric" column of the Deliverables
// page's KPI table — shown under the topic title on its page so a reader sees what's actually
// being measured before the charts.
export const TOPIC_METRIC: Record<TopicKey, string> = {
  "motivations-financial-goals": "% selecting each motivation / financial goal",
  "reported-barriers": "% selecting each reported barrier",
  "previous-investment": "% in each previous-investment category and each stopping reason",
  "risk-preferences": "% selecting each risk/return preference and downturn reaction",
  "reported-uncertainty": "% selecting “Not Aware” or the correct response on each knowledge item",
  "group-differences": "Percentage-point differences in barriers, encouragement, and knowledge across groups",
  "awareness-media": "% citing each awareness source and media channel",
  "encouragement-factors": "% selecting each encouragement factor",
  "learning-preferences": "% preferring each education format, medium, topic, and language",
}

function groupFor(key: TopicKey) {
  const group = GROUPS.find((g) => g.topics.includes(key))
  if (!group) throw new Error(`analysis-topics: no group contains topic "${key}"`)
  return group
}

export function topicLabel(key: TopicKey): string {
  return TOPICS.find((t) => t.key === key)!.label
}

/** e.g. "/understanding-the-barriers/reported-barriers" — the topic's own real page. */
export function topicPageUrl(key: TopicKey): string {
  return `/${groupFor(key).key}/${key}`
}

/** "Understanding the barriers" for "reported-barriers", etc. */
export function groupLabelForTopic(key: TopicKey): string {
  return groupFor(key).label
}

/** A group has no page of its own — its "home" is just its first topic's page, same URL the
 * sidebar's top-level entry for that group already links to. */
export function groupHomeUrl(key: TopicKey): string {
  return topicPageUrl(groupFor(key).topics[0])
}

/** A topic's page, optionally deep-linked to one chart on it via `#chartId`. */
export function analysisHref(key: TopicKey, chartId?: string): string {
  return chartId ? `${topicPageUrl(key)}#${chartId}` : topicPageUrl(key)
}
