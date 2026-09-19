import Link from "next/link"
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
import { WhoIsInSampleTab } from "@/components/findings/who-is-in-sample-tab"
import { SampleOverviewSheet } from "@/components/findings/sample-overview-sheet"

export const metadata = {
  title: "Who is in our sample? — Findings — SEBI Investor Survey 2025",
  description:
    "Who the 553 selected salaried Gen Z respondents are — demographics, preferences, income, and reported knowledge.",
}

export default function WhoIsInSamplePage() {
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link href="/findings/who-is-in-sample" />}>Findings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Who is in our sample?</BreadcrumbPage>
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-3xl">
                <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Who is in our sample?</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  553 salaried Gen Z respondents (SEBI Investor Survey 2025) who considered mutual funds but do not
                  currently hold them. Unweighted, descriptive only.
                </p>
              </div>
              <SampleOverviewSheet />
            </div>

            <WhoIsInSampleTab filteringEnabled={respondentTabEnabled} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
