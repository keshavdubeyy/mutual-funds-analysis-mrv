# Analysis Page — Coverage Checklist

Tracks every analysis item required for the Findings page's **Analysis** tab, against what is verified and available, what still needs calculation, and what is blocked and why. Cross-references `docs/research_and_measurement_plan.md`, `docs/descriptive_findings.md`, `docs/segment_findings.md`, `docs/barrier_coverage.md`, and `docs/research_synthesis.md` — this document does not recompute anything those already established; it only tracks what is displayed, where, and what remains open. **Unweighted, descriptive only**, focused group (n = 553) unless stated otherwise. No respondent-level data is referenced or displayed anywhere on the page.

**Update:** full objective/measure definitions now live on the standalone **Research Objectives and Key Measures** page (`/research-plan`, `src/lib/research-plan-data.ts`). Sections: "What we want to understand" (intro — research question, 3 objectives), "Key research indicators" (a single readable **table**, one row per measure — all 25 measures in the register, none omitted — grouped under 8 Key Research Indicator headings (motivation/barrier/encouragement percentages; previous investment and stopping reasons; risk-preference distributions; "Not Aware" percentages; differences between groups; learning preferences) plus a "Context measures" group (income, income allocation, financial goals, awareness sources, education attendance, stock-market familiarity, Q12M, broader-group MF holding)), "Limitations" (what this survey-response study cannot show — no INDmoney activity/onboarding/conversion records, no evidence a proposal would work), and "Conclusion" (proposals framed as ideas to investigate). Each table row has a "How calculated" button (or, for the one `needs_clarification` measure — `A15_D15` — a "Why unavailable" button) opening a right-side sheet with: the measure name, a one-sentence definition, numbered calculation steps, a verified worked example, who's included and how missing answers are handled, interpretation limits, a "View analysis" link where one exists, and an expandable "Source details" disclosure with field codes and original wording. There is **no company-KPI section on the page** — company-side outcomes are documented once as a limitation (item 15 below), not tracked as pending measures. Detailed per-measure status (this document) stays in the repository rather than as a separate checklist section on the page itself. The Analysis tab shows short question headings, charts/tables and "Metric definition" links back to that page. This document still tracks what is displayed on the Analysis tab and where; it does not duplicate the Research Plan page's fuller register.

Section IDs below (`§A`–`§F`) match the anchors used on the Analysis page (`src/app/page.tsx` → `AnalysisTab`): `§A` Overview, `§B` Motivations/barriers/encouragement, `§C` Knowledge, `§D` Differences between groups, `§E` Relationships between reported answers (items 11–13, now computed — see `analysis/05_supplementary_measures.ipynb`), `§F` Conclusions and next steps.

Status legend: **verified and available** (existing aggregate export, ready to display) · **needs calculation** (not yet computed anywhere; exact required calculation is stated) · **blocked** (cannot be computed from this dataset, by design).

---

## 1. Reasons for considering investing — `AA1_DD1`

| | |
|---|---|
| Research question | Among focused-group respondents who were asked, what reasons do they give for considering investing in MF/ETF? |
| Source fields | `AA1_DD1` — *"Top 3 Primary reasons for considering investing in MF/ETFs"* |
| Respondent group | Focused group (553), restricted to substantive answerers. Intended population is **inferred, not confirmed**: "likely Intenders" (SEBI Chapter 8 concept) — base count (3,168 workbook-wide) does not exactly match any published table (`docs/barrier_coverage.md`) |
| Calculation and denominator | Multi-select (always exactly 3 selections when answered); % of substantive answerers, not of 553. **Denominator = 240 of 553 (43.4%)** |
| Missing/special-response treatment | 313 blanks = missing/unknown, not "no reason." 0 explicit non-substantive markers observed. `"Other (please specify)"` kept as its own option (free text itself never shown) |
| Proposed chart | Sorted horizontal bars (desc. by %), counts + percentages on every bar; full 19-option table available via bar/table toggle; full question wording in an expandable disclosure |
| Status | **Verified and available** — `data/processed/analysis/barrier_option_counts.csv` + `barrier_field_metadata.csv`, exported to `public/data/findings/motivations.json` in this pass (was verified but not previously exported to the dashboard) |
| Location | §B — Motivations, barriers and encouragement → "Reasons for considering investing" |

## 2. Reasons for not investing — `AA2_DD2`

| | |
|---|---|
| Research question | Among focused-group respondents who were asked, what reasons do they give for not currently investing in MF/ETF? |
| Source fields | `AA2_DD2` — *"Top 3 Reasons for not investing in MF/ETF"* |
| Respondent group | Focused group (553), substantive answerers only. Population: **Non-Investors, SUPPORTED by an exact base-count match** to SEBI Main Report Table 7.1 (base = 18,223 workbook-wide) |
| Calculation and denominator | Multi-select (exactly 3 per respondent); % of substantive answerers. **Denominator = 266 of 553 (48.1%)** |
| Missing/special-response treatment | 287 blanks = missing/unknown. Documented routing cause: report footnote states *"Each respondent was asked to respond on 2 products"* (out of products not currently held) — explains the overall non-administration rate, not any individual respondent's blank. 0 non-substantive markers |
| Proposed chart | Sorted horizontal bars (desc. by %), 19 options, bar/table toggle, full wording in expandable disclosure |
| Status | **Verified and available** — `public/data/findings/barriers.json` |
| Location | §B — Motivations, barriers and encouragement → "Reasons for not investing" |

