# Research and Measurement Plan — Salaried Gen Z, Mutual Fund Consideration and Barriers

This plan documents how to measure, from the SEBI Investor Survey 2025 respondent workbook, the barriers and encouragement factors reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them, and how those differ by income and previous investment experience. It is built from `docs/data_inspection.md`, `docs/cohort_definition.md`, `docs/barrier_coverage.md`, `docs/descriptive_findings.md`, `docs/segment_findings.md`, and `analysis/01_data_inspection.ipynb`–`04_segment_comparisons.ipynb`.

**Revision note:** this version corrects an earlier draft. Specifically: measure 2.2 has been retired as an analytical finding (it was a data-consistency check, not a metric, and was previously reported with a misleading "100%" framing); barrier routing-evidence labels have been reconciled with `barrier_routing_evidence.csv` so an exact base-count match is never called more than SUPPORTED; blank-answer language has been tightened to "missing/unknown" by default; a routing-vs-independence conflation was corrected; unsupported behavioral-economics language was removed from a worked example; the two KPI definitions in §5 were split and tightened; and the closing checklist no longer treats weighting, external stakeholder sign-off, or resolving every open cohort item as prerequisites for this explicitly unweighted, academic dashboard.

Research question: *"What barriers and encouragement factors are reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them, and how do these differ by income and previous investment experience?"*

Eventual business goal: use these findings to propose changes INDmoney could test to improve first-SIP completion. **The SEBI data cannot measure INDmoney conversion and cannot prove any proposed change will work** — stated once here and re-stated wherever relevant below.

---

## 1. Research scope

### The two groups

- **Broader group, n = 4,346** — Mains-complete, `Life_Stage == "Gen Z"`, and `Q14` (occupation) in the documented "Salaried" set from the SEBI Main Report Annexure. No requirement on MF awareness, consideration, or holding.
- **Focused group, n = 553** — the subset of the broader group who (a) reported considering mutual funds (`Q23A` contains the literal "Mutual Funds (One-time Lumpsum / SIP)" token) and (b) have an interpretable `Q22A_All` (current holdings) response that does not contain that same token. Full derivation: `docs/cohort_definition.md`.

Both counts were re-verified after the holding-status correction in §2 below and are **unchanged** — see `docs/segment_findings.md`.

### Age band

`Life_Stage == "Gen Z"` is defined, per the SEBI Investor Survey 2025 Main Report's Annexure (the official PDF linked from `docs/data_sources.md`), as **respondents aged 18 to 28** (Millennial = 29–44, Gen X = 45–60, and the report's oldest band — "Silver Gen" in the report text, `"Baby Boomers"` in this workbook's raw values — is 61+; that naming mismatch doesn't affect this study since only Gen Z is used).

### Salaried definition

`Q14` values are classified as Salaried only if the SEBI Main Report Annexure explicitly lists them there (9 categories: Clerk/Salesman, Supervisory Level, Officer/Executive Junior and Middle/Senior, Postman, and four Rural/Urban "Service … & CWE Education …" combinations). Two counter-intuitive confirmations from that Annexure: **Teacher** and standalone **Doctor** are Self Employed, not Salaried; **Skilled Worker** and **Unskilled Worker** are their own separate buckets. Two "Service (Urban)" categories (18 respondents) are not named anywhere in the Annexure despite their Rural siblings being listed — kept ambiguous, excluded, not assumed. Full table: `docs/cohort_definition.md` §2.

### Mutual funds vs. MF+ETF

