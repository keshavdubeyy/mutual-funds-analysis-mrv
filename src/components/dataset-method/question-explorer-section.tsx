"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "./section-heading"
import type { FieldCatalogueEntry } from "@/lib/dataset-method-data"

const PAGE_SIZE = 25

export function QuestionExplorerSection() {
  const [entries, setEntries] = React.useState<FieldCatalogueEntry[] | null>(null)
  const [error, setError] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [topic, setTopic] = React.useState("all")
  const [usedOnly, setUsedOnly] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)

  React.useEffect(() => {
    let cancelled = false
    fetch("/data/dataset-method/field_catalogue.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((data: FieldCatalogueEntry[]) => {
        if (!cancelled) setEntries(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const topics = React.useMemo(() => {
    if (!entries) return []
    return Array.from(new Set(entries.map((e) => e.topic))).sort()
  }, [entries])

  const filtered = React.useMemo(() => {
    if (!entries) return []
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (topic !== "all" && e.topic !== topic) return false
      if (usedOnly && !e.used_in_research) return false
      if (!q) return true
      return (
        e.code.toLowerCase().includes(q) ||
        e.source_wording.toLowerCase().includes(q) ||
        (e.plain_explanation ?? "").toLowerCase().includes(q)
      )
    })
  }, [entries, query, topic, usedOnly])

  // Reset pagination when the filters change — adjusted during render rather than
  // in an effect, per https://react.dev/learn/you-might-not-need-an-effect
  const filterKey = `${query}|${topic}|${usedOnly}`
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const visible = filtered.slice(0, visibleCount)

  return (
    <section id="what-respondents-were-asked" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="what-respondents-were-asked-heading"
        title="What respondents were asked"
        description="The respondent workbook has 448 columns — not 448 questions. Many are metadata, derived fields, or per-product grid slots. Search or filter the full catalogue below to see what each column actually is."
      />

      <Card>
        <CardHeader>
          <CardTitle>Field / question explorer</CardTitle>
          <CardDescription>
            {entries ? `${entries.length} workbook columns catalogued.` : "Loading the field catalogue…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by code, wording, or plain explanation…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:max-w-xs"
              aria-label="Search fields"
            />
            <div className="flex flex-wrap items-center gap-3">
              <NativeSelect
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                aria-label="Filter by topic"
              >
                <NativeSelectOption value="all">All topics</NativeSelectOption>
                {topics.map((t) => (
                  <NativeSelectOption key={t} value={t}>
                    {t}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <label className="flex items-center gap-2 text-sm text-foreground/80">
                <Switch checked={usedOnly} onCheckedChange={setUsedOnly} size="sm" />
                Used in this study only
              </label>
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Could not load the field catalogue. Try reloading the page.
            </p>
          ) : !entries ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
              No columns match this search.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Showing {visible.length} of {filtered.length} matching columns
                {filtered.length !== entries.length ? ` (of ${entries.length} total)` : ""}.
              </p>
              <Accordion>
                {visible.map((e) => (
                  <AccordionItem key={e.code}>
                    <AccordionTrigger>
                      <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 pr-2">
                        <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold">
                          {e.code}
                        </code>
                        <span className="text-foreground/90">{e.topic}</span>
                        {e.used_in_research ? (
                          <Badge>Used in this study</Badge>
                        ) : (
                          <Badge variant="outline">Not used</Badge>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {e.non_missing_count.toLocaleString("en-IN")} answered · {e.missing_pct.toFixed(1)}% blank
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <FieldDetail entry={e} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {visibleCount < filtered.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="w-full rounded-2xl border border-border py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                </button>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function FieldDetail({ entry }: { entry: FieldCatalogueEntry }) {
  return (
    <div className="space-y-3">
      <DetailRow label="Exact source wording">
        <span className="italic">“{entry.source_wording}”</span>
      </DetailRow>
      {entry.plain_explanation ? (
        <DetailRow label="Plain-language explanation">{entry.plain_explanation}</DetailRow>
      ) : null}
      <DetailRow label="Response type">{entry.response_type}</DetailRow>
      <DetailRow label="Applicable respondents / routing evidence">
        {entry.applicable_respondents}
      </DetailRow>
      <DetailRow label="Used in this study?">
        {entry.used_in_research ? "Yes" : "No"} — {entry.usage_reason}
      </DetailRow>
      <DetailRow label="Coverage (workbook-wide, all 109,430 respondents)">
        {entry.non_missing_count.toLocaleString("en-IN")} answered, {entry.missing_count.toLocaleString("en-IN")}{" "}
        blank ({entry.missing_pct.toFixed(1)}%), {entry.n_distinct_non_missing.toLocaleString("en-IN")} distinct
        non-blank values observed.
      </DetailRow>
      {entry.options && entry.options.length > 0 ? (
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {entry.options_type === "documented" ? "Documented options" : "Observed options"}
          </p>
          {entry.options_note ? (
            <p className="mt-1 text-xs text-muted-foreground">{entry.options_note}</p>
          ) : null}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {entry.options.slice(0, 40).map((o) => (
              <li key={o.label}>
                <Badge variant="secondary" className="font-normal">
                  {o.label}
                  {"n" in o ? ` · ${o.n.toLocaleString("en-IN")}` : ""}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : entry.options_note ? (
        <p className="text-xs text-muted-foreground">{entry.options_note}</p>
      ) : null}
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-foreground/90">{children}</p>
    </div>
  )
}
