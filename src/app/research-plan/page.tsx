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
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ResearchPlanSectionNav } from "@/components/research-plan/section-nav"
import { UnderstandSection } from "@/components/research-plan/understand-section"
import { KeyResearchIndicatorsSection } from "@/components/research-plan/key-research-indicators-section"
import { LimitationsSection } from "@/components/research-plan/limitations-section"
import { ConclusionSection } from "@/components/research-plan/conclusion-section"

export const metadata = {
  title: "Research Objectives and Key Measures — SEBI Investor Survey 2025",
  description:
    "What we are studying, what our data shows in a searchable measure register, and its limitations.",
}

export default function ResearchPlanPage() {
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
                  <BreadcrumbPage>Research Plan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Link href="/" className={buttonVariants({ variant: "default", size: "sm" })}>
              Explore the findings
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                Research Objectives and Key Measures
              </h1>
              <p className="mt-3 text-muted-foreground">
                What we want to understand, what our data shows, and its limitations.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_240px]">
              <div className="flex min-w-0 flex-col gap-14">
                <UnderstandSection />
                <KeyResearchIndicatorsSection />
                <LimitationsSection />
                <ConclusionSection />
              </div>
              <div className="xl:sticky xl:top-24 xl:self-start">
                <ResearchPlanSectionNav />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
