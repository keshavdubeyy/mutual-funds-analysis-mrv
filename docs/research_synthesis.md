# Research Synthesis — Salaried Gen Z, Mutual Fund Barriers and Encouragement Factors

Synthesizes `docs/research_and_measurement_plan.md`, `docs/descriptive_findings.md`, `docs/segment_findings.md`, `analysis/03_descriptive_analysis.ipynb`, and `analysis/04_segment_comparisons.ipynb`. **Unweighted, descriptive only.** No respondent-level data appears below.

## The original INDmoney question, and the narrower question this data can answer

**Original business question:** how can INDmoney increase first-SIP completion — getting more prospective investors from showing intent to actually completing their first mutual-fund SIP?

**INDmoney's own product data (signups, onboarding steps, order placement, payment success) does not exist in this project.** This project uses the SEBI Investor Survey 2025, a national household survey — a different population, collected for a different purpose, with no link to INDmoney whatsoever. The question this data *can* answer is narrower:

> *What barriers and encouragement factors are reported by salaried Gen Z respondents who have considered mutual funds but do not currently hold them, and how do these differ by income and previous investment experience?*

Everything below describes this SEBI sample. It supports *hypotheses* worth investigating in INDmoney's own product and user research — it does not measure or predict INDmoney outcomes.

## The two respondent groups

- **Broader group, n = 4,346** — Mains-complete, `Life_Stage == "Gen Z"` (SEBI Main Report Annexure: ages 18–28), and `Q14` occupation in the SEBI-documented "Salaried" set. No requirement on MF awareness, consideration, or holding.
- **Focused group, n = 553** — the subset of the broader group who report considering mutual funds (`Q23A`) and have an interpretable, MF-free current-holdings response (`Q22A_All`). Full derivation: `docs/cohort_definition.md`.

Both groups' membership was re-verified after the holding-status field correction (`docs/segment_findings.md` §1) and is unchanged.

---

## Findings

Five findings, selected for relevance to the INDmoney question above — not for which showed the largest gap.

### Finding 1 — A quarter of the focused group are past mutual-fund investors; only some report no prior securities-market investment

- **Counts/denominator:** of the full focused group (n = 553, 0 missing): 136 (24.6%) report previous mutual-fund investment; 382 (69.1%) selected `"None of the above"` on `Q24A`; 35 (6.3%) report prior investment in another securities-market product but not MF.
- **Question wording and scope:** `Q24A` — *"Could you please tell me if you have ever invested in these products in the past"*. Verified directly against the raw data: `Q24A` offers only 7 securities-market products (Mutual Funds, ETF/Gold ETF, Futures & Options, Stocks/Shares, REITs/InvIT, Corporate Bonds, Alternate Investment Fund — the same 7 the SEBI report itself calls "Securities products"). It does **not** ask about Fixed Deposits, insurance, EPF, PPF, NPS, post office schemes, physical gold, or crypto.
- **Which group:** focused group (553).
- **What this supports:** the 382 respondents in the `"None of the above"` category should be described as having **reported none of the seven listed securities-market products** — not as "never invested" or "first-time investors" in any general sense. The focused group as a whole is not a first-time-SIP-user sample; it mixes past MF investors, respondents with no prior securities-market investment (by this narrower definition), and respondents experienced with other securities products but not MF.
- **Alternative explanations / limitations:** none needed for the count itself — this is a direct tabulation of what respondents reported, not an inference. The main risk is *reader* misinterpretation (treating "None of the above" as "financially inexperienced"), which is why the wording above is used throughout this document.
- **Additional evidence that would help:** a question (not present in this workbook) covering the fuller set of financial products would establish whether the 382 have any financial product experience at all, not just securities-market experience.

### Finding 2 — About a third of salaried Gen Z respondents already hold mutual funds