## 3. Encouragement factors — `AA3_DD3`

| | |
|---|---|
| Research question | Among focused-group respondents who were asked, which factors would encourage them to invest in MF/ETF? |
| Source fields | `AA3_DD3` — *"Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"* |
| Respondent group | Focused group (553), substantive answerers only. Population: **Non-Investors, SUPPORTED by exact base-count match** to Table 7.2. Verified directly: answered by the *identical* 266 respondents who answer `AA2_DD2` |
| Calculation and denominator | Multi-select; % of substantive answerers. **Denominator = 266 of 553 (48.1%)** |
| Missing/special-response treatment | 287 blanks = missing/unknown, same documented "2 products" routing constraint as `AA2_DD2`. 0 non-substantive markers |
| Proposed chart | Sorted horizontal bars (desc. by %), 10 options, bar/table toggle, full wording in expandable disclosure |
| Status | **Verified and available** — `public/data/findings/encouragement.json` |
| Location | §B — Motivations, barriers and encouragement → "Encouragement factors" |

## 4. Reasons for stopping investment — `AA4_DD4`

| | |
|---|---|
| Research question | Among focused-group respondents who were asked, why did they stop investing in MF/ETF? |
| Source fields | `AA4_DD4` — *"What were the Top 3 reasons you stopped investing in MF/ETF"* |
| Respondent group | Focused group (553), substantive answerers only. Population: **"Likely Lapser-adjacent," inferred, not confirmed** — base (1,381 workbook-wide) only partially matches a "Base : By Products" row near the report's lapsing/dormancy discussion, not a titled table |
| Calculation and denominator | Multi-select; % of substantive answerers. **Denominator = 64 of 553 (11.6%)**. **The 64 answerers are explicitly *not* assumed to be a subset of the 136 respondents who report previous MF investment (`Q24A`)** — checked directly in `docs/barrier_coverage.md`: a related field (`A15_D15`, the documented "Lapser" question) has only 1 non-blank answer among all 553, including the 136 known past investors, showing routing to these stopping/lapsing questions does **not** track `Q24A` in any simple way. `AA4_DD4`'s own routing to a specific respondent subset is unresolved, so its answer base is reported as its own group of 64, not derived from or cross-checked against the 136 |
| Missing/special-response treatment | 489 blanks = missing/unknown, cause unresolved. 0 non-substantive markers |
| Proposed chart | Sorted horizontal bars (desc. by %), 16 options, bar/table toggle, full wording in expandable disclosure, with the answer-base caveat above stated directly on the page (not only in this document) |
| Status | **Verified and available**, small-answer-base caveat displayed prominently — exported to `public/data/findings/stopping_reasons.json` in this pass (was verified but not previously exported) |
| Location | §B — Motivations, barriers and encouragement → "Reasons for stopping investment" |

## 5. Knowledge-battery response distributions and "Not Aware" shares — `GRIDxQ15AM.Q15AM` (9 items)

| | |
|---|---|
| Research question | For each of 9 financial-knowledge statements, what share of the focused group selects True, False, or "Not Aware"? |
| Source fields | `GRIDxQ15AM[{_1..9}].Q15AM` |
| Respondent group | Full focused group (553); **0 blank on any of the 9 items** |
| Calculation and denominator | Response distribution per item; denominator = 553 for every item (full coverage) |
| Missing/special-response treatment | "Not Aware" is an **explicit selected response**, kept as its own category — never merged with missing/blank, never scored as incorrect or correct. No documented answer key exists for this battery in any source used by this project, so **no item is marked correct/incorrect** |
| Proposed chart | One horizontal stacked bar per item (True / False / Not Aware), all 9 in a single chart, sorted by "Not Aware" share descending; full statement wording in an expandable disclosure; accessible response table alongside |
| Status | **Verified and available** — `public/data/findings/who_is_in_sample.json` → `knowledge_grid` (previously rendered on the "Who is in our sample?" tab; relocated to the Analysis page in this pass, per the instruction that reported-uncertainty analysis belongs with Analysis, not the respondent-profile page) |
| Location | §C — Knowledge and reported uncertainty |

Per-item detail (all n = 553, 0 blank):

| Field | Topic (short label) |
|---|---|
| `GRIDxQ15AM[{_1}]` | Expense ratio (direct plans) |
| `GRIDxQ15AM[{_2}]` | PF in stock market |
| `GRIDxQ15AM[{_3}]` | Compounding (short-term) |
| `GRIDxQ15AM[{_4}]` | Online KYC |
| `GRIDxQ15AM[{_5}]` | Demat requirement |
| `GRIDxQ15AM[{_6}]` | Risk vs. return |
| `GRIDxQ15AM[{_7}]` | Diversification |
| `GRIDxQ15AM[{_8}]` | CAS statement |
| `GRIDxQ15AM[{_9}]` | BSDA |

## 6. Barriers by previous MF experience — comparison

