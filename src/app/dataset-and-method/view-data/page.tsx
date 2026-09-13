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
import { ViewDataExplorer } from "@/components/dataset-method/view-data-explorer"

export const metadata = {
  title: "View data — Dataset and Method — SEBI Investor Survey 2025",
  description: "Explore all 109,430 survey respondents and filter down to the 553 people this research is about.",
}

export default function ViewDataPage() {
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
                  <BreadcrumbLink render={<Link href="/dataset-and-method" />}>Dataset and Method</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>View data</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <div>
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Explore the survey respondents</h1>
              <p className="mt-3 text-muted-foreground">
                109,430 people took this survey. Use the filters below to narrow that down to the 553 people who
                match what this research is about.
              </p>
            </div>
            <div className="mt-8">
              <ViewDataExplorer />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