- **Counts/denominator:** 1,427 of 4,343 broader-group respondents with a *known* holding status hold mutual funds = **32.86%**. 2,916 (67.14%) have a known status and do not hold MF. 3 respondents have an unknown status (blank or explicit `"Not Answered"` on `Q22A_All`) and are excluded from the percentage.
- **Question wording and scope:** `Q22A_All` — *"Which of the following financial products do you currently hold investments in"*. This measure isolates **mutual funds specifically** (the literal MF token), not the combined MF+ETF tag.
- **Which group:** broader group (4,346), restricted to the 4,343 with known status (99.9% coverage).
- **What this supports:** mutual fund holding is already fairly common in this specific salaried-Gen-Z sample — useful context for sizing the "non-holder but considering" population (553) against the group it's drawn from, and a reminder that the focused group is a minority, not the typical case.
- **Alternative explanations / limitations:** this is a plain descriptive share of a specific unweighted sample; it is not a market penetration estimate. No claim is made about *why* the other ~67% don't hold MF from this number alone.
- **Additional evidence that would help:** applying `WeightMainM2`/`Weight_to_Sample` (not done in this stage) would show whether this share shifts once population weighting is considered.

### Finding 3 — "Fear of losing money due to market risks" is the most-cited reported barrier

- **Counts/denominator:** 81 of 266 focused-group respondents who answered `AA2_DD2` selected it — **30.5%**.
- **Question wording and scope:** `AA2_DD2` — *"Top 3 Reasons for not investing in MF/ETF"* — **MF+ETF combined scope; cannot isolate mutual funds from ETF/Gold ETF.** Multi-select (each respondent selects exactly 3); percentages are of the 266 who answered, and sum to ~300% across all options, not 100%.
- **Which group:** focused group, restricted to the 266 (48%) who gave a substantive answer to this specific question — the field's base count exactly matches SEBI Main Report Table 7.1 (Non-Investors), which is **SUPPORTED by an exact base-count match**, not confirmed by an explicit named linkage in the report.
- **What this supports:** among focused-group respondents who were asked and answered, concern about losing money is the single most commonly selected reason for not currently investing in MF+ETF.
- **Alternative explanations / limitations:** the 52% who did not answer are excluded from the denominator, not assumed to lack this concern — their views on this question are simply unknown. The reason may reflect general risk aversion, specific market conditions around the survey period, unfamiliarity with risk-mitigation features of MF investing, or something else — this single number cannot distinguish between those.
- **Additional evidence that would help:** a follow-up question on *what specifically* respondents fear (volatility, total loss, lack of guarantees) would help separate a general risk-aversion story from a knowledge-gap story.

### Finding 4 — The top encouragement factor is the same for both past investors and those reporting no prior securities-market investment, but a specific gap exists around financial education

- **Counts/denominators:** `AA3_DD3` (*"Factors would encourage you to consider investing in MF/ETF that you currently do not invest in"* — MF+ETF combined scope) is answered by the same 266 respondents who answer `AA2_DD2` (verified directly: identical respondent sets, not merely equal counts). "Simple and easy process for investing (e.g. account opening, documentation, etc.)" is the top-ranked option for **both** previous-experience groups: 30 of 61 (49.2%) past MF investors, and 79 of 188 (42.0%) respondents reporting none of `Q24A`'s 7 products. The largest gap between these two groups is **"Better education on how mutual funds work"**: 76 of 188 (**40.4%**) of the no-prior-investment group vs. 15 of 61 (**24.6%**) of past MF investors — verified directly against `data/processed/analysis/comparison_AA3_DD3_by_prev_investment.csv` (columns `explicit_no_prior_investment_pct`=40.4/n=76/denominator=188 and `past_mf_investor_pct`=24.6/n=15/denominator=61).
- **Which group:** focused group, split by `Q24A`-based previous-experience category; both subgroups clear the 30-answer reporting minimum used in this analysis (see note below).
- **What this supports:** a simpler onboarding/account-opening process is the most commonly selected encouragement factor regardless of prior experience; wanting more education on how mutual funds work is more commonly selected among those reporting no prior securities-market investment than among past MF investors.
- **Alternative explanations / limitations:** past MF investors may find "education" less relevant simply because they've already been through the product once, not because education wouldn't help them in some other way; conversely, the no-prior-investment group's higher education interest could reflect genuine knowledge gaps or could reflect this group containing relatively more younger/newer earners (not tested here). No significance test was run. Coverage for this comparison (44.9%–49.2%) is similar across groups, but a similar *coverage rate* does not prove the respondents who answered are a representative, unbiased subset of each group — it is a necessary check, not proof of comparability.
- **Additional evidence that would help:** a direct question asking *what kind* of education/process simplification would help (content format, specific steps) would make this actionable; without it, both findings describe *that* something matters more, not *what specifically* to change.