- **Product-holding/consideration fields** (`Q21A`, `Q22A_All`, `Q23A`, `Q24A`, `Q25A`) list *"Mutual Funds (One-time Lumpsum / SIP)"* and *"Exchange Trade Funds (ETF) / Gold Exchange Trade Funds (Gold ETF)"* as **separate, distinguishable options**, plus a combined `MF_ETF`/`MF+ETF` tag whenever either is chosen. This study's consideration/holding definitions use the literal MF token, never the bare tag (a meaningful share of tagged rows hold/consider ETF only).
- **Every barrier and encouragement field** (`A11_D11`–`A15_D15`, `AA1_DD1`–`AA4_DD4`) is asked **only at the combined MF+ETF level**. No field reports barriers/encouragement for mutual funds in isolation from ETFs. This MF+ETF-combined restriction does **not** apply to the holding/consideration fields (`Q21A`, `Q22A_All`, `Q23A`, `Q24A`, `Q25A`) — those distinguish MF from ETF directly, per the bullet above. The awareness-source fields (`Q4_Q5_Inv_Filt`/`Q4_Q5_NONInv_Filt`) share the same MF+ETF-combined constraint for the non-holder population specifically — verified directly: `Q4_Q5_NONInv_Filt[{_1_2}]` only has a combined slot, no MF-only slot exists for non-holders. This is a property of the survey design, not a scope choice made in this analysis.
- **`Q24A` (previous investment) has its own, narrower product list** — verified directly against the raw data, not assumed: it offers only 7 securities-market products (Mutual Funds, ETF/Gold ETF, Futures & Options, Stocks/Shares, REITs/InvIT, Corporate Bonds, Alternate Investment Fund), the same 7 the SEBI report's own Annexure calls "Securities products." It does **not** offer Fixed Deposits, insurance, EPF, PPF, NPS, post office schemes, physical gold, chit funds, or crypto — all of which `Q22A_All` (current holdings) does ask about. **`Q24A`'s `"None of the above"` therefore means "none of these 7 securities-market products," not "no prior investment in any financial product."** Earlier drafts of this plan and `docs/descriptive_findings.md` described this category as "no prior investment in anything" — that wording is corrected here and should be read as superseded wherever it appears in earlier documents.

### Inclusion of previous investors

The focused group is defined by **current** non-holding only, and is **not** a "never invested" or "first-time SIP" sample. Restated with the corrected `Q24A` wording: within the focused group, 136 of 553 (24.6%) report previous investment in mutual funds specifically; 382 (69.1%) report `"None of the above"` on `Q24A` — i.e. no prior investment in any of the 7 securities-market products it asks about, which does not rule out prior investment in FDs, insurance, EPF, gold, etc.; and 35 (6.3%) report prior investment in one of the other 6 securities-market products but not mutual funds. This 3-way split is the grouping variable for the previous-experience comparisons in §3.

### What this data can and cannot establish

**Can:**
- Unweighted, self-reported shares of a defined SEBI respondent sample: awareness, consideration, current holding, past securities-market investment, and (for the subset asked) selected barriers/encouragement factors, each with its own denominator.
- Within-sample descriptive differences in those shares across income or previous-investment subgroups, reported as observed patterns in this specific sample.

**Cannot:**
- Anything about INDmoney's own users, app funnel, or conversion — this is a SEBI national survey, not INDmoney telemetry.
- Causal claims — that a reported barrier *causes* non-investment, or that resolving it *would* increase investment.
- Population-representative estimates — no survey weight (`WeightMainM2`, `Weight_to_Sample`) has been applied in this work; every share is unweighted within this sample. This is treated as a deliberate, standing design choice for this stage's explicitly unweighted, academic dashboard, not a gap that blocks further work (see the revised checklist).
- Statistical significance of any observed group difference — not run, and not appropriate to add without first assessing survey design (see §3).
- Freedom from selection bias merely because two groups' answer-coverage *rates* happen to be similar (see §2.6).

---

## 2. Measurement definitions

Each measure states: the research question it answers, its exact source fields, numerator and denominator, the eligible respondent group, how missing/special responses are treated, and its interpretation and limitations. All measures are **unweighted** and are not population estimates or conversion rates. **Unless a specific reason for non-administration is documented (cited below), a blank answer is described as missing/unknown — not asserted to be "not administered for reason X."**

### 2.1 Current MF holding share in the broader group

