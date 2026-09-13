# Cohort Definition — Salaried Gen Z, Considered Mutual Funds, Currently Non-Holding

Research question: *"What investment barriers are reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them?"*

This is a respondent-level analysis of the **SEBI Investor Survey 2025** respondent workbook (`data/raw/Respondent Data.XLSX`, sheet `RLD`). It is not an INDmoney conversion analysis and not a "first-SIP non-completers" sample — see §4. This document only *defines and justifies* the sample; see `analysis/02_cohort_definition.ipynb` for the executable version and `docs/barrier_coverage.md` for the barrier-field audit.

Per `docs/data_inspection.md`: `QFL` (Investor/Non-Investor) is a Listing-stage classification, decided independently of Mains participation and independently of any single product's holding status. It is **not** substituted for either "completed Mains" or "does not hold mutual funds" anywhere below.

## 1. Selection rules, in order

| # | Rule | Field(s) | Condition |
|---|---|---|---|
| 1 | Completed the relevant Mains survey stage | `MAIN_COMP_STATUS` | `== "Main Complete"` |
| 2 | Gen Z | `Life_Stage` | `== "Gen Z"` |
| 3 | Occupation explicitly supports salaried employment | `Q14` | in the documented "Salaried" set (§2) |
| 4 | Reports considering mutual funds | `Q23A` | tokenized answer contains the literal item `"Mutual Funds (One-time Lumpsum / SIP)"` (§3) |
| 5 | Interpretable current-holdings response that does not include mutual funds | `Q22A_All` | not blank, not `"Not Answered"`, and tokenized answer does **not** contain `"Mutual Funds (One-time Lumpsum / SIP)"` (§3) |

Rules 1-2 use exact-match fields already validated in `docs/data_inspection.md` (0 missing, no ambiguity). Rules 3-5 are the ones requiring interpretation, detailed below.

## 2. Occupation classification (`Q14`)

**Source of truth:** the **SEBI Investor Survey 2025 Main Report** (the official PDF linked from `docs/data_sources.md`), Annexure, pp. 104-106, which defines the exact occupation buckets SEBI itself uses in the published report (e.g. Figure 4.5 "Overall Awareness of Securities Market Products across occupations"). This is a documented external source, fetched and cross-checked against the raw PDF text (not assumed).

Within Mains-complete Gen Z respondents (n = 24,576), every one of the 34 observed `Q14` values is classified below. All three classifications (included/excluded/ambiguous) are represented; counts sum exactly to 24,576.

### Included — "Salaried", per the official Annexure (n = 4,346)

| Q14 value | n |
|---|---|
| Clerk / Salesman | 1,684 |
| Officer / Executive - Junior | 1,139 |
| Supervisory Level | 1,136 |
| Officer / Executive - Middle /Senior | 290 |
| Service (Rural In any village) & CWE Education Grad/Post Grad Prof or Post Grad General | 38 |
| Service (Rural In any village) & CWE Education 10 to Graduate | 23 |
| Service (Urban) & CWE Education Grad/Post Grad Prof or Post Grad General | 20 |
| Service (Rural In any village) & CWE Education illiterate to 9th standard | 9 |
| Postman | 7 |

The Annexure's "Salaried" entry lists exactly this set verbatim. Note that "Clerk / Salesman" — a merged label whose "Salesman" half could in principle mean a self-employed/commission agent — is nonetheless explicitly documented by SEBI itself as belonging to the Salaried bucket, so it is included on that authority rather than on our own reading of the label.

### Excluded — clearly not salaried employment (n = 18,892)

