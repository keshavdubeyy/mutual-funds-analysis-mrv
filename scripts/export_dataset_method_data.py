"""
Export verified aggregate JSON for the "Dataset and Method" dashboard page.

Reads only:
  - data/processed/data_dictionary.csv (one row per respondent-workbook column;
    see docs/data_inspection.md)
  - data/processed/analysis/*.csv (verified aggregate tables; see docs/cohort_definition.md,
    docs/barrier_coverage.md)
  - data/raw/*.XLSX, read-only, to compute per-column *aggregate* observed value counts
    (never respondent-level values) for columns with few distinct values, and to recount
    workbook shapes directly rather than re-typing them from prose.

Writes only aggregate/derived JSON to public/data/dataset-method/. No respondent IDs,
free-text values, or high-cardinality field values are written anywhere.

Run with: python scripts/export_dataset_method_data.py
"""

import json
from pathlib import Path

import pandas as pd
from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
ANALYSIS_DIR = PROCESSED_DIR / "analysis"
OUT_DIR = ROOT / "public" / "data" / "dataset-method"
OUT_DIR.mkdir(parents=True, exist_ok=True)

RESPONDENT_FILE = RAW_DIR / "Respondent Data.XLSX"
INTERMEDIARY_FILE = RAW_DIR / "Intermediary Data.XLSX"

# Fields whose raw values are documented multi-select combinations (comma-joined) rather
# than single categorical answers. Generic per-column value-counts would just surface
# combinatorial junk for these, so they are excluded from the generic pass; the four
# barrier/encouragement fields among them get their properly tokenized counts from
# data/processed/analysis/barrier_option_counts.csv instead (see below).
MULTISELECT_FIELDS = {
    "Q21A", "Q22A_All", "Q23A", "Q24A", "Q25A",
    "A11_D11", "A12_D12", "A13_D13", "A14_D14", "A15_D15",
    "AA1_DD1", "AA2_DD2", "AA3_DD3", "AA4_DD4",
}