| | |
|---|---|
| **Answers** | Of salaried Gen Z respondents (broader group), what share currently hold mutual funds, among those with a known holding status? |
| **Source fields** | `Q22A_All`, via the safe, three-state `mf_holding_status` field (`holds` / `does_not_hold` / `unknown`) — see the correction below |
| **Numerator** | Broader-group respondents with `mf_holding_status == "holds"` |
| **Denominator** | Broader-group respondents with a **known** status: `mf_holding_status in {"holds", "does_not_hold"}` — i.e. excluding `"unknown"` |
| **Eligible group** | Broader group, n = 4,346, restricted to the known-status subset |
| **Missing/special** | `"unknown"` (blank or explicit `"Not Answered"` `Q22A_All`) is excluded from the denominator, never counted as `does_not_hold`. **Correction:** an earlier boolean `holds_mf_token` column conflated blank/`"Not Answered"` with `does_not_hold` (an empty or non-matching token set reads as `False` either way). That column has been removed from the saved extracts; `mf_holding_status` replaces it, gating on interpretability first. Token absence alone never establishes non-holding — see `analysis/02_cohort_definition.ipynb` §8 |
| **Interpretation/limitations** | Describes holding incidence within this unweighted salaried-Gen-Z sample only; not a market-wide MF penetration estimate. Computed in `analysis/04_segment_comparisons.ipynb`; result and exact denominator coverage reported in `docs/segment_findings.md` |

### 2.2 Data-consistency check: `Q23A` / `Q22A_All` compatibility (not an analytical measure)

This is **not** a measure and produces **no published percentage or ratio**. It is a one-time check on cohort construction, retained here only so the reasoning is visible.

`Q23A`'s own wording — *"Future Consideration for Selective Financial Products **Not Invested in Currently**"* — already restricts it to products the respondent doesn't currently hold. `docs/cohort_definition.md` §3 checked this directly: among respondents who consider MF under `Q23A`, zero had an interpretable `Q22A_All` that *did* contain the MF token. That confirms the two fields' meanings and routing are compatible enough to build the focused-group filter on both (§1), which is the only thing this check is used for. It is **not** reported as a "100% non-holding rate among considerers" — that framing (used in an earlier draft of this plan) implied an empirical finding where there is essentially a definitional one, and has been removed. No replacement ratio is defined in its place unless a future question specifically requires one.

### 2.3 Percentage selecting each reported barrier

| | |
|---|---|
| **Answers** | Among focused-group respondents who were asked, which reasons for not investing in MF+ETF are most commonly selected? |
| **Source fields** | `AA2_DD2` (*"Top 3 Reasons for not investing in MF/ETF"*), tokenized with the validated reason-field tokenizer (`docs/descriptive_findings.md` §3) |
| **Numerator** | Count of focused-group respondents selecting a given option (up to 3 per respondent; always exactly 3 when answered) |
| **Denominator** | Focused-group respondents with a substantive (non-blank) `AA2_DD2` answer — **266 of 553** |
| **Eligible group** | `AA2_DD2`'s base count (18,223, workbook-wide) exactly matches the SEBI Main Report's Table 7.1 (Non-Investor barriers, MF+ETF column). This is an exact base-count match and is recorded as **SUPPORTED**, not CONFIRMED — see the routing-evidence note below |
| **Missing/special** | The 287 of 553 blanks are missing/unknown (this field's non-administration pattern is explained by a documented routing constraint — see the coverage note below — but that explains the *overall rate*, not a proof about any one individual's blank); 0 explicit non-substantive markers (e.g. "Don't Know") observed |
| **Interpretation/limitations** | Percentages sum to ~300% (multi-select). MF+ETF combined scope. Coverage is 48% — the SEBI report's own footnote states *"Each respondent was asked to respond on 2 products"* (a documented, general routing constraint), which is the best available explanation for the overall non-administration rate. Comparable coverage between two groups (§2.6/§2.7) shows similar *non-response rates*, not that the two groups' respondents (or non-respondents) are otherwise alike — see §2.6 |

### 2.4 Percentage selecting each encouragement factor

Identical structure to 2.3, with `AA3_DD3` (*"Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"*). Denominator = 266 of 553. Base count (18,223) exactly matches SEBI Main Report Table 7.2 — an exact base-count match, recorded as **SUPPORTED**, same population and same "2 products" routing constraint as 2.3.