| | |
|---|---|
| Research question | Do reported barriers (`AA2_DD2`) differ between past MF investors and respondents reporting no prior investment in `Q24A`'s 7 securities-market products? |
| Source fields | `AA2_DD2` × `Q24A`-derived 3-way class |
| Respondent group | Focused group, split by `Q24A` class, restricted to substantive `AA2_DD2` answerers per class: past MF investor (61 of 136, 44.9%), explicit no-prior-investment (188 of 382, 49.2%), other-product-only (17 of 35, 48.6% — **below the reporting minimum, counts only**) |
| Calculation and denominator | % of each subgroup's own substantive answerers (not of 553, not of the subgroup's full size) |
| Missing/special-response treatment | Coverage checked and reported before any comparison (44.9–49.2%, comparable across the two large subgroups). Comparable coverage is stated as a **necessary precondition check, not proof of freedom from selection bias** |
| Proposed chart | Side-by-side percentage bars per option for the two reportable subgroups, with the third subgroup shown as counts-only text (no bar) |
| Status | **Verified and available** — already explored in `docs/descriptive_findings.md` §5, reproduced as context in `docs/segment_findings.md` §3, exported to `public/data/findings/comparison_by_experience.json` → `barriers_AA2_DD2` |
| Location | §D — Differences between groups → tab "Barriers by previous MF experience" |

## 7. Encouragement by previous MF experience — comparison

| | |
|---|---|
| Research question | Do encouragement factors (`AA3_DD3`) differ between the same three `Q24A`-based groups? |
| Source fields | `AA3_DD3` × `Q24A`-derived 3-way class |
| Respondent group | Same three subgroups as item 6; `AA3_DD3` is answered by the *identical* 266 respondents who answer `AA2_DD2` (verified directly) |
| Calculation and denominator | % of each subgroup's own substantive answerers |
| Missing/special-response treatment | Same coverage caveats as item 6 |
| Proposed chart | Side-by-side percentage bars per option for the two reportable subgroups; other-product-only shown as counts only |
| Status | **Verified and available** — new comparison run in `analysis/04_segment_comparisons.ipynb`, documented in `docs/segment_findings.md` §4, exported to `public/data/findings/comparison_by_experience.json` → `encouragement_AA3_DD3` |
| Location | §D — Differences between groups → tab "Encouragement by previous MF experience" |

## 8. Barriers by income tier — comparison

| | |
|---|---|
| Research question | Do reported barriers (`AA2_DD2`) differ across income tiers? |
| Source fields | `AA2_DD2` × `Q10A`-derived income tiers (adjacent-bracket grouping, boundaries preserved, decided before any barrier result was examined) |
| Respondent group | Focused group, 5 income categories: Up to ₹20,000 (120/218 answered, 55.0%), ₹20,001–₹40,000 (74/182, 40.7%), Above ₹40,000 (40/102, 39.2%) — all three ≥ reporting minimum; `"Do not wish to disclose"` (20/33, 60.6%) and `"No current income"` (12/18, 66.7%) — **both below the reporting minimum, counts only** |
| Calculation and denominator | % of each tier's own substantive answerers. `Q10A` = "Monthly Personal Income (all sources, before tax)" — an individual, all-sources figure, never called "salary" |
| Missing/special-response treatment | Coverage is **more uneven across income tiers (39.2–55.0%) than across previous-experience groups (44.9–49.2%)** — stated explicitly on the page, not smoothed over |
| Proposed chart | Side-by-side percentage bars per option across the three numeric tiers; the two special categories shown as counts only |
| Status | **Verified and available** — `docs/segment_findings.md` §5, exported to `public/data/findings/comparison_by_income.json` |
| Location | §D — Differences between groups → tab "Barriers by income tier" |

## 9. Percentage-point differences in the completed comparisons

| | |
|---|---|
| Research question | How large are the gaps between groups in comparisons 6–8, in percentage points? |
| Source fields | Derived arithmetic on the already-verified percentages in items 6–8 — no new respondent-level computation |
| Respondent group | Same as the underlying comparison (item 6, 7, or 8) |
| Calculation and denominator | `pp_diff = pct(group A) − pct(group B)`, computed only where **both** groups clear the reporting minimum (i.e. never computed against a counts-only group). For income (3 numeric tiers), the reported diff is Above-₹40,000 minus Up-to-₹20,000 (the two tiers spanning the largest gap, per `docs/segment_findings.md` §5) |
| Missing/special-response treatment | No diff is shown for any option/group pair where either side is counts-only |
| Proposed chart | A labeled numeric badge (e.g. "+16.7 pp") attached to each comparison row, not a separate chart |
| Status | **Verified and available** — pure subtraction of already-verified percentages already present in items 6–8's exports; computed client-side at render time, not a new analytical claim |
| Location | §D — Differences between groups (attached to each comparison row, within its tab) |

## 10. Question coverage for every analysis

