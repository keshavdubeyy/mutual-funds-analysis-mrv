# Current Work Audit — Against the Professor's Deliverables

Inspection and reporting only. Nothing in this document changes the dashboard, adds a metric, or runs a new calculation. Every claim below is traced to a specific file. Where something could not be traced, that is stated explicitly rather than assumed.

Deliverables being audited against:
1. Business problem statement
2. Industry KPIs (5–10)
3. Marketing metrics (3–7)
4. Analysis and visual representations
5. Propositions

---

## Summary

**1. What we have completed.** A full, traceable pipeline from a SEBI government survey (109,430 respondents) down to a defined study group of 553 salaried Gen Z respondents who say they've considered mutual funds but don't currently hold one, plus 25 descriptive measures computed from that group's answers, all exported to a working Next.js dashboard with drill-down "how calculated" detail for every number, and 3 evidence-tied propositions.

**2. Why that work matters.** SEBI's survey is the only data source this project has. Everything downstream — which respondents count, which questions apply to them, what a percentage means — depends on the cohort and field-routing work being right first. That work has been done carefully, audited twice, and self-corrected in writing when errors were found (see §2 and §5).

**3. What we can measure.** Self-reported, unweighted percentages within this specific 553-person sample: reasons for considering/not investing, what would encourage investing, prior investment experience, risk preference, knowledge-battery uncertainty, and how several of these differ by income tier or prior experience. These are **survey research measures**, not company or industry KPIs.

**4. What we cannot measure.** Anything requiring INDmoney's own product data (conversion, order placement, payment completion, retention, CAC, revenue) or true industry-wide figures (market share, AUM growth, penetration) — this project has no such data, and says so consistently across its documents. "Industry KPIs" and "marketing metrics" in the sense a professor would usually mean (funnel, channel, cost) **do not exist in this dataset** and cannot be manufactured from it without adding data or new sources.

**5. What we should do next, in priority order.**
1. Decide, as a team, how to honestly answer the "Industry KPIs" and "Marketing metrics" deliverables given the data gap (see §6) — this is a decision, not a data task.
2. Write one consolidated business problem statement paragraph from existing material (no new analysis needed).
3. Reconcile `docs/analysis_pages_report.md`'s newest respondent-level checks (stopping-reasons overlap, barrier↔encouragement pairs, education-attendance-vs-awareness overlap) with the dashboard — they exist only in a document and a script output right now, not in `public/data/` or any component.
4. Decide whether the 3 existing propositions are sufficient or need 1–2 more, and whether pitch-style language (in `docs/pitch_speech.md`) needs toning down for a formal submission.
5. Only after 1–4: assemble the final submission document.

No overall completion percentage is given below — there isn't a clear basis for one (the professor's five deliverables aren't equally sized, and two of them are structurally blocked by a data gap, not a work gap).

---

## 1. What problem are we actually studying?

There are **two different questions** in this project, and the documents are consistent about keeping them separate — this is a genuine strength, not a gap.

| | Statement | Answerable with our data? |
|---|---|---|
| **Original/eventual business question** | "How can INDmoney increase first-SIP completion — getting more prospective investors from showing intent to actually completing their first mutual-fund SIP?" (`docs/research_synthesis.md` line 7) | **No.** Stated explicitly and repeatedly: "INDmoney's own product data (signups, onboarding steps, order placement, payment success) does not exist in this project" (`docs/research_synthesis.md` line 9); restated in `docs/research_and_measurement_plan.md` §5 and `docs/key_research_indicators.md`'s Limitations section. |
| **Narrower research question our data can answer** | "What barriers and encouragement factors are reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them, and how do these differ by income and previous investment experience?" (`docs/research_and_measurement_plan.md` line 7, `docs/cohort_definition.md` line 3, `docs/key_research_indicators.md` line 5) | **Yes**, within an unweighted, self-reported, 553-person sample. |

**Are the documents and dashboard consistent?** Yes. Every core document (`research_and_measurement_plan.md`, `research_synthesis.md`, `key_research_indicators.md`, `building_kpis.md`, `analysis_pages_report.md`) restates the same distinction and the same "SEBI ≠ INDmoney data" limitation. The dashboard's Research Plan page and Limitations section carry the same statement. This consistency was not automatic — `docs/research_and_measurement_plan.md`'s own revision note documents that an *earlier draft* conflated things (a misleading "100%" framing on a data-consistency check, a routing-vs-independence conflation) and was corrected. The current state is consistent; it got there through explicit self-correction, which is worth knowing before trusting any single document in isolation.