| Bucket (per Annexure, or self-evident) | Q14 values | n |
|---|---|---|
| Business | Shop Owner…, Petty trader…, Businessmen/Industrialist (no employees), Trader/Shopkeeper, Businessmen/Industrialist (9 or less employees) | 4,672 |
| Business *(inferred gap, see below)* | Businessmen/Industrialist with 10 or more employees under him/her | 97 |
| Non-worker | Student, Homemaker/Housewife, Unemployed, Retired | 8,535 |
| Self Employed | Self-employed professional like Doctors/Lawyers, Self Employed Professional, Teacher, Doctor | 700 |
| Agriculture & Allied Activities | Owner Farmer, Agricultural Worker, Leased Farmer, Owner Of Poultry, Owner Of Fisheries, Owner Of Livestock | 1,627 |
| Skilled Worker | Skilled worker like electrician/Mechanic etc., Artisan / Skilled Labourer | 2,379 |
| Unskilled Worker | Unskilled worker like Cleaner/housemaids etc., Unskilled Labourer (Other Than Agriculture) | 882 |

Two results here are worth flagging because they are *not* obvious from the label alone and were confirmed only by reading the official documentation, not assumed:

- **Teacher** and standalone **Doctor** are classified by SEBI's own Annexure as **Self Employed**, not Salaried. A plain-English reading might have guessed "Teacher" implies a salaried school employee — the source document says otherwise, so that reading is not used.
- **Skilled Worker** and **Unskilled Worker** are each their own distinct bucket in SEBI's scheme, separate from Salaried — i.e. SEBI itself does not treat wage/manual labour as "salaried" for this classification.
- "Businessmen/Industrialist with 10 or more employees under him/her" is not literally named anywhere in the Annexure (its two sibling employee-count tiers are), almost certainly an editorial gap given the parallel structure — treated as Business by inference, flagged as such rather than silently assumed.

### Ambiguous — kept OUT of the confirmed salaried group (n = 1,338)

| Q14 value | n | Why ambiguous |
|---|---|---|
| Others (Specify) | 1,320 | Free-text catch-all; SEBI's own bucket scheme does not name it and its content is not visible to us |
| Service (Urban) & CWE Education 10 to Graduate | 13 | Sibling Rural version *is* explicitly listed under Salaried; this Urban/10-to-Graduate combination is not mentioned anywhere in the Annexure — a likely editorial gap, but not stated, so not assumed |
| Service (Urban) & CWE Education illiterate to 9th standard | 5 | Same reasoning as above |

These 1,338 respondents are excluded from the confirmed salaried Gen Z group used below. If a future pass wants to treat the two "Service (Urban)" gaps as Salaried (by the same parallel-structure logic used for the Businessmen inference above), that is a defensible follow-up decision — but it is not made silently here.

## 3. Product-answer parsing (`Q21A`, `Q22A_All`, `Q23A`, `Q24A`, `Q25A`)

Per `docs/data_inspection.md`, these multi-select fields cannot be split on a bare comma: one answer option's own label contains commas (`"Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc)"`). A vocabulary-based tokenizer is used instead: the one known comma-bearing label is protected before splitting, then restored. Validation (in the notebook): **every** distinct non-blank value across all five fields resolves completely into the closed, 20-item known vocabulary — zero unresolved fragments across 22,393 / 2,840 / 103 / 90 / 129 distinct values respectively. `Q22A_All` additionally contains an explicit `"Not Answered"` value (203 respondents workbook-wide) — a genuine non-substantive response distinct from both blank and `"None of the above"`.

**The combined tag is not used as a stand-in for "mutual funds."** `Q21A`/`Q22A_All`/`Q23A`/`Q24A`/`Q25A` list `"Mutual Funds (One-time Lumpsum / SIP)"` and `"Exchange Trade Funds (ETF) / Gold Exchange Trade Funds (Gold ETF)"` as separate items, and *also* append a combined tag (`MF_ETF` / `MF+ETF`) whenever either is chosen. Checked directly in the data: the tag is present if and only if the MF token or the ETF token (or both) is present — but a meaningful share of tagged rows hold/consider **ETF only, not MF** (e.g. 296 of 18,624 tagged `Q22A_All` rows; 757 of 5,962 tagged `Q23A` rows). Reading the bare tag as "mutual funds" would misclassify these ETF-only respondents. **Both filters below check for the literal `"Mutual Funds (One-time Lumpsum / SIP)"` token, never the combined tag alone.**

