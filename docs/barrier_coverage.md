# Barrier-Question Coverage Audit — Focused Group

Coverage audit only. **No barrier rankings are calculated here**, and no unanswered question is treated as "no barrier." All counts are unweighted, computed within the focused group defined in `docs/cohort_definition.md` (salaried Gen Z, Mains-complete, considers mutual funds, does not currently hold them — n = 553).

Three evidence tiers are used and kept distinct throughout (reconciled with `data/processed/analysis/barrier_routing_evidence.csv`):
- **Documented** — a fact or definition literally stated in the SEBI Investor Survey 2025 Main Report PDF (linked from `docs/data_sources.md`), quoted directly (e.g. the Lapser definition, the "2 products" footnote, the Investor/Non-Investor chapter definitions).
- **SUPPORTED (exact base-count match)** — this workbook's field is not named anywhere in the report, but its non-blank count matches a specific published table's base exactly. An exact match on a distinctive number is strong evidence for which population a field targets, but the field-to-table *link itself* is our own inference, not something the report states — so this is never elevated to "Documented" or "Confirmed."
- **SUPPORTED (pattern only) / UNRESOLVED** — a weaker or partial match (shared base with another field, a conceptual-only match, or no match at all).

A blank answer is described as **missing/unknown** by default. It is described as "not administered for [specific documented reason]" only where that reason is itself literally stated in the report (the "2 products" rule below) — never asserted as the explanation for an individual respondent's blank.

## Candidate MF+ETF barrier/reason fields

| Column | Exact question wording (row-2 description, verbatim) |
|---|---|
| `A11_D11` | "A11_D11:MF+ETF - Frequently you invest in MF/ETF." |
| `A12_D12` | "A12_D12: MF+ETF - What you think are the expected returns for Mutual Funds" |
| `A13_D13` | "A13_D13:MF+ETF - What challenges do you face before/ while making fresh investment in MF/ETF" |
| `A14_D14` | "A14_D14:  What challenges do you face after making investment in Mutual Funds" |
| `A15_D15` | "A15_D15: You have not invested in MF/ETF in the last 1 year. Top 3 Reasons are for not investing" |
| `AA1_DD1` | "AA1_DD1:MF+ETF - Top 3 Primary reasons for considering investing in MF/ETFs." |
| `AA2_DD2` | "AA2_DD2:MF+ETF - Top 3 Reasons for not investing in MF/ETF" |
| `AA3_DD3` | "AA3_DD3:MF+EF - Factors would encourage you to consider investing in MF/ETF that you currently do not invest in" |
| `AA4_DD4` | "AA4_DD4: What were the TOp 3 reasons you stopped investing in MF/ETF." |

As established in `docs/data_inspection.md`, every one of these is asked at the **combined MF+ETF level only** — none of them can isolate mutual funds from ETF/Gold ETF.

## Intended respondent group per field

The SEBI Main Report's chapter structure and published tables were matched against these columns by their **base counts**, which line up exactly (workbook-wide, not just the focused group):

| Column | Workbook-wide non-blank | Matches report table (base) | Evidence tier and intended group |
|---|---|---|---|
| `AA2_DD2` / `AA3_DD3` | 18,223 | Table 7.1 / Table 7.2, "Barriers to Invest Among Non-Investors" / "Factors that encourage Non-Investors to invest", MF+ETF base = **18,223** | **SUPPORTED (exact base-count match)**: Non-Investors (Chapter 7) — respondents who do not currently hold the product. The "Non-Investor" concept and both tables' content are documented in the report; the link from `AA2_DD2`/`AA3_DD3` specifically to these tables is our inference from the matching base count |
| `A13_D13` / `A14_D14` | 13,862 | Table 9.2/9.3, "Challenges faced before/during… / after making fresh investments", MF+ETF base = **13,862** | **SUPPORTED (exact base-count match)**: current Investors (Chapter 9) — respondents who hold the product. Same caveat as above |
| `A15_D15` | 5,710 | Report defines "Lapser" (p.5 of the PDF): *"an individual who has not made any investment in the past 12 months and no longer holds any investments"*; a dedicated report section ("Understanding reasons for lapsing among non-investors") discusses this population | **Documented concept, base not matched**: the Lapser *definition* is documented, but no published table's base count matches 5,710 exactly, so the *exact* routing condition (vs. `Q24A` alone) is unresolved — see below |
| `AA1_DD1` | 3,168 | Chapter 8 ("Opportunity Unlocked: The Non-Investor Intenders") covers this population conceptually, but no published table's base matches 3,168 | **SUPPORTED (pattern only)**: likely Intenders (non-investors who report considering/intending to invest), no exact table match |
| `A11_D11` / `A12_D12` | 13,862 (same base as A13/A14) | Not separately tabulated in the report, but shares `A13_D13`'s exact base | **SUPPORTED (pattern only)**: same population as `A13_D13`/`A14_D14`, i.e. current Investors |
| `AA4_DD4` | 1,381 | Matches a "Base : By Products" row (MF column) seen near the dormancy/lapsing discussion | **SUPPORTED (pattern only)**: plausibly a Lapser-adjacent "reasons for stopping" question, exact routing not established |