---

## 2. What work have we completed, and why?

| Activity | What we did | Which research question it serves | Why necessary | What it produced | Evidence |
|---|---|---|---|---|---|
| Data inspection | Loaded the raw SEBI workbook, validated field codes, age bands, occupation categories | Foundation for both questions | Nothing downstream is trustworthy if the raw fields are misread | Verified field inventory, age-band definitions | `analysis/01_data_inspection.ipynb`, `docs/data_inspection.md`, `docs/survey_schema_reference.md` |
| Cohort definition | Defined "broader group" (4,346 salaried Gen Z) and "focused group" (553, considered MF but don't hold it) via documented, source-cited rules (SEBI's own occupation Annexure, literal product-token matching, not the combined MF+ETF tag) | Narrower research question | The narrower question only makes sense once "who counts" is fixed and defensible | Two defined, reproducible respondent groups; a documented selection funnel | `analysis/02_cohort_definition.ipynb`, `docs/cohort_definition.md` |
| Barrier/field-routing audit | Checked which survey fields are actually administered to which respondents, and cross-checked base counts against SEBI's own published report tables | Narrower research question | Multi-select survey fields have partial coverage (routing); using the wrong denominator silently misstates a percentage | Denominators for every barrier/encouragement/motivation field, each checked against a SEBI-published table where possible | `docs/barrier_coverage.md` |
| Descriptive analysis | Computed % selecting each reason for considering/not investing, and each encouragement factor | Narrower research question | These are the core "barriers and encouragement factors" the research question asks about | Ranked percentage tables for `AA1_DD1`, `AA2_DD2`, `AA3_DD3`, `AA4_DD4` | `analysis/03_descriptive_analysis.ipynb`, `docs/descriptive_findings.md` |
| Segment comparisons | Recomputed the same barrier/encouragement percentages split by prior investment experience and by income tier | Narrower research question, "how do these differ" half | This is the second half of the stated research question — it was not optional | Comparison tables with per-group coverage and percentage-point gaps | `analysis/04_segment_comparisons.ipynb`, `docs/segment_findings.md` |
| Supplementary measures | Awareness-source/media distributions, a corrected income-allocation measure (fixing a silent blank→"0%" bug in a derived field), financial-goal ranking, 3 pre-registered relationship cross-tabs | Context for the narrower question | Adds sample context (who these people are) and tests 3 specific, pre-chosen associations rather than fishing for the largest gap | Additional context measures; 3 weak/inconclusive association results, reported as such | `analysis/05_supplementary_measures.ipynb`, `docs/research_and_measurement_plan.md` §6 |
| Follow-up respondent-level checks (**uncommitted, new**) | Joined the cohort extract and raw workbook to check: whether `AA4_DD4` (stopping-reasons) answerers overlap with past-MF-investors; barrier↔matching-encouragement pairs; investor-education attendance vs. awareness-source overlap | Narrower research question, QA on `docs/analysis_pages_report.md` | Requested during review of the Analysis-page report to verify claims that had previously been stated without a computed check | 4 new CSVs in `data/processed/analysis/` (gitignored, not yet in `public/data/`) | `scripts/compute_followup_checks.py` (untracked) |
| Export pipeline | Turned verified processed-data aggregates into JSON files the dashboard reads | Both | Keeps respondent-level data out of the public dashboard; makes every dashboard number traceable to a specific export | `public/data/findings/*.json`, `public/data/dataset-method/*.json` | `scripts/export_*.py` |
| Dashboard build | Built a Next.js app with Dataset & Method, Findings (3 sub-pages), and Research Plan pages, each measure with a "how calculated" detail sheet | Both, as the delivery surface | Makes the analysis reviewable and navigable, not just a stack of notebooks | Working app at `/dataset-and-method`, `/findings/*`, `/research-plan` | `src/app/`, `src/components/`, `src/lib/research-plan-data.ts` |
| Self-audit and correction | Reviewed the Analysis page's own report twice, found and documented real errors (a swapped comparison direction, a sorting error, an overstated interpretation, a mislabeled button), corrected them | Both | Catching your own errors before a professor does is exactly what this pass is for | `docs/analysis_pages_report.md` — currently a "second revision," with an §8 change log | `docs/analysis_pages_report.md` (modified, uncommitted) |
| Communication drafts (**uncommitted, new**) | Plain-language walkthrough of the KPI-building method (`docs/building_kpis.md`); a speaking script for presenting the dataset and findings (`docs/pitch_speech.md`) | Both, as presentation aids | Prepares the material for a live pitch/presentation, not new analysis | Two new docs, not yet cross-checked against the final submission format | `docs/building_kpis.md`, `docs/pitch_speech.md` |

