"""
Build the data behind the Findings page's "Who is in our sample?" tab
(demographics + psychographics only — no barrier/product analysis here).

Writes TWO files from the same verified 553-row focused-group join:

  1. public/data/findings/who_is_in_sample.json
     Aggregate-only, unfiltered (n = 553). Safe for production and for the
     public bundle — no respondent identifiers, no free text, no per-row data.

  2. data/processed/who_is_in_sample_local.json
     Respondent-level, LOCAL-ONLY (data/processed/ is fully gitignored except
     README.md). Read exclusively by a server-only, development-only Next.js
     route (src/app/api/dev/who-is-in-sample/route.ts) that computes combined
     filter intersections server-side and returns only aggregate counts to the
     browser — never a raw row, never an original respondent id. Mirrors the
     established pattern in scripts/export_respondent_table.py.

Source: data/processed/cohort_focused_considered_mf_not_holding.csv (the
verified 553-row Resp_ID_DP set + already-verified occupation_class and
prev_mf_investment_class classifications — reused as-is, not re-derived) +
data/raw/Respondent Data.XLSX (read-only, for the additional raw columns this
tab needs that aren't in the focused extract: state/urban-rural/zone,
education, gender, marital status, family type, chief wage earner, income,
return/risk preference, downturn reaction, stock-market familiarity, the
inflation literacy question, the 9-item GRIDxQ15AM true/false/not-aware
knowledge battery, and the four Q20 investor-education preference fields).

Run with: python scripts/export_who_is_in_sample.py
"""

import html
import json
import re
from pathlib import Path

import pandas as pd
from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
PUBLIC_OUT = ROOT / "public" / "data" / "findings" / "who_is_in_sample.json"
LOCAL_OUT = PROCESSED_DIR / "who_is_in_sample_local.json"

FOCUSED_EXTRACT = PROCESSED_DIR / "cohort_focused_considered_mf_not_holding.csv"
RESPONDENT_FILE = RAW_DIR / "Respondent Data.XLSX"

# Same known source-workbook mojibake documented in docs/data_inspection.md and
# already handled identically in scripts/export_respondent_table.py and
# scripts/export_demographics_psychographics.py — display cleanup only.
MOJIBAKE_FIXES = {
    "â€“": "–",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€\x9d": "”",
}


def clean(value) -> str:
    value = str(value)
    for bad, good in MOJIBAKE_FIXES.items():
        value = value.replace(bad, good)
    value = html.unescape(value)
    return re.sub(r"</?[a-zA-Z][^>]*>", "", value).strip()


# Verified against docs/data_inspection.md / the special "(DO NOT AID THIS
# OPTION)" interviewer instructions — display cleanup only, same fix used in
# scripts/export_respondent_table.py's income_tier()/display_income_bracket().
INCOME_DISPLAY_FIXES = {
    "Do not wish to disclose (DO NOT AID THIS OPTION)": "Do not wish to disclose",
    "No current income (DO NOT AID THIS OPTION)": "No current income",
}


def income_tier(bracket: str) -> str:
    """Identical bucketing to scripts/export_respondent_table.py's income_tier() —
    reused rather than re-derived, so filter results agree with the existing
    Respondent data tab's income-tier convention."""
    if bracket in INCOME_DISPLAY_FIXES:
        return INCOME_DISPLAY_FIXES[bracket]
    lower_bound = int(re.search(r"[\d,]+", bracket).group().replace(",", ""))
    if lower_bound <= 20000:
        return "Up to Rs.20,000"
    if lower_bound <= 40000:
        return "Rs.20,001-Rs.40,000"
    return "Above Rs.40,000"


