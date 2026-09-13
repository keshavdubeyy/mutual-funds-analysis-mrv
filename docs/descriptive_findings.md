# Descriptive Findings — Salaried Gen Z, Considered Mutual Funds, Currently Non-Holding

Produced by `analysis/03_descriptive_analysis.ipynb` from the validated extracts in `data/processed/` (see `docs/cohort_definition.md`, `docs/barrier_coverage.md`). **Unweighted descriptive statistics only** — both weight columns are preserved in every saved table but not applied anywhere below. This is a respondent-level SEBI Investor Survey 2025 analysis: **not** an INDmoney conversion analysis, not app-drop-off data, and (confirmed again below) not a "first-time SIP users" sample. No respondent-level records appear in this document, the notebook outputs, or the saved tables.

Aggregate tables: `data/processed/analysis/*.csv`. Charts: `analysis/figures/*.png`. Nothing here has been copied to `public/data/` — denominators and definitions still need review before that happens.

## 1. Clarifications to the cohort counts

**The 1,338 ambiguous occupation records are two unrelated things, not one group:**
- **1,320** respondents answered `Q14` as the free-text catch-all `"Others (Specify)"` — SEBI's own occupation-bucket scheme (the Main Report Annexure) doesn't name this category, and its free-text content isn't in this workbook.
- **18** respondents fall into two specific `"Service (Urban)"` categories (`...10 to Graduate` = 13, `...illiterate to 9th standard` = 5) whose **Rural siblings are explicitly listed as Salaried in the Annexure, but these two Urban ones are not mentioned anywhere in it** — a likely documentation gap, not assumed to be Salaried.

These do not overlap (`1,320 + 18 = 1,338` exactly, re-verified in the notebook by reloading the raw workbook and reconciling `included (4,346) + excluded (18,892) + ambiguous (1,338) = 24,576` with no double-counting).

**The 892 "consideration unknown" exclusions**: `Q23A` is **missing/unknown** for these salaried Gen Z Mains-completers — non-administration is a plausible reading (this is a routed, computer-assisted survey), but no report text documents this specific pattern, so it is not asserted as a proven "not administered because X." Investigated directly: the split is **not** explained by `QFL` Investor/Non-Investor status (≈55% vs. ≈57% Investor in the two groups — essentially identical), **not** explained by current MF-holding (≈33% vs. ≈33% — identical), but **is** tightly linked to `Q25A`: 891 of the 892 also have a blank `Q25A`. A shared routing gate clearly exists for these two future-facing questions; the variable driving it is not identified from the fields available. Reported as unresolved, per `docs/cohort_definition.md` §6 — not given an invented explanation.

**Barrier-field routing evidence, kept typed and explicit** (`data/processed/analysis/barrier_routing_evidence.csv`). Note: an exact base-count match to a published table is strong evidence but is still our own inference bridging this workbook's field codes to the report's tables (the report contains no such field-code mapping) — it is recorded as **SUPPORTED**, never "CONFIRMED":