### 2.5 Previous MF investment experience

| | |
|---|---|
| **Answers** | Within the focused group, who reports previous investment in mutual funds specifically, vs. in other securities-market products, vs. none of the 7 products `Q24A` asks about? |
| **Source fields** | `Q24A` (*"Could you please tell me if you have ever invested in these products in the past"* — "these products" is the same 7-item securities-market list as `Q22A_All`'s MF/ETF/F&O/Stocks/REITs/Corporate-Bonds/AIF options, verified directly against the raw data, not the full ~20-item product list) |
| **Categories** | Reported previous MF investment (contains MF token) = 136; `"None of the above"` — no prior investment in any of these 7 securities-market products (**not** "no prior investment in anything") = 382; prior investment in one of the other 6 products, not MF = 35 |
| **Denominator** | Full focused group, 553 |
| **Missing/special** | 0 blank in this field within the focused group |
| **Interpretation/limitations** | A 3-way grouping variable, not a summary percentage. Must always be reported with the corrected `"None of the above"` wording above — never collapsed to "never invested" |

### 2.6 Question coverage

| | |
|---|---|
| **Answers** | For a given field and eligible group, what share gave a substantive answer, vs. missing/unknown, vs. a special/non-substantive response? — a precondition check, not a finding |
| **Numerator** | Substantive (non-blank, non-special) answers |
| **Denominator** | The full eligible group or subgroup being checked |
| **Missing/special** | Kept explicit and separate, never assumed to mean "no answer selected" |
| **Selection-bias caution** | **Similar coverage rates across two groups do not establish that either group's respondents are free from selection bias.** A matching non-response *rate* says nothing about whether the people who *did* answer are a representative subset of their group, or whether the same kinds of people are missing from each group for different reasons. Coverage comparability is a necessary check before trusting a percentage-point comparison — it is not sufficient to rule out selection bias, and is not described as doing so anywhere in this plan |
| **Interpretation/limitations** | Used before every comparison in §3 |

### 2.7 Percentage-point differences between relevant groups

| | |
|---|---|
| **Answers** | How much does the selection rate for a given barrier/encouragement option differ between two groups? |
| **Numerator/Denominator** | Each group gets its own numerator and denominator (its own substantive-answer count) — never assumed equal |
| **Eligible group** | Intersection of the focused group, the grouping variable's category, and a substantive answer to the specific field |
| **Missing/special** | Coverage (2.6) checked and reported first; a group with a small substantive-answer count is reported as counts only, per the small-group rule fixed in §3 before any comparison is run |
| **Interpretation/limitations** | **Descriptive only.** No significance test attached (see §3). Routing/coverage and respondent-independence are two separate concerns, addressed separately below — a percentage-point figure here describes this sample and does not imply either group's characteristic causes the difference |

---

## 3. Questions for deeper analysis

Four candidate questions were assessed. **At most three are selected to run**, chosen for relevance and adequate coverage — not for which would show the largest difference.

| # | Question | Fields | Eligible sample | Available group sizes | Status |
|---|---|---|---|---|---|
| A | Do reported barriers differ by previous MF experience? | `AA2_DD2` × `Q24A` | Focused group, substantive `AA2_DD2` answers | 61 (past MF investor) / 188 (`"None of the above"` on `Q24A`) / 17 (other-product-only, counts only) | **Already explored** — `analysis/03_descriptive_analysis.ipynb` §6, `docs/descriptive_findings.md` §5. Retained as context in `analysis/04_segment_comparisons.ipynb`, not re-presented as new |
| B | Do encouragement factors differ by the same characteristic? | `AA3_DD3` × `Q24A` | Focused group, substantive `AA3_DD3` answers | Coverage checked, not assumed equal to A, before comparing | **New** — run in `analysis/04_segment_comparisons.ipynb`, see `docs/segment_findings.md` |
| C | Do reported barriers differ by income? | `AA2_DD2` × `Q10A` | Focused group, substantive answers, grouped by income tier | `Q10A` has 14 raw brackets; several have single-digit n even at the full 553 — unworkable at that granularity once restricted to ~266 answerers | **New, contingent** — requires income re-grouping into adjacent-bracket tiers, decided before any barrier result is examined; run in `analysis/04_segment_comparisons.ipynb` |
| D | Does question coverage itself differ across these groups? | Any barrier field × `Q24A` or `Q10A` | Same as above | Checked as a precondition for A/B/C, not run as its own comparison | **Precondition check, not a standalone comparison** |

### The three selected comparisons

1. **Barriers by previous MF experience** (A) — already explored; shown as context in the new notebook, not re-run as new work.
2. **Encouragement factors by previous MF experience** (B) — new.
3. **Barriers by income tier** (C) — new, contingent on:
   - **`Q10A`'s exact wording, unit, and reference period verified first.** `Q10A` asks for *"Monthly Personal Income from all sources before tax"* — a monthly, individual (not household), all-income-sources (not salary-only) figure; the raw description string is truncated in the source workbook past *"Please consider only your in…"*, so the remainder cannot be quoted, but the visible text is sufficient to rule out calling this "salary": it explicitly covers all income sources, not employment income alone. It is referred to as **"Monthly Personal Income (all sources, before tax)"** throughout, never "salary."
   - **Grouping only adjacent brackets**, boundaries preserved, decided from the distribution's own shape before any barrier percentage is examined (exact tiers and rationale: `docs/segment_findings.md`).
   - **`"Do not wish to disclose"` and `"No current income"` kept as their own separate categories**, never folded into a numeric tier.
   - **Coverage of `AA2_DD2` checked within each resulting tier** before trusting any percentage; a fixed small-group rule (stated before looking at results) determines which tiers get percentages vs. counts only.

**Not selected as a 4th comparison:** "coverage differs by income" (D) is executed as a mandatory precondition inside comparison 3, not as a separate output.

### Statistical tests: two separate open questions, not one

No chi-square, t-test, or other significance test is used for any comparison above. Before adding one, two **separate** things need assessment, not one combined "routing means responses aren't independent" argument (an earlier draft of this plan conflated them):

1. **Coverage/missingness** — routing means not every respondent answers every question, which affects what denominator and what population a percentage describes (addressed directly in §2.6/§2.7 above).
2. **Respondent independence** — whether individual respondents' answers can be treated as statistically independent draws, which depends on the survey's actual sampling/clustering design (e.g. geographic or household-level clustering in how respondents were recruited) and is a **separate** question from routing. Partial question coverage, on its own, says nothing about whether respondents are independent of one another — it is not evidence either way. This has not been assessed and is not assumed in either direction.

---

## 4. From evidence to proposals

**Observed finding → possible explanation → what remains unknown → proposed company test → success measure.** A template, not a claim that any step follows automatically from the one before it.

### Worked example 1

| Step | Content |
|---|---|
| Observed finding | "Simple and easy process for investing (e.g. account opening, documentation, etc.)" is the single most-selected encouragement factor among focused-group respondents who answered `AA3_DD3` — 117 of 266 (44.0%) |
| Possible explanation | Perceived onboarding friction may be a salient consideration for this group when thinking about investing in MF+ETF |
| What remains unknown | Whether this self-reported perception maps onto any specific step in INDmoney's actual onboarding flow; whether the 44% figure would hold among people who actually reach INDmoney's onboarding screen (a different, unmeasured population); whether simplifying onboarding would change completion at all, since stated preference and revealed behavior can diverge |
| Proposed company test | INDmoney could A/B test a shortened/simplified MF onboarding flow (e.g. fewer document upload steps, clearer progress indicators) against the current flow, for new users who show MF intent |
| Success measure | Defined structurally in §5 — **not calculable from SEBI data** |

### Worked example 2

| Step | Content |
|---|---|
| Observed finding | "Fear of losing money due to market risks" is the single most-selected reason for not investing among focused-group respondents who answered `AA2_DD2` — 81 of 266 (30.5%) |
| Possible explanation | Respondents may weigh the risk of losing money as a reason not to invest in MF+ETF — stated only as tentatively as the survey question itself supports; no specific psychological mechanism is asserted |
| What remains unknown | Whether this reflects something addressable by product design, market conditions at the time of the survey, general caution, or something else entirely; whether it generalizes to INDmoney's specific user base |
| Proposed company test | INDmoney could test whether clearer, plainer risk information shown during onboarding changes completion, for new users who show MF intent |
| Success measure | Defined structurally in §5 — **not calculable from SEBI data** |

**Not done, and not to be done from this data alone:** treating either finding as proof a feature will work; naming a specific behavioral mechanism (e.g. "loss aversion") the survey did not ask about; proposing a specific product solution (e.g. "capital-protected products") not implied by what respondents were actually asked; or projecting an expected conversion lift.

---

## 5. Company-side outcomes — out of scope by design, not a pending task

**Note (later revision):** this project is defined around what the SEBI survey data supports. INDmoney's own product/activity data (the definitions below) is out of scope for this project by design — documented here as background for whoever eventually instruments it, and stated as a plain limitation on the dashboard (`docs/analysis_coverage_checklist.md` item 15; the Research Plan page's "Limitations" section) rather than tracked as unfinished project work. The definitions below are **not** calculable from SEBI data and are not estimated or benchmarked from this survey.

