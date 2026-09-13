import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatBar } from "@/components/dataset-method/stat-bar"
import { coverage, sampleSelection, formatN } from "@/lib/dataset-method-data"
import {
  barriers,
  encouragement,
  comparisonByExperience,
  comparisonByIncome,
  demographics,
  type DemographicField,
} from "@/lib/findings-data"

function FieldTile({ f }: { f: DemographicField }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{f.label}</CardTitle>
        <CardDescription className="italic">&ldquo;{f.question_wording}&rdquo;</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {f.options.map((o) => (
          <StatBar key={o.label} label={o.label} value={o.n} total={f.n_answered} />
        ))}
      </CardContent>
    </Card>
  )
}

function BatteryCard({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: DemographicField[]
}) {
  return (
    <Card size="sm" className="sm:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((f) => (
            <div key={f.field_code}>
              <p className="mb-2 text-xs font-medium text-foreground">{f.label}</p>
              <div className="space-y-1.5">
                {f.options.map((o) => (
                  <StatBar key={o.label} label={o.label} value={o.n} total={f.n_answered} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DemographicsPsychographicsSection() {
  const isRegulatorPerception = (code: string) => code.startsWith("g_Q1B")
  const isIncomeAllocation = (code: string) => code.startsWith("Q1M_DP")

  const demoFields = demographics.fields.filter((f) => f.group === "Demographics")
  const regulatorItems = demographics.fields.filter((f) => isRegulatorPerception(f.field_code))
  const incomeAllocationItems = demographics.fields.filter((f) => isIncomeAllocation(f.field_code))
  const otherPsychoFields = demographics.fields.filter(
    (f) => f.group === "Psychographics" && !isRegulatorPerception(f.field_code) && !isIncomeAllocation(f.field_code)
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Respondent profile: demographics</h3>
        <p className="mb-3 text-xs text-muted-foreground">{demographics.note}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoFields.map((f) => (
            <FieldTile key={f.field_code} f={f} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Respondent profile: psychographics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BatteryCard
            title="Perceptions of India's securities-market regulators"
            description="Attitudes toward the entities that regulate/operate the securities market (SEBI, exchanges, etc.) — not specifically about mutual funds. 6-point agreement scale."
            items={regulatorItems}
          />
          <BatteryCard
            title="Monthly income allocation"
            description="Self-reported share of monthly income allocated to each category."
            items={incomeAllocationItems}
          />
          {otherPsychoFields.map((f) => (
            <FieldTile key={f.field_code} f={f} />
          ))}
        </div>
      </div>
    </div>
  )
}

const PROPOSALS = [
  {
    title: "Proposal 1 — Investigate onboarding friction before designing a fix",
    finding:
      "“Simple and easy process for investing” is the top-selected encouragement factor for both previous-experience groups, and the top-selected option overall.",
    investigate:
      "Before any A/B test: review INDmoney's own onboarding funnel data (step-by-step drop-off, time-on-step) and support-ticket themes, and/or run a small moderated usability study. The actual friction point in INDmoney's product is unknown from this SEBI data and must be established first.",
  },
  {
    title: "Proposal 2 — Investigate whether financial-education content changes anything, segmented by prior experience",
    finding:
      "“Better education on how mutual funds work” is selected notably more by respondents reporting no prior securities-market investment (40.4%) than by past MF investors (24.6%).",
    investigate:
      "Review whether INDmoney already has educational content in its onboarding flow, and whether usage differs for users who self-identify as new to investing vs. experienced. If no such segmentation exists today, consider a lightweight addition before building new content.",
  },
  {
    title: "Proposal 3 — Treat lapsed investors, no-prior-investment respondents, and other-product investors as potentially different segments",
    finding:
      "The focused group mixes three meaningfully different histories: past MF investors (24.6%), no prior securities-market investment (69.1%), and other-securities-only investors (6.3%) — who report somewhat different top barriers.",
    investigate:
      "Check whether INDmoney's own signup/KYC flow already captures a prior-investment signal (e.g. existing Demat/MF folio detection); if not, evaluate whether a single lightweight onboarding question is feasible before building segment-specific flows.",
  },
]

function ComparisonTable({
  rows,
  optionKey,
  groups,
}: {
  rows: Record<string, string | number | null>[]
  optionKey: string
  groups: { key: string; label: string; n: number; countOnly?: boolean }[]
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead className="min-w-[220px]">Option</TableHead>
            {groups.map((g) => (
              <TableHead key={g.key} className="text-right whitespace-normal">
                {g.label}
                <div className="text-xs font-normal text-muted-foreground">n={formatN(g.n)}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="max-w-xs whitespace-normal">{row[optionKey]}</TableCell>
              {groups.map((g) => {
                const n = row[`${g.key}_n`]
                const pct = row[`${g.key}_pct`]
                return (
                  <TableCell key={g.key} className="text-right tabular-nums">
                    {g.countOnly || pct === null || pct === undefined ? (
                      <span className="text-muted-foreground">{n ?? "—"} (count only)</span>
                    ) : (
                      <>
                        {pct}% <span className="text-muted-foreground">({n})</span>
                      </>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function AnalysisTab() {
  const q24a = coverage.previous_investment_q24a

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border px-4 py-3 text-xs text-muted-foreground">
        This tab describes the full verified research sample (focused group, n = 553) and each question&apos;s own
        answer base. Filters on the &ldquo;Respondent data&rdquo; tab never change what is shown here — every figure
        below is a fixed, pre-computed aggregate. Unweighted, descriptive only — no significance tests, no causal
        claims.
      </div>

      <DemographicsPsychographicsSection />

      <Card size="sm">
        <CardHeader>
          <CardTitle>Previous mutual-fund investment experience</CardTitle>
          <CardDescription>
            &ldquo;{q24a.question_wording}&rdquo; — answered by all {formatN(q24a.denominator)} of the focused group
            ({q24a.n_blank} blank).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {q24a.categories.map((c) => (
            <div key={c.category_fine}>
              <StatBar label={c.category_fine.replace(/_/g, " ")} value={c.n} total={q24a.denominator} />
              <p className="mt-1 pl-0.5 text-xs text-muted-foreground">{c.rollup}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Reported barriers (AA2_DD2)</CardTitle>
            <CardDescription>
              &ldquo;{barriers.question_wording.split(":").pop()?.trim()}&rdquo; — {formatN(barriers.denominator)} of{" "}
              {formatN(barriers.focused_group_size)} answered. MF+ETF combined scope; multi-select, percentages sum
              to ~300%.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {barriers.options.map((o) => (
              <StatBar key={o.option} label={o.option} value={o.n} total={barriers.denominator} />
            ))}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Encouragement factors (AA3_DD3)</CardTitle>
            <CardDescription>
              &ldquo;{encouragement.question_wording.split(":").pop()?.trim()}&rdquo; —{" "}
              {formatN(encouragement.denominator)} of {formatN(encouragement.focused_group_size)} answered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {encouragement.options.map((o) => (
              <StatBar key={o.option} label={o.option} value={o.n} total={encouragement.denominator} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Comparison: by previous MF investment experience</CardTitle>
          <CardDescription>{comparisonByExperience.note}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Barriers (AA2_DD2)</p>
            <ComparisonTable
              rows={comparisonByExperience.barriers_AA2_DD2}
              optionKey="option"
              groups={[
                { key: "past_mf_investor", label: "Past MF investor", n: comparisonByExperience.group_sizes.past_mf_investor },
                {
                  key: "explicit_no_prior_investment",
                  label: "None of the 7 products",
                  n: comparisonByExperience.group_sizes.explicit_no_prior_investment,
                },
                {
                  key: "past_investor_other_product_only",
                  label: "Other product only",
                  n: comparisonByExperience.group_sizes.past_investor_other_product_only,
                  countOnly: true,
                },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Encouragement (AA3_DD3)</p>
            <ComparisonTable
              rows={comparisonByExperience.encouragement_AA3_DD3}
              optionKey="option"
              groups={[
                { key: "past_mf_investor", label: "Past MF investor", n: comparisonByExperience.group_sizes.past_mf_investor },
                {
                  key: "explicit_no_prior_investment",
                  label: "None of the 7 products",
                  n: comparisonByExperience.group_sizes.explicit_no_prior_investment,
                },
                {
                  key: "past_investor_other_product_only",
                  label: "Other product only",
                  n: comparisonByExperience.group_sizes.past_investor_other_product_only,
                  countOnly: true,
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Comparison: reported barriers by income tier</CardTitle>
          <CardDescription>{comparisonByIncome.note}</CardDescription>
        </CardHeader>
        <CardContent>
          <ComparisonTable
            rows={comparisonByIncome.barriers_AA2_DD2}
            optionKey="option"
            groups={[
              { key: "Up to Rs.20,000", label: "Up to ₹20,000", n: comparisonByIncome.tier_sizes.find((t) => t.income_tier === "Up to Rs.20,000")?.n ?? 0 },
              {
                key: "Rs.20,001-Rs.40,000",
                label: "₹20,001–₹40,000",
                n: comparisonByIncome.tier_sizes.find((t) => t.income_tier === "Rs.20,001-Rs.40,000")?.n ?? 0,
              },
              {
                key: "Above Rs.40,000",
                label: "Above ₹40,000",
                n: comparisonByIncome.tier_sizes.find((t) => t.income_tier === "Above Rs.40,000")?.n ?? 0,
              },
              { key: "Do not wish to disclose", label: "Do not wish to disclose", n: 33, countOnly: true },
              { key: "No current income", label: "No current income", n: 18, countOnly: true },
            ]}
          />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Question coverage and limitations</CardTitle>
          <CardDescription>{coverage.note}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Answered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[260px]">Intended respondent group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverage.fields.map((f) => (
                  <TableRow key={f.field_code}>
                    <TableCell className="font-mono text-xs">{f.field_code}</TableCell>
                    <TableCell className="tabular-nums">
                      {formatN(f.n_substantive_answer)} / {formatN(f.focused_group_size)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={f.suitable_for_descriptive_analysis ? "default" : "outline"} className="font-normal">
                        {f.suitable_for_descriptive_analysis ? "Used" : "Not used"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-sm text-xs whitespace-normal text-muted-foreground">
                      {f.intended_respondent_group}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Context: current MF holding share in the broader group</CardTitle>
          <CardDescription>
            {sampleSelection.broader_group_holding_status_note.text} This is context from the 4,346-respondent
            broader group — not a calculation on the 553-respondent focused group above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {sampleSelection.broader_group_holding_status_note.data.map((row) => (
              <div key={row.status} className="rounded-2xl bg-background/60 p-3 text-center">
                <p className="text-xl font-bold tabular-nums text-foreground">{formatN(row.n)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground capitalize">{row.status.replace(/_/g, " ")}</p>
                {row.pct_of_known !== null ? (
                  <p className="mt-0.5 text-xs font-medium text-primary">{row.pct_of_known}%</p>
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Conditional proposals for further investigation
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Every proposal below is conditional on further evidence INDmoney would need to gather. None of this SEBI
          data can confirm an INDmoney interface problem or predict a conversion improvement.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PROPOSALS.map((p) => (
            <Card key={p.title} size="sm">
              <CardHeader>
                <CardTitle className="text-sm">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p>
                  <span className="font-medium text-foreground">Observed: </span>
                  <span className="text-muted-foreground">{p.finding}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Investigate: </span>
                  <span className="text-muted-foreground">{p.investigate}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