# Curated, source-traced enrichment for the fields this study's documentation actually
# discusses. Everything here is paraphrased from docs/data_inspection.md, docs/cohort_definition.md,
# docs/barrier_coverage.md, docs/research_and_measurement_plan.md — not invented. Fields not
# listed here get only the mechanical facts (wording, dtype, coverage, observed options).
FIELD_ENRICHMENT = {
    "MAIN_COMP_STATUS": dict(
        topic="Survey completion / stage",
        plain_explanation="Whether this respondent finished the detailed “Mains” section of the survey, or stopped after the initial screening (“Listing”) stage.",
        applicable_respondents="All 109,430 respondents; blank for the 56,073 Listing-only respondents, “Main Complete” for the 53,357 who proceeded to Mains.",
        used_in_research=True,
        usage_reason="Defines the Mains-completion boundary used at selection step 1.",
    ),
    "QLISTMAIN": dict(
        topic="Survey completion / stage",
        plain_explanation="A second flag recording the same Listing-vs-Mains outcome as MAIN_COMP_STATUS.",
        applicable_respondents="All 109,430 respondents; its value split matches MAIN_COMP_STATUS's blank/non-blank split exactly (confirmed directly, 0 discrepancies).",
        used_in_research=False,
        usage_reason="Redundant cross-check of MAIN_COMP_STATUS; not needed as its own filter once that field is verified.",
    ),
    "INT_TYPE": dict(
        topic="Survey completion / stage",
        plain_explanation="Whether this respondent came from the survey's main random sample or from a supplementary “booster” sample added to reach specific targets.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="Relevant to survey weighting, which this deliberately unweighted study does not apply.",
    ),
    "QFL": dict(
        topic="Survey completion / stage",
        plain_explanation="SEBI's own Investor / Non-Investor classification, decided at the initial screening stage.",
        applicable_respondents="All 109,430 respondents; a Listing-stage classification independent of Mains completion and independent of any single product's holding status.",
        used_in_research=False,
        usage_reason="Explicitly kept separate from this study's completion and holding-status filters — never substituted for either (see docs/cohort_definition.md).",
    ),
    "Life_Stage": dict(
        topic="Age / generation",
        plain_explanation="The respondent's generation band (Gen Z, Millennial, Generation X, or Baby Boomer) — the closest available proxy for age, since the workbook has no raw age-in-years field.",
        applicable_respondents="All 109,430 respondents. Age-band cutoffs are not documented in the workbook itself; per the SEBI Main Report Annexure, Gen Z = ages 18–28.",
        used_in_research=True,
        usage_reason="Defines the Gen Z age filter at selection step 2.",
    ),
    "Q14": dict(
        topic="Employment / occupation",
        plain_explanation="The respondent's occupation, in SEBI's own wording (e.g. “Clerk / Salesman”, “Self Employed Professional”).",
        applicable_respondents="All 109,430 respondents; 36 distinct raw values, classified into Salaried / Business / Non-worker / Self-Employed / Agriculture / Skilled / Unskilled / Ambiguous per the SEBI Main Report Annexure, pp.104–106 (docs/cohort_definition.md §2).",
        used_in_research=True,
        usage_reason="Defines the Salaried occupation filter at selection step 3.",
    ),
    "CWE": dict(
        topic="Employment / occupation",
        plain_explanation="Whether the respondent is the main wage-earner supporting their household.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="Considered as a candidate field; not used in the final cohort or measurement definitions.",
    ),
    "Q10": dict(
        topic="Income",
        plain_explanation="The respondent's total household income bracket, before tax, from all sources.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="This study uses personal income (Q10A) for the income-tier comparison, not household income.",
    ),
    "Q10A": dict(
        topic="Income",
        plain_explanation="The respondent's own personal income bracket, before tax, from all sources — not salary alone, and not household income.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=True,
        usage_reason="Defines the income-tier segment comparison (docs/segment_findings.md).",
    ),
    "Q21A": dict(
        topic="Investment awareness",
        plain_explanation="Which financial products the respondent says they are aware of.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="Investment-awareness candidate field; not used in the final cohort or measurement definitions.",
    ),
    "Q1A": dict(
        topic="Investment awareness",
        plain_explanation="An investment-awareness question asked only of Mains-completers.",
        applicable_respondents="Mains-completers only (53,357 non-blank; blank exactly matches the Listing-only group).",
        used_in_research=False,
        usage_reason="Investment-awareness candidate field; not used in the final cohort or measurement definitions.",
    ),
    "Q29": dict(
        topic="Investment awareness",
        plain_explanation="An additional investment-related question considered but not used in this study.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="Investment-awareness candidate field; not used in the final cohort or measurement definitions.",
    ),
    "Q23A": dict(
        topic="Mutual-fund consideration",
        plain_explanation="Which financial products, among those the respondent does not currently hold, they say they would consider investing in.",
        applicable_respondents="Answered by 38,607 of 109,430 respondents workbook-wide (blank for Listing-only respondents and for some Mains respondents; the exact routing rule is not fully documented).",
        used_in_research=True,
        usage_reason="Defines “considers mutual funds” at selection step 4 (checked for the literal MF token, never the combined MF+ETF tag).",
    ),
    "Q25A": dict(
        topic="Mutual-fund consideration",
        plain_explanation="A related future-consideration question, similar in structure to Q23A.",
        applicable_respondents="Answered by 34,727 of 109,430 respondents workbook-wide.",
        used_in_research=False,
        usage_reason="Candidate consideration field; Q23A is used instead in the final cohort definition.",
    ),
    "Q22A_All": dict(
        topic="Current mutual-fund holdings",
        plain_explanation="Which financial products the respondent currently holds investments in.",
        applicable_respondents="All 109,430 respondents (no blanks), though 203 workbook-wide give the explicit non-substantive answer “Not Answered” rather than a product list.",
        used_in_research=True,
        usage_reason="Defines “does not currently hold mutual funds” at selection step 5, via a three-state status (holds / does_not_hold / unknown) that never treats a blank or “Not Answered” as non-holding.",
    ),
    "Q24A": dict(
        topic="Previous mutual-fund investment",
        plain_explanation="Whether the respondent has ever invested, in the past, in any of 7 specific securities-market products — even if they don't hold them now.",
        applicable_respondents="Answered by 38,583 of 109,430 respondents workbook-wide. Covers only Mutual Funds, ETF/Gold ETF, Futures & Options, Stocks/Shares, REITs/InvIT, Corporate Bonds and Alternate Investment Funds — not Fixed Deposits, insurance, EPF, PPF, NPS, post office schemes, physical gold or crypto.",
        used_in_research=True,
        usage_reason="Defines the three-way previous-investment grouping used in this study's segment comparisons.",
    ),
    "A11_D11": dict(
        topic="Reported investment barriers",
        plain_explanation="How frequently current MF/ETF investors say they invest.",
        applicable_respondents="Answered by 13,862 of 109,430 respondents workbook-wide — this base count exactly matches the SEBI Main Report's current-Investor tables, i.e. it targets people who already hold MF or ETF.",
        used_in_research=False,
        usage_reason="Documented as targeting current investors — the wrong population for this study's non-holder focused group (only 4 of 553 focused-group members have an answer here).",
    ),
    "A12_D12": dict(
        topic="Reported investment barriers",
        plain_explanation="What current MF/ETF investors say they expect to earn as returns.",
        applicable_respondents="Answered by 13,862 of 109,430 respondents workbook-wide — shares A13_D13's exact base (current investors).",
        used_in_research=False,
        usage_reason="Same reason as A11_D11: wrong population for this cohort.",
    ),
    "A13_D13": dict(
        topic="Reported investment barriers",
        plain_explanation="What challenges current MF/ETF investors say they face before or while making a fresh investment.",
        applicable_respondents="Answered by 13,862 of 109,430 respondents workbook-wide — base count exactly matches SEBI Main Report Table 9.2 (current-Investor challenges).",
        used_in_research=False,
        usage_reason="Targets current investors — the wrong population for this study's non-holder focused group.",
    ),
    "A14_D14": dict(
        topic="Reported investment barriers",
        plain_explanation="What challenges current MF/ETF investors say they face after investing.",
        applicable_respondents="Answered by 13,862 of 109,430 respondents workbook-wide — base count exactly matches SEBI Main Report Table 9.3.",
        used_in_research=False,
        usage_reason="Targets current investors — the wrong population for this study's non-holder focused group.",
    ),
    "A15_D15": dict(
        topic="Reported investment barriers",
        plain_explanation="Among people SEBI defines as “Lapsers” (no investment in the past 12 months, no current holdings), their top reasons for not investing.",
        applicable_respondents="Answered by only 5,710 of 109,430 respondents workbook-wide. The report documents the Lapser concept, but no published table's base matches 5,710, and only 1 of 553 focused-group members has an answer here.",
        used_in_research=False,
        usage_reason="Routing versus Q24A is unresolved; excluded from substantive interpretation (docs/barrier_coverage.md).",
    ),
    "AA1_DD1": dict(
        topic="Mutual-fund consideration",
        plain_explanation="Primary reasons given for considering investing in mutual funds or ETFs.",
        applicable_respondents="Answered by 3,168 of 109,430 respondents workbook-wide — plausibly targets “Intenders” (SEBI Report Chapter 8 concept), though no published table's base matches exactly.",
        used_in_research=True,
        usage_reason="Used descriptively in this study, with its target population explicitly labeled as inferred, not confirmed.",
    ),
    "AA2_DD2": dict(
        topic="Reported investment barriers",
        plain_explanation="Top reasons given for not currently investing in mutual funds or ETFs.",
        applicable_respondents="Answered by 18,223 of 109,430 respondents workbook-wide — base count exactly matches SEBI Main Report Table 7.1 (Non-Investor barriers). The report's own footnote states each respondent was asked about 2 products, which explains the partial coverage.",
        used_in_research=True,
        usage_reason="Primary barrier field for this study's focused group.",
    ),
    "AA3_DD3": dict(
        topic="Reported investment barriers",
        plain_explanation="What would encourage the respondent to consider investing in mutual funds or ETFs they don't currently hold.",
        applicable_respondents="Answered by 18,223 of 109,430 respondents workbook-wide — base count exactly matches SEBI Main Report Table 7.2, same “2 products” routing constraint as AA2_DD2.",
        used_in_research=True,
        usage_reason="Primary encouragement field for this study's focused group.",
    ),
    "AA4_DD4": dict(
        topic="Previous mutual-fund investment",
        plain_explanation="Among people who stopped investing, their top reasons for stopping.",
        applicable_respondents="Answered by 1,381 of 109,430 respondents workbook-wide — partially matches a “Base: By Products” row near the report's lapsing discussion, not a titled table.",
        used_in_research=True,
        usage_reason="Used descriptively in this study, with an explicit small-sample caveat (only 64 of 553 focused-group members have an answer).",
    ),
    "WeightMainM2": dict(
        topic="Survey weights",
        plain_explanation="A statistical weight for making the Mains-completer sample population-representative.",
        applicable_respondents="Mains-completers only (53,357 non-blank, blank for Listing-only respondents).",
        used_in_research=False,
        usage_reason="Not applied anywhere in this study — a deliberately unweighted, sample-descriptive analysis.",
    ),
    "Weight_to_Sample": dict(
        topic="Survey weights",
        plain_explanation="A statistical weight for making the full Listing sample population-representative.",
        applicable_respondents="All 109,430 respondents.",
        used_in_research=False,
        usage_reason="Not applied anywhere in this study — a deliberately unweighted, sample-descriptive analysis.",
    ),
    "Resp_ID_DP": dict(
        topic="Respondent identifier",
        plain_explanation="An internal respondent identifier used to keep records straight across the analysis pipeline.",
        applicable_respondents="All 109,430 respondents; 0 missing, 0 duplicates (checked directly).",
        used_in_research=False,
        usage_reason="Used only for internal joins — never displayed or exported at the respondent level, and not itself a research variable.",
    ),
    "UniqueId_DP": dict(
        topic="Respondent identifier",
        plain_explanation="A second internal respondent identifier, used the same way as Resp_ID_DP.",
        applicable_respondents="All 109,430 respondents; 0 missing, 0 duplicates (checked directly).",
        used_in_research=False,
        usage_reason="Used only for internal joins — never displayed or exported at the respondent level, and not itself a research variable.",
    ),
}