### First-SIP order placement vs. first-SIP payment completion — kept as two separate events

These are not the same thing and must not be defined as one:

- **First-SIP order placement**: a user sets up/submits a SIP mandate (selects fund, amount, frequency, authorizes the mandate). This can happen without any money moving yet.
- **First-SIP payment completion**: the first scheduled debit under that mandate actually succeeds. An order can be placed and still fail here (insufficient funds, mandate not approved by the user's bank, technical failure) — placement is not completion.

Both need their own event and their own rate:
- **Order placement rate** — share of users who reach a defined onboarding/intent step who go on to place a first SIP order, within an agreed observation window.
- **Payment completion rate** — share of users who *placed* a first SIP order whose first scheduled debit actually succeeds, within an agreed window tied to that debit's schedule.

**Company events needed:** an "onboarding started"/"MF intent shown" event, a "SIP order placed" event, and a "first SIP debit succeeded/failed" event, distinct from each other, with reliable deduplicated user-level tracking.

**Eligible users / observation window:** to be agreed with INDmoney — not specified further here, since this is a future company KPI, not something this plan resolves.

### Continued-payment (SIP persistence) rate

- **Definition to agree:** among users whose first SIP payment completed, the share who also complete a second (and later, an Nth) scheduled payment.
- **Eligibility requires the relevant scheduled payment date to have already passed.** A user whose second installment isn't due yet is **not yet eligible** to be counted as either a persister or a lapser for that installment — including them prematurely would bias the rate upward by counting people who haven't had the chance to lapse.
- **Cancellations and failed payments must remain in the denominator as non-persisters.** They are not dropped or silently excluded — a persistence rate computed only over "payments that were attempted and succeeded" would overstate persistence by removing exactly the cases that represent non-persistence.
- **Company events needed:** a "SIP installment scheduled" event (to establish the eligibility window) and a "SIP installment outcome" event (succeeded/failed/cancelled), both linked to the originating order.
- **Observation window:** relative to each installment's own due date (e.g. 2nd installment due at +1 month; persistence at 3/6/12 months), to be agreed with INDmoney.

Both KPIs require INDmoney's own event data and internal sign-off before they can be computed. **No attempt is made here to calculate, approximate, or benchmark either from the SEBI sample**, and reaching that sign-off is not treated as a prerequisite for the unweighted, academic analysis in this repository to continue (see the checklist).

---

## 6. Supplementary measures (computed in `analysis/05_supplementary_measures.ipynb`)

Documented with the same rigor as §2 — source fields, numerator/denominator, eligible group, missing-response handling, and limitations. All are unweighted and descriptive only, per the standing scope statement in §1.

### 6.1 Awareness-source and media distributions

| | |
|---|---|
| **Answers** | Where does the focused group (specifically, the subset who answered the barriers question) report hearing about MF/ETF? |
| **Source fields** | `Q4_Q5_NONInv_Filt[{_1_2}].Q4M` (sources), `.Q5M` (media) — multi-select, several option labels contain internal commas |
| **Numerator** | Respondents selecting a given source/medium |
| **Denominator** | 266 of 553 — verified by exact respondent-ID-set comparison to be identical to the `AA2_DD2` answer base |
| **Eligible group** | Focused group, restricted to `AA2_DD2` substantive answerers; only a combined MF+ETF slot exists for this population (no MF-only slot) — a survey-design property, not a scope choice |
| **Missing/special** | 287 blank = not part of this answer base, same routing as `AA2_DD2` |
| **Interpretation/limitations** | Shows where respondents report hearing about these products, not whether that source caused them to invest. Cannot separate mutual funds from ETFs for this population — the survey doesn't offer that split here |

### 6.2 Corrected income-allocation distributions

| | |
|---|---|
| **Answers** | How does the focused group report allocating income across 5 categories (expenses, savings, loans, investments, other)? |
| **Source fields** | `Q1MXGrid[{_1..5}].Q1M` — the true raw numeric field, **not** the derived `Q1M_DP[{_1..5}].Q1M` used previously |
| **Correction** | `Q1M_DP` silently converts a blank raw value into a `"0%"` category (confirmed directly: e.g. the investments category shows 32 genuinely blank raw values vs. 75 shown as `"0%"` in the derived field). Recomputed here from raw, with blank kept as blank |
| **Denominator** | 534 / 532 / 517 / 521 / 527 of 553, one per category (19–36 blank per category) |
| **Eligible group** | Full focused group |
| **Missing/special** | Blank kept distinct from a genuine `0.0` raw answer |
| **Interpretation/limitations** | Each category's distribution is now individually reliable. The five are **not** validated as a single consistent budget and are never summed into a disposable-income figure |

### 6.3 Financial-goal ranking

| | |
|---|---|
| **Answers** | Which financial goals does the focused group rank in its top 3 priorities? |
| **Source fields** | `Q6_RANK_GRID[{_1..13}].Q6_RANK` (12 named goals + one free-text "Others" slot) |
| **Eligibility and rank meaning, verified before computing** | All 553 focused-group respondents have at least one non-blank slot; every respondent's non-blank pattern is exactly `{1.0, 2.0, 3.0}` (occasionally a 4-slot variant when the free-text "Others" item is also used) — i.e. a top-3 priority ranking, not an open scale |
| **Denominator** | 553 |
| **Missing/special** | 0 focused-group respondents used the free-text "Others" slot — reported as its own separate 0% row, not folded into a named goal |
| **Interpretation/limitations** | Reports "selected in top 3" (any non-blank rank) per goal — not a rank-weighted score. Does not test whether a respondent's ranked goals connect to their reported MF-consideration motivations (`AA1_DD1`) — that comparison wasn't run |

### 6.4 `Q12M` — distinct from the `GRIDxQ15AM` battery

`Q12M` (inflation/real-returns numeracy) has one arithmetically correct answer stated in the question itself ("Less than today," given a 5% return against 6% inflation) — 245 of 553 (44.3%) answer correctly. This is fundamentally different from the 9-item `GRIDxQ15AM` battery (§2.x / `docs/analysis_coverage_checklist.md` item 5), which has **no** documented answer key anywhere in this project's sources and is therefore never scored correct/incorrect. The two should never be conflated into one "knowledge" figure.

### 6.5 Three planned relationships

Each restricted to the substantive answerers of the relevant question (266, for both `AA2_DD2` and `AA3_DD3`), joined at the respondent level (not derived from separate marginal totals), and gated by the existing small-group rule (`SMALL_GROUP_MIN_N = 30`, `docs/segment_findings.md`).

- **(a) `QRT` (risk/return preference) × selecting "fear of losing money due to market risks" on `AA2_DD2`.** Result: 28.0% / 28.1% / 35.4% across the three reportable risk-preference categories (one category, n=22, below the reporting minimum). No clear gradient — the group expressing some risk tolerance selects this barrier slightly *more* than the two more risk-averse groups, the opposite of a simple risk-aversion story. Reported as a weak, non-monotonic association, not a trend.
- **(b) `GRIDxQ15AM[{_1}]`** ("Direct plans in mutual funds have a lower expense ratio than regular plans") **× selecting "Better education on how mutual funds work" on `AA3_DD3`.** This specific item was chosen *before* looking at any result, as the one item among the 9 most directly about mutual-fund product mechanics (as opposed to generic financial concepts or account/KYC mechanics) — not chosen post hoc from whichever showed the largest gap. Result: 37.8% (True) / 40.0% (Not Aware) / 25.6% (False). Weak and mixed — not a consistent knowledge-gap pattern.
- **(c) `GRIDxQ15AM[{_4}]`** ("KYC can be completed online") **× selecting "Simple and easy process for investing" on `AA3_DD3`.** Result: 45.2% (True) vs. 43.3% (False) — a 1.9pp gap (the "Not Aware" category, n=28, is below the reporting minimum). Essentially no difference.

All three describe associations observed in this specific sample, not causes. No significance test is applied to any of them.

**Reused, not re-derived:** the `AA2_DD2`/`AA3_DD3` reason-field tokenizer vocabulary was loaded directly from the already-verified `data/processed/analysis/barrier_option_counts.csv` rather than re-running the vocabulary-discovery step (which is not perfectly deterministic across re-runs when fragments recur an equal number of times — a scratch re-run produced 19/11 options instead of the verified 18/10).

---

## Prioritized analysis checklist

This checklist is scoped to what this **unweighted, academic** analysis needs next. It does not treat applying survey weights, contacting INDmoney, or resolving every open cohort-definition item as blocking prerequisites — those are separate tracks, noted where relevant, that can proceed in parallel or later without holding up this stage's descriptive work.

1. ~~Compute measure 2.1 (current MF holding share, broader group)~~ — done in `analysis/04_segment_comparisons.ipynb`; see `docs/segment_findings.md` for the result and its denominator.
2. Measure 2.2 is retired as a finding (see §2.2) — no further action needed; do not re-introduce a "100%" framing for it.
3. ~~Run comparison B (encouragement factors by previous MF experience)~~ — done; see `docs/segment_findings.md`.
4. ~~Decide and document the `Q10A` income re-grouping, then check coverage per tier~~ — done; see `docs/segment_findings.md` for the fixed tiers and the small-group rule applied.
5. ~~Run comparison C (barriers by income tier)~~ — done, with thin tiers reported as counts only per the fixed rule.
6. When (not before) a statistical test is wanted for a future comparison, assess coverage/missingness and respondent-independence separately (§3) — an open item, not a blocker for descriptive work.
7. Survey weighting (`WeightMainM2`, `Weight_to_Sample`) remains a deliberate, separate track for whenever a population-representative (rather than sample-descriptive) result is needed — not required before further descriptive analysis in this repository. Applying these weights alone would not, by itself, guarantee a population-representative result — that depends on the full survey design (sampling frame, response patterns, clustering), not on weighting in isolation. This is not attempted or implied anywhere in this repository.
8. The two still-open cohort-definition items (the 1,338 ambiguous occupation records — 1,320 "Others (Specify)" plus 18 undocumented "Service (Urban)" — excluded at the salaried-occupation selection step, see `docs/cohort_definition.md` §2; `A15_D15`'s unresolved routing) remain documented limitations of this sample — noted, not blocking.
9. The §4 worked examples (and any new ones from comparisons B/C) are ready whenever INDmoney stakeholder discussion is scheduled — that conversation is not a prerequisite for continuing this repository's own analysis.
10. Before anything moves into `public/data/` or a dashboard: review definitions and denominators established here and in `docs/segment_findings.md` against what the dashboard will actually display.
11. ~~Compute the three planned relationships (§3), awareness-source/media distributions, corrected income-allocation distributions, and financial-goal ranking~~ — done, see §6.