| | |
|---|---|
| Research question | For every barrier/reason/encouragement field used on this page, what share of the focused group gave a substantive answer, vs. missing, vs. special? |
| Source fields | All of `AA1_DD1`, `AA2_DD2`, `AA3_DD3`, `AA4_DD4` (plus, for completeness, the excluded `A11_D11`–`A15_D15`) |
| Respondent group | Focused group (553) |
| Calculation and denominator | Substantive-answer count / 553, per field |
| Missing/special-response treatment | Blank vs. special kept as separate, explicit columns; "not used" fields shown with their exclusion reason, not hidden |
| Proposed chart | Expandable table, one row per question (field code, answered/553, status, intended respondent group) |
| Status | **Verified and available** — reused directly from `public/data/dataset-method/coverage.json`, not re-exported (per this project's existing convention of treating that file as the source of truth) |
| Location | §A — Overview, as an expandable "Full question coverage" disclosure (kept out of the main scroll to avoid a wall of cards, per the design instructions for this page) |

## 11. Relationship (a) — Risk preference and fear of loss

| | |
|---|---|
| Research question | Among respondents who selected "Fear of losing money due to market risks" on `AA2_DD2`, does their `QRT` risk/return preference differ from those who did not select it? |
| Source fields | `QRT` (4-category risk/return preference, 553/553 answered) × `AA2_DD2` = "Fear of losing money due to market risks" (selected by 81 of 266 `AA2_DD2` answerers) |
| Respondent group | Would be restricted to the **intersection**: focused-group respondents with a substantive `AA2_DD2` answer (266 of 553) — `QRT` alone cannot extend this to the full 553, since the relationship is about what respondents who answered `AA2_DD2` selected |
| Calculation and denominator | **Computed** in `analysis/05_supplementary_measures.ipynb` §8(a): joined `QRT` onto `cohort_focused_considered_mf_not_holding.csv` by `Resp_ID_DP` (never exposed), tokenized `AA2_DD2` using the already-verified vocabulary from `barrier_option_counts.csv`, cross-tabulated at the respondent level. Denominator = 266, split into 4 `QRT` categories (one, n=22, below the reporting minimum) |
| Missing/special-response treatment | Restricted to the 266 substantive `AA2_DD2` answerers; 0 blanks in `QRT` itself |
| Proposed chart | Percentage bars per `QRT` category, rendered in `src/components/analysis/relationships-section.tsx` |
| Status | **Verified and available** — exported to `public/data/findings/relationships.json` → `qrt_fear_of_loss`. Result: 28.0% / 28.1% / 35.4% across the three reportable categories — a weak, non-monotonic pattern (the group expressing some risk tolerance selects this barrier slightly *more* than the two more risk-averse groups), not a clear gradient |
| Location | §E (recreated) — Relationships between reported answers, on the Analysis tab; full definition on the Research Plan page |

## 12. Relationship (b) — Selected knowledge-item responses and demand for education

| | |
|---|---|
| Research question | Do respondents who select "Not Aware" (or a specific incorrect/uncertain response) on one or more `GRIDxQ15AM` items select "Better education on how mutual funds work" (`AA3_DD3`) at a different rate than respondents who don't? |
| Source fields | One or more `GRIDxQ15AM[{_1..9}].Q15AM` items × `AA3_DD3` = "Better education on how mutual funds work" (selected by 97 of 266 `AA3_DD3` answerers) |
| Respondent group | Would be restricted to the 266 `AA3_DD3` answerers (the knowledge-battery items themselves have full 553 coverage, but the encouragement question does not) |
| Calculation and denominator | **Computed** in `analysis/05_supplementary_measures.ipynb` §8(b). Item pre-registered before looking at any result: `GRIDxQ15AM[{_1}]` ("Direct plans in mutual funds have a lower expense ratio than regular plans"), chosen as the one item among the 9 most specifically about mutual-fund product mechanics — not chosen post hoc from whichever showed the largest gap. Denominator = 266, split into True (172) / Not Aware (55) / False (39) |
| Missing/special-response treatment | Restricted to the 266 substantive `AA3_DD3` answerers; 0 blanks in the knowledge item |
| Proposed chart | Percentage bars per knowledge-item response, in `src/components/analysis/relationships-section.tsx` |
| Status | **Verified and available** — exported to `public/data/findings/relationships.json` → `knowledge_item1_education`. Result: 37.8% (True) / 40.0% (Not Aware) / 25.6% (False) — weak and mixed, not a consistent knowledge-gap pattern |
| Location | §E (recreated) — Relationships between reported answers, on the Analysis tab; full definition on the Research Plan page |

## 13. Relationship (c) — Online-KYC knowledge and preference for a simple process

| | |
|---|---|
| Research question | Do respondents who answer the online-KYC knowledge item (`GRIDxQ15AM[{_4}]`, "KYC can be completed online") differently select "Simple and easy process for investing" (`AA3_DD3`) at different rates? |
| Source fields | `GRIDxQ15AM[{_4}].Q15AM` (True / False / Not Aware) × `AA3_DD3` = "Simple and easy process for investing (e.g. account opening, documentation, etc.)" (the single most-selected option overall — 117 of 266, 44.0%) |
| Respondent group | Would be restricted to the 266 `AA3_DD3` answerers |
| Calculation and denominator | **Computed** in `analysis/05_supplementary_measures.ipynb` §8(c): `GRIDxQ15AM[{_4}]` response cross-tabulated against `AA3_DD3`'s "Simple and easy process..." selection, at the respondent level. Denominator = 266, split into True (208) / False (30) / Not Aware (28, below the reporting minimum) |
| Missing/special-response treatment | Restricted to the 266 substantive `AA3_DD3` answerers; 0 blanks in the knowledge item |
| Proposed chart | Percentage bars per knowledge-item response, in `src/components/analysis/relationships-section.tsx` |
| Status | **Verified and available** — exported to `public/data/findings/relationships.json` → `kyc_simple_process`. Result: 45.2% (True) vs. 43.3% (False) — a 1.9pp gap, essentially no difference |
| Location | §E (recreated) — Relationships between reported answers, on the Analysis tab; full definition on the Research Plan page |

**For all three relationships (11–13):** no intersection is derived from the two fields' marginal totals — each used a genuine respondent-level join (`Resp_ID_DP`, never displayed or exported), reusing the already-verified `AA2_DD2`/`AA3_DD3` tokenizer vocabulary rather than re-deriving it. All three describe associations observed in this sample, not causes; no significance test is applied.

## 16. Awareness sources and media — `Q4_Q5_NONInv_Filt[{_1_2}].Q4M`/`.Q5M`

| | |
|---|---|
| Research question | Where does the focused group report hearing about MF/ETF (sources and media)? |
| Source fields | `Q4_Q5_NONInv_Filt[{_1_2}].Q4M` (sources), `.Q5M` (media) |
| Respondent group | Focused group, restricted to the 266 `AA2_DD2` substantive answerers — verified by exact respondent-ID-set comparison to be the identical answer base |
| Calculation and denominator | Multi-select; % of the 266 substantive answerers, per source/medium. A 12-item (sources) and 14-item (media) vocabulary was derived from and verified against all 18,223 workbook-wide non-holder respondents (100% resolved, zero unresolved fragments) before being applied to the focused group |
| Missing/special-response treatment | 287 blank = not part of this answer base, same routing as `AA2_DD2`. Only a combined MF+ETF slot exists for non-holders — no MF-only slot, a survey-design property |
| Proposed chart | Sorted horizontal bars, one for sources and one for media |
| Status | **Verified and available** — `public/data/findings/awareness_sources.json`, rendered on the "Who is in our sample?" tab |
| Location | Findings → "Who is in our sample?" tab → "Reported awareness sources and media" |

## 17. Corrected income allocation — `Q1MXGrid[{_1..5}].Q1M`

| | |
|---|---|
| Research question | How does the focused group report allocating income across 5 categories? |
| Source fields | `Q1MXGrid[{_1..5}].Q1M` (raw numeric), not `Q1M_DP[{_1..5}].Q1M` (derived) |
| Respondent group | Focused group |
| Calculation and denominator | Response distribution per category, banded into deciles from the raw numeric value; 534/532/517/521/527 of 553 answered, per category |
| Missing/special-response treatment | Blank kept as blank — correcting `Q1M_DP`, which silently converted a blank raw value into a `"0%"` category (confirmed: e.g. the investments category shows 32 genuinely blank vs. 75 previously shown as `"0%"`) |
| Proposed chart | Five response distributions |
| Status | **Verified and available** — `public/data/findings/income_allocation.json`, rendered on the "Who is in our sample?" tab. Not validated as a joint budget — never summed into a disposable-income figure |
| Location | Findings → "Who is in our sample?" tab → "Income allocation" |

## 18. Financial-goal ranking — `Q6_RANK_GRID`

| | |
|---|---|
| Research question | Which financial goals does the focused group rank in its top 3 priorities? |
| Source fields | `Q6_RANK_GRID[{_1..13}].Q6_RANK` |
| Respondent group | Full focused group — verified all 553 have ≥1 non-blank slot before computing anything |
| Calculation and denominator | Share of the 553 who ranked each goal anywhere in their top 3 (any non-blank rank) — not a rank-weighted score. 0 respondents used the free-text "Others" 13th slot |
| Missing/special-response treatment | "Others" free-text slot reported as its own separate row, not folded into a named goal |
| Proposed chart | Sorted horizontal bars |
| Status | **Verified and available** — `public/data/findings/financial_goals.json`, rendered on the "Who is in our sample?" tab |
| Location | Findings → "Who is in our sample?" tab → "Financial goals" |

## 19. `Q12M` — distinct from the `GRIDxQ15AM` battery

| | |
|---|---|
| Research question | Can respondents work out that a return below inflation is a real-terms loss? |
| Source fields | `Q12M` |
| Respondent group | Full focused group, 553, 0 blank |
| Calculation and denominator | Correct ("Less than today," the arithmetically correct answer given the question's own 5%-return-vs-6%-inflation numbers) vs. incorrect (all other answers, including "Do not know"/"Refuse to answer"). 245 of 553 (44.3%) correct |
| Missing/special-response treatment | Not applicable — 0 blank |
| Proposed chart | Correct/incorrect table |
| Status | **Verified and available** — already exported in `public/data/findings/demographics.json`, independently reconfirmed in `analysis/05_supplementary_measures.ipynb` §7. Explicitly distinct from the 9-item `GRIDxQ15AM` battery (item 5 above), which has no documented answer key and is never scored |
| Location | Findings → "Who is in our sample?" tab → "Knowledge and learning preferences" |

## 14. Evidence-based conclusions and conditional company investigations

| | |
|---|---|
| Research question | What can be concluded from the verified findings above, and what conditional, evidence-gathering steps follow? |
| Source fields | All verified findings above (items 1–10), synthesized |
| Respondent group | Focused group (553), per-finding denominators as stated in each finding |
| Calculation and denominator | No new calculation — restructures `docs/research_synthesis.md`'s five findings and three proposals into an explicit **What we observed / What it might mean / What remains unknown / What to investigate or test next** structure per conclusion |
| Missing/special-response treatment | Inherited from each underlying finding, restated where relevant |
| Proposed chart | None — structured text cards, one per conclusion |
| Status | **Verified and available** — reuses `docs/research_synthesis.md` (Findings 1–5, Proposals 1–3), restructured for the page, not recomputed |
| Location | §F — Conclusions and next steps |

## 15. Company-side outcomes — documented as a limitation, not a pending measure

**Revision:** this item previously tracked 9 detailed company-KPI definitions (primary/diagnostic/continuation/user-outcome) as a page section (`/research-plan#research-plan-kpis`). That framing has been removed from the dashboard — presenting definitions INDmoney would need to instrument as if they were an unfinished part of *this* project made an out-of-scope dependency look like pending work. This project is defined around what the SEBI survey data supports; company-side product/activity data is out of scope by design.

| | |
|---|---|
| Research question | What would INDmoney need to measure, in its own product, to evaluate any proposal above? |
| Source fields | None in this dataset — by design |
| Respondent group | Not applicable — these are INDmoney user-level product events, not SEBI survey respondents |
| Calculation and denominator | Not applicable — no value, target, or projected improvement is calculated or estimated for any of these from the SEBI sample |
| Missing/special-response treatment | Not applicable |
| Proposed chart | None |
| Status | **Out of scope by design** — this project has no INDmoney activity, onboarding-journey, or conversion records, and provides no evidence that a proposed change would work. Stated once as a limitation, not tracked as blocked/pending work |
| Location | Research Plan page → "Limitations" (`/research-plan#research-plan-limitations`); the detailed KPI definitions (kept only as background reference, not page content) are in `docs/research_and_measurement_plan.md` §5. The Analysis tab's Conclusions section links to the Limitations section, not to a KPI list |

---

## Other items intentionally excluded from this page, with reason

- `A11_D11`–`A14_D14` — target current Investors (holders), an exact base-count match to the wrong population for this non-holder cohort; excluded per `docs/barrier_coverage.md`. Shown only in the reused coverage table (item 10) with their exclusion reason, not analyzed.
- `A15_D15` — routing unresolved (only 1 of 553 answered); excluded from substantive interpretation per explicit prior instruction. Shown only in the coverage table.
- Demographic/psychographic profile fields (`Q1`, `Q3D`, `Q13`, `Q5A`, geography, `Q10M`, `Q11M`, `Q12M`, `Q20CM`, `Q20DM`, `Q20E`, `Q20F`) — these describe **who is in the sample**, not reported motivations/barriers/uncertainty/relationships, and are rendered on the "Who is in our sample?" tab. `Q12M` (the inflation/real-returns literacy question) also stays there: unlike the `GRIDxQ15AM` battery, it has a documented, arithmetic-derived correct answer stated in the question itself, so its correct/incorrect framing is not the "Not Aware"-only measure this Analysis page uses for `GRIDxQ15AM`. **Correction:** `Q20AM` and the 5-item income-allocation battery (`Q1M_DP[{_1..5}].Q1M`) are computed and exported to `public/data/findings/demographics.json`, but — unlike the fields above — are **not currently rendered on the "Who is in our sample?" tab or anywhere else in the dashboard** (the `demographics` export in `src/lib/findings-data.ts` is not yet imported by any component); an earlier version of this note incorrectly implied they were already shown there. Both are now documented instead in the Research Plan page's measure register (`/research-plan`), with the income-allocation battery flagged for cross-field validation before being treated as a joint budget measure.
- Survey weighting (`WeightMainM2`, `Weight_to_Sample`) — a deliberate, separate track per `docs/research_and_measurement_plan.md`'s checklist; not applied anywhere on this page, and every page section states its unweighted status.
- Statistical significance testing — not run for any comparison; two separate open prerequisites (coverage/missingness, already checked per comparison; respondent independence, not assessed) per `docs/research_and_measurement_plan.md` §3.

## Verification (post-build)

- [x] AA1_DD1 and AA4_DD4 exported to `public/data/findings/motivations.json` / `stopping_reasons.json` from already-verified `barrier_option_counts.csv` / `barrier_field_metadata.csv` — no new tokenization or computation, only export of previously-verified aggregates.
- [x] Every displayed count/percentage/denominator on the page traced back to a source JSON value listed above; no value computed from another chart's already-rounded percentage. `comparison_by_experience.json` also gained a `coverage` block (from the already-verified `coverage_AA3_DD3_by_prev_investment.csv`, which applies identically to `AA2_DD2` per the verified-identical-respondent-set fact in `docs/segment_findings.md` §4) so per-group answer counts/denominators can be shown for both barrier and encouragement experience comparisons.
- [x] Percentage-point differences (item 9) computed client-side in `src/lib/analysis-comparisons.ts` only where both sides clear the reporting minimum; spot-checked against `docs/research_synthesis.md` (Finding 4's education gap: 40.4% − 24.6% = 15.8pp; Finding 5's fear-of-loss income gradient: 42.5% − 25.8% = 16.7pp) — both reproduce exactly.
- [x] `AA1_DD1`–`AA4_DD4` kept as four separate `QuestionAnswersCard` sections in §B; no pooled ranking; each uses its own denominator (240/266/266/64), never 553.
- [x] `GRIDxQ15AM` battery relocated from "Who is in our sample?" to the Analysis page (§C); `Q12M` and the preference/education-format fields (`Q20CM`/`Q20DM`/`Q20E`/`Q20F`) left in place on the profile tab, with a note pointing to the Analysis tab for the battery.
- [x] Relationships (a)–(c) were documented as "needs calculation" only in §E in the prior pass — no joint table was invented, no chart rendered for them at that time.
- [x] `npm run lint` and `npx tsc --noEmit` pass after the page changes (2 pre-existing, unrelated errors remain in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`, confirmed present on `main` before this work via `git stash`).
- [x] `npm run build` succeeds; verified via a temporary `next start` instance on a separate port (not the user's dev server) that every section's real computed content (not just static prop strings) renders — including tracking down and fixing a build-specific issue where a top-level `"use client"` section component silently failed to render when placed as a direct sibling among server-rendered sections (fixed by nesting the interactive part one level deeper, matching this codebase's established pattern of server section + client leaf).
- [x] Desktop and mobile layout use the existing responsive pattern (`grid-cols-1 xl:grid-cols-[1fr_240px]`, sticky section nav) already proven on the Dataset and Method page; tables scroll horizontally in their own containers; the "Differences between groups" section uses a tabbed layout (one tab per comparison) with a wrapping tab list for narrow screens.

## Verification (post-build) — supplementary-measures pass

- [x] `analysis/05_supplementary_measures.ipynb` executed end-to-end from a clean kernel (`nbclient`, `sebi-investor-survey` kernel) — all assertions passed (553/4,346 group sizes; 109,430×448 raw shape; 266-respondent population match for `AA2_DD2`/`AA3_DD3`/awareness fields; zero unresolved tokenization fragments for the awareness-source/media vocabularies against all 18,223 workbook-wide non-holder respondents).
- [x] Relationships (a)–(c) are now genuine respondent-level joins (`Resp_ID_DP`, never displayed/exported), reusing the already-verified `AA2_DD2`/`AA3_DD3` tokenizer vocabulary from `barrier_option_counts.csv` rather than re-deriving it (a scratch re-run of the derivation produced 19/11 options instead of the verified 18/10 — not used).
- [x] The knowledge item for relationship (b) (`GRIDxQ15AM[{_1}]`) was pre-registered before any result was examined, documented in `docs/research_and_measurement_plan.md` §6.5 and on the Research Plan page.
- [x] Income allocation recomputed from the raw `Q1MXGrid` field, not the derived `Q1M_DP` field, after confirming the derived field silently converts blank into `"0%"` (verified directly, not assumed).
- [x] Financial-goal ranking's eligibility (all 553 answered) and rank meaning (top-3 priority, values `{1,2,3}`) were verified before computing anything, not assumed.
- [x] `scripts/export_supplementary_measures.py` run after the notebook; every exported JSON value traced back to a notebook-printed value.
- [x] `npx tsc --noEmit`, `npm run lint` (only the same 2 pre-existing unrelated errors), and `npm run build` all pass after the page and Analysis-tab changes.
- [x] No respondent-level data, IDs, or free text in any new export or any new page/component.

---

## 20. Analysis-tab rebuild (this pass) — updated measure-to-location mapping

The Analysis tab was rebuilt from the old 6-section, single-scroll layout (§A–§F above, sticky
right-rail nav) into **one page, 5 topic tabs**, matching the "Research Objectives and Key
Measures" page's register 1:1 by measure id. The old section components
(`overview-section.tsx`, `motivations-barriers-section.tsx`, `knowledge-section.tsx`,
`group-differences-section.tsx`, `relationships-section.tsx`, `comparison-tabs.tsx`,
`conclusions-section.tsx`, `section-nav.tsx`) were deleted, not kept alongside the new ones —
their content was carried forward into the new tabs listed below, not duplicated.

**Update — Findings split into 3 real pages, not tabs.** Findings no longer lives at `/` as a
single page with top-level tabs (who-is-in-sample / analysis / respondent-data). It's now three
separate routes, matching how Dataset and Method and Research Plan are already their own pages:
`/findings/who-is-in-sample`, `/findings/analysis`, `/findings/respondent-data` (dev-only —
`notFound()` in production). `src/app/page.tsx` (`/`) now just `redirect()`s to
`/findings/who-is-in-sample` so old links keep working. The sidebar's "Findings" item
(`src/components/app-sidebar.tsx`) has the 3 pages as sub-items via `NavMain`'s existing
`items`/`Collapsible` support — no new sidebar component needed. `findings-tabs.tsx` (the old
`?tab=` query-param tab switcher) was deleted, since routing replaced it.

**New structure (within `/findings/analysis`):** `src/app/findings/analysis/page.tsx` (server
component, holds `metadata`) → `analysis-tab.tsx` (client, `?topic=` query param, 5 topics,
persistent header) → one file per topic in `src/components/analysis/`:
`overview-tab.tsx`, `motivations-barriers-tab.tsx`, `what-could-help-tab.tsx`,
`risk-knowledge-tab.tsx`, `group-differences-tab.tsx`. Every chart card is the same shared
`analysis-chart-card.tsx` shell (title, scope/denominator line, chart, one observation
sentence, "View table" toggle, "How calculated"/"Why unavailable" button opening the *same*
`MeasureDetailSheet` used on `/research-plan` — so the two pages cannot drift apart).

**URL scheme:** `/findings/analysis?topic=<topic>#<chart-id>` — e.g.
`/findings/analysis?topic=motivations-barriers#barriers-selection-pct`. Every measure below
that now has a chart has a real `analysisHref` in `src/lib/research-plan-data.ts` using this
scheme (previously most had only a plain-text `analysisLocation`). Cross-topic links generated
*within* the Analysis page itself (Overview's "View chart" cards, "See this compared by group")
use `useAnalysisNav()` (`analysis-nav-context.tsx`) instead of `next/link`, since a same-page
query-param change doesn't remount the page and a plain link wouldn't update the visible topic.

| Measure id | New location |
|---|---|
| `motivations-selection-pct` | Analysis → Motivations & barriers → `#motivations-selection-pct` |
| `barriers-selection-pct` | Analysis → Motivations & barriers → `#barriers-selection-pct` |
| `encouragement-selection-pct` | Analysis → What could help → `#encouragement-selection-pct` |
| `previous-investment-shares` | Analysis → Motivations & barriers → `#previous-investment-shares` |
| `stopping-reasons-selection-pct` | Analysis → Motivations & barriers → `#stopping-reasons-selection-pct` |
| `financial-goal-ranking` | Analysis → Motivations & barriers → `#financial-goal-ranking` (also still shown on "Who is in our sample?") |
| `risk-preference-distribution` | Analysis → Risk & knowledge → `#risk-preference-distribution` (also still shown on "Who is in our sample?") |
| `downturn-reaction-distribution` | Analysis → Risk & knowledge → `#downturn-reaction-distribution` (also still shown on "Who is in our sample?") |
| `knowledge-battery-distributions` | Analysis → Risk & knowledge → `#knowledge-battery-distributions` (All-responses/Not-Aware-only toggle) |
| `q12m-inflation-numeracy` | Analysis → Risk & knowledge → `#q12m-inflation-numeracy` — all 5 raw response options shown separately, no combined score (distinct from the "Who is in our sample?" tab's `Q12MCorrectnessCard`, which shows the scored 4-row breakdown for that page's different purpose) |
| `stock-market-familiarity` | Analysis → Risk & knowledge → `#stock-market-familiarity` (also still shown on "Who is in our sample?") |
| `education-attendance` | Analysis → What could help → `#education-attendance` (also still shown on "Who is in our sample?") |
| `learning-preference-fields` | Analysis → What could help → `#learning-format`/`#learning-topics`/`#learning-medium`/`#learning-language` (also still shown on "Who is in our sample?") |
| `awareness-sources-media` | Analysis → What could help → `#awareness-sources-media` (also still shown on "Who is in our sample?") |
| `barriers-by-experience-comparison` | Analysis → Group differences (select: "Barriers by previous MF experience") → `#group-differences-barriers-by-experience` |
| `encouragement-by-experience-comparison` | Analysis → Group differences (select: "Encouragement by previous MF experience") → `#group-differences-encouragement-by-experience` |
| `barriers-by-income-comparison` | Analysis → Group differences (select: "Barriers by income tier") → `#group-differences-barriers-by-income` |
| `pp-differences-supported-groups` | Analysis → Group differences (attached to every comparison row's pp badge) |
| `relationship-risk-fear-of-loss` | Analysis → Group differences (select: "Risk preference and fear of losing money") → `#group-differences-risk-fear-of-loss` |
| `relationship-knowledge-education-demand` | Analysis → Group differences (select: "Fund-fee knowledge and demand for education") → `#group-differences-knowledge-education` |
| `relationship-kyc-simple-process` | Analysis → Group differences (select: "Online-KYC knowledge and preference for a simple process") → `#group-differences-kyc-simple-process` |
| `broader-group-mf-holding-share` | Unchanged — Dataset and Method → `#how-we-selected-the-sample` (context measure, describes the 4,346-person broader group, never the focused group this page studies) |
| `personal-income-distribution` | Unchanged — "Who is in our sample?" tab (context measure; grouping variable for the income comparison, not itself charted on Analysis) |
| `income-allocation-corrected` | Unchanged — "Who is in our sample?" tab (context measure) |
| `a15-d15-lapser-detail` | Unchanged — `needs_clarification`, excluded from substantive interpretation everywhere (only 1 of 553 answered) |

**Group differences (Tab 5) is a single `NativeSelect`, not a third layer of tabs** — one
`AnalysisChartCard` renders whichever of the 6 comparisons (3 group comparisons + 3
respondent-level relationships) is selected, via one shared adapter
(`normalizeRelationship`/`relationshipReportableRange` in `src/lib/analysis-comparisons.ts`)
so both kinds of comparison render through the same `ComparisonRowsCard`/`ComparisonRowsTable`.
A relationship's pp-diff is only shown when there are exactly 2 reportable categories (KYC);
with 3 reportable categories (QRT; the knowledge item), a min–max range is shown instead of an
arbitrarily-chosen pair.

**Print / "show all sections" mode:** the top-level Findings tabs (who-is-in-sample, analysis)
and all 5 Analysis topic tabs use `keepMounted`, so every panel's content exists in the DOM at
all times (hidden inactive panels via the native `hidden` attribute). `src/app/globals.css` adds
`@media print { [data-slot="tabs-content"][hidden] { display: block !important; } }`, so
printing the page renders every tab and topic's content at once, not just the active one.
