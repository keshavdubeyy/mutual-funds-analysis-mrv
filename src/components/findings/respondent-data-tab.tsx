"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ColumnsThreeCogIcon,
  FilterIcon,
} from "@hugeicons/core-free-icons"

const PAGE_SIZE = 25
const EMPTY_RECORDS: RespondentRecord[] = []

interface RawAnswers {
  Q21A_awareness: string | null
  Q22A_All_holdings: string | null
  Q23A_consideration: string | null
  Q24A_past_investment: string | null
  Q25A_never_consider: string | null
  AA1_DD1: string | null
  AA2_DD2: string | null
  AA3_DD3: string | null
  AA4_DD4: string | null
}

interface RespondentRecord {
  ref: string
  age_band: string
  occupation: string
  occupation_class: string
  income_bracket: string
  income_tier: string
  considers_mf: boolean
  mf_holding_status: string
  prev_mf_investment_class: "past_mf_investor" | "explicit_no_prior_investment" | "past_investor_other_product_only"
  raw: RawAnswers
}

type FetchState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "error" }
  | { status: "ready"; data: RespondentRecord[] }

const INCOME_BRACKET_ORDER = [
  "Upto Rs. 5,000",
  "Rs. 5,001 – Rs. 10,000",
  "Rs.10,001 – Rs. 15,000",
  "Rs.15,001 – Rs. 20,000",
  "Rs.20,001 – Rs. 30,000",
  "Rs.30,001 – Rs. 40,000",
  "Rs.40,001 – Rs. 50,000",
  "Rs.50,001 – Rs. 60,000",
  "Rs.60,001 – Rs. 80,000",
  "Rs.80,001 – Rs. 1,00,000",
  "Rs.1,00,001 – Rs. 1,25,000",
  "Rs.1,25,001 – Rs. 3,00,000",
  "Rs.3,00,001 - Rs. 5,00,000",
  "More than Rs. 5,00,000",
  "Do not wish to disclose",
  "No current income",
]

const INCOME_TIER_OPTIONS = [
  "Up to Rs.20,000",
  "Rs.20,001-Rs.40,000",
  "Above Rs.40,000",
  "Do not wish to disclose",
  "No current income",
]

const PREV_INVESTMENT_LABEL: Record<string, string> = {
  past_mf_investor: "Past MF investor",
  explicit_no_prior_investment: "None of the 7 listed products",
  past_investor_other_product_only: "Other product only (not MF)",
}

const PREV_INVESTMENT_ORDER = ["past_mf_investor", "explicit_no_prior_investment", "past_investor_other_product_only"]

const RAW_FIELD_INFO: Record<keyof RawAnswers, { code: string; label: string; wording: string }> = {
  Q21A_awareness: {
    code: "Q21A",
    label: "Product awareness",
    wording: "Which of the following financial products are you aware of",
  },
  Q22A_All_holdings: {
    code: "Q22A_All",
    label: "Current holdings",
    wording: "Which of the following financial products do you currently hold investments in",
  },
  Q23A_consideration: {
    code: "Q23A",
    label: "Future consideration",
    wording: "Future Consideration for Selective Financial Products Not Invested in Currently",
  },
  Q24A_past_investment: {
    code: "Q24A",
    label: "Past investment (7 securities products)",
    wording: "Could you please tell me if you have ever invested in these products in the past",
  },
  Q25A_never_consider: {
    code: "Q25A",
    label: "Would never consider",
    wording: "Financial products the respondent says they would never consider investing in",
  },
  AA1_DD1: {
    code: "AA1_DD1",
    label: "Reasons for considering MF/ETF",
    wording: "Top 3 Primary reasons for considering investing in MF/ETFs",
  },
  AA2_DD2: {
    code: "AA2_DD2",
    label: "Reasons for not investing",
    wording: "Top 3 Reasons for not investing in MF/ETF",
  },
  AA3_DD3: {
    code: "AA3_DD3",
    label: "Encouragement factors",
    wording: "Factors that would encourage considering investing in MF/ETF currently not invested in",
  },
  AA4_DD4: {
    code: "AA4_DD4",
    label: "Reasons for stopping",
    wording: "Top 3 reasons for having stopped investing in MF/ETF",
  },
}

type ColumnKey = "occupation" | "age_band" | "income_bracket" | "considers_mf" | "mf_holding_status" | "prev_mf_investment_class"

const COLUMN_LABELS: Record<ColumnKey, string> = {
  age_band: "Age band",
  occupation: "Occupation",
  income_bracket: "Monthly personal income",
  considers_mf: "MF consideration",
  mf_holding_status: "Current MF holding",
  prev_mf_investment_class: "Previous MF experience",
}

type SortColumn = ColumnKey | "ref"
type SortDirection = "asc" | "desc"

function compareByOrder(order: string[]) {
  return (a: string, b: string) => order.indexOf(a) - order.indexOf(b)
}