def sanitize_nan(obj):
    """Recursively replace float NaN with None so json.dump never emits the invalid
    (non-JSON-spec) `NaN` literal, which breaks JSON.parse in the browser."""
    if isinstance(obj, float) and pd.isna(obj):
        return None
    if isinstance(obj, dict):
        return {k: sanitize_nan(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize_nan(v) for v in obj]
    return obj


def dump_json(obj, path):
    with open(path, "w") as f:
        json.dump(sanitize_nan(obj), f, indent=2)


def response_type_for(row, generic_options):
    code = row["column_code"]
    if row["non_missing_count"] == 0:
        return "All-blank in this fielding (no responses recorded for any respondent)"
    if code == "Q14":
        return "Categorical — occupation, classified per official SEBI documentation (see options below)"
    if code in {"A11_D11", "A12_D12", "A13_D13", "A14_D14", "A15_D15", "AA1_DD1", "AA2_DD2", "AA3_DD3", "AA4_DD4"}:
        return "Multi-select — respondents choose their top options (documented as “Top 3” where the question says so); this field's raw value is a comma-joined combination of chosen options"
    if code in {"Q21A", "Q22A_All", "Q23A", "Q24A", "Q25A"}:
        return "Multi-select — comma-joined list of financial-product options, tokenized against a fixed, documented vocabulary"
    if row["n_distinct_non_missing"] == row["non_missing_count"] and row["non_missing_count"] > 1000:
        return "Identifier — effectively unique per respondent"
    if generic_options is not None:
        return "Categorical — observed as a small, closed set of values in this fielding"
    if row["observed_dtype"] == "numeric":
        return "Numeric"
    return "High-cardinality text field (free text, or a combination field not otherwise documented here)"


def main():
    print("Reading data_dictionary.csv ...")
    data_dict = pd.read_csv(PROCESSED_DIR / "data_dictionary.csv")

    print("Reading raw respondent workbook (this takes ~10-15s) ...")
    resp_wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    resp_sheet = resp_wb.get_sheet_by_name(resp_wb.sheet_names[0])
    resp_data = resp_sheet.to_python(skip_empty_area=True)
    resp_codes, resp_rows = resp_data[0], resp_data[2:]
    resp_df = pd.DataFrame(resp_rows, columns=resp_codes)
    respondent_shape = {"records": resp_df.shape[0], "columns": resp_df.shape[1]}

    print("Reading raw intermediary workbook ...")
    int_wb = CalamineWorkbook.from_path(str(INTERMEDIARY_FILE))
    int_sheet = int_wb.get_sheet_by_name(int_wb.sheet_names[0])
    int_data = int_sheet.to_python(skip_empty_area=True)
    intermediary_shape = {"records": len(int_data) - 2, "columns": len(int_data[0])}
    del int_wb, int_sheet, int_data

    def clean(series):
        s = series.astype(str)
        return s[(s != "") & (s.notna()) & (s != "nan")]

    # --- Generic per-column observed value counts, low-cardinality columns only ---
    print("Computing observed value counts for low-cardinality columns ...")
    generic_options_by_code = {}
    for _, row in data_dict.iterrows():
        code = row["column_code"]
        if code in MULTISELECT_FIELDS or code == "Q14":
            continue
        if row["non_missing_count"] == 0 or row["n_distinct_non_missing"] > 25:
            continue
        if code not in resp_df.columns:
            continue
        vc = clean(resp_df[code]).value_counts()
        total = int(vc.sum())
        generic_options_by_code[code] = [
            {"label": str(val), "n": int(n), "pct": round(100 * n / total, 1)}
            for val, n in vc.items()
        ]

    # Free the big frame; nothing further needs the raw respondent-level data.
    del resp_df

    # --- Barrier/encouragement fields: use the already-tokenized, verified option counts ---
    barrier_counts = pd.read_csv(ANALYSIS_DIR / "barrier_option_counts.csv")
    barrier_options_by_code = {}
    for field, grp in barrier_counts.groupby("field"):
        barrier_options_by_code[field] = [
            {"label": r["option"], "n": int(r["n"]), "pct": float(r["pct_of_answered"])}
            for _, r in grp.iterrows()
        ]
    barrier_denominators = {row["field"]: int(row["denominator"]) for _, row in barrier_counts.iterrows()}

    # --- Q14 occupation: documented SEBI Annexure classification, not a generic pass ---
    occ = pd.read_csv(ANALYSIS_DIR / "occupation_reconciliation.csv")
    q14_options = [
        {"label": r["Q14"], "n": int(r["n"]), "class": r["class"]}
        for _, r in occ.iterrows()
    ]

    # --- Build the full field catalogue (448 rows: every respondent-workbook column) ---
    print("Building field catalogue ...")
    catalogue = []
    for _, row in data_dict.iterrows():
        code = row["column_code"]
        enrichment = FIELD_ENRICHMENT.get(code, {})

        options = None
        options_type = None
        options_note = None
        if code == "Q14":
            options = q14_options
            options_type = "documented"
            options_note = "SEBI Investor Survey 2025 Main Report Annexure, pp.104–106 (see docs/cohort_definition.md §2) — the official occupation classification, not this study's own grouping."
        elif code in barrier_options_by_code:
            options = barrier_options_by_code[code]
            options_type = "observed"
            options_note = f"Observed options from this fielding's tokenized answers, among the {barrier_denominators.get(code, '?')} respondents (workbook-wide) who gave a substantive answer — not the complete original questionnaire, and not a percentage of all 109,430 respondents."
        elif code in generic_options_by_code:
            options = generic_options_by_code[code]
            options_type = "observed"
            options_note = "Observed options from this fielding's data — a closed set of values as they appear in the workbook, not independently confirmed against an official codebook."
        elif row["non_missing_count"] > 0:
            options_note = "Not exported: either a high-cardinality, free-text, or identifier-like field (see docs/data_inspection.md); individual values are never shown to avoid exposing respondent-level or free-text data."

        catalogue.append({
            "code": code,
            "source_wording": row["question_description"],
            "topic": enrichment.get("topic", "Not classified in this study's documentation"),
            "response_type": response_type_for(row, generic_options_by_code.get(code)),
            "observed_dtype": row["observed_dtype"],
            "non_missing_count": int(row["non_missing_count"]),
            "missing_count": int(row["missing_count"]),
            "missing_pct": float(row["missing_pct"]),
            "n_distinct_non_missing": int(row["n_distinct_non_missing"]),
            "plain_explanation": enrichment.get("plain_explanation"),
            "applicable_respondents": enrichment.get("applicable_respondents", "Not established from the file alone — see docs/data_inspection.md for what is and isn't documented about routing."),
            "used_in_research": enrichment.get("used_in_research", False),
            "usage_reason": enrichment.get("usage_reason", "Not part of this study's documented field selection (see docs/data_inspection.md §“Candidate fields for this study”)."),
            "options": options,
            "options_type": options_type,
            "options_note": options_note,
        })

    dump_json(catalogue, OUT_DIR / "field_catalogue.json")

    # --- Overview ---
    overview = {
        "dataset_name": "SEBI Investor Survey 2025",
        "publisher": "Securities and Exchange Board of India (SEBI), Research Department",
        "source_url": "https://www.sebi.gov.in/reports-and-statistics/research/jan-2026/investor-survey-2025-_99170.html",
        "survey_vs_publication_note": "The fielding is named “Investor Survey 2025”; the publisher's own URL path is dated “jan-2026” (report/publication listing). This repository does not have a separately documented data-collection period distinct from the survey's name — the exact fielding dates are not established from the files available here.",
        "what_it_investigates": "A national household survey of individual investment behaviour: awareness, current holdings, past investment, and — for the subset asked — reported barriers and encouragement factors across securities-market products (mutual funds, ETFs, stocks, F&O, REITs/InvITs, corporate bonds, AIFs).",
        "not_indmoney_data": "This is a SEBI national survey, not INDmoney app-usage or conversion telemetry. It cannot establish anything about INDmoney's own users or product funnel.",
        "record_definition": "A respondent record is one person who took part in the survey — not an “automatically completed survey,” and every column is a workbook field, not automatically a “question” (see below).",
        "workbooks": [
            {
                "file": "Respondent Data.XLSX",
                "sheet": "RLD",
                "records": respondent_shape["records"],
                "columns": respondent_shape["columns"],
                "used_in_this_study": True,
                "description": "One row per individual survey respondent. Used for this entire study.",
            },
            {
                "file": "Intermediary Data.XLSX",
                "sheet": "T1",
                "records": intermediary_shape["records"],
                "columns": intermediary_shape["columns"],
                "used_in_this_study": False,
                "description": "Surveys market intermediaries (RIAs, distributors, brokers) about their category, tenure, customer base, and their own perceived view of investors — a different unit of analysis (intermediary opinion, not respondent self-report). Its identifier column (INTNR) has 7 duplicate values out of 1,313 rows, noted but not investigated. Kept entirely separate from this study.",
            },
        ],
        "why_respondent_workbook_only": "The research question is about what individual (would-be) investors themselves report — their occupation, income, product consideration, holdings, and barriers. Only the respondent workbook asks respondents about themselves; the intermediary workbook records what intermediaries perceive about investors in general, a different population and a different question entirely.",
        "header_structure": "Row 1 = short column codes, row 2 = full question wording, row 3 onward = one row per respondent record.",
    }
    dump_json(overview, OUT_DIR / "overview.json")

    # --- Participation ---
    def opt_lookup(code):
        return generic_options_by_code.get(code, [])

    participation = {
        "total_respondent_records": respondent_shape["records"],
        "listing_only": int(data_dict.loc[data_dict.column_code == "MAIN_COMP_STATUS", "missing_count"].iloc[0]),
        "main_survey": int(data_dict.loc[data_dict.column_code == "MAIN_COMP_STATUS", "non_missing_count"].iloc[0]),
        "qfl_split": opt_lookup("QFL"),
        "int_type_split": opt_lookup("INT_TYPE"),
        "notes": [
            "QFL (Investor / Non-Investor) is a separate classification decided at the Listing stage. It is not the same split as Listing-only vs. Main-survey completion, and this study never substitutes one for the other.",
            "Not every Main-survey respondent answered every Main-survey question — routing narrows further within the Mains section (see the field catalogue and the coverage section below).",
        ],
    }
    dump_json(participation, OUT_DIR / "participation.json")

    # --- Sample selection funnel ---
    steps_df = pd.read_csv(ANALYSIS_DIR / "selection_steps.csv")
    unknown_892 = pd.read_csv(ANALYSIS_DIR / "unknown_consideration_892_investigation.csv")
    mf_holding_broader = pd.read_csv(ANALYSIS_DIR / "mf_holding_share_broader.csv")

    step_rules = {
        1: dict(
            rule="MAIN_COMP_STATUS == “Main Complete”",
            why="Only Mains-completers were asked the detailed occupation, product-consideration and holdings questions this study depends on.",
        ),
        2: dict(
            rule="Life_Stage == “Gen Z” (ages 18–28 per the SEBI Main Report Annexure)",
            why="The research question is specifically about Gen Z respondents.",
        ),
        3: dict(
            rule="Q14 (occupation) is one of the 9 values the SEBI Main Report Annexure documents as “Salaried”",
            why="The research question is specifically about salaried respondents; classification follows SEBI's own published occupation buckets rather than an inferred reading of the label.",
        ),
        4: dict(
            rule="Q23A's tokenized answer contains the literal “Mutual Funds (One-time Lumpsum / SIP)” option",
            why="Identifies respondents who report considering mutual funds — the population the research question is about.",
        ),
        5: dict(
            rule="Q22A_All gives an interpretable answer (not blank, not the explicit “Not Answered”) that does not contain the MF option",
            why="Confirms current non-holding of mutual funds specifically — an unclear Q22A_All response is treated as unknown, never assumed to mean non-holding.",
        ),
    }
    funnel_steps = []
    for _, r in steps_df.iterrows():
        step_num = int(r["step"])
        detail = None
        if step_num == 3:
            detail = {
                "excluded_breakdown": "18,892 respondents fall into SEBI-documented non-salaried buckets (Business, Non-worker, Self Employed, Agriculture & Allied, Skilled Worker, Unskilled Worker) — see the occupation table below.",
                "ambiguous_breakdown": [
                    {"label": "Others (Specify) — free-text catch-all, not named in the SEBI Annexure", "n": 1320},
                    {"label": "Service (Urban) & CWE Education 10 to Graduate — sibling Rural version is listed as Salaried, this Urban combination is not", "n": 13},
                    {"label": "Service (Urban) & CWE Education illiterate to 9th standard — same reasoning", "n": 5},
                ],
                "ambiguous_note": "1,338 = 1,320 + 13 + 5. These 3 groups are kept distinct and are excluded from the confirmed Salaried group, not assumed either way.",
            }
        if step_num == 4:
            detail = {
                "excluded_breakdown": "2,901 respondents answered Q23A but did not include the mutual-fund option — they reported considering other products instead.",
                "unknown_breakdown": "892 respondents have a blank Q23A (not administered/not answered). Investigated directly: this 892 group's QFL Investor share (55.2%) and mutual-fund holding rate (32.6%) are close to the 3,454 respondents who did answer Q23A (56.7% and 32.9%) — so this blank group does not look systematically different on those two measures — but 891 of the 892 (99.9%) are also blank on the related Q25A field, consistent with a routing gap rather than a recorded ‘no’.",
                "unknown_comparison": unknown_892.to_dict(orient="records"),
            }
        funnel_steps.append({
            "step": step_num,
            "label": r["label"],
            "entering": int(r["entering"]),
            "retained": int(r["retained"]),
            "excluded": int(r["excluded"]),
            "unknown_or_ambiguous": int(r["unknown_or_ambiguous"]),
            "rule": step_rules.get(step_num, {}).get("rule"),
            "why": step_rules.get(step_num, {}).get("why"),
            "detail": detail,
        })

    sample_selection = {
        "title": "How we selected the research sample",
        "framing_note": "These are research selection steps, not investment conversion or app drop-offs.",
        "steps": funnel_steps,
        "occupation_table": occ.to_dict(orient="records"),
        "broader_group_holding_status_note": {
            "text": "Separately from this funnel: within the broader group (n = 4,346), 3 respondents have an unknown mutual-fund holding status (blank or explicit “Not Answered” on Q22A_All). This is a distinct measure — the current-MF-holding-share calculation for the broader group — not a step in the funnel above, since the focused group (step 5) is itself defined by requiring an interpretable Q22A_All.",
            "data": mf_holding_broader.to_dict(orient="records"),
        },
    }
    dump_json(sample_selection, OUT_DIR / "sample_selection.json")

    # --- Coverage within the focused group (n = 553) ---
    barrier_meta = pd.read_csv(ANALYSIS_DIR / "barrier_field_metadata.csv")
    prev_investment = pd.read_csv(ANALYSIS_DIR / "prev_investment_distribution.csv")
    coverage_rows = []
    for _, r in barrier_meta.iterrows():
        coverage_rows.append({
            "field_code": r["field_code"],
            "question_wording": r["question_wording"],
            "focused_group_size": int(r["focused_group_size"]),
            "n_substantive_answer": int(r["n_substantive_answer"]),
            "n_special_response": int(r["n_special_response"]),
            "n_blank_unrecorded": int(r["n_blank_unrecorded"]),
            "denominator_used_for_pct": (None if pd.isna(r["denominator_used_for_pct"]) else int(r["denominator_used_for_pct"])),
            "suitable_for_descriptive_analysis": bool(r["suitable_for_descriptive_analysis"]),
            "intended_respondent_group": r["intended_respondent_group"],
            "routing_evidence": r["routing_evidence"],
        })
    coverage = {
        "focused_group_size": 553,
        "note": "Being selected into the focused group does not mean answering every question — each field below has its own denominator. Coverage bars are shown separately per question; answer counts across different questions are never added together as if they were unique people.",
        "fields": coverage_rows,
        "previous_investment_q24a": {
            "question_wording": "Could you please tell me if you have ever invested in these products in the past",
            "denominator": 553,
            "n_blank": 0,
            "categories": prev_investment.to_dict(orient="records"),
        },
    }
    dump_json(coverage, OUT_DIR / "coverage.json")

    print("Done. Wrote:")
    for p in sorted(OUT_DIR.glob("*.json")):
        print(" -", p.relative_to(ROOT), f"({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
