"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AvatarStack } from "@/components/presence/avatar-stack"
import { GroupDifferencesNavContext } from "@/components/analysis/group-differences-nav-context"
import { goToEvidenceElement } from "@/lib/dom-highlight"
import { TOPICS, TOPIC_METRIC, groupLabelForTopic, groupHomeUrl, type TopicKey } from "@/lib/analysis-topics"

/**
 * Shared chrome for each of the 9 topic pages (src/app/understanding-the-user/*,
 * src/app/understanding-the-barriers/*, src/app/reaching-and-engaging/*) — sidebar, breadcrumb,
 * the topic's title + one-line KPI/metric, and the Group Differences cross-navigation context
 * (only meaningfully used by that one topic's page, but harmless to provide everywhere so no
 * page needs its own special-cased wrapper). Each page.tsx just passes its own `topicKey` and
 * renders its one Tab component as `children` — there's no more shared multi-panel Tabs root,
 * since every topic is now its own real page instead of a `?topic=` query-param variant of one.
 */
export function AnalysisTopicPage({ topicKey, children }: { topicKey: TopicKey; children: React.ReactNode }) {
  const topic = TOPICS.find((t) => t.key === topicKey)!
  const groupLabel = groupLabelForTopic(topicKey)
  const groupUrl = groupHomeUrl(topicKey)

  // A deep link like /understanding-the-barriers/reported-barriers#barriers-selection-pct
  // already lands on the right page via normal routing — this only needs to scroll to (and
  // briefly highlight) the specific chart once mounted. Runs once per page load (never needs
  // to re-run on a topic change now, since a topic change is a fresh page load).
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    requestAnimationFrame(() => {
      goToEvidenceElement(hash)
    })
    window.history.replaceState(null, "", window.location.pathname)
  }, [])

  // Group Differences renders only one comparison card at a time (a select, not a tab set),
  // so a Findings evidence link that targets a specific comparison needs to ask it to switch
  // before the scroll/highlight above can find the target element.
  const [gdRequestedKey, setGdRequestedKey] = React.useState<string | null>(null)
  const groupDifferencesNav = React.useMemo(
    () => ({ selectComparison: setGdRequestedKey, requestedKey: gdRequestedKey }),
    [gdRequestedKey]
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">SEBI Investor Survey 2025</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={groupUrl}>{groupLabel}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{topic.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <AvatarStack />
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-6 md:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground md:text-2xl">{topic.label}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{TOPIC_METRIC[topicKey]}</p>
            </div>
            <GroupDifferencesNavContext.Provider value={groupDifferencesNav}>
              {children}
            </GroupDifferencesNavContext.Provider>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
