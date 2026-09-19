import Link from "next/link"
import { notFound } from "next/navigation"
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
import { RespondentDataTab } from "@/components/findings/respondent-data-tab"

export const metadata = {
  title: "Respondent data — Findings — SEBI Investor Survey 2025",
  description: "Local development tool for inspecting individual survey respondents. Not available in production.",
}

export default function RespondentDataPage() {
  // Respondent-level inspection is a local development tool only. The actual gate is
  // server-side (src/app/api/dev/respondent-table/route.ts refuses outside next dev) —
  // this keeps the page itself from existing at all in a production build.
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

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
                  <BreadcrumbPage>Respondent data</BreadcrumbPage>
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
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Respondent data</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Local development tool for inspecting individual survey respondents. Not shown in production.
              </p>
            </div>
            <RespondentDataTab />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
