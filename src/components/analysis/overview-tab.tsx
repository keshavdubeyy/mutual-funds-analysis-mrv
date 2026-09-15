import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatBar } from "@/components/dataset-method/stat-bar"
import { formatN } from "@/lib/dataset-method-data"
import { barriers, encouragement, comparisonByExperience, type OptionCount } from "@/lib/findings-data"
import { normalizeEncouragementByExperience } from "@/lib/analysis-comparisons"
import { useAnalysisNav } from "./analysis-nav-context"

const MF_ETF_BADGE = (
  <Badge variant="secondary" className="font-normal">
    MF + ETF combined
  </Badge>
)

/**
 * The top N options by share, plus any option tied with the Nth-place value — so a genuine
 * tie at the cutoff (e.g. two encouragement factors both at 36.5%) is shown as a tie, never
 * arbitrarily resolved into a single "3rd place."
 */
function topWithTies(options: OptionCount[], n: number): OptionCount[] {
  const sorted = [...options].sort((a, b) => b.pct_of_answered - a.pct_of_answered)
  if (sorted.length <= n) return sorted
  const cutoff = sorted[n - 1].pct_of_answered
  return sorted.filter((o, i) => i < n || o.pct_of_answered === cutoff)
}

// Same key → color mapping used throughout the Group Differences tab (comparison-rows.tsx's
// GROUP_COLORS, in this same fixed order) — kept identical here so the same experience group
// is always the same color everywhere on the Analysis page, not just within one panel.
const EXPERIENCE_GROUP_COLOR: Record<string, string> = {
  past_mf_investor: "var(--chart-1)",
  explicit_no_prior_investment: "var(--chart-2)",
  past_investor_other_product_only: "var(--chart-3)",
}

const EXPERIENCE_GROUP_LABEL: Record<string, string> = {
  past_mf_investor: "Previously invested in MF",
  explicit_no_prior_investment: "No previous investment in the 7 listed products",
  past_investor_other_product_only: "Previously invested in other listed products, but not MF",
}

const EXPERIENCE_GROUP_ORDER = ["past_mf_investor", "explicit_no_prior_investment", "past_investor_other_product_only"] as const

function OptionBars({ options, denominator }: { options: OptionCount[]; denominator: number }) {
  return (
    <div className="space-y-3">
      {options.map((o) => (
        <StatBar key={o.option} label={o.option} value={o.n} total={denominator} />
      ))}
    </div>
  )
}

function ExploreLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="text-sm text-primary underline underline-offset-2 dark:text-white">
      {children}
    </button>
  )
}