# code -> (short label, plain-language wording, section)
SINGLE_SELECT_FIELDS = {
    "SELECTED_STATE": ("State", "Selected State", "geography"),
    "URBANRURAL": ("Urban / Rural", "Urban-Rural Classification", "geography"),
    "Zone_DP": ("Zone", "Zone", "geography"),
    "Q3D": ("Education level", "Can you please tell me your education level?", "work_household"),
    "Q14": ("Occupation", "What is your current primary occupation? (documented salaried categories only — see docs/cohort_definition.md §2)", "work_household"),
    "Q10A": (
        "Monthly personal income",
        "And among the following broad groups, where does your Monthly Personal Income from all sources before tax fall? Please consider only your income, not the household's.",
        "work_household",
    ),
    "Q1": ("Gender", "Gender", "work_household"),
    "Q13": ("Marital status", "What is your marital status?", "work_household"),
    "Q5A": ("Family type", "Can you please tell me about your Family Type?", "work_household"),
    "CWE": (
        "Chief wage earner",
        "And can you now tell me who is the chief wage earner in the family i.e., the one who contributes the most to the household expense?",
        "work_household",
    ),
    "QRT": (
        "Return / risk preference",
        "Which of the following best describes your preference when considering returns from investments?",
        "preferences",
    ),
    "Q10M": ("Reaction to a market downturn", "Reaction to Market Downturn", "preferences"),
    "Q11M": ("Familiarity with stock markets", "How familiar are you with investing in stock markets?", "preferences"),
    "Q12M": (
        "Financial literacy (inflation vs. savings)",
        "Suppose the rate of return on your savings is 5% per year and inflation is 6% per year — after a year, will you be able to buy more, less, or the same as today with this money?",
        "knowledge",
    ),
    "Q20E": (
        "Preferred language for investor education",
        "In which language would you prefer investor education programmes to be conducted?",
        "knowledge",
    ),
}

# The 9-item GRIDxQ15AM true/false/not-aware battery. Item wording is taken
# verbatim from the raw workbook's own row-2 description (before the " : "
# separator — see docs/survey_schema_reference.md, which documents that the
# text after " : " is a mechanically-carried parent-question label, not part
# of the item itself). No answer key exists anywhere in this project's
# documented sources, so responses are shown as their own TRUE/FALSE/Not Aware
# categories — never marked "correct"/"incorrect" (that would be invented).
KNOWLEDGE_GRID_ITEMS = [
    ("GRIDxQ15AM[{_1}].Q15AM", "Direct plans in mutual funds have a lower expense ratio than regular plans"),
    ("GRIDxQ15AM[{_2}].Q15AM", "A portion of investments in pension/provident funds is invested in the stock market"),
    ("GRIDxQ15AM[{_3}].Q15AM", "The concept of compounding is beneficial in the short term"),
    ("GRIDxQ15AM[{_4}].Q15AM", "KYC can be completed online"),
    ("GRIDxQ15AM[{_5}].Q15AM", "Need to open a Demat account to invest in securities in addition to trading account"),
    ("GRIDxQ15AM[{_6}].Q15AM", "Investment options that offer high returns are also associated with high-risk"),
    ("GRIDxQ15AM[{_7}].Q15AM", "Investments across different asset classes increase risk"),
    (
        "GRIDxQ15AM[{_8}].Q15AM",
        "CAS (Consolidated Account statement) provides overview of investments in Securities/stock market. E.g. Equity, Mutual Funds, Bonds, Government Securities, NPS, NIR, etc. investment held in demat and folio form",
    ),
    (
        "GRIDxQ15AM[{_9}].Q15AM",
        "BSDA (Basic service demat account) allows you to have a demat account with nil or negligible charges when your investment holdings are below a certain amount",
    ),
]

# Multi-select ("top 3") fields — verified vocabularies reused verbatim from
# scripts/export_demographics_psychographics.py (same source fields, same
# comma-in-label hazard). Duplicated here rather than imported, matching this
# project's existing convention of self-contained export scripts.
MULTISELECT_FIELDS = {
    "Q20CM": (
        "Preferred medium for investor education",
        "Please let me know what your preferred medium would be to receive the investor education program (top 3)",
        [
            "Information on social media (YouTube, Instagram, etc.)",
            "Advertisements on TV, Digital or other mediums",
            "In-person seminars or workshops",
            "Online webinars and virtual training sessions",
            "Mobile apps",
            "Websites/online portal",
            "Email",
            "Expert opinion /expert interview / Expert panel discussion",
            "Others (please specify)",
        ],
    ),
    "Q20DM": (
        "Preferred format for investor education",
        "Could you please share your preferred format for receiving the investor education program (top 3)",
        [
            "Videos",
            "Podcast",
            "Audio books",
            "Online courses",
            "Article/blogs/newsletters/educational article/ whitepapers",
            "Social media post",
            "Others (please specify)",
        ],
    ),
    "Q20F": (
        "Preferred investor-education topics",
        "Which topics should be covered in these investor education programs to enhance financial awareness and decision-making?",
        [
            "Information on various investment options available (stocks, bonds, mutual funds, etc.)",
            "Risk Management & Portfolio Diversification (how to minimize investment risks)",
            "How to Identify Financial Frauds & Scams (protecting against Ponzi schemes, phishing, and fraud)",
            "Retirement & Long-Term Financial Planning (planning for a secure financial future)",
            "Using Digital Investment Platforms Safely (avoiding cyber threats and securing online transactions)",
            "Investor Rights & SEBI Regulations (understanding legal protections and grievance redressal mechanisms)",
            "Understanding fact sheets of mutual funds and other financial reports",
            "Others (please specify)",
        ],
    ),
}