| Tier | Fields |
|---|---|
| SUPPORTED (exact base-count match) | `AA2_DD2` (Table 7.1), `AA3_DD3` (Table 7.2) |
| SUPPORTED (exact base-count match), but wrong population for this cohort | `A13_D13`, `A14_D14` (Table 9.2/9.3 — current Investors) |
| SUPPORTED by pattern only (shared base or partial match, no titled table) | `A11_D11`, `A12_D12` (share A13_D13's base), `AA1_DD1` (Intenders, plausible), `AA4_DD4` (Lapser-adjacent, plausible) |
| UNRESOLVED | `A15_D15` |

No inferred rule is reported as more strongly evidenced than this table shows.

## 2. Focused-group profile (n = 553), broader group (n = 4,346) for context

**Income (`Q10A`, Monthly Personal Income — primary measure for this cohort since it's specific to the individual as a salaried earner)**: the focused group's income is concentrated in the ₹15,001–₹40,000/month range (18.8% + 18.1% + 14.8% ≈ 52% across the ₹15–40k brackets), a shape very close to the broader group's. 6.0% (33/553) said "Do not wish to disclose" and 3.3% (18/553) reported "No current income" — both kept as their own explicit categories, not folded into any bracket or into missing. **0 missing** for `Q10A` in either group. See `focused_income_profile.png` and `income_distribution.csv` (which also carries `Q10`, household income, for both groups).

**Occupation**: within the focused group, `Clerk / Salesman` (37.8%), `Officer/Executive - Junior` (26.8%) and `Supervisory Level` (26.2%) dominate — a mix nearly identical in shape to the broader group's (38.7% / 26.2% / 26.1%). No occupation sub-category stands out as disproportionately over- or under-represented among those who consider-but-don't-hold MF, versus the broader salaried Gen Z population. See `occupation_distribution_focused_vs_broader.csv`.

**Previous mutual-fund investment (`Q24A`)** — 0 missing/unknown in the focused group. **Correction:** `Q24A` only offers 7 securities-market products (MF, ETF, F&O, Stocks, REITs, Corporate Bonds, AIF — the same 7 the SEBI report itself calls "Securities products"), not the fuller ~20-item list `Q22A_All` asks about. `"None of the above"` therefore means *no prior investment in any of these 7 products*, not "no prior investment in anything" — an earlier version of this table used the latter, broader wording, which is corrected here:

| | n | % |
|---|---|---|
| Yes — reported previous MF investment | 136 | 24.6% |
| `"None of the above"` — no prior investment in any of `Q24A`'s 7 securities-market products (does not rule out FDs, insurance, EPF, gold, etc., which `Q24A` doesn't ask about) | 382 | 69.1% |
| Invested previously in one of the other 6 securities-market products, not MF | 35 | 6.3% |

**This group is not "first-time SIP users."** A quarter of it has already invested in mutual funds before and stopped; the rest split between no prior securities-market investment (per the scope above) and having invested in another securities-market product but never MF. See `focused_prev_investment_experience.png` and `prev_investment_distribution.csv`.

## 3. Barrier fields analyzed vs. excluded

**Analyzed** (suitable — see `barrier_field_metadata.csv` for the full per-field record: wording, scope, intended group, routing evidence, n, denominator):
- `AA2_DD2` (reasons for not investing) — n answered = 266/553, Non-Investor population, SUPPORTED by an exact base-count match.
- `AA3_DD3` (factors that would encourage investing) — n answered = 266/553, Non-Investor population, SUPPORTED by an exact base-count match.
- `AA1_DD1` (reasons for considering) — n answered = 240/553, population inferred (likely Intenders), not matched to an exact table base.
- `AA4_DD4` (reasons for stopping) — n answered = 64/553, population inferred (likely Lapser-adjacent), small-n caveat applies.

**Excluded from substantive analysis:**
- `A11_D11`–`A14_D14` — SUPPORTED by an exact base-count match to target current Investors, not this non-holder cohort; the mismatch is also shown directly in this sample (all 4 focused-group respondents who answered any of these hold ETF, none hold MF — consistent with routing via ETF-holding, not MF).
- `A15_D15` — per explicit instruction, kept out of substantive interpretation: its routing is unresolved (base doesn't match any table, and only 1 of 553 respondents — including the 136 known past MF investors — has an answer).

Multi-select handling: each respondent counted once per selected option (always exactly 3, confirmed — option percentages sum to ~300%, not 100%). `"Other (please specify)"` kept as its own real option. Special/non-substantive markers: **0 observed** in any of these 9 fields within the focused group — every non-blank value here is a genuine answer. Denominator for every percentage = respondents who gave a substantive answer to *that specific* field (stated on every chart and in `barrier_field_metadata.csv`), not the full 553. Vocabulary for these multi-select fields (which have their own comma-bearing option labels, e.g. *"High fees, charges and Management expenses"*) was derived from the data itself and validated to fully resolve every distinct raw value — not typed in or split blindly on commas.

## 4. Strongest descriptive findings, with evidence

- **Fear of losing money due to market risks is the single most-cited reason for not investing in MF+ETF.** 81 of 266 focused-group respondents who answered `AA2_DD2` selected it (30.5%). Describes: focused group (salaried Gen Z, considers MF, doesn't hold it), among the 266 who answered this specific question. Limitation: only 48% of the focused group answered this question at all (a documented "2 products" sampling constraint); the other 52% gave no answer to this question and are excluded from the denominator, not assumed to lack this barrier.
- **The single most-cited factor that would encourage investing is a simpler onboarding process.** "Simple and easy process for investing (e.g. account opening, documentation, etc.)" was selected by 117 of 266 `AA3_DD3` respondents (44.0%) — the highest share of any option across any of the four analyzed fields. Same population and coverage caveat as above.
- **Income and occupation profiles of the focused group closely mirror the broader salaried Gen Z group.** No income bracket or occupation category is conspicuously over/under-represented in the 553 relative to the 4,346 (see §2 tables). Limitation: this is a shape comparison only; no statistical test was run.
- **A quarter of the focused group are past mutual-fund investors, not first-time prospects.** 136 of 553 (24.6%) report previous MF investment. Limitation: `Q24A` doesn't establish recency or amount invested, only that an investment happened at some point.

## 5. The one comparison: `AA2_DD2` by previous MF experience

Coverage was checked first and found comparable across all three previous-investment subgroups (44.9%–49.2% answered `AA2_DD2`), so the comparison is reported for the two subgroups large enough for percentages: **past MF investors** (61 answered) and **explicit no-prior-investment respondents** (188 answered); the third subgroup (invested elsewhere only, 17 answered) is shown as counts only, per instructions, and not plotted.

**Observation:** "Lack of trust in fund managers" is the top-ranked reason among past MF investors (31.1%, 19/61) but a mid-ranked reason among never-invested respondents (20.7%, 39/188 — see `comparison_AA2_DD2_by_prev_investment.csv` for its exact rank there). "Fear of losing money due to market risks" ranks at or near the top in both groups (29.5% vs. 31.4%).

**This is reported as a descriptive pattern in this specific unweighted sample only.** No significance test was run; n = 61 and n = 188 are both modest; this is not evidence that prior MF experience *causes* distrust of fund managers, and it is not claimed to generalize beyond this cohort. Comparable answer rates across the two subgroups make the comparison worth reporting, but similar coverage does **not** prove either subgroup's respondents are free from selection bias — it only shows the non-response *rate* was similar, not that who-answered-and-who-didn't is comparable within each subgroup.

## 6. Unresolved issues affecting interpretation

- The routing gate behind the 892 `Q23A`-blank exclusions is real (confirmed via the `Q25A` lockstep pattern) but its cause is unidentified.
- The two "Service (Urban)" occupation categories (18 respondents) remain ambiguous — a documentation gap next to an already-included sibling, not resolved here.
- `A15_D15`'s routing relative to `Q24A` is unresolved; excluded from interpretation entirely.
- `AA1_DD1` and `AA4_DD4`'s intended respondent populations are inferred, not confirmed by an exact published-table match — findings from these two fields should be read with correspondingly lower confidence than `AA2_DD2`/`AA3_DD3`.
- All results are unweighted. `WeightMainM2` and `Weight_to_Sample` are preserved in every extract and every saved table's source data but have not been applied — weighted estimates could differ from the unweighted shares reported here.
- MF+ETF combined scope applies to every barrier finding in §4-5: none of it isolates mutual funds from ETF/Gold ETF.

**Stops here.** No Next.js dashboard, no `public/data/` publishing — those come after these definitions and denominators are reviewed.