function SortHeader({
  column,
  sort,
  onToggle,
  children,
}: {
  column: SortColumn
  sort: { column: SortColumn; direction: SortDirection }
  onToggle: (column: SortColumn) => void
  children: React.ReactNode
}) {
  const active = sort.column === column
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onToggle(column)}
        className="flex items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground"
      >
        {children}
        <HugeiconsIcon
          icon={active ? (sort.direction === "asc" ? ArrowUp01Icon : ArrowDown01Icon) : ArrowDown01Icon}
          strokeWidth={2}
          className={`size-3 ${active ? "text-foreground" : "text-muted-foreground/40"}`}
        />
      </button>
    </TableHead>
  )
}

function RowDetail({ record, onClose }: { record: RespondentRecord | null; onClose: () => void }) {
  return (
    <Sheet open={record !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        {record ? (
          <>
            <SheetHeader>
              <SheetTitle>Respondent {record.ref}</SheetTitle>
              <SheetDescription>
                Local display reference only — not the original respondent ID.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6 text-sm">
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Derived classification
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Age band</p>
                    <p className="font-medium text-foreground">{record.age_band}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Occupation class</p>
                    <p className="font-medium text-foreground">{record.occupation_class.replace(/_/g, " ")}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Income tier</p>
                    <p className="font-medium text-foreground">{record.income_tier}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">MF holding status</p>
                    <p className="font-medium text-foreground">{record.mf_holding_status.replace(/_/g, " ")}</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Previous MF investment experience</p>
                    <p className="font-medium text-foreground">
                      {PREV_INVESTMENT_LABEL[record.prev_mf_investment_class]}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Original structured survey answers
                </p>
                <div className="space-y-3">
                  {(Object.keys(RAW_FIELD_INFO) as (keyof RawAnswers)[]).map((key) => {
                    const info = RAW_FIELD_INFO[key]
                    const value = record.raw[key]
                    return (
                      <div key={key} className="rounded-2xl border border-border p-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-medium text-foreground">{info.label}</p>
                          <code className="text-xs text-muted-foreground">{info.code}</code>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground italic">“{info.wording}”</p>
                        <p className="mt-2 text-xs whitespace-normal text-foreground/90">
                          {value ?? <span className="text-muted-foreground italic">Not answered</span>}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export function RespondentDataTab() {
  const [state, setState] = React.useState<FetchState>({ status: "loading" })
  const [incomeTierFilter, setIncomeTierFilter] = React.useState("all")
  const [prevInvestmentFilter, setPrevInvestmentFilter] = React.useState("all")
  const [sort, setSort] = React.useState<{ column: SortColumn; direction: SortDirection }>({
    column: "ref",
    direction: "asc",
  })
  const [page, setPage] = React.useState(1)
  const [columns, setColumns] = React.useState<Record<ColumnKey, boolean>>({
    age_band: true,
    occupation: true,
    income_bracket: true,
    considers_mf: true,
    mf_holding_status: true,
    prev_mf_investment_class: true,
  })
  const [selected, setSelected] = React.useState<RespondentRecord | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetch("/api/dev/respondent-table", { cache: "no-store" })
      .then(async (res) => {
        if (cancelled) return
        if (res.status === 404) {
          setState({ status: "unavailable" })
          return
        }
        if (!res.ok) {
          setState({ status: "error" })
          return
        }
        const data = (await res.json()) as RespondentRecord[]
        setState({ status: "ready", data })
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allRecords = state.status === "ready" ? state.data : EMPTY_RECORDS

  const filtered = React.useMemo(() => {
    return allRecords.filter((r) => {
      if (incomeTierFilter !== "all" && r.income_tier !== incomeTierFilter) return false
      if (prevInvestmentFilter !== "all" && r.prev_mf_investment_class !== prevInvestmentFilter) return false
      return true
    })
  }, [allRecords, incomeTierFilter, prevInvestmentFilter])

  const sorted = React.useMemo(() => {
    const dir = sort.direction === "asc" ? 1 : -1
    const withIncomeOrder = compareByOrder(INCOME_BRACKET_ORDER)
    const withPrevOrder = compareByOrder(PREV_INVESTMENT_ORDER)
    return [...filtered].sort((a, b) => {
      switch (sort.column) {
        case "ref":
          return dir * a.ref.localeCompare(b.ref)
        case "occupation":
          return dir * a.occupation.localeCompare(b.occupation)
        case "age_band":
          return dir * a.age_band.localeCompare(b.age_band)
        case "income_bracket":
          return dir * withIncomeOrder(a.income_bracket, b.income_bracket)
        case "prev_mf_investment_class":
          return dir * withPrevOrder(a.prev_mf_investment_class, b.prev_mf_investment_class)
        case "considers_mf":
          return dir * Number(a.considers_mf === b.considers_mf ? 0 : a.considers_mf ? 1 : -1)
        case "mf_holding_status":
          return dir * a.mf_holding_status.localeCompare(b.mf_holding_status)
        default:
          return 0
      }
    })
  }, [filtered, sort])

  // Reset to page 1 when filters change — adjusted during render rather than in an
  // effect, per https://react.dev/learn/you-might-not-need-an-effect
  const filterKey = `${incomeTierFilter}|${prevInvestmentFilter}`
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageRows = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)

  function toggleSort(column: SortColumn) {
    setSort((prev) =>
      prev.column === column ? { column, direction: prev.direction === "asc" ? "desc" : "asc" } : { column, direction: "asc" }
    )
  }

  if (state.status === "loading") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (state.status === "unavailable") {
    return (
      <div className="rounded-4xl border border-border bg-card p-8 text-center shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
        <p className="font-medium text-foreground">Respondent inspection is a local development tool</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This table reads a local, gitignored extract through a route that&apos;s disabled outside{" "}
          <code>next dev</code>. It is intentionally unavailable in this build. The Analysis tab remains fully
          available — it uses verified aggregate data only.
        </p>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="rounded-4xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="font-medium text-destructive">Could not load the respondent extract</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          If you&apos;re running locally, make sure you&apos;ve run{" "}
          <code>python scripts/export_respondent_table.py</code> at least once, then reload.
        </p>
      </div>
    )
  }

  const filtersActive = incomeTierFilter !== "all" || prevInvestmentFilter !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} className="size-3.5" />
          Filters
        </div>
        <NativeSelect
          value={incomeTierFilter}
          onChange={(e) => setIncomeTierFilter(e.target.value)}
          aria-label="Filter by income tier"
        >
          <NativeSelectOption value="all">All income tiers</NativeSelectOption>
          {INCOME_TIER_OPTIONS.map((t) => (
            <NativeSelectOption key={t} value={t}>
              {t}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          value={prevInvestmentFilter}
          onChange={(e) => setPrevInvestmentFilter(e.target.value)}
          aria-label="Filter by previous investment experience"
        >
          <NativeSelectOption value="all">All previous experience</NativeSelectOption>
          {PREV_INVESTMENT_ORDER.map((v) => (
            <NativeSelectOption key={v} value={v}>
              {PREV_INVESTMENT_LABEL[v]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {filtersActive ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIncomeTierFilter("all")
              setPrevInvestmentFilter("all")
            }}
          >
            Clear filters
          </Button>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="ml-auto gap-1.5">
                <HugeiconsIcon icon={ColumnsThreeCogIcon} strokeWidth={2} />
                Columns
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(COLUMN_LABELS) as ColumnKey[]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={columns[key]}
                onCheckedChange={(checked) => setColumns((c) => ({ ...c, [key]: Boolean(checked) }))}
              >
                {COLUMN_LABELS[key]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {sorted.length} of {allRecords.length} respondents
        {filtersActive ? " (filtered)" : ""}.
      </p>

      <div className="max-h-[65vh] overflow-y-auto rounded-3xl border border-border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead className="w-16">Ref</TableHead>
              {columns.age_band ? <SortHeader column="age_band" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.age_band}</SortHeader> : null}
              {columns.occupation ? <SortHeader column="occupation" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.occupation}</SortHeader> : null}
              {columns.income_bracket ? (
                <SortHeader column="income_bracket" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.income_bracket}</SortHeader>
              ) : null}
              {columns.considers_mf ? (
                <SortHeader column="considers_mf" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.considers_mf}</SortHeader>
              ) : null}
              {columns.mf_holding_status ? (
                <SortHeader column="mf_holding_status" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.mf_holding_status}</SortHeader>
              ) : null}
              {columns.prev_mf_investment_class ? (
                <SortHeader column="prev_mf_investment_class" sort={sort} onToggle={toggleSort}>{COLUMN_LABELS.prev_mf_investment_class}</SortHeader>
              ) : null}
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((r) => (
              <TableRow key={r.ref} className="cursor-pointer" onClick={() => setSelected(r)}>
                <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                {columns.age_band ? <TableCell>{r.age_band}</TableCell> : null}
                {columns.occupation ? <TableCell className="max-w-[220px] whitespace-normal">{r.occupation}</TableCell> : null}
                {columns.income_bracket ? (
                  <TableCell className="max-w-[200px] whitespace-normal">{r.income_bracket}</TableCell>
                ) : null}
                {columns.considers_mf ? (
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {r.considers_mf ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                ) : null}
                {columns.mf_holding_status ? (
                  <TableCell className="capitalize">{r.mf_holding_status.replace(/_/g, " ")}</TableCell>
                ) : null}
                {columns.prev_mf_investment_class ? (
                  <TableCell className="max-w-[200px] whitespace-normal">
                    {PREV_INVESTMENT_LABEL[r.prev_mf_investment_class]}
                  </TableCell>
                ) : null}
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(r) }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  No respondents match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-xs text-muted-foreground">
          Page {clampedPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={clampedPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={clampedPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>

      <RowDetail record={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
