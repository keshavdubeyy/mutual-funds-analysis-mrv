import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { RespondentDataTab } from "@/components/findings/respondent-data-tab"
import { WhoIsInSampleTab } from "@/components/findings/who-is-in-sample-tab"
import { SampleOverviewSheet } from "@/components/findings/sample-overview-sheet"
import { HugeiconsIcon } from "@hugeicons/react"
import { ConstructionIcon } from "@hugeicons/core-free-icons"

export const metadata = {
  title: "Findings — SEBI Investor Survey 2025",
  description:
    "Reported barriers and encouragement factors among salaried Gen Z respondents who considered mutual funds but do not currently hold them.",
}

export default function Home() {
  // Respondent-level inspection is a local development tool only. The actual gate is
  // server-side (src/app/api/dev/respondent-table/route.ts refuses outside next dev) —
  // this just avoids showing a tab that would only ever report itself unavailable in
  // a production build.
  const respondentTabEnabled = process.env.NODE_ENV !== "production"

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Findings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-6 md:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Findings</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Barriers and encouragement factors reported by salaried Gen Z respondents (SEBI Investor Survey
                2025) who considered mutual funds but do not currently hold them. Unweighted, descriptive only.
              </p>
            </div>

            <Tabs defaultValue="who-is-in-sample">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsList>
                  <TabsTrigger value="who-is-in-sample">Who is in our sample?</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  {respondentTabEnabled ? (
                    <TabsTrigger value="respondent-data">Respondent data</TabsTrigger>
                  ) : null}
                </TabsList>
                <SampleOverviewSheet />
              </div>
              <TabsContent value="who-is-in-sample" className="pt-4">
                <WhoIsInSampleTab filteringEnabled={respondentTabEnabled} />
              </TabsContent>
              <TabsContent value="analysis" className="pt-4">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <HugeiconsIcon icon={ConstructionIcon} strokeWidth={2} />
                    </EmptyMedia>
                    <EmptyTitle>Work in progress</EmptyTitle>
                    <EmptyDescription>
                      We&apos;re still working out the right KPIs for this analysis. Check back soon.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
              {respondentTabEnabled ? (
                <TabsContent value="respondent-data" className="pt-4">
                  <RespondentDataTab />
                </TabsContent>
              ) : null}
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