### Finding 5 — "Fear of losing money" is reported more often at higher income tiers, an observed pattern in this sample, not a proven income effect

- **Counts/denominators:** `AA2_DD2`, income tiers built from adjacent `Q10A` brackets, boundaries preserved, decided before any barrier result was examined: **Up to ₹20,000/month** (31/120 = 25.8%), **₹20,001–₹40,000/month** (24/74 = 32.4%), **Above ₹40,000/month** (17/40 = 42.5%). `Q10A` = *"Monthly Personal Income from all sources before tax"* — an individual, all-sources, pre-tax figure; **not** "salary," and not household income.
- **Which group:** focused group, split by income tier. **Question coverage is uneven across these tiers** — 55.0% (120/218) for the lowest tier, 40.7% (74/182) for the middle tier, 39.2% (40/102) for the highest tier — noticeably more uneven than the previous-experience split in Finding 4 (44.9%–49.2%). All three numeric tiers clear the 30-answer reporting minimum used here; `"Do not wish to disclose"` (20/33 answered) and `"No current income"` (12/18 answered) do not, and are reported as counts only, not percentages.
- **What this supports:** within this sample, and only among the ~39–55% of each income tier who answered this specific question, reported fear of losing money rises as income tier rises. Most other `AA2_DD2` options do **not** show a similar gradient by income tier (e.g. "Lack of knowledge about how mutual funds work" is highest in the top tier and lowest in the middle one — not ordered by income at all).
- **Alternative explanations / limitations:** **this is an observed pattern across the three chosen income tiers, not a proven income effect.** Only one option out of nineteen shows anything like a consistent gradient; the uneven coverage across tiers (fewer than half of the two higher tiers answered at all) means the pattern could partly reflect differences in who answered, not just differences in what was felt; no significance test was run, and the tiering itself (adjacent-bracket grouping around round numbers) is one reasonable choice among others. Higher earners may have more to lose in absolute terms, may be more exposed to market-linked products already (see Finding 2), or the pattern could be sensitive to exactly how the tiers were drawn.
- **Additional evidence that would help:** repeating this check with a different (but still principled, pre-registered) income cut would show whether the gradient is robust to tier choice; weighting would show whether it survives population adjustment; a larger, higher-coverage follow-up on this specific question would reduce the uneven-coverage concern.

**Note on the 30-answer minimum used throughout:** this is a **reporting convention** adopted for this analysis to avoid displaying volatile percentages from very small samples — it is **not** a statistical reliability or significance threshold, and clearing it does not mean a result is statistically robust. No significance testing has been performed on any finding above.

---

## Research-backed proposals

Structure: **Observed finding → tentative explanation → proposed investigation or change → how to evaluate it.** Every proposal is conditional on further evidence INDmoney would need to gather — none of this SEBI data can confirm an INDmoney interface problem or predict a conversion improvement.

### Proposal 1 — Investigate onboarding friction before designing a fix

- **Observed finding:** "Simple and easy process for investing" is the top-selected encouragement factor for both previous-experience groups (Finding 4); it is also the top-selected option overall in the broader barrier/encouragement analysis (`docs/descriptive_findings.md`).
- **Tentative explanation:** perceived account-opening/documentation friction may be a consideration for this population when thinking about investing in MF+ETF. This is a survey response about a general product process, not a diagnosis of anything specific in INDmoney's own flow.
- **Proposed investigation:** **before any A/B test**, review INDmoney's own onboarding funnel data (step-by-step drop-off, time-on-step) and support-ticket themes for new users attempting a first MF purchase, and/or run a small moderated usability study with prospective non-holding users attempting onboarding. The actual friction point (if any) in INDmoney's product is unknown from this SEBI data and must be established first.
- **How to evaluate:** if a specific friction point is identified, test a targeted fix, evaluated using the three-part outcome structure below (order placement, first payment, continued payments) rather than a single "conversion" number — plus a brief user-outcome check (e.g. a short comprehension question on what a SIP is and what happens if a payment fails) to confirm users understand what they signed up for, not just that they completed a form faster.

