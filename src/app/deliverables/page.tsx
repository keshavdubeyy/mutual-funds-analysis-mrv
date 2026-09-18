import type { ReactNode } from "react"
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
import { SectionHeading } from "@/components/dataset-method/section-heading"
import { KpiMappingSection } from "@/components/deliverables/kpi-mapping-section"
import { FindingsMappingTable } from "@/components/deliverables/findings-mapping-table"
import { ReportedProblemsSheet } from "@/components/deliverables/reported-problems-sheet"

export const metadata = {
  title: "Deliverables — SEBI Investor Survey 2025",
  description:
    "The five items this project is being assessed against: business problem statement, industry KPIs, marketing metrics, analysis and visual representations, and propositions.",
}

interface DeliverableSection {
  /** Matches the professor's fixed 1–5 numbering even where two of their items share one section. */
  label: string
  title: string
  body?: string
  content?: ReactNode
  /** Rendered to the right of the heading, on the same row — for a section-level action
   * (e.g. a sheet trigger) rather than something that belongs in the flow of `content`. */
  headerAction?: ReactNode
}

const DELIVERABLES: DeliverableSection[] = [
  {
    label: "1",
    title: "Business problem statement",
    body:
      "INDmoney faces a problem where salaried young adults aged 18–28 (early-career users) consider starting a mutual-fund SIP but do not complete their first SIP.",
  },
  {
    label: "2–3",
    title: "Industry KPIs and Marketing metrics",
    body:
      "Groups 1–6 (industry KPIs) cover how the segment behaves. Groups 7–9 (marketing-relevant metrics) cover how to reach and persuade it. Note: groups 7–9 aren't marketing metrics in the standard sense (CAC, conversion rate, ROI) — we have no data on actual marketing activity. Click a KPI name to open its tab on the Analysis page, or a specific question to jump straight to that chart — in either view below.",
    content: <KpiMappingSection />,
  },
  {
    label: "4",
    title: "Analysis and visual representations",
    body: "Every chart, table, and written finding for each KPI and marketing metric lives on the Analysis page. Click a finding below to jump straight to the chart it's based on.",
    headerAction: <ReportedProblemsSheet />,
    content: (
      <div className="mt-4 flex flex-col gap-4">
        <Link
          href="/findings/analysis"
          className="inline-block text-sm text-primary underline underline-offset-2 dark:text-white"
        >
          To view analysis, click here →
        </Link>
        <FindingsMappingTable />
      </div>
    ),
  },
  {
    label: "5",
    title: "Propositions",
    body: "We propose a guided investing experience for young salaried adults that combines simple explanations, clear comparisons, transparent fund information and an understandable payment commitment. It would help users assess risk, resolve questions and complete SIP setup when they choose to invest, while allowing them to wait or reconsider. The proposal is informed by reported survey concerns and requires testing with users of INDmoney.",
  },
]

export default function DeliverablesPage() {
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
                  <BreadcrumbPage>Deliverables</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                Deliverables
              </h1>
              <p className="mt-3 text-muted-foreground">
                The five items this project is being assessed against. Each will get its own
                write-up here.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-10">
              {DELIVERABLES.map((deliverable) => {
                const id = `deliverable-${deliverable.label}`
                return (
                  <section key={deliverable.title} id={id} className="scroll-mt-20">
                    <div className="flex w-full items-start justify-between gap-4">
                      <SectionHeading
                        id={`${id}-heading`}
                        title={`${deliverable.label}. ${deliverable.title}`}
                      />
                      {deliverable.headerAction ? (
                        <div className="shrink-0">{deliverable.headerAction}</div>
                      ) : null}
                    </div>

                    {deliverable.body ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {deliverable.body}
                      </p>
                    ) : null}

                    {deliverable.content}
                  </section>
                )
              })}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
