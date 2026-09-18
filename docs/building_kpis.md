# Building KPIs for This Problem Statement

**Problem statement:** What barriers and encouragement factors are reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them, and how do these differ by income and previous investment experience? (Eventual business goal: give INDmoney testable ideas to improve first-SIP completion.)

This document explains, in simple terms, how the KPIs on this dashboard were built from the SEBI Investor Survey 2025 data, and why some KPIs INDmoney would eventually want are **not** in this data at all. Full technical definitions live in `docs/key_research_indicators.md` and `docs/research_and_measurement_plan.md` — this is the plain-language walkthrough of the *method*.

---

## 1. The general recipe

Almost every KPI on this dashboard is built the same way:

1. **Start with the right group of people.** Usually the "focused group" — 553 salaried Gen Z respondents who said they've considered mutual funds but don't currently hold them.
2. **Keep only the people who actually answered the question.** Many questions were only asked to a subset (routing), so blanks are dropped from both the top and bottom of the fraction — never counted as a "no."
3. **Count how many chose each option.**
4. **Divide by the number of people who answered** (not always 553), then multiply by 100.

That's it: **KPI = (count who selected an option) ÷ (count who substantively answered that question) × 100.**

Two rules apply everywhere:
- A blank answer means *missing/unknown*, never "selected nothing" or "answered no."
- Many questions are multi-select (pick up to 3), so percentages for a question can add up to roughly 300%, not 100%.

---

## 2. The core KPI groups

| Group | What it measures | Built from | Answer base |
|---|---|---|---|
| Motivations | Why people consider MF/ETF | `AA1_DD1` | 240 of 553 |
| Barriers | Why people haven't invested yet | `AA2_DD2` | 266 of 553 |
| Encouragement | What would help them invest | `AA3_DD3` | 266 of 553 |
| Previous experience | Past MF / other-product / no prior investment | `Q24A` | 553 of 553 |
| Stopping reasons | Why past investors stopped | `AA4_DD4` | 64 of 553 (small, uncertain population) |
| Risk preference & downturn reaction | Self-described risk appetite | `QRT`, `Q10M` | 553 of 553 |
| Knowledge uncertainty | Which of 9 statements draw "Not Aware" | `GRIDxQ15AM` | 553 of 553 (per item) |
| Group differences | Same KPI, split by income or experience | Barrier/encouragement fields × `Q24A` / `Q10A` | varies, checked per group |

**Worked example (barriers):** "Fear of losing money due to market risks" was picked by 81 of the 266 people who answered the barriers question → 81 ÷ 266 × 100 = **30.5%**, the single most-cited barrier.

---

## 3. KPIs that compare groups

To answer the "how do these differ by income and previous investment experience" half of the problem statement, the same barrier/encouragement KPIs are recomputed **separately for each subgroup**, then compared:

- **By previous experience:** split the 553 into 3 groups from `Q24A` — past MF investors, no prior investment in any of 7 listed securities products, invested in something else but not MF — then compute each barrier/encouragement % *within* each group's own answerers.
- **By income:** group `Q10A` responses into a small number of adjacent-bracket income bands (decided before looking at any barrier result, to avoid cherry-picking), then compute each barrier % within each band's own answerers.
- **Percentage-point gap:** the plain difference between two group percentages (e.g. 40.4% − 24.6% = 15.8pp), only reported when both groups have at least 30 answerers.

**Before trusting any group comparison, coverage is checked first** — what share of each group actually answered the question. Similar coverage across groups is a precondition, not proof the groups are free of selection bias.

---

## 4. Guardrails that shape every KPI here

- **Unweighted.** No SEBI survey weight is applied — every KPI describes this specific sample, not the national population.
- **Descriptive, not causal.** A KPI like "30.5% cite fear of loss" describes what was reported — it does not prove fear of loss *causes* non-investment.
- **No significance testing.** Group differences are reported as plain percentage-point gaps, not p-values, because the survey's clustering/independence design hasn't been assessed.
- **Small groups get counts, not percentages.** Below ~30 answerers, a group is shown as a raw count so a shaky KPI isn't dressed up as a precise rate.
- **MF+ETF combined.** Every barrier/encouragement/motivation field asks about mutual funds and ETFs together — there's no mutual-fund-only version of these KPIs in the survey.

---

## 5. KPIs that are *out of scope* — deliberately not built here

The eventual business goal (improve first-SIP completion) needs KPIs this survey **cannot** produce, because SEBI data has no visibility into INDmoney's product or user behavior:

- **Order placement rate** — share of users who reach onboarding who go on to place a first SIP order.
- **Payment completion rate** — share of placed orders whose first scheduled debit actually succeeds.
- **SIP persistence rate** — share of first-time payers who complete a second (and later Nth) scheduled payment, with lapsed/cancelled payments kept in the denominator, not dropped.

These require INDmoney's own event data (onboarding started, SIP order placed, SIP debit succeeded/failed) and are documented here only as a template for whoever eventually instruments them — not calculated, approximated, or benchmarked from this survey.

---

## 6. Where to look next

- Exact field-by-field definitions, denominators, and worked examples: `docs/key_research_indicators.md`
- Full measurement rationale, missing-data rules, and open limitations: `docs/research_and_measurement_plan.md`
- Underlying computation notebooks: `analysis/03_descriptive_analysis.ipynb`, `analysis/04_segment_comparisons.ipynb`, `analysis/05_supplementary_measures.ipynb`
