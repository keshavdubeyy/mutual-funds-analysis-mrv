# Segment Findings — MF Holding Share, Encouragement by Experience, Barriers by Income

Produced by `analysis/04_segment_comparisons.ipynb`, continuing from `docs/cohort_definition.md`, `docs/barrier_coverage.md`, `docs/descriptive_findings.md`, and the corrected `docs/research_and_measurement_plan.md`. **Unweighted, descriptive only.** No respondent-level data in this document, the notebook outputs, or any saved table. No dashboard, no `public/data/` publishing.

## 1. Corrections carried into this stage

- **Holding-status field fixed.** The saved `holds_mf_token` boolean (in `analysis/02_cohort_definition.ipynb`'s extracts) evaluated to `False` for both a genuine non-holder *and* a blank/`"Not Answered"` respondent — indistinguishable. It has been removed and replaced with a three-state `mf_holding_status` (`holds` / `does_not_hold` / `unknown`), gated on interpretability first. **Cohort membership was re-verified after the fix and is unchanged: broader group = 4,346, focused group = 553** — the funnel's own filter already required an interpretable `Q22A_All` before checking for the MF token, so only a reporting column was affected, not who is in either group.
- **Measure 2.2 retired.** "Non-holding share among MF considerers" is no longer reported as a 100% finding — it was a data-consistency check on `Q23A`'s own definition, not an empirical result. See `docs/research_and_measurement_plan.md` §2.2.
- **Barrier routing evidence reconciled.** `AA2_DD2`/`AA3_DD3`/`A13_D13`/`A14_D14` were previously labeled "CONFIRMED" for matching a SEBI report table's base count exactly. That label has been corrected to **SUPPORTED (exact base-count match)** everywhere (`data/processed/analysis/barrier_routing_evidence.csv`, `barrier_field_metadata.csv`, `docs/barrier_coverage.md`, `docs/descriptive_findings.md`): an exact match is strong evidence, but the SEBI report contains no field-code-to-table mapping, so the link is our inference, not something the report states.
- **`Q24A`'s "None of the above" wording corrected.** `Q24A` only offers 7 securities-market products (verified directly against the raw data: MF, ETF, F&O, Stocks, REITs, Corporate Bonds, AIF — the same 7 the SEBI report itself calls "Securities products"). It does not ask about FDs, insurance, EPF, PPF, NPS, post office schemes, gold, or crypto. `"None of the above"` on `Q24A` therefore means "none of these 7 products," not "no prior investment in anything" — corrected in `docs/cohort_definition.md`, `docs/descriptive_findings.md`, and `data/processed/analysis/prev_investment_distribution.csv`.
- **`Q10A` confirmed as "Monthly Personal Income (all sources, before tax)"**, never "salary" — its own wording explicitly says "from all sources," ruling out an employment-income-only reading.
- Blank-answer language tightened to **missing/unknown** by default across the plan and affected docs; "not administered" is used only where a specific reason is textually documented (the SEBI report's "2 products" sampling footnote).
- Coverage-comparability language corrected: matching answer rates across groups is now explicitly described as **not proof of freedom from selection bias** — only a necessary precondition check.
- Routing/coverage and respondent-independence were previously conflated when discussing statistical tests; the plan now treats them as two separate open questions.
- The plan's worked examples no longer use unsupported terms ("loss aversion," "capital-protected products") not grounded in what respondents were actually asked.
- The two KPI definitions in the plan (§5) now separate SIP order placement from payment completion, and require the continued-payment measure to keep cancellations/failures in the denominator and to only count users whose next payment window has actually elapsed.
- The plan's checklist no longer treats survey weighting, contacting INDmoney, or resolving every open cohort item as prerequisites for this explicitly unweighted, academic dashboard.

**Nothing above changed which respondents are in the broader or focused group.**

## 2. Current MF holding share in the broader group (n = 4,346)

| Status | n | % of known-status |
|---|---|---|
| Holds MF | 1,427 | 32.9% |
| Does not hold MF | 2,916 | 67.1% |
| Unknown (blank/`"Not Answered"` `Q22A_All`) | 3 | — |

**Denominator: 4,343 of 4,346 broader-group respondents have a known holding status (99.9% coverage).** Holding share = 1,427 / 4,343 = **32.86%**. This describes this unweighted salaried-Gen-Z sample only — not a market-wide MF penetration estimate. Chart: `analysis/figures/mf_holding_share_broader.png`. Table: `data/processed/analysis/mf_holding_share_broader.csv`.

## 3. Comparison A (context only — not new): barriers by previous MF experience

Already established in `docs/descriptive_findings.md` §5: "Lack of trust in fund managers" ranks top among past MF investors (31.1%, 19/61) but mid-ranked among no-prior-investment respondents (20.7%, 39/188); "Fear of losing money" ranks at or near the top in both. Reproduced here from its saved table for reference; not recomputed as new work.

## 4. Comparison B (new): encouragement factors (`AA3_DD3`) by previous MF experience

**Coverage checked first:** `AA3_DD3` is answered by the *identical* 266 respondents who answer `AA2_DD2` (verified directly, not assumed from the matching overall count of 266). Within previous-investment subgroups: past MF investors 44.9% (61/136) answered, no-prior-investment 49.2% (188/382), other-product-only 48.6% (17/35, below the 30-answer minimum — counts only).

**Main observations** (both groups above the 30-answer minimum; percentages are of each group's own `AA3_DD3` answerers):

- "Simple and easy process for investing (e.g. account opening, documentation, etc.)" is the top-ranked encouragement factor for **both** groups — 49.2% (30/61) of past MF investors, 42.0% (79/188) of no-prior-investment respondents.
- "Better education on how mutual funds work" shows the largest gap: 40.4% (76/188) of no-prior-investment respondents vs. 24.6% (15/61) of past MF investors.
- "Friendly and easy to use trading platforms and tools" is also higher among no-prior-investment respondents (39.4% vs. 32.8%).
- "Positive recommendations from family, friends, or financial advisors" runs the other way: higher among past MF investors (31.1% vs. 23.4%).

Full option table (all 11 options, not just the largest gaps): `data/processed/analysis/comparison_AA3_DD3_by_prev_investment.csv`. Chart: `analysis/figures/comparison_AA3_DD3_by_prev_investment.png`. **Descriptive only — no significance test, no claim that either group's characteristic causes the difference in what they selected.**

## 5. Comparison C (new): reported barriers (`AA2_DD2`) by income tier

**Income tiers, decided before any barrier result was examined** (adjacent `Q10A` brackets only, boundaries preserved): Up to ₹20,000/month (n=218), ₹20,001–₹40,000 (n=182), Above ₹40,000 (n=102), plus `"Do not wish to disclose"` (n=33) and `"No current income"` (n=18) kept as their own categories.

**Coverage checked first, and it varies more by income than it did by previous experience:** 55.0% (120/218) for the lowest tier, 40.7% (74/182) for the middle tier, 39.2% (40/102) for the highest tier — all three clear the 30-answer minimum. `"Do not wish to disclose"` (60.6%, 20/33) and `"No current income"` (66.7%, 12/18) fall **below** the minimum after applying it — reported as **counts only**, per the fixed small-group rule, not plotted.

**Main observations** (three numeric tiers, each ≥ 30 answers):

- "Fear of losing money due to market risks" is notably higher in the **Above ₹40,000** tier (42.5%, 17/40) than in the ₹20,001–₹40,000 tier (32.4%, 24/74) or the Up-to-₹20,000 tier (25.8%, 31/120) — the only option with a clear, monotonic-looking gap across all three tiers in this sample.
- Most other options do **not** show a clean gradient by income. "Lack of knowledge about how mutual funds work," for example, is highest in the Above-₹40,000 tier (30.0%) and lowest in the middle tier (20.3%) — not ordered by income.
- "It's for long term investment" is highest in the middle tier (29.7%) and lowest in the highest tier (22.5%) — again no clean gradient.

Full option table (all 19 options): `data/processed/analysis/comparison_AA2_DD2_by_income_tier.csv`. Chart: `analysis/figures/comparison_AA2_DD2_by_income_tier.png`. **Descriptive only.**

## 6. Weak or inconclusive comparisons

- **The two special income categories** (`"Do not wish to disclose"`, `"No current income"`) have too few `AA2_DD2` answers (20 and 12) to report percentages under the fixed rule — shown as counts only in the saved table, not charted.
- **`past_investor_other_product_only`** (comparisons A and B) remains too small (17 `AA2_DD2`/`AA3_DD3` answers) for percentages in either comparison — counts only, consistent with prior work.
- **Income-tier coverage is uneven** (39%–55%) in a way previous-experience coverage was not (45%–49%) — this makes the income comparison's numeric tiers individually usable, but the comparison *as a whole* is on weaker footing than comparison B, since lower coverage in the two higher tiers means a larger share of each is simply unaccounted for.
- **Most `AA2_DD2` options show no consistent pattern by income tier** — only "Fear of losing money" showed a gradient-like pattern; the rest fluctuate without a clear direction, and none of this was tested for significance.

## 7. Remaining limitations

- All results are unweighted; `WeightMainM2`/`Weight_to_Sample` are preserved in the extracts but not applied anywhere in this notebook.
- No significance test was run for any comparison; none is warranted yet without first assessing survey design (coverage/missingness and respondent-independence, treated as two separate questions — see the plan §3).
- Comparable coverage rates (comparison B) do not prove the answering respondents are representative of their subgroup; differing coverage rates (comparison C) make that concern more visible but do not resolve it either way.
- MF+ETF combined scope applies to every barrier/encouragement finding above — none of it isolates mutual funds from ETF/Gold ETF.
- The three "unknown" broader-group holding statuses, and the two open cohort-definition items (1,338 ambiguous occupation records — 1,320 "Others (Specify)" plus 18 undocumented "Service (Urban)"; `A15_D15`'s unresolved routing), remain documented limitations, not blockers.
- The two new comparisons here are new observations in this specific unweighted sample, not generalizable claims, and not evidence that any product change would affect completion.

## 8. Supplementary measures (new pass, `analysis/05_supplementary_measures.ipynb`)

Headline results for the newly-computed measures — full definitions in `docs/research_and_measurement_plan.md` §6.

- **Awareness sources/media**: among the 266 who answered the barriers question, "Friends, Family, and Colleagues" (57.9%) and "Financial Influencers on social media" (54.1%) are the top-reported sources; "Social media" (57.5%) and "Television" (42.1%) the top media.
- **Corrected income allocation**: recomputed from the raw `Q1MXGrid` field; real blank rates now visible per category (19–36 of 553), no longer masked as "0%" by the derived `Q1M_DP` field.
- **Financial-goal ranking**: "Growing wealth" (42.5%) and "Supporting family members" (37.3%) are the two most commonly top-3-ranked goals of 553; 0 respondents used the free-text "Others" slot.

### Weak or inconclusive relationships

- **Risk preference (`QRT`) and fear of losing money**: no clear gradient — 28.0% / 28.1% / 35.4% across the three reportable `QRT` categories. The group expressing some risk tolerance selects this barrier slightly *more* than the two more risk-averse groups, the opposite of what a simple risk-aversion story would predict.
- **Fund-fee knowledge (`GRIDxQ15AM[{_1}]`) and demand for "better education"**: weak and mixed — 37.8% (selected True) vs. 40.0% ("Not Aware") vs. 25.6% (selected False). Not a consistent knowledge-gap pattern; the group who selected False asks for education *least*, not most. This battery has no documented answer key, so "True"/"False" describe only what was selected, never whether it was correct.
- **Online-KYC knowledge and preference for a "simple process"**: essentially no difference — 45.2% (selected True) vs. 43.3% (selected False), a 1.9pp gap.

All three describe associations observed in this sample, not causes; no significance test is applied to any of them, consistent with §7 above.

Unlike comparisons A–C above (analysis-only at the time this document was first written), the §8 measures were subsequently published: `scripts/export_supplementary_measures.py` exports them to `public/data/findings/` (`awareness_sources.json`, `income_allocation.json`, `financial_goals.json`, `relationships.json`), and they render on the Findings dashboard's "Who is in our sample?" tab and Analysis tab respectively — see `docs/analysis_coverage_checklist.md` items 11–13 and 16–18.
