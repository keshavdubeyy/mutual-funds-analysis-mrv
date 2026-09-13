# Data Inspection — SEBI Investor Survey 2025

Summary of `analysis/01_data_inspection.ipynb`. Inspection only — no sample filtering, imputation, calculated findings, or dashboard charts. No respondent-level examples or identifiers are included below (see the notebook's guidance on that).

## Files and sheets

`data/raw/` contains two workbooks, each with a single sheet:

| File | Sheet | Records (excl. 2 header rows) | Columns |
|---|---|---|---|
| `Respondent Data.XLSX` | `RLD` | 109,430 | 448 |
| `Intermediary Data.XLSX` | `T1` | 1,313 | 70 |

Both follow the same layout: **row 1 = short column codes, row 2 = full question description, row 3 onward = data.**

### Intermediary workbook (documented, then left aside)

Surveys **market intermediaries** (RIAs, distributors, brokers) — their category, tenure, customer base, geography, and their *perceived* familiarity/risk-rating of investors for various securities products (grid questions covering Stocks, Mutual Funds, F&O, ETF/Gold ETF, Corporate Bonds, REITs/InvIT, AIF). This is intermediary-reported opinion data, a different unit of analysis from the respondent survey, and is not used further. Its identifier column `INTNR` has 7 duplicate values out of 1,313 rows — noted, not investigated.

All further analysis in this document concerns the **respondent workbook** only.

## Structure of the respondent workbook

- 109,430 respondent records, 448 columns, no duplicate column codes.
- 5 columns have a row-2 "description" that adds nothing beyond the code itself (e.g. `Resp_ID_DP`, `Life_Stage`) — no description was invented for these in the data dictionary.
- **Two survey stages, not one flat pass:**
  - Every respondent went through **Listing** (screening).
  - `QLISTMAIN`/`MAIN_COMP_STATUS` show 56,073 respondents were closed out at Listing only, and 53,357 continued to **Mains** (the detailed section) — an exact match between the two fields.
  - `QFL` (Investor: 27,882 / Non-Investor: 81,548) is a **separate** classification decided at Listing; it does not align with the Mains-completion split and must not be conflated with it.
  - `INT_TYPE` mixes a `Random` sample (91,950) with a `Booster` sample (17,480) — relevant to weighting.
  - Within Mains, routing narrows further: e.g. the MF+ETF-specific follow-up questions are answered by only 13,862 of the 53,357 Mains-completers.
- **134 of 448 columns (~30%) are entirely blank** across all 109,430 records — almost all are per-product slots inside repeated grid questions, for products *other than* F&O, Stocks/Shares, REITs/InvIT, Corporate Bonds, AIF and the combined MF+ETF slot. Whether this is genuine zero incidence or a narrower export/routing is **not established from the file alone** (see Open questions).
- **Encoding artifact in the source file itself:** several description/answer strings contain mojibake (e.g. `â€“` for an en-dash), confirmed present in the workbook's own `sharedStrings.xml` — not introduced by our reading tools. Affects display of some punctuation only.

## Candidate fields for this study

| Topic | Candidate columns |
|---|---|
| Survey completion / stage | `MAIN_COMP_STATUS`, `QLISTMAIN`, `INT_TYPE`, `QFL` |
| Age / generation | `Life_Stage` (derived; **no raw age-in-years field exists anywhere in the workbook**) |
| Employment / occupation | `Q14`, `CWE` |
| Income | `Q10` (household), `Q10A` (personal) |
| Investment awareness | `Q21A`, `Q1A`, `Q29` |
| Mutual-fund consideration | `Q23A`, `Q25A`, `AA1_DD1`, `AA2_DD2`, `AA3_DD3` |
| Current mutual-fund holdings | `Q22A_All`, `GRIDxP1[{_1_2}].P1`, `Q2MXGrid[{_1_2}].Q2M`, `ADI_Dashboard[{_1_2}].Slice` |
| Previous mutual-fund investment | `Q24A`, `NI_Dashboard[{_1_2}].Slice`, `A15_D15`, `AA4_DD4` |
| Reported investment barriers | `A13_D13`, `A14_D14`, `AA2_DD2`, `AA3_DD3` |
| Survey weights | `WeightMainM2` (Mains population), `Weight_to_Sample` (full Listing population) |
| Respondent identifier | `Resp_ID_DP`, `UniqueId_DP` |

`Life_Stage` (Gen Z / Millennials / Generation X / Baby Boomers) is the closest available proxy for age; its band construction (birth-year cutoffs) is not documented in the workbook.

### Do any questions combine Mutual Funds and ETFs?

Yes — two distinct patterns:

- **Kept separate, with a combined tag added:** `Q21A`, `Q22A_All`, `Q23A`/`Q25A`, `Q24A` list *"Mutual Funds (One-time Lumpsum / SIP)"* and *"Exchange Trade Funds (ETF) / Gold Exchange Trade Funds (Gold ETF)"* as distinct selectable items, plus an `MF_ETF`/`MF+ETF` marker appended whenever either is chosen. A plain-MF and a plain-ETF count can both be recovered here.
- **Combined only, cannot be separated:** every `A#_D#`/`AA#_DD#` column and the `GRIDxP1`, `Q2MXGrid`, `GridxQ7`, `Q14M_RANK_GRID`, `Q15M_RANK_GRID`, `Q4_Q5_Inv_Filt`/`Q4_Q5_NONInv_Filt`, `ADI_Dashboard`/`NI_Dashboard` `{_1_2}` slots ask about **MF+ETF as one combined product**. Barriers, reasons, frequency, expected returns, and active/dormant status are only ever recorded at this combined level — there is no column reporting these for Mutual Funds alone.

Any use of the barrier/reason columns is therefore reporting on **mutual funds and ETFs/Gold ETFs together**, not mutual funds in isolation.

## Data-quality / interpretation risks

- **Blank ≠ explicit non-response ≠ "No".** `python_calamine` returns an empty string for a blank/unasked cell. Explicit answers such as *"Don't Know / Can't Say"*, *"Can't remember"*, *"Do not wish to disclose"*, *"No current income"*, *"Choose not to answer"* are distinct, substantive responses and were **not** folded into "missing" in the data dictionary or in any count in this document. *"None of the above"* (used in the multi-select product fields) is likewise a substantive answer ("holds/considers none of these"), not a non-response marker.
- **Different respondent groups answered different questions**, confirmed directly: the set of respondents with a blank `Q1A` (a Mains-only question) matches the Listing-only group exactly; routing narrows further within Mains for the MF+ETF-specific follow-ups.
- **Multi-select parsing hazard:** naively splitting these fields on a bare comma is unsafe — one answer option's own label contains a comma (`"Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc)"`), which a plain split shreds into fake separate items. A later notebook must split against the known option vocabulary.
- **Respondent identifiers checked, not altered:** `Resp_ID_DP` and `UniqueId_DP` both have 0 missing and 0 duplicate values across all 109,430 records. No records were removed as part of this check.
- **Two weight columns serve different populations:** `WeightMainM2` (Mains-completers only, blank for Listing-only respondents) vs. `Weight_to_Sample` (full Listing sample, no blanks). Which is correct depends on which population a given analysis targets.

## Unresolved / needs confirmation before filtering the sample

1. Whether the 134 all-blank columns reflect true zero incidence of certain products in this fielding, or a narrower export/routing — not decidable from the file alone.
2. The exact construction of `Life_Stage` (age-band cutoffs are undocumented).
3. The full routing logic gating the MF+ETF-specific follow-ups within Mains-completers (observed empirically, not documented in a codebook).
4. Which weight column (`WeightMainM2` vs. `Weight_to_Sample`) is appropriate for a given planned analysis.
5. The intermediary workbook's 7 duplicate `INTNR` values (out of scope here, left unresolved).

## Outputs

- `data/processed/data_dictionary.csv` — one row per respondent-workbook column (code, description, observed dtype, non-missing/missing count and %, distinct non-missing values). Gitignored (respondent-level derived data).
- This document — safe to commit; no respondent-level examples or identifiers.
