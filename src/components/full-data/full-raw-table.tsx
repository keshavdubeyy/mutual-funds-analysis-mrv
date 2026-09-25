"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

interface FullRawTableResponse {
  total: number
  page: number
  pageSize: number
  fieldCodes: string[]
  questionWording: string[]
  rows: unknown[][]
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined || v === "") return ""
  return String(v)
}

function formatN(n: number): string {
  return n.toLocaleString("en-IN")
}

type FetchResult =
  | { key: string; status: "success"; data: FullRawTableResponse }
  | { key: string; status: "error"; message: string }

/**
 * Paginated browser for the ENTIRE raw SEBI Investor Survey 2025 workbook — all ~109,430
 * respondents, all 448 columns, unfiltered. Fetches one page at a time from
 * src/app/api/dev/full-raw-table/route.ts (dev-only) rather than ever loading the full
 * ~500MB export into the browser — see scripts/export_full_raw_table.py for how that
 * export is built.
 */
export function FullRawTable() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [result, setResult] = React.useState<FetchResult | null>(null)
  const pageInputRef = React.useRef<HTMLInputElement>(null)

  const requestKey = `${page}:${pageSize}`

  // No setState call runs synchronously in this effect's body — every update happens inside
  // the fetch's own then/catch callbacks, keyed by requestKey so a stale response from a
  // superseded page/pageSize change can never overwrite a newer one.
  React.useEffect(() => {
    fetch(`/api/dev/full-raw-table?page=${page}&pageSize=${pageSize}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error ?? `Request failed (${res.status})`)
        }
        return res.json() as Promise<FullRawTableResponse>
      })
      .then((json) => {
        setResult({ key: requestKey, status: "success", data: json })
      })
      .catch((err: Error) => {
        setResult({ key: requestKey, status: "error", message: err.message })
      })
  }, [page, pageSize, requestKey])

  const data = result?.status === "success" && result.key === requestKey ? result.data : null
  const error = result?.status === "error" && result.key === requestKey ? result.message : null
  const loading = !data && !error

  const skeletonColSpan = data?.fieldCodes.length ?? 10
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1
  const rowStart = data ? (data.page - 1) * data.pageSize + 1 : 0
  const rowEnd = data ? Math.min(data.page * data.pageSize, data.total) : 0

  function goToPage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages))
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data ? (
            <>
              Rows {formatN(rowStart)}–{formatN(rowEnd)} of {formatN(data.total)} · {data.fieldCodes.length} columns
            </>
          ) : (
            "Loading…"
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <NativeSelect
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-8 w-20"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <NativeSelectOption key={n} value={n}>
                {n}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-auto rounded-lg border border-border">
        <Table className="border-collapse">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {(data?.fieldCodes ?? []).map((code, i) => (
                <TableHead
                  key={`${code}-${i}`}
                  title={data?.questionWording[i] ?? code}
                  className="border-r border-b border-border font-mono text-xs font-normal whitespace-nowrap"
                >
                  {code}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !data
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={skeletonColSpan}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : (data?.rows ?? []).map((row, ri) => (
                  <TableRow key={ri}>
                    {row.map((cell, ci) => (
                      <TableCell
                        key={ci}
                        className="border-r border-border font-mono text-xs whitespace-nowrap text-muted-foreground"
                      >
                        {formatCell(cell)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1 || loading}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <form
          className="flex items-center gap-2 text-xs text-muted-foreground"
          onSubmit={(e) => {
            e.preventDefault()
            const n = Number(pageInputRef.current?.value)
            if (Number.isFinite(n)) goToPage(n)
          }}
        >
          Page
          <Input
            key={page}
            ref={pageInputRef}
            defaultValue={page}
            className="h-8 w-16 text-center"
          />
          of {formatN(totalPages)}
        </form>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages || loading}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}
