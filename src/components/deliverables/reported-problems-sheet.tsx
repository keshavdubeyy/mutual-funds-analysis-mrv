"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { REPORTED_PROBLEMS_STATS, type ReportedProblemStat } from "@/lib/findings-register"
import { AffinityMappingTable } from "./affinity-mapping-table"

function Stat({ s }: { s: ReportedProblemStat }) {
  return (
    <strong className="font-semibold text-foreground">
      {s.n}/{s.denominator} ({s.pct.toFixed(1)}%)
    </strong>
  )
}

const S = REPORTED_PROBLEMS_STATS

/**
 * A plain-language "problems, not preferences" summary for the Deliverables page's Analysis
 * deliverable — every number reads live from findings-register.ts's REPORTED_PROBLEMS_STATS,
 * which itself reads the same verified option lookups the Analysis page's Findings use.
 */
export function ReportedProblemsSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm">Reported problems</Button>} />
      <SheetContent side="right" className="overflow-y-auto sm:max-w-4xl!">
        <SheetHeader>
          <SheetTitle>Reported problems</SheetTitle>
          <SheetDescription className="text-sm">
            The analysis points to these reported problems. These concern the surveyed respondents; they are not
            confirmed problems with INDmoney&apos;s interface.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6 pb-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <Table className="border-collapse">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="w-72 border-r border-border text-sm font-normal">Problem</TableHead>
                  <TableHead className="text-sm font-normal">Supporting evidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    1. Fear of losing money makes respondents hesitant to invest.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    <Stat s={S.fearOfLoss} /> selected fear of market losses as a barrier.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    2. Some respondents do not understand how mutual funds work.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    <Stat s={S.lackOfKnowledge} /> selected lack of knowledge as a barrier.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    3. Some respondents do not know how to start investing.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    <Stat s={S.dontKnowHowToStart} /> selected this reason. This is different from understanding the
                    investment itself.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    4. Too much information and too many choices create confusion.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    Information overload: <Stat s={S.infoOverload} />. Too many options: <Stat s={S.tooManyOptions} />.
                    These groups may overlap.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    5. Some respondents do not trust fund managers or mutual funds.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    Distrust of fund managers: <Stat s={S.distrustFundManagers} />. Distrust of mutual funds:{" "}
                    <Stat s={S.distrustMutualFunds} />. These are separate answers, not a combined percentage.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    6. The perceived long investment period is a concern.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    <Stat s={S.longTermPerception} /> selected &ldquo;It&apos;s for long term investment&rdquo; as a
                    barrier. The survey does not explain whether this reflects their needs or a misunderstanding.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    7. Uncertain or disappointing returns are a concern.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    Uncertainty about returns: <Stat s={S.uncertainReturns} />. Among the 64 stopping-question
                    answerers, <Stat s={S.lowerThanExpectedReturns} /> cited lower-than-expected returns.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    8. Starting amounts and available money are obstacles for some respondents.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    A large starting amount: <Stat s={S.largeStartingAmount} />. Not enough money:{" "}
                    <Stat s={S.notEnoughMoney} />. Separately, <Stat s={S.lowerMinimumEncouragement} /> selected a
                    lower minimum as encouragement.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    9. Other financial needs can interrupt investing.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    Among stopping-question answerers, <Stat s={S.urgentNeedForMoney} /> cited urgent needs for money
                    and <Stat s={S.changingFinancialGoals} /> cited changing financial goals.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r border-border align-top text-sm font-medium text-foreground">
                    10. Some financial concepts remain unclear.
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    <Stat s={S.diversificationNotAware} /> selected &ldquo;Not Aware&rdquo; for the diversification
                    statement. Only <Stat s={S.inflationCorrect} /> selected the correct answer to the inflation
                    question. This does not establish an overall literacy score.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Affinity mapping — grouping the problems above into themes:</p>
            <div className="mt-2">
              <AffinityMappingTable />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              Three further findings identify needs to investigate, rather than confirmed problems:
            </p>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">A simpler investing process: </span>
                selected by <Stat s={S.simplerProcessEncouragement} /> as encouragement. We still need to discover
                what &ldquo;simpler&rdquo; means to them.
              </li>
              <li>
                <span className="font-medium text-foreground">Different support by previous experience: </span>
                education was selected by <Stat s={S.educationNoPriorInvestment} /> of respondents reporting none of
                the seven listed products, versus <Stat s={S.educationPastMfInvestor} /> of past MF investors. This
                suggests different reported needs, not proof that the current experience serves either group poorly.
              </li>
              <li>
                <span className="font-medium text-foreground">Practical investor education: </span>
                fraud prevention and investor rights were frequently requested topics. That supports exploring
                educational content; it does not establish that respondents have experienced fraud.
              </li>
            </ul>
          </div>

          <p className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Do not turn every finding into a problem. </span>
            Preferring videos, hearing about investments through friends, choosing a particular language, or having
            different financial goals are characteristics and preferences. They help shape a solution once you
            choose which problem to address.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