- **Considers mutual funds** (`Q23A`, *"Future Consideration for Selective Financial Products Not Invested in Currently"*): tokenized answer contains the MF token.
- **Does not currently hold mutual funds** (`Q22A_All`, *"Which of the following financial products do you currently hold investments in"*): the response must be *interpretable* — not blank (not administered / routed out) and not the explicit `"Not Answered"` value — and must not contain the MF token. **A blank or `"Not Answered"` `Q22A_All` is never treated as "does not hold mutual funds"** — it is excluded from the focused group entirely, as unknown.

One internal-consistency finding worth noting: `Q23A` is, by its own documented definition, restricted to products the respondent does **not** currently hold. Empirically, every respondent who considers MF under `Q23A` also has an interpretable, MF-free `Q22A_All` (0 exceptions) — so rule 5 is confirmatory here, not doing independent work. It is still applied explicitly and independently rather than assumed from `Q23A`'s semantics alone, both as a safeguard and per instructions.

## 4. Selection funnel (unweighted)

| Step | Entering | Retained | Excluded | Unknown/ambiguous |
|---|---|---|---|---|
| 0. All respondents | 109,430 | — | — | — |
| 1. Completed Mains | 109,430 | 53,357 | 56,073 (Listing-only) | 0 |
| 2. Gen Z | 53,357 | 24,576 | 28,781 (other generations) | 0 |
| 3. Salaried (documented) | 24,576 | 4,346 | 18,892 (documented non-salaried) | 1,338 (ambiguous, §2) |
| 4. Considers mutual funds (`Q23A`) | 4,346 | 553 | 2,901 (`Q23A` answered, no MF token) | 892 (`Q23A` blank — not administered) |
| 5. Interpretable, does not hold MF (`Q22A_All`) | 553 | 553 | 0 | 0 |

**Broader confirmed salaried Gen Z group (within Mains): n = 4,346.**
**Focused group (considered MF, does not currently hold it): n = 553.**

The focused group is a strict row-level subset of the broader group (verified in the notebook — every focused-group `Resp_ID_DP` appears in the broader group). No prior "reported counts" existed to reconcile against for this exact definition; the 4,346/553 figures are new, not forced to match anything.

## 5. Previous mutual-fund investment within the focused group

The focused group is defined by **current** non-holding, not by having always been MF-free — the two are kept explicitly distinct via `Q24A` (*"Could you please tell me if you have ever invested in these products in the past"*):

| Q24A reading | n | Meaning |
|---|---|---|
| Contains MF token | 136 | Reports previous mutual-fund investment (candidate "lapser" — see `docs/barrier_coverage.md` for the official Lapser definition) |
| `"None of the above"` (explicit) | 382 | Explicitly reports no previous investment in any of the listed products |
| Other non-blank (past investor in a different product only) | 35 | Reports past investment, but not in mutual funds specifically |
| Blank/unknown | 0 | — |

All three non-blank categories sum to 553 with no blanks — `Q24A` was administered to every focused-group member. Past MF investors (136) are **not** removed from the focused group; the working question concerns current non-holding, and removing them would silently change the research question. However: **this group cannot be described as "first-time SIP non-completers"** — it mixes people who tried mutual funds and stopped (potential lapsers), people who report no prior investment in any of `Q24A`'s 7 securities-market products (which does not rule out FDs, insurance, EPF, gold, etc. — `Q24A` doesn't ask about those), and people who have invested in another securities-market product but never in MF. Any later analysis must keep these three subgroups distinguishable rather than treating the focused group as uniformly "never invested."

## 6. Open items carried into `docs/barrier_coverage.md`

- Whether the two "Service (Urban)" occupation categories (18 respondents) should be folded into Salaried by the same parallel-structure logic applied to the Businessmen gap.
- The exact routing condition for `A15_D15` (lapser-specific reasons) is not fully explained by `Q24A` alone — see barrier coverage doc.
- Whether the 892 respondents excluded at step 4 for a blank `Q23A` include anyone who should count as "considering MF" through a different, not-yet-examined field.
