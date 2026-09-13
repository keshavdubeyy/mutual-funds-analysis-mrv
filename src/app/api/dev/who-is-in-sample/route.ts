import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"
import { whoIsInSampleBase, type WhoField, type KnowledgeItem } from "@/lib/who-is-in-sample-data"

// Server-only, development-only — same protection model as
// src/app/api/dev/respondent-table/route.ts. This route reads the local,
// gitignored respondent-level extract (data/processed/who_is_in_sample_local.json)
// to compute REAL combined-filter intersections (state × urban/rural × income
// tier × previous-investment experience), but only ever returns aggregate
// counts — never a raw row, never a respondent id, never free text.
export const dynamic = "force-dynamic"
export const revalidate = 0

const DATA_PATH = path.join(process.cwd(), "data", "processed", "who_is_in_sample_local.json")

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
}

interface LocalRecord {
  ref: string
  state: string
  urbanrural: string
  zone: string
  education: string
  occupation: string
  gender: string
  marital_status: string
  family_type: string
  cwe: string
  occupation_class: string
  income_bracket: string
  income_tier: string
  prev_mf_investment_class: string
  qrt: string
  q10m: string
  q11m: string
  q12m: string
  q20e: string
  knowledge: Record<string, string>
  q20cm: string[]
  q20dm: string[]
  q20f: string[]
}

const SINGLE_FIELD_ACCESSOR: Record<string, (r: LocalRecord) => string> = {
  SELECTED_STATE: (r) => r.state,
  URBANRURAL: (r) => r.urbanrural,
  Zone_DP: (r) => r.zone,
  Q3D: (r) => r.education,
  Q14: (r) => r.occupation,
  Q10A: (r) => r.income_bracket,
  Q1: (r) => r.gender,
  Q13: (r) => r.marital_status,
  Q5A: (r) => r.family_type,
  CWE: (r) => r.cwe,
  QRT: (r) => r.qrt,
  Q10M: (r) => r.q10m,
  Q11M: (r) => r.q11m,
  Q12M: (r) => r.q12m,
  Q20E: (r) => r.q20e,
}

const MULTI_FIELD_ACCESSOR: Record<string, (r: LocalRecord) => string[]> = {
  Q20CM: (r) => r.q20cm,
  Q20DM: (r) => r.q20dm,
  Q20F: (r) => r.q20f,
}

function summarizeSingle(values: string[]) {
  const counts = new Map<string, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  const total = values.length
  return Array.from(counts.entries())
    .map(([label, n]) => ({ label, n, pct: total ? Math.round((1000 * n) / total) / 10 : 0 }))
    .sort((a, b) => b.n - a.n)
}

function summarizeMulti(values: string[][], vocabulary: string[]) {
  const counts = new Map(vocabulary.map((v) => [v, 0]))
  const answered = values.filter((v) => v.length > 0)
  for (const tokens of answered) {
    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  const total = answered.length
  return Array.from(counts.entries())
    .map(([label, n]) => ({ label, n, pct: total ? Math.round((1000 * n) / total) / 10 : 0 }))
    .sort((a, b) => b.n - a.n)
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404, headers: NO_STORE_HEADERS })
  }

  let records: LocalRecord[]
  try {
    records = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
  } catch {
    return NextResponse.json(
      {
        error:
          "Local respondent extract not found. Run `python scripts/export_who_is_in_sample.py` from the project root, then reload.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  const params = request.nextUrl.searchParams
  const state = params.get("state")
  const urbanrural = params.get("urbanrural")
  const incomeTier = params.get("incomeTier")
  const prevInvestment = params.get("prevInvestment")

  const matched = records.filter(
    (r) =>
      (!state || r.state === state) &&
      (!urbanrural || r.urbanrural === urbanrural) &&
      (!incomeTier || r.income_tier === incomeTier) &&
      (!prevInvestment || r.prev_mf_investment_class === prevInvestment)
  )

  const fieldsOut: WhoField[] = whoIsInSampleBase.fields.map((base) => {
    if (base.kind === "single") {
      const accessor = SINGLE_FIELD_ACCESSOR[base.field_code]
      const values = matched.map(accessor).filter((v) => v !== "")
      return {
        ...base,
        denominator: matched.length,
        n_answered: values.length,
        n_blank: matched.length - values.length,
        options: summarizeSingle(values),
      }
    }
    const accessor = MULTI_FIELD_ACCESSOR[base.field_code]
    const vocabulary = base.options.map((o) => o.label)
    const values = matched.map(accessor)
    const answeredCount = values.filter((v) => v.length > 0).length
    return {
      ...base,
      denominator: matched.length,
      n_answered: answeredCount,
      n_blank: matched.length - answeredCount,
      options: summarizeMulti(values, vocabulary),
    }
  })

  const stateUrbanRuralOut = (() => {
    const byState = new Map<string, { urban_n: number; rural_n: number }>()
    for (const r of matched) {
      if (!r.state) continue
      const row = byState.get(r.state) ?? { urban_n: 0, rural_n: 0 }
      if (r.urbanrural === "Urban") row.urban_n += 1
      else if (r.urbanrural === "Rural") row.rural_n += 1
      byState.set(r.state, row)
    }
    return Array.from(byState.entries()).map(([state, row]) => ({ state, ...row }))
  })()

  const knowledgeOut: KnowledgeItem[] = whoIsInSampleBase.knowledge_grid.items.map((base) => {
    const values = matched.map((r) => r.knowledge[base.field_code]).filter((v) => v !== undefined && v !== "")
    return {
      ...base,
      n_answered: values.length,
      n_blank: matched.length - values.length,
      options: summarizeSingle(values),
    }
  })

  return NextResponse.json(
    {
      ...whoIsInSampleBase,
      fields: fieldsOut,
      state_urbanrural_crosstab: stateUrbanRuralOut,
      knowledge_grid: { ...whoIsInSampleBase.knowledge_grid, items: knowledgeOut },
      matched_n: matched.length,
    },
    { status: 200, headers: { ...NO_STORE_HEADERS, "Content-Type": "application/json" } }
  )
}