export function OverviewTab() {
  const nav = useAnalysisNav()

  const topBarriers = topWithTies(barriers.options, 3)
  const topEncouragement = topWithTies(encouragement.options, 3)

  const previousInvestment = EXPERIENCE_GROUP_ORDER.map((key) => ({
    key,
    label: EXPERIENCE_GROUP_LABEL[key],
    n: comparisonByExperience.group_sizes[key] ?? 0,
    color: EXPERIENCE_GROUP_COLOR[key],
  }))
  const previousInvestmentTotal = previousInvestment.reduce((sum, g) => sum + g.n, 0)

  const encouragementByExperience = normalizeEncouragementByExperience(comparisonByExperience)
  const educationRow = encouragementByExperience.rows.find((r) => r.option === "Better education on how mutual funds work")
  const noPrior = educationRow?.groups.find((g) => g.key === "explicit_no_prior_investment")
  const pastMf = educationRow?.groups.find((g) => g.key === "past_mf_investor")

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Filters on the &ldquo;Who is in our sample?&rdquo; tab don&apos;t apply here — every figure below is a fixed,
        pre-computed aggregate for the full research group.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-sm">What holds people back? {MF_ETF_BADGE}</CardTitle>
            <CardDescription>
              {formatN(barriers.denominator)} of {formatN(barriers.focused_group_size)} people answered this
              question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <OptionBars options={topBarriers} denominator={barriers.denominator} />
            <p className="text-sm text-foreground/90">
              &ldquo;Fear of losing money due to market risks&rdquo; is the most-selected reported barrier.
            </p>
          </CardContent>
          <CardFooter className="justify-start border-t border-border">
            <ExploreLink onClick={() => nav.goTo("motivations-barriers", "barriers-selection-pct")}>
              Explore all barriers →
            </ExploreLink>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-sm">What could encourage investing? {MF_ETF_BADGE}</CardTitle>
            <CardDescription>
              {formatN(encouragement.denominator)} of {formatN(encouragement.focused_group_size)} people answered
              this question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <OptionBars options={topEncouragement} denominator={encouragement.denominator} />
            <p className="text-sm text-foreground/90">
              &ldquo;Simple and easy process for investing&rdquo; is the most-selected encouragement factor among
              those who answered.
            </p>
          </CardContent>
          <CardFooter className="justify-start border-t border-border">
            <ExploreLink onClick={() => nav.goTo("what-could-help", "encouragement-selection-pct")}>
              Explore encouragement factors →
            </ExploreLink>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">Previous investment experience</CardTitle>
            <CardDescription>
              All {formatN(previousInvestmentTotal)} people in the focused group, grouped by prior investment history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex h-6 w-full overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              {previousInvestment.map((g) => (
                <div
                  key={g.key}
                  style={{ width: `${(g.n / previousInvestmentTotal) * 100}%`, backgroundColor: g.color }}
                />
              ))}
            </div>
            <ul className="space-y-2">
              {previousInvestment.map((g) => (
                <li key={g.key} className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex items-start gap-2 text-foreground/90">
                    <span
                      className="mt-1 size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: g.color }}
                      aria-hidden="true"
                    />
                    {g.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatN(g.n)} ({((g.n / previousInvestmentTotal) * 100).toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-foreground/90">About one quarter have invested in mutual funds before.</p>
          </CardContent>
          <CardFooter className="justify-start border-t border-border">
            <ExploreLink onClick={() => nav.goTo("motivations-barriers", "previous-investment-shares")}>
              Explore our sample →
            </ExploreLink>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-sm">Who asks for more education? {MF_ETF_BADGE}</CardTitle>
            <CardDescription>Among people in each group who answered the encouragement question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {noPrior && pastMf ? (
              <div className="space-y-3">
                <StatBar
                  label={EXPERIENCE_GROUP_LABEL.explicit_no_prior_investment}
                  value={noPrior.n}
                  total={noPrior.denominator}
                  valueLabel={`${formatN(noPrior.n)} of ${formatN(noPrior.denominator)} (${noPrior.pct}%)`}
                  barClassName="bg-[var(--chart-2)]"
                />
                <StatBar
                  label={EXPERIENCE_GROUP_LABEL.past_mf_investor}
                  value={pastMf.n}
                  total={pastMf.denominator}
                  valueLabel={`${formatN(pastMf.n)} of ${formatN(pastMf.denominator)} (${pastMf.pct}%)`}
                  barClassName="bg-[var(--chart-1)]"
                />
              </div>
            ) : null}
            <p className="text-sm text-foreground/90">
              Education was selected more often by respondents with no previous investment in the seven listed
              products.
            </p>
          </CardContent>
          <CardFooter className="justify-start border-t border-border">
            <ExploreLink
              onClick={() => nav.goTo("group-differences", "group-differences-encouragement-by-experience")}
            >
              Compare experience groups →
            </ExploreLink>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <p>Answer counts vary by question. Survey findings do not measure INDmoney app conversion.</p>
        <Link
          href="/research-plan#research-plan-limitations"
          className="shrink-0 text-primary underline underline-offset-2 dark:text-white"
        >
          Methods and limitations →
        </Link>
      </div>
    </div>
  )
}