---

## 3. What measures do we currently have?

The full register is 25 measures in `src/lib/research-plan-data.ts`, documented one-by-one in `docs/key_research_indicators.md`. All 25 have status **Calculated** except one, `A15_D15`, which is **Needs clarification**. Grouped below (see `docs/key_research_indicators.md` for the complete per-measure detail — this table condenses, it does not omit anything material).

| Measure group | What it helps us understand | Why it matters to the research question | Source fields | Calculation / answer base | Status | Where shown | Main limitation |
|---|---|---|---|---|---|---|---|
| Reasons for considering MF/ETF | What draws attention to MF/ETF in the first place | Direct input to "motivation" half of context | `AA1_DD1` | % of 240/553 substantive answerers, multi-select (~300% sum) | Calculated | Findings → Analysis → Motivations & barriers | Intended respondent population is inferred, not confirmed against a published SEBI table |
| Reasons for not investing (barriers) | What stops the focused group from investing | Directly answers "barriers" in the research question | `AA2_DD2` | % of 266/553 substantive answerers | Calculated | Findings → Analysis → Motivations & barriers | 52% of the focused group didn't answer this specific question; their views are unknown, not "no barrier" |
| Encouragement factors | What respondents say would help them invest | Directly answers "encouragement factors" in the research question | `AA3_DD3` | % of 266/553 (identical base as barriers) | Calculated | Findings → Analysis → What could help | Stated preference only — no evidence it would change actual behavior |
| Previous investment experience | Splits the focused group into 3 experience histories | Grouping variable for "how these differ by... previous investment experience" | `Q24A` | 3-way share of 553/553 | Calculated | Findings → Analysis; Who is in our sample? | "None of the above" is easy to misread as "never invested" — it means none of 7 specific securities products |
| Reasons for stopping investment | Why past investors say they stopped | Context on lapsed investors within the focused group | `AA4_DD4` | % of 64/553 substantive answerers | Calculated, small base flagged | Findings → Analysis → Motivations & barriers | Only 64 answered; not confirmed to be a subset of the 136 known past MF investors |
| Further lapser detail | Would sharpen the stopping-reasons question | Would refine the above | `A15_D15` | 1 of 553 answered | **Needs clarification** | Not shown as a finding anywhere | Field exists but its intended respondent population/routing is unresolved |
| Risk/return preference, downturn reaction | Self-described risk appetite | Context alongside the fear-of-loss barrier | `QRT`, `Q10M` | % of 553/553 | Calculated | Who is in our sample? | Self-described, not observed behavior |
| Knowledge-battery "Not Aware" shares (9 items) | Which financial topics carry the most reported uncertainty | Candidate targets for investor-education content | `GRIDxQ15AM` (×9) | % of 553/553 per item | Calculated | Findings → Analysis → Risk & knowledge | No documented answer key exists for this battery — never scored correct/incorrect |
| Barriers/encouragement by previous experience | Whether messaging should be segmented by experience | Directly answers "how do these differ by... previous investment experience" | `AA2_DD2`/`AA3_DD3` × `Q24A` | % within each of 3 subgroups' own answerers | Calculated (1 of 3 subgroups counts-only, below 30-answer minimum) | Findings → Analysis → Group differences | No significance testing; similar coverage rates ≠ representativeness |
| Barriers by income tier | Whether a barrier's importance changes with income | Directly answers "how do these differ by income" | `AA2_DD2` × `Q10A` | % within each of 3 income tiers | Calculated (2 special categories counts-only) | Findings → Analysis → Group differences | Coverage more uneven across tiers (39–55%) than across experience groups |
| Percentage-point gaps | Turns a comparison into one number | Makes group differences legible | Derived from the above | Client-side subtraction, only where both sides clear 30 answerers | Calculated | Attached to every comparison row | Descriptive only; not a causal or significance claim |
| 3 pre-registered relationships (risk×fear-of-loss, 1 knowledge-item×education-demand, KYC-knowledge×simple-process demand) | Whether specific stated associations hold in this sample | Tests specific hypotheses instead of pooling everything into a "financial literacy" claim | `QRT`, `GRIDxQ15AM` items, `AA2_DD2`/`AA3_DD3` | Respondent-level joins, % within each response group | Calculated — all 3 came back weak/inconclusive | Findings → Analysis → Group differences | Associations only, no significance test, one item pre-chosen (not the largest gap found post hoc) |
| Awareness sources & media | Where the focused group says it hears about MF/ETF | Marketing-relevant channel context | `Q4_Q5_NONInv_Filt` | % of 266/553 | Calculated | Who is in our sample? | Cannot separate MF from ETF; shows exposure, not causation of investment |
| Learning preferences (format/medium/language/topics) | What content format/channel/language this group prefers for investor education | Marketing-relevant content/channel context | `Q20CM`, `Q20DM`, `Q20E`, `Q20F` | % of 553/553 (note: `Q20F` has no documented selection cap, unlike the other three) | Calculated | Who is in our sample? | Stated preference, not effectiveness evidence |
| Personal income, income allocation, financial goals | Sample context and grouping variable | Describes who is in the sample, supports the income-tier comparison | `Q10A`, `Q1MXGrid`, `Q6_RANK_GRID` | % of 553/553 (income allocation: 517–534/553, category-specific) | Calculated | Who is in our sample? | Income-allocation categories are individually reliable but not validated as a joint personal budget |
| Investor-education attendance, stock-market familiarity, inflation-numeracy check | More sample context | Baseline for any future education proposal | `Q20AM`, `Q11M`, `Q12M` | % of 553/553 | Calculated | Who is in our sample? | Self-rated / single-question checks, not a literacy score |
| Current MF holding share (broader group) | How common MF holding already is beyond the focused group | Context for sizing the focused group against its parent population | `Q22A_All` | 32.9% of 4,343/4,346 with known status | Calculated | Dataset & Method → sample-selection funnel | Unweighted — **not a market-penetration estimate**, explicitly stated everywhere it appears |

