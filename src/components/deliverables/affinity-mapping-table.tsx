import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AffinityTheme {
  theme: string
  problems: string[]
  connection: string
}

/** Groups the 10 problems in reported-problems-sheet.tsx into 5 higher-level themes — a
 * qualitative synthesis, not a new calculation, so (unlike findings-register.ts) nothing
 * here reads from a data export. */
const AFFINITY_THEMES: AffinityTheme[] = [
  {
    theme: "1. Concerns about risk and returns",
    problems: ["P1: Fear of losing money.", "P7: Uncertain or disappointing returns."],
    connection: "Concerns about what could happen to the money invested and whether returns will meet expectations.",
  },
  {
    theme: "2. Understanding investments and getting started",
    problems: [
      "P2: Limited understanding of mutual funds.",
      "P3: Not knowing how to start.",
      "P10: Uncertainty about financial concepts.",
    ],
    connection: "Questions about how investing works and what to do next.",
  },
  {
    theme: "3. Making sense of information and choices",
    problems: ["P4: Information overload and too many options."],
    connection: "Difficulty making a decision when faced with information and alternatives.",
  },
  {
    theme: "4. Trust in funds and fund managers",
    problems: ["P5: Distrust of fund managers or mutual funds."],
    connection: "Concerns about whether the investment and the people managing it deserve trust.",
  },
  {
    theme: "5. Fitting investing around financial needs",
    problems: [
      "P6: Concern about a long investment period.",
      "P8: Starting amounts and limited available money.",
      "P9: Urgent expenses and changing financial goals.",
    ],
    connection: "Questions about how much money can be committed, for how long, and what happens when other needs arise.",
  },
]

export function AffinityMappingTable() {
  return (
    <div className="rounded-lg border border-border">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-56 border-r border-border">Theme</TableHead>
            <TableHead className="w-72 border-r border-border">Problems grouped under it</TableHead>
            <TableHead>What connects them</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AFFINITY_THEMES.map((t) => (
            <TableRow key={t.theme}>
              <TableCell className="border-r border-border align-top font-medium whitespace-normal text-foreground">
                {t.theme}
              </TableCell>
              <TableCell className="border-r border-border align-top whitespace-normal text-muted-foreground">
                <ul className="flex flex-col gap-1">
                  {t.problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="align-top whitespace-normal text-muted-foreground">{t.connection}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