### Proposal 2 — Investigate whether financial-education content changes anything, segmented by prior experience

- **Observed finding:** "Better education on how mutual funds work" is selected notably more by respondents reporting no prior securities-market investment (40.4%) than by past MF investors (24.6%) (Finding 4).
- **Tentative explanation:** users with no prior securities-market experience may benefit from more foundational content than those who have already invested before, though the survey does not say what content or format would help.
- **Proposed investigation:** review whether INDmoney already has educational content in its onboarding flow and, if so, whether usage/completion of that content differs for users who self-identify (via any existing signup question) as new to investing vs. experienced; if no such segmentation exists today, consider a lightweight addition before building new content.
- **How to evaluate:** if a gap is confirmed, test specific educational content (not assumed in advance to be effective) against the three-part completion outcomes below, plus a pre/post comprehension check on a small number of core concepts (e.g. what a SIP is, what an expense ratio is) — the goal is confirming understanding increased, not just that a screen was viewed.

### Proposal 3 — Treat lapsed investors, no-prior-investment respondents, and other-product investors as potentially different segments, not one "non-holder" group

- **Observed finding:** the focused group mixes three meaningfully different histories (Finding 1): past MF investors (24.6%), respondents reporting none of `Q24A`'s 7 securities-market products (69.1%), and respondents experienced with other securities products but not MF (6.3%). Comparison A (`docs/descriptive_findings.md` §5) already shows these groups report somewhat different top barriers (e.g. "Lack of trust in fund managers" ranks higher among past investors).
- **Tentative explanation:** a lapsed investor's concerns (e.g. trust in fund managers, past experience) may differ systematically from a genuinely new investor's concerns (e.g. education, process simplicity) — but this is inferred from a small, unweighted subgroup difference and not confirmed.
- **Proposed investigation:** check whether INDmoney's own signup/KYC flow already captures any prior-investment signal (e.g. existing Demat/MF folio detection) that could be used to segment messaging; if not, evaluate whether adding a single lightweight onboarding question is feasible before building segment-specific flows.
- **How to evaluate:** if segmentation is feasible, compare the three completion outcomes below across segments (not pooled into one "non-holder" number), watching specifically for whether a one-size-fits-all message underperforms a segment-tailored one for any group.

### Outcome measures for evaluating any of the above (kept separate, per `docs/research_and_measurement_plan.md` §5)

1. **First-SIP order placement** — a user sets up/submits a SIP mandate.
2. **First successful SIP payment** — the first scheduled debit under that mandate actually succeeds (distinct from placement; an order can be placed and still fail here).
3. **Continued scheduled payments** — among users whose first payment succeeded, the share who also complete later scheduled payments, counted only once the relevant payment's due date has passed, with cancellations and failed payments kept in the denominator (not dropped).

Alongside completion, include a **user-outcome check** appropriate to the proposal (e.g. a brief comprehension check on investment risk or on what a SIP is) — confirming that faster or higher completion isn't coming at the cost of understanding what was purchased. None of these three measures, or the comprehension check, can be calculated from the SEBI data used in this project; they require INDmoney's own event instrumentation and sign-off, as detailed in `docs/research_and_measurement_plan.md` §5.

---

## Sources

- `docs/cohort_definition.md`, `docs/barrier_coverage.md` — cohort and field-routing definitions.
- `docs/descriptive_findings.md`, `docs/segment_findings.md` — the descriptive and segment-comparison analyses this synthesis draws from.
- `docs/research_and_measurement_plan.md` — measurement definitions, KPI structure, and the corrections carried forward here.
- `data/processed/analysis/*.csv` — the verified aggregate tables cited above.

**Stops here.** No dashboard components built in this step.