**Distinguishing availability from calculation, as requested:**
- **Calculated from our survey data:** everything in the table above marked Calculated (24 of 25 register measures).
- **Available fields, but not yet calculated / not yet exported to the dashboard:** the three follow-up checks in `scripts/compute_followup_checks.py` (stopping-reasons-by-experience overlap, 3 barrier↔encouragement pair diffs, education-attendance-vs-awareness overlap) — these ran and produced CSVs in `data/processed/analysis/` (gitignored), and their results are written up in `docs/analysis_pages_report.md`, but they are **not** in any `public/data/*.json` file and **not** rendered by any dashboard component. This is a real gap between what a document claims is "verified" and what the dashboard actually shows.
- **Fields exist, but their meaning or routing needs clarification:** `A15_D15` only, documented as such throughout.
- **Requires data we do not have:** everything under "company-side outcomes" in `docs/research_and_measurement_plan.md` §5 — order placement rate, payment completion rate, SIP persistence rate — these need INDmoney's own event data, not a raw-workbook field that merely hasn't been read yet.

---

## 4. How do these measures relate to the assignment?

Honest classification, per the professor's categories:

| Category | What we actually have |
|---|---|
| **Survey research measures** | All 24 calculated measures in §3. This is the vast majority of the project's output. |
| **Business or industry KPIs** | **None, in the standard sense** (CAC, market share, AUM/industry growth, retention, revenue, conversion). The one measure that comes closest — "current MF holding share, broader group, 32.9%" — is explicitly documented as **not** a market-penetration estimate (unweighted sample, not the national population). Calling it an industry KPI would misstate what it is. |
| **Marketing metrics** | **None, in the standard sense** (CAC, channel conversion rate, campaign ROI, engagement rate). What exists that is *marketing-relevant context*, honestly labeled: awareness-source/media distribution (which channels already reach this group), encouragement-factor ranking (candidate messaging priorities), learning-format/medium/language preferences (content and channel input). These are self-reported preferences and exposure, not performance metrics of any actual marketing activity. |
| **Sample descriptions / data-quality checks** | Personal income, income allocation, financial goals, risk preference, downturn reaction, knowledge-battery uncertainty, investor-education attendance, question-coverage checks (§2.6 of the measurement plan). These describe the 553-person sample and the data's own completeness — necessary, but not primary findings about barriers/encouragement. |

