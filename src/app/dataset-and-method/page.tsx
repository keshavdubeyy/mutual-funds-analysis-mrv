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
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Table02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { AvatarStack } from "@/components/presence/avatar-stack"
import { SectionNav } from "@/components/dataset-method/section-nav"
import { DatasetOverviewSection } from "@/components/dataset-method/dataset-overview-section"
import { ParticipationSection } from "@/components/dataset-method/participation-section"
import { QuestionExplorerSection } from "@/components/dataset-method/question-explorer-section"
import { DataQualitySection } from "@/components/dataset-method/data-quality-section"
import { SampleSelectionSection } from "@/components/dataset-method/sample-selection-section"
import { CoverageSection } from "@/components/dataset-method/coverage-section"
import { StudyScopeSection } from "@/components/dataset-method/study-scope-section"

export const metadata = {
  title: "Dataset and Method — SEBI Investor Survey 2025",
  description:
    "What the SEBI Investor Survey 2025 data is, how the research sample was selected, and what it can and cannot establish.",
}

export default function DatasetAndMethodPage() {
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Dataset and Method</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <AvatarStack />
            <Link href="/dataset-and-method/view-data" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <HugeiconsIcon icon={Table02Icon} strokeWidth={2} data-icon="inline-start" />
              View data
            </Link>
            <Link href="/" className={buttonVariants({ variant: "default", size: "sm" })}>
              Explore the findings
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Dataset and Method</h1>
              <p className="mt-3 text-muted-foreground">
                What the data is, how it was collected, and how the 553-respondent sample was selected.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_240px]">
              <div className="flex flex-col gap-14">
                <DatasetOverviewSection />
                <ParticipationSection />
                <QuestionExplorerSection />
                <DataQualitySection />
                <SampleSelectionSection />
                <CoverageSection />
                <StudyScopeSection />
              </div>
              <div className="xl:sticky xl:top-24 xl:self-start">
                <SectionNav />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