def tokenize(value: str, vocabulary: list[str]) -> list[str]:
    protected = value
    placeholders = {}
    for i, opt in enumerate(vocabulary):
        if "," in opt:
            token = f"\x00{i}\x00"
            placeholders[token] = opt
            protected = protected.replace(opt, token)
    parts = [p.strip() for p in protected.split(",")]
    resolved = [placeholders.get(p, p) for p in parts]
    unresolved = [p for p in resolved if p not in vocabulary]
    if unresolved:
        raise ValueError(f"Unresolved fragment(s) {unresolved!r} in value {value!r}")
    return resolved


def single_select_summary(col: pd.Series):
    non_blank = col[col != ""]
    n_blank = int((col == "").sum())
    counts = non_blank.value_counts()
    total_answered = int(counts.sum())
    options = [
        {
            "label": INCOME_DISPLAY_FIXES.get(str(val), clean(val)),
            "n": int(n),
            "pct": round(100 * n / total_answered, 1) if total_answered else 0,
        }
        for val, n in counts.items()
    ]
    return options, total_answered, n_blank


def multiselect_summary(col: pd.Series, vocabulary: list[str]):
    non_blank = col[col != ""]
    n_blank = int((col == "").sum())
    option_counts: dict[str, int] = {opt: 0 for opt in vocabulary}
    n_respondents_answered = 0
    for value in non_blank:
        for token in tokenize(value, vocabulary):
            option_counts[token] += 1
        n_respondents_answered += 1
    options = sorted(
        (
            {"label": clean(opt), "n": n, "pct": round(100 * n / n_respondents_answered, 1) if n_respondents_answered else 0}
            for opt, n in option_counts.items()
        ),
        key=lambda o: -o["n"],
    )
    return options, n_respondents_answered, n_blank