**Legitimate overlap:** several "sample description" measures double as inputs the pitch material uses for marketing-style framing (e.g., "top encouragement factor = simpler onboarding" is both a survey finding *and* a plausible input to a messaging/product decision). This is legitimate as long as it's presented as *survey evidence suggesting a marketing direction*, not as a marketing metric itself. The project's own docs are careful about this distinction (`docs/building_kpis.md` §5 explicitly lists what's out of scope); `docs/pitch_speech.md`'s spoken framing ("That's a product problem, not a market problem," "concentrated exactly where the money is") is punchier than the underlying descriptive data and should not be read as more than a presentation device.

**Explicit checks against the "do not" list in the request — all confirmed as followed in current project documents:**
- Current MF holding share is **not** called a conversion rate anywhere found.
- Survey sample percentages are **not** called market share anywhere found; the one place this could have happened (broader-group MF holding, 32.9%) is explicitly flagged as not a penetration estimate in three separate documents.
- Consideration (`Q23A`) is **not** treated as completed investment — the focused group's definition explicitly requires *current non-holding* alongside consideration.
- CAC, retention cost, revenue, and profitability are **not** calculated anywhere — they are named only as things this project cannot produce (`docs/research_and_measurement_plan.md` §5, `docs/building_kpis.md` §5).
- No definition-only metric (i.e., `A15_D15`) is presented as a calculated result — it is labeled "Needs clarification" everywhere it appears.

**What's missing for the unavailable business/marketing metrics, stated simply:**
- **CAC, revenue, profitability, retention cost:** need INDmoney's own financial/cost data — none of it is in a national household survey.
- **Order placement rate, payment completion rate, SIP persistence rate:** need INDmoney's own product event logs (onboarding started, SIP order placed, SIP debit succeeded/failed) — SEBI's survey has no visibility into any individual's interaction with any specific platform.
- **True market share / industry penetration:** would need either (a) applying SEBI's own survey weights (`WeightMainM2`, `Weight_to_Sample`) — not done, deliberately, per the project's checklist — plus a defensible sampling-design justification, or (b) an external industry source (AMFI/CRISIL data on total SIP accounts, industry AUM), which this project does not have.

---

## 5. What analysis and proposals are supported?

- **Reproducible calculations:** all 24 "Calculated" measures trace to a specific notebook cell and export script, and every dashboard number has a "How calculated" detail sheet linking back (`docs/analysis_coverage_checklist.md`'s verification checklist confirms every displayed value traces to a source JSON, not a re-derived or re-rounded figure).
- **Comparisons that are complete:** barriers/encouragement by previous investment experience; barriers by income tier; the 3 pre-registered relationship cross-tabs. All are in the dashboard.
- **Results that exist only in documents, not the dashboard:** the newest follow-up checks (`scripts/compute_followup_checks.py`, run recently, documented in `docs/analysis_pages_report.md` §2.4 and §3.6) — stopping-reasons/prior-experience overlap, 3 barrier↔encouragement pair comparisons, and the education-attendance-vs-awareness-source overlap. These are real, verified computations, but they live in a gitignored CSV and a markdown report right now, not in `public/data/` or any React component.
- **Conclusions that go beyond what the data shows:** none found in the core analytical documents — they are unusually careful about hedging ("descriptive, not causal," "no significance test," "an observed pattern, not a proven effect"). The one place framing gets more assertive than the underlying data is `docs/pitch_speech.md`, which is written as a spoken pitch script rather than an analytical document — worth reviewing before reusing its language in a formal written submission.
- **Proposals tied to evidence vs. assumptions:** all 3 proposals in `docs/research_synthesis.md` follow an explicit "Observed finding → tentative explanation → what remains unknown → proposed investigation → how to evaluate" structure, and each cites its specific supporting finding and count. None claims a fix will work; each explicitly proposes further investigation (with INDmoney's own data) before any product change.

---

## 6. What remains — mapped to each deliverable

| Deliverable | Completed work | Supporting paths | Remaining gap | Fillable with existing data? | Smallest next action |
|---|---|---|---|---|---|
| **1. Business problem statement** | The distinction between the original INDmoney question and the answerable research question is made repeatedly and consistently, but as scattered paragraphs, not one consolidated statement | `docs/research_synthesis.md` (lines 5–13), `docs/research_and_measurement_plan.md` (lines 7–9), `docs/key_research_indicators.md` (line 5) | No single, submission-ready "business problem statement" paragraph exists yet | Yes — pure writing/assembly, no new analysis | Draft one paragraph combining the existing framing; no calculation needed |
| **2. Industry KPIs (5–10)** | None exist in the standard sense; the gap and its cause are explicitly documented | `docs/research_and_measurement_plan.md` §5, `docs/building_kpis.md` §5, `docs/analysis_coverage_checklist.md` item 15 | Structural: this data cannot produce true industry KPIs (market share, AUM growth, industry-wide penetration) | **No**, not with current data — would need INDmoney data or an external industry source (e.g. AMFI statistics) | Team decision: either request 5–10 industry-context indicators be reframed honestly as "survey-based context measures" (a few exist, e.g. broader-group MF holding, income allocation, financial-goal priorities), or scope in an external secondary data source |
| **3. Marketing metrics (3–7)** | None exist in the standard sense; several marketing-*relevant* descriptive measures exist (awareness sources, encouragement ranking, learning-format preferences) | `docs/key_research_indicators.md` §3, §8, §9 | Structural, same as above, for CAC/conversion/channel-performance style metrics | **No**, not with current data | Same decision as above: honestly relabel available survey measures as "marketing-relevant indicators," not "marketing metrics," or scope in real marketing data |
| **4. Analysis and visual representations** | Dashboard live with 4 pages (Dataset & Method, Findings × 3, Research Plan), charts, tables, and traceable calculation detail for every measure | `src/app/`, `src/components/analysis/`, `public/data/*` | The newest follow-up checks (§5 above) aren't yet in the dashboard; two rounds of self-audit have already found and fixed real errors, suggesting a third pass before final submission is worthwhile | Partially — exporting the follow-up checks is straightforward; a full re-audit takes more time | Export the 3 follow-up-check results to `public/data/` and decide whether/where they belong on the Analysis page, only if the team wants them shown |
| **5. Propositions** | 3 evidence-tied propositions with an explicit evidence→investigation structure | `docs/research_synthesis.md` §"Research-backed proposals" | Only 3 exist; unclear if the professor expects more, and whether pitch-style language needs toning for a written submission | Yes, if more are wanted — same evidence base supports additional propositions (e.g. from the income-tier or experience-based comparisons not yet turned into a proposition) | Decide with the team whether 3 is sufficient, or draft 1–2 more from existing (already-calculated) comparisons before writing new analysis |

**Necessary corrections:** none identified beyond what the project's own two audit rounds already caught and fixed in `docs/analysis_pages_report.md`.

**Necessary missing work:** (a) consolidate the business problem statement into one paragraph; (b) decide how deliverables 2 and 3 will be honestly satisfied given the data gap — this is a decision to make with the professor or team, not a task to execute alone; (c) export the follow-up checks to the dashboard if they're meant to be shown.

**Optional improvements:** a third audit pass on `docs/analysis_pages_report.md`; polishing `docs/pitch_speech.md` language for a written (not spoken) submission if it will be reused.

**Requirements that cannot be calculated with current data:** true industry KPIs and true marketing metrics as those terms are normally used (CAC, market share, retention, revenue, channel conversion, campaign ROI) — this is a data-availability limit, not a work-effort limit, and is already documented honestly and consistently throughout the project.
