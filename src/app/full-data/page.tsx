import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FullRawTable } from "@/components/full-data/full-raw-table"

export const metadata: Metadata = {
  title: "Full data — SEBI Investor Survey 2025",
  description: "Local development tool for browsing the entire raw survey workbook. Not available in production.",
}

// Deliberately excluded from src/components/app-sidebar.tsx — reachable only via this direct
// URL. This is the ENTIRE raw workbook (109,430 respondents x 448 columns, unfiltered,
// unaggregated) — respondent-level data, so it follows the same dev-only rule as the
// existing /findings/respondent-data page. The actual gate is server-side
// (src/app/api/dev/full-raw-table/route.ts refuses outside next dev); this keeps the page
// itself from existing at all in a production build.
export default function FullDataPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Full data</h1>
      </div>
      <FullRawTable />
    </main>
  )
}
