"""
Export simple demographic and psychographic distributions for the focused group
(n = 553), for display on the Findings page's Analysis tab.

These fields are NOT part of any previously verified doc (docs/descriptive_findings.md,
segment_findings.md) — they were never part of this study's original candidate-field
list. This script only adds a plain, unweighted frequency count (n, %) per field among
the already-defined 553 focused-group respondents. It does not touch cohort membership
(the Resp_ID_DP set is read as-is from the verified extract) and computes no
comparison, no significance test, no new derived classification — just a count.

Source: data/processed/cohort_focused_considered_mf_not_holding.csv (for the verified
Resp_ID_DP set only) + data/raw/Respondent Data.XLSX (read-only, for these additional
columns, which are not present in any saved cohort extract).

Run with: python scripts/export_demographics_psychographics.py
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
OUT_DIR = ROOT / "public" / "data" / "findings"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FOCUSED_EXTRACT = PROCESSED_DIR / "cohort_focused_considered_mf_not_holding.csv"
RESPONDENT_FILE = RAW_DIR / "Respondent Data.XLSX"

# Same known source-workbook mojibake documented in docs/data_inspection.md and
# already handled in scripts/export_respondent_table.py — a display-encoding fix only.
MOJIBAKE_FIXES = {
    "â€“": "–",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€\x9d": "”",
}


def clean_text(value: str) -> str:
    """Fix known source mojibake, unescape HTML entities, and strip literal HTML
    formatting tags (e.g. <u>...</u>) left over from the interviewer script — display
    cleanup only, the underlying option text is unchanged."""
    for bad, good in MOJIBAKE_FIXES.items():
        value = value.replace(bad, good)
    value = html.unescape(value)
    return re.sub(r"</?[a-zA-Z][^>]*>", "", value)


# code -> (short label, plain-language question, group)
SINGLE_SELECT_FIELDS = {
    # --- Demographics ---
    "Q1": ("Gender", "Gender", "Demographics"),
    "Q3D": ("Education level", "Can you please tell me your education level?", "Demographics"),
    "Q13": ("Marital status", "What is your marital status?", "Demographics"),
    "Q5A": ("Family type", "Can you please tell me about your Family Type?", "Demographics"),
    "URBANRURAL": ("Urban / Rural", "Urban-Rural Classification", "Demographics"),
    "Life_Stage": (
        "Age band",
        "Generation band (no raw age-in-years field exists in this workbook — this is the closest available proxy for age)",
        "Demographics",
    ),
    "SELECTED_STATE": ("State", "Selected State", "Demographics"),
    "Zone_DP": ("Zone", "Zone", "Demographics"),
    "SECNEW": ("Socio-economic class (NCCS)", "NCCS socio-economic classification", "Demographics"),
    "Q9": (
        "Living arrangement",
        "Which of the following best describes the living arrangement for the house in which you stay currently?",
        "Demographics",
    ),
    "Q8": (
        "House type",
        "What is the type of house that you live in? (interviewer-observed)",
        "Demographics",
    ),
    "Q11": ("Mother tongue", "What is your mother tongue?", "Demographics"),
    "Q12": ("Religion", "Which faith or spiritual practice do you personally follow or identify with?", "Demographics"),
    # --- Psychographics ---
    "Q29": ("Has a Demat / trading account", "Do you have a Demat account / Share Market trading account?", "Psychographics"),
    "Q10M": ("Reaction to a market downturn", "Reaction to Market Downturn", "Psychographics"),
    "Q11M": ("Familiarity with stock markets", "How familiar are you with investing in stock markets?", "Psychographics"),
    "Q12M": (
        "Financial literacy (inflation vs. savings)",
        "Suppose the rate of return on your savings is 5% per year and inflation is 6% per year — after a year, will you be able to buy more, less, or the same as today with this money?",
        "Psychographics",
    ),
    "QRT": (
        "Return / risk preference",
        "Which of the following best describes your preference when considering returns from investments?",
        "Psychographics",
    ),
    "Q20AM": (
        "Attended an investor education program",
        "There are Investor Education Programmes run by prominent institutions/Industry Associations (SEBI, NISM, Stock Exchanges, Depositories, AMFI, etc.) — have you attended any of these?",
        "Psychographics",
    ),
    "Q20E": (
        "Preferred language for investor education",
        "In which language would you prefer investor education programmes to be conducted?",
        "Psychographics",
    ),
    # g_Q1B[{_1..6}] — perceptions of India's securities-market regulators/entities
    # (this grid directly follows Q1A, "Are you aware of the entities that are directly
    # involved in regulating or operating the securities market in India?" — it is not
    # about mutual funds specifically).
    "g_Q1B[{_1}].Q1B": (
        "Regulators are well regulated",
        "Perceptions of India's securities-market regulators/entities — are well regulated",
        "Psychographics",
    ),
    "g_Q1B[{_2}].Q1B": (
        "Regulators can handle market ups and downs",
        "Perceptions of India's securities-market regulators/entities — are strong enough to handle ups and downs in the markets",
        "Psychographics",
    ),
    "g_Q1B[{_3}].Q1B": (
        "Regulators offer new investment avenues",
        "Perceptions of India's securities-market regulators/entities — offer new avenues and instruments to invest",
        "Psychographics",
    ),
    "g_Q1B[{_4}].Q1B": (
        "Regulators are accessible to investors like me",
        "Perceptions of India's securities-market regulators/entities — are accessible to investors like me",
        "Psychographics",
    ),
    "g_Q1B[{_5}].Q1B": (
        "Regulators offer good wealth-creation opportunities",
        "Perceptions of India's securities-market regulators/entities — offer good opportunities for wealth creation",
        "Psychographics",
    ),
    "g_Q1B[{_6}].Q1B": (
        "Regulators are easy and convenient",
        "Perceptions of India's securities-market regulators/entities — are easy and convenient to invest in",
        "Psychographics",
    ),
    # Q1M_DP[{_1..5}] — allocation of monthly income (percentage bands; "0" is stored as
    # a bare number in the source file for respondents who allocate nothing to that
    # category, normalized to the "0%" band below for consistent display)
    "Q1M_DP[{_1}].Q1M": (
        "Income allocation: monthly expenses",
        "Allocation of monthly income — Monthly Expenses (rent, utilities, groceries, transportation, medical)",
        "Psychographics",
    ),
    "Q1M_DP[{_2}].Q1M": (
        "Income allocation: savings",
        "Allocation of monthly income — Savings (savings accounts, emergency funds)",
        "Psychographics",
    ),
    "Q1M_DP[{_3}].Q1M": (
        "Income allocation: loan repayments",
        "Allocation of monthly income — Loan Repayments (home/personal/car loan EMIs, credit card)",
        "Psychographics",
    ),
    "Q1M_DP[{_4}].Q1M": (
        "Income allocation: investments",
        "Allocation of monthly income — Investments (stocks, mutual funds, real estate, gold, retirement products)",
        "Psychographics",
    ),
    "Q1M_DP[{_5}].Q1M": (
        "Income allocation: other expenses",
        "Allocation of monthly income — Other Expenses (dining out, travel, hobbies, entertainment, luxury)",
        "Psychographics",
    ),
}

# Multi-select fields ("select top 3") whose own option labels contain commas — same
# hazard documented in docs/data_inspection.md for the product fields. Each vocabulary
# is the verified, complete atomic option list for that field (confirmed directly
# against the raw data: every distinct raw value resolves fully into it, see the
# assertion in tokenize() below), used to protect comma-bearing labels before splitting.
MULTISELECT_FIELDS = {
    "Q20CM": (
        "Preferred medium for investor education",
        "Please let me know what your preferred medium would be to receive the investor education program (top 3)",
        "Psychographics",
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
        "Psychographics",
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
        "Psychographics",
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
    """Protect known comma-bearing option labels, split on the remaining commas, then
    restore — same technique used for the product-holding fields (see
    docs/data_inspection.md). Raises if any fragment doesn't resolve into the known
    vocabulary, rather than silently guessing."""
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


def normalize_income_allocation(value):
    """Q1M_DP columns store '0' as a bare number (float) for respondents who allocate
    nothing to that category, and a '<lo>-<hi>%' string band otherwise — normalize to a
    single consistent string label. This is a display-format fix only."""
    if isinstance(value, float):
        return "0%" if value == 0.0 else str(value)
    return value


def main():
    print("Reading verified focused-group extract (for the Resp_ID_DP set only) ...")
    focused = pd.read_csv(FOCUSED_EXTRACT, keep_default_na=False)
    assert len(focused) == 553, f"focused group count changed: {len(focused)} != 553"
    resp_ids = set(focused["Resp_ID_DP"])

    print("Reading raw respondent workbook (read-only, for these additional columns) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    codes, rows = data[0], data[2:]
    raw_df = pd.DataFrame(rows, columns=codes)

    subset = raw_df[raw_df["Resp_ID_DP"].isin(resp_ids)]
    assert len(subset) == 553, f"join produced {len(subset)} rows, expected 553"

    fields_out = []

    for code, (label, wording, group) in SINGLE_SELECT_FIELDS.items():
        col = subset[code]
        if code.startswith("Q1M_DP"):
            col = col.map(lambda v: "" if v == "" else normalize_income_allocation(v))
        non_blank = col[col != ""]
        n_blank = int((col == "").sum())
        counts = non_blank.value_counts()
        total_answered = int(counts.sum())
        options = [
            {"label": clean_text(str(val)), "n": int(n), "pct": round(100 * n / total_answered, 1) if total_answered else 0}
            for val, n in counts.items()
        ]
        fields_out.append(
            {
                "field_code": code,
                "label": label,
                "question_wording": wording,
                "group": group,
                "denominator": 553,
                "n_answered": total_answered,
                "n_blank": n_blank,
                "options": options,
            }
        )

    for code, (label, wording, group, vocabulary) in MULTISELECT_FIELDS.items():
        col = subset[code]
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
                {
                    "label": clean_text(opt),
                    "n": n,
                    "pct": round(100 * n / n_respondents_answered, 1) if n_respondents_answered else 0,
                }
                for opt, n in option_counts.items()
            ),
            key=lambda o: -o["n"],
        )
        fields_out.append(
            {
                "field_code": code,
                "label": label,
                "question_wording": wording + " — multi-select, percentages sum to more than 100%",
                "group": group,
                "denominator": 553,
                "n_answered": n_respondents_answered,
                "n_blank": n_blank,
                "options": options,
            }
        )

    out = {
        "focused_group_size": 553,
        "note": "Simple unweighted frequency counts, not previously part of this study's verified findings docs — new descriptive tabulation only, no comparison or significance test.",
        "fields": fields_out,
    }

    out_path = OUT_DIR / "demographics.json"
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"Wrote {out_path.relative_to(ROOT)} ({out_path.stat().st_size:,} bytes)")
    for fo in fields_out:
        print(f"  {fo['field_code']:20s} answered={fo['n_answered']:>4d} blank={fo['n_blank']:>3d}")


if __name__ == "__main__":
    main()