**Key implication for this study:** `A11_D11`–`A14_D14` target **current investors**, i.e. people who hold MF or ETF. Our focused group is defined by *not* holding mutual funds — so these four columns are largely **not the intended audience** for this cohort, indicated both by the base-count match above and by direct inspection (see next section). `AA2_DD2`/`AA3_DD3` (Non-Investor barriers) and, more tentatively, `AA1_DD1` (considering-reasons) are the fields actually aligned with this cohort's non-holder, MF-considering population.

## Coverage within the focused group (n = 553, unweighted)

| Column | Non-missing | Missing (blank) | Explicit non-substantive |
|---|---|---|---|
| `A11_D11` | 4 | 549 | 0 |
| `A12_D12` | 4 | 549 | 0 |
| `A13_D13` | 4 | 549 | 0 |
| `A14_D14` | 4 | 549 | 0 |
| `A15_D15` | 1 | 552 | 0 |
| `AA1_DD1` | 240 | 313 | 0 |
| `AA2_DD2` | 266 | 287 | 0 |
| `AA3_DD3` | 266 | 287 | 0 |
| `AA4_DD4` | 64 | 489 | 0 |

No explicit "Not Applicable"/"Don't Know"-style non-substantive marker was observed in these nine columns within the focused group — every non-blank value is a genuine multi-select answer string. All blanks above are treated as **missing/unknown**, not as "no barrier reported" — and not asserted to be "not administered" beyond the two specific, documented routing patterns discussed below.

### Why `A11_D11`–`A14_D14` are (almost) all blank here — a data pattern, checked directly

Checked directly: **all 4** focused-group respondents with a non-blank `A13_D13` also hold **ETF** in `Q22A_All` (even though, by the cohort's own definition, none of them hold mutual funds). This is consistent with these four columns being gated on the **combined** MF+ETF holding flag (`{_1_2}` slot used throughout the workbook — see `docs/data_inspection.md`), so holding ETF alone would be sufficient to be routed into these "MF+ETF investor" questions, independent of mutual-fund holding. This is a data pattern observed directly (4 of 4 cases), consistent with the report's Investor/Non-Investor split — with only 4 respondents involved, it indicates the mechanism rather than proving it holds universally.

### `AA2_DD2` / `AA3_DD3` partial coverage — a documented routing constraint

Table 7.1's footnote in the Main Report states explicitly: *"Each respondent was asked to respond on 2 products"* (out of all products they don't currently hold). This directly explains why `AA2_DD2`/`AA3_DD3` cover only 266 of 553 (48%) focused-group members even though the whole group, by definition, does not hold MF: a respondent who doesn't hold several products only has the barrier question asked for 2 of them, randomly or by some undocumented priority — MF may or may not be among the 2 selected for any given respondent. This is the same constraint that plausibly explains `AA1_DD1`'s 240/553 (43%) coverage, though `AA1_DD1`'s exact routing population is not documented (see table above).

### `A15_D15` — routing not resolved

Only 1 of 553 focused-group members (including the 136 identified in `docs/cohort_definition.md` §5 as reporting past MF investment) has a non-blank `A15_D15`. If `A15_D15` routing followed directly from "reported past MF investment in `Q24A`," a much larger overlap with those 136 would be expected. It does not — **this routing condition is not resolved from the file alone** and is not assumed here. Candidate explanations not yet confirmed: `A15_D15` may require the official Lapser definition's *stronger* condition (no investment in the past 12 months **and** no longer holding **any** investment, potentially assessed at a different/stricter recency threshold than `Q24A` captures), or may be subject to the same 2-product sampling constraint as the Non-Investor barrier questions, or both. Flagged as an open item, not resolved.

## What was deliberately not done

- No barrier is ranked or summarized by frequency.
- No blank was recoded as "no barrier" or as any other substantive answer.
- No respondent-level answer is reproduced in this document.