def main():
    print("Reading verified focused-group extract (553 rows, Resp_ID_DP set + occupation/prev-investment classes) ...")
    focused = pd.read_csv(FOCUSED_EXTRACT, keep_default_na=False)
    assert len(focused) == 553, f"focused group count changed: {len(focused)} != 553"
    resp_ids = set(focused["Resp_ID_DP"])

    print("Reading raw respondent workbook (read-only, additional demographic/psychographic columns) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    codes, rows = data[0], data[2:]
    raw_df = pd.DataFrame(rows, columns=codes)

    subset = raw_df[raw_df["Resp_ID_DP"].isin(resp_ids)].copy()
    assert len(subset) == 553, f"join produced {len(subset)} rows, expected 553"

    # Bring in the already-verified classifications from the focused extract
    # (not re-derived) so this tab's filters agree with the Respondent data tab.
    subset = subset.merge(
        focused[["Resp_ID_DP", "Q14_occupation_raw", "prev_mf_investment_class"]],
        on="Resp_ID_DP",
        how="left",
    )
    assert subset["prev_mf_investment_class"].isna().sum() == 0
    subset["Q14"] = subset["Q14_occupation_raw"].map(clean)

    # ---- 1. Aggregate (public, production-safe) ----
    fields_out = []
    for code, (label, wording, section) in SINGLE_SELECT_FIELDS.items():
        options, n_answered, n_blank = single_select_summary(subset[code])
        fields_out.append(
            {
                "field_code": code,
                "label": label,
                "question_wording": wording,
                "section": section,
                "kind": "single",
                "denominator": 553,
                "n_answered": n_answered,
                "n_blank": n_blank,
                "options": options,
            }
        )

    knowledge_items_out = []
    for code, item_text in KNOWLEDGE_GRID_ITEMS:
        options, n_answered, n_blank = single_select_summary(subset[code])
        knowledge_items_out.append(
            {
                "field_code": code,
                "label": item_text,
                "n_answered": n_answered,
                "n_blank": n_blank,
                "options": options,
            }
        )

    for code, (label, wording, vocabulary) in MULTISELECT_FIELDS.items():
        options, n_answered, n_blank = multiselect_summary(subset[code], vocabulary)
        fields_out.append(
            {
                "field_code": code,
                "label": label,
                "question_wording": wording + " — multi-select (top 3), percentages may sum to more than 100%",
                "section": "knowledge",
                "kind": "multi",
                "denominator": 553,
                "n_answered": n_answered,
                "n_blank": n_blank,
                "options": options,
            }
        )

    income_tiers = subset["Q10A"].map(income_tier)
    tier_counts = income_tiers.value_counts()
    prev_investment_counts = subset["prev_mf_investment_class"].value_counts()
    urbanrural_counts = subset["URBANRURAL"].value_counts()

    # State x Urban/Rural crosstab — aggregate-only (one row per observed state,
    # two counts each), safe to ship in the public bundle. Lets the "ranked by
    # state" list toggle between the combined ranking and an urban-only /
    # rural-only ranking without needing respondent-level data client-side.
    state_ur_crosstab = (
        subset.groupby([subset["SELECTED_STATE"].map(clean), "URBANRURAL"]).size().unstack(fill_value=0)
    )
    state_urbanrural_crosstab = [
        {
            "state": state,
            "urban_n": int(row.get("Urban", 0)),
            "rural_n": int(row.get("Rural", 0)),
        }
        for state, row in state_ur_crosstab.iterrows()
    ]
    assert sum(r["urban_n"] + r["rural_n"] for r in state_urbanrural_crosstab) == 553

    public_out = {
        "focused_group_size": 553,
        "note": (
            "Demographics and psychographics only, for the verified 553-respondent focused group "
            "(salaried Gen Z respondents who considered mutual funds but do not currently hold them). "
            "Unweighted, descriptive only — no significance tests, no personas, no causal claims."
        ),
        "sample_overview": {
            "n": 553,
            "age_band": "Gen Z (18–28)",
            "occupation_scope": "Documented salaried occupation categories only (see docs/cohort_definition.md §2)",
            "research_scope": "Considered mutual funds (Q23A) but do not currently hold them (Q22A_All)",
        },
        "filter_options": {
            "income_tier": [{"tier": t, "n": int(n)} for t, n in tier_counts.items()],
            "prev_mf_investment_class": [{"cls": c, "n": int(n)} for c, n in prev_investment_counts.items()],
            "urbanrural": [{"value": v, "n": int(n)} for v, n in urbanrural_counts.items()],
        },
        "state_urbanrural_crosstab": state_urbanrural_crosstab,
        "fields": fields_out,
        "knowledge_grid": {
            "field_family": "GRIDxQ15AM.Q15AM",
            "note": (
                "9-item true/false/not-aware financial-knowledge battery. No documented answer key exists in this "
                "project's sources, so responses are shown as their own categories — never marked correct/incorrect."
            ),
            "items": knowledge_items_out,
        },
    }

    PUBLIC_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(PUBLIC_OUT, "w") as f:
        json.dump(public_out, f, indent=2, ensure_ascii=False)
    print(f"Wrote {PUBLIC_OUT.relative_to(ROOT)} ({PUBLIC_OUT.stat().st_size:,} bytes)")

    # ---- 2. Local-only respondent-level extract (dev-only filtering) ----
    records = []
    for i, r in enumerate(subset.to_dict("records"), start=1):
        rec = {
            "ref": f"R{i:03d}",
            "state": clean(r["SELECTED_STATE"]),
            "urbanrural": clean(r["URBANRURAL"]),
            "zone": clean(r["Zone_DP"]),
            "education": clean(r["Q3D"]),
            "occupation": r["Q14"],
            "gender": clean(r["Q1"]),
            "marital_status": clean(r["Q13"]),
            "family_type": clean(r["Q5A"]),
            "cwe": clean(r["CWE"]),
            "income_bracket": INCOME_DISPLAY_FIXES.get(str(r["Q10A"]), clean(r["Q10A"])),
            "income_tier": income_tier(r["Q10A"]),
            "prev_mf_investment_class": r["prev_mf_investment_class"],
            "qrt": clean(r["QRT"]),
            "q10m": clean(r["Q10M"]),
            "q11m": clean(r["Q11M"]),
            "q12m": clean(r["Q12M"]),
            "q20e": clean(r["Q20E"]),
            "knowledge": {code: clean(r[code]) for code, _ in KNOWLEDGE_GRID_ITEMS},
        }
        for code, (_, _, vocabulary) in MULTISELECT_FIELDS.items():
            raw_val = r[code]
            rec[code.lower()] = tokenize(raw_val, vocabulary) if raw_val != "" else []
        records.append(rec)

    assert len(records) == 553
    LOCAL_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(LOCAL_OUT, "w") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(records)} records to {LOCAL_OUT.relative_to(ROOT)} ({LOCAL_OUT.stat().st_size:,} bytes)")
    print("No Resp_ID_DP, UniqueId_DP, weights, or free-text fields included.")


if __name__ == "__main__":
    main()
