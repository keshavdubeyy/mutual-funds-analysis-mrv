import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeading } from "./section-heading"

interface Check {
  title: string
  prevents: string
  detail: string
}

const CHECKS: Check[] = [
  {
    title: "Two header rows, not one",
    prevents: "Reading the short column codes (row 1) as if they were the full question text, or vice-versa.",
    detail:
      "Both workbooks put a short column code in row 1 (e.g. Q14) and the full question wording in row 2 (e.g. “Q14: Occupation of the respondent…”). Data starts at row 3. Every export and table on this page treats row 1 as the field code and row 2 as its exact source wording — never conflated.",
  },
  {
    title: "Respondent identifiers, checked directly",
    prevents: "Accidentally double-counting a respondent, or joining data to the wrong row.",
    detail:
      "Resp_ID_DP and UniqueId_DP were checked directly against all 109,430 rows: 0 missing, 0 duplicate values in either column. No records were removed as part of this check — it is a verification, not a filter.",
  },
  {
    title: "Missing vs. explicit negative answers",
    prevents: "Treating “Don't Know / Can't Say,” “Do not wish to disclose,” or “No current income” as if the respondent simply wasn't asked.",
    detail:
      "A blank cell (unasked or unanswered) and an explicit substantive answer are kept as distinct categories throughout — never folded into one “missing” bucket. “None of the above” (in multi-select product fields) is likewise treated as a genuine answer (“holds/considers none of these”), not a non-response.",
  },
  {
    title: "Three-state mutual-fund holding status",
    prevents: "Silently counting an unanswered or “Not Answered” holdings response as “does not hold mutual funds.”",
    detail:
      "The current-holdings field (Q22A_All) is read into one of three states — holds / does_not_hold / unknown — rather than a plain true/false. An earlier draft's boolean version conflated blank and “Not Answered” with does_not_hold; that column was removed and replaced with this three-state version, gating on whether the answer is interpretable before checking which products it names.",
  },
  {
    title: "Multi-select labels containing commas",
    prevents: "Splitting a multi-select answer on a bare comma and shredding one option's own label into fake separate items.",
    detail:
      "Several multi-select fields let a respondent pick several financial products at once, joined by commas — but one option's own label contains commas (“Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc)”). Every multi-select field on this page is parsed with a vocabulary-based tokenizer that protects that label before splitting, then restores it — validated so every distinct answer value resolves completely into the known option list, with zero unresolved fragments.",
  },
  {
    title: "Official age-band and occupation definitions",
    prevents: "Guessing what “Gen Z” or “Salaried” means instead of using SEBI's own published definitions.",
    detail:
      "Age bands (Gen Z = 18–28) and the Salaried occupation set (9 specific Q14 values) both come from the SEBI Investor Survey 2025 Main Report's own Annexure — not an inferred reading of the labels. Two results only became clear from reading that source: “Teacher” and standalone “Doctor” are classified as Self Employed, not Salaried, and “Skilled Worker”/“Unskilled Worker” are their own separate buckets.",
  },
  {
    title: "MF-only fields vs. combined MF+ETF barrier fields",
    prevents: "Reporting a barrier or encouragement figure as being about “mutual funds” when it was actually asked about mutual funds and ETFs together.",
    detail:
      "Product-holding fields (Q21A, Q22A_All, Q23A, Q24A, Q25A) list mutual funds and ETFs as separate, selectable options, so MF-only figures can be recovered from them. Every barrier/encouragement field (A11_D11–A15_D15, AA1_DD1–AA4_DD4), by contrast, is asked only at the combined MF+ETF level — there is no field reporting these for mutual funds in isolation. This page always labels those fields “MF+ETF combined,” never “mutual funds.”",
  },
  {
    title: "All-blank columns and unresolved explanations",
    prevents: "Assuming a column with no data at all means “zero incidence” when the real explanation might be a narrower export or routing rule.",
    detail:
      "134 of the workbook's 448 columns (about 30%) are entirely blank across all 109,430 respondents — almost all are per-product slots for financial products other than the handful actually populated in this fielding. Whether that reflects genuine zero incidence or a narrower export is not decidable from the file alone, and is labeled as such rather than guessed.",
  },
]

export function DataQualitySection() {
  return (
    <section id="how-we-checked-the-data" className="scroll-mt-20 space-y-6">
      <SectionHeading
        id="how-we-checked-the-data-heading"
        title="How we checked and interpreted the data"
        description="Eight checks applied before any filtering or analysis — each one exists to prevent a specific, concrete misreading of this workbook."
      />
      <Card>
        <CardHeader>
          <CardTitle>Data-quality checks</CardTitle>
          <CardDescription>Expand any check for its detailed implementation note.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion>
            {CHECKS.map((c, i) => (
              <AccordionItem key={c.title}>
                <AccordionTrigger>
                  <div className="flex flex-1 items-start gap-3">
                    <span className="mt-0.5 text-muted-foreground tabular-nums">{i + 1}.</span>
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                        Prevents: {c.prevents}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pl-6 text-foreground/90">{c.detail}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
