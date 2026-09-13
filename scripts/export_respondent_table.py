"""
Build the LOCAL, dev-only respondent-table extract used by the Findings page's
"Respondent data" tab.

Source: data/processed/cohort_focused_considered_mf_not_holding.csv — the verified,
already-defined focused-group extract (553 records; see docs/cohort_definition.md).
Cohort membership and rules are NOT touched here — this script only:
  1. Re-reads that extract as-is (553 rows in, 553 rows out, same Resp_ID_DP set).
  2. Joins one additional already-verified field (Q10A, Monthly Personal Income) from
     the raw respondent workbook by Resp_ID_DP — the same join
     analysis/04_segment_comparisons.ipynb already performs and validates (0 missing
     after the join). No other raw-workbook field is added.
  3. Drops respondent identifiers (Resp_ID_DP, UniqueId_DP, weights) and replaces them
     with a local display reference (R001..R553) assigned by row order — never derived
     from or reversible to the original ID.
  4. Writes ONLY to data/processed/ (already fully gitignored except README.md) —
     never to public/, never anywhere a client bundle or static export could pick it up.

This output is read exclusively by a server-only, development-only Next.js API route
(src/app/api/dev/respondent-table/route.ts), which itself refuses to serve it outside
`next dev` / NODE_ENV !== "production".

Run with: python scripts/export_respondent_table.py
"""

import json
from pathlib import Path

import pandas as pd
from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
OUT_PATH = PROCESSED_DIR / "respondent_table.json"

FOCUSED_EXTRACT = PROCESSED_DIR / "cohort_focused_considered_mf_not_holding.csv"
RESPONDENT_FILE = RAW_DIR / "Respondent Data.XLSX"

INCOME_SPECIAL = {
    "Do not wish to disclose (DO NOT AID THIS OPTION)": "Do not wish to disclose",
    "No current income (DO NOT AID THIS OPTION)": "No current income",
}


def income_tier(bracket: str) -> str:
    if bracket in INCOME_SPECIAL:
        return INCOME_SPECIAL[bracket]
    import re

    lower_bound = int(re.search(r"[\d,]+", bracket).group().replace(",", ""))
    if lower_bound <= 20000:
        return "Up to Rs.20,000"
    if lower_bound <= 40000:
        return "Rs.20,001-Rs.40,000"
    return "Above Rs.40,000"


# Documented in docs/data_inspection.md: the source workbook's own sharedStrings.xml
# contains these exact mojibake byte sequences for punctuation (confirmed there, not
# introduced by our reading tools). Normalizing them here is a display-encoding fix
# only — it does not change or reinterpret any answer's substance.
MOJIBAKE_FIXES = {
    "â€“": "–",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€\x9d": "”",
}


def fix_mojibake(value: str) -> str:
    for bad, good in MOJIBAKE_FIXES.items():
        value = value.replace(bad, good)
    return value


# The two special income options carry a verbatim interviewer instruction in their
# label ("(DO NOT AID THIS OPTION)") — a fieldwork instruction, not part of the
# respondent's substantive answer. Stripped for display only; income_tier() below
# still matches against the original label from the source workbook.
INCOME_DISPLAY_FIXES = {
    "Do not wish to disclose (DO NOT AID THIS OPTION)": "Do not wish to disclose",
    "No current income (DO NOT AID THIS OPTION)": "No current income",
}


def display_income_bracket(value: str) -> str:
    fixed = fix_mojibake(value)
    return INCOME_DISPLAY_FIXES.get(value, fixed)


def blank_or(value: str) -> str | None:
    if value == "":
        return None
    return fix_mojibake(value)


def main():
    print("Reading verified focused-group extract ...")
    focused = pd.read_csv(FOCUSED_EXTRACT, keep_default_na=False)
    assert len(focused) == 553, f"focused group count changed: {len(focused)} != 553"
    assert focused["Resp_ID_DP"].duplicated().sum() == 0

    print("Reading raw respondent workbook (for Q10A income only) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    codes, rows = data[0], data[2:]
    raw_df = pd.DataFrame(rows, columns=codes)
    income_cols = raw_df[["Resp_ID_DP", "Q10A"]]

    focused = focused.merge(income_cols, on="Resp_ID_DP", how="left")
    assert focused["Q10A"].isna().sum() == 0 and (focused["Q10A"] != "").all(), (
        "Q10A must be present for every focused-group respondent (re-verify join)"
    )

    records = []
    for i, row in enumerate(focused.itertuples(index=False), start=1):
        r = row._asdict()
        records.append(
            {
                "ref": f"R{i:03d}",
                "age_band": r["Life_Stage"],
                "occupation": fix_mojibake(r["Q14_occupation_raw"]),
                "occupation_class": r["occupation_class"],
                "income_bracket": display_income_bracket(r["Q10A"]),
                "income_tier": income_tier(r["Q10A"]),
                "considers_mf": bool(r["considers_mf_token"]),
                "mf_holding_status": r["mf_holding_status"],
                "prev_mf_investment_class": r["prev_mf_investment_class"],
                "raw": {
                    "Q21A_awareness": blank_or(r["Q21A_awareness_raw"]),
                    "Q22A_All_holdings": blank_or(r["Q22A_All_holdings_raw"]),
                    "Q23A_consideration": blank_or(r["Q23A_consideration_raw"]),
                    "Q24A_past_investment": blank_or(r["Q24A_past_investment_raw"]),
                    "Q25A_never_consider": blank_or(r["Q25A_never_consider_raw"]),
                    "AA1_DD1": blank_or(r["AA1_DD1_raw"]),
                    "AA2_DD2": blank_or(r["AA2_DD2_raw"]),
                    "AA3_DD3": blank_or(r["AA3_DD3_raw"]),
                    "AA4_DD4": blank_or(r["AA4_DD4_raw"]),
                },
            }
        )

    assert len(records) == 553
    assert all(rec["mf_holding_status"] == "does_not_hold" for rec in records)
    assert all(rec["considers_mf"] is True for rec in records)

    with open(OUT_PATH, "w") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(records)} records to {OUT_PATH.relative_to(ROOT)} ({OUT_PATH.stat().st_size:,} bytes)")
    print("No Resp_ID_DP, UniqueId_DP, weights, or free-text fields included.")


if __name__ == "__main__":
    main()
