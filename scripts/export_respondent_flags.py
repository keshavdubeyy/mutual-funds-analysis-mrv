"""
Export per-respondent DERIVED flags for the "Dataset and Method" page's View Data table.

Reads only:
  - data/raw/Respondent Data.XLSX, read-only.

Writes one row per respondent (all 109,430) to public/data/dataset-method/respondent_flags.json,
but only as derived, non-identifying, low-cardinality flags:
  - No respondent identifier is included (Resp_ID_DP / UniqueId_DP are read only to confirm
    row count, never written out).
  - No free-text or raw multi-select cell values are included — only the derived
    categorical/boolean OUTCOME of each selection-funnel rule (e.g. "considers_mf": yes/no/
    unknown), never the raw Q23A/Q22A_All string.
  - Every exported category is a small, closed set (<= 9 values).

The classification and tokenization logic below is copied verbatim from the verified,
assertion-checked logic in analysis/02_cohort_definition.ipynb (see docs/cohort_definition.md)
so this export can never silently diverge from the documented selection funnel.

Run with: python scripts/export_respondent_flags.py
"""

import json
from pathlib import Path

import pandas as pd
from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
RESPONDENT_FILE = ROOT / "data" / "raw" / "Respondent Data.XLSX"
OUT_DIR = ROOT / "public" / "data" / "dataset-method"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Occupation classification (verbatim from analysis/02_cohort_definition.ipynb) ---
SALARIED_DOCUMENTED = {
    "Clerk / Salesman",
    "Supervisory Level",
    "Officer / Executive - Junior",
    "Officer / Executive - Middle /Senior",
    "Postman",
    "Service (Rural In any village) & CWE Education illiterate to 9th standard",
    "Service (Rural In any village) & CWE Education 10 to Graduate",
    "Service (Rural In any village) & CWE Education Grad/Post Grad Prof or Post Grad General",
    "Service (Urban) & CWE Education Grad/Post Grad Prof or Post Grad General",
}
BUSINESS_DOCUMENTED = {
    "Petty trader- street vendor, drivers owning vehicles etc.",
    "Shop Owner- operate from a permanent establishment e.g. wholesalers, distributors etc.",
    "Businessmen/Industrialist with no employees under him/her",
    "Businessmen/Industrialist with 9 or less employees under him/her",
    "Trader / Shopkeeper",
}
SELF_EMPLOYED_DOCUMENTED = {
    "Self-employed professional like Doctors, Lawyers etc.",
    "Teacher",
    "Doctor",
    "Self Employed Professional",
}
AGRICULTURE_DOCUMENTED = {
    "Owner Farmer", "Leased Farmer", "Agricultural Worker",
    "Owner Of Livestock", "Owner Of Fisheries", "Owner Of Poultry",
}
UNSKILLED_DOCUMENTED = {
    "Unskilled worker like Cleaner/housemaids etc.",
    "Unskilled Labourer (Other Than Agriculture)",
}
SKILLED_DOCUMENTED = {
    "Skilled worker like electrician/Mechanic etc.",
    "Artisan / Skilled Labourer",
}
NON_WORKER_DIRECT = {"Student", "Homemaker / Housewife", "Unemployed", "Retired"}
BUSINESS_INFERRED_GAP = {"Businessmen/Industrialist with 10 or more employees under him/her"}
DOCUMENTATION_GAP_AMBIGUOUS = {
    "Service (Urban) & CWE Education 10 to Graduate",
    "Service (Urban) & CWE Education illiterate to 9th standard",
}
CATCHALL_AMBIGUOUS = {"Others (Specify)"}

OCCUPATION_CLASS_LEGEND = [
    "included_salaried_documented",
    "excluded_business",
    "excluded_self_employed",
    "excluded_agriculture",
    "excluded_unskilled_worker",
    "excluded_skilled_worker",
    "excluded_non_worker",
    "ambiguous_documentation_gap",
    "ambiguous_catchall",
]


def classify_occupation(q14: str) -> str:
    if q14 in SALARIED_DOCUMENTED:
        return "included_salaried_documented"
    if q14 in BUSINESS_DOCUMENTED or q14 in BUSINESS_INFERRED_GAP:
        return "excluded_business"
    if q14 in SELF_EMPLOYED_DOCUMENTED:
        return "excluded_self_employed"
    if q14 in AGRICULTURE_DOCUMENTED:
        return "excluded_agriculture"
    if q14 in UNSKILLED_DOCUMENTED:
        return "excluded_unskilled_worker"
    if q14 in SKILLED_DOCUMENTED:
        return "excluded_skilled_worker"
    if q14 in NON_WORKER_DIRECT:
        return "excluded_non_worker"
    if q14 in DOCUMENTATION_GAP_AMBIGUOUS:
        return "ambiguous_documentation_gap"
    if q14 in CATCHALL_AMBIGUOUS:
        return "ambiguous_catchall"
    return "ambiguous_unclassified"  # safety net — should never fire; checked below


# --- Product-field tokenization (verbatim from analysis/02_cohort_definition.ipynb) ---
CRYPTO_ORIG = "Cryptocurrency (e.g. Tether, Bitcoin, Ethereum, etc)"
CRYPTO_PLACEHOLDER = "Cryptocurrency (e.g. Tether\x00Bitcoin\x00Ethereum\x00etc)"
MF_TOKEN = "Mutual Funds (One-time Lumpsum / SIP)"
ETF_TOKEN = "Exchange Trade Funds (ETF) / Gold Exchange Trade Funds (Gold ETF)"

KNOWN_VOCAB = {
    "Alternate Investment Fund (AIF)", "Chit Fund", "Corporate Bonds", CRYPTO_ORIG,
    "Employees Provident Fund (EPF)", ETF_TOKEN,
    "Fixed Deposits / Recurring Deposit / Bank Savings Account", "Futures & Options (F&O)",
    "Gold - Physical form / Sovereign Gold Bond (SGB)", "Life insurance / Unit Linked Insurance Plans (ULIPS)",
    "MF+ETF", "MF_ETF", MF_TOKEN, "National Pension System (NPS)",
    "None of the above", "Not Answered",
    "Post office savings / Kisan Vikas Patra (KVP) / National Savings Certificate (NSC)",
    "Public Provident Fund (PPF) / Voluntary Provident Fund (VPF)",
    "Real Estate Investment Trusts (REITs) and /or Infrastructure Investment Trusts (InvIT)",
    "Real Estate as an Investment (excluding where you are staying)", "Stocks / Shares",
}


def tokenize(raw: str):
    if raw == "" or raw is None:
        return [], True
    protected = raw.replace(CRYPTO_ORIG, CRYPTO_PLACEHOLDER)
    tokens = [p.strip().replace("\x00", ", ") for p in protected.split(",")]
    return tokens, all(t in KNOWN_VOCAB for t in tokens)


def tokset(raw: str) -> frozenset:
    tokens, ok = tokenize(raw)
    assert ok, f"Unresolved fragment(s) in: {raw!r}"
    return frozenset(tokens)


def q22_status(raw: str) -> str:
    if raw == "":
        return "blank_not_administered"
    if raw == "Not Answered":
        return "explicit_not_answered"
    return "interpretable"


def mf_holding_status(raw: str) -> str:
    status = q22_status(raw)
    if status != "interpretable":
        return "unknown"
    return "holds" if MF_TOKEN in tokset(raw) else "does_not_hold"


CONSIDERS_MF_LEGEND = ["no", "unknown", "yes"]
MF_HOLDING_LEGEND = ["does_not_hold", "holds", "unknown"]


def main():
    print("Reading raw respondent workbook (this takes ~10-15s) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    codes, rows = data[0], data[2:]
    df = pd.DataFrame(rows, columns=codes)
    n_total = len(df)
    assert (n_total, df.shape[1]) == (109430, 448), "Unexpected shape — investigate before continuing"

    completed_main = df["MAIN_COMP_STATUS"] == "Main Complete"

    life_stage_legend = sorted(df["Life_Stage"].unique())
    life_stage_index = {v: i for i, v in enumerate(life_stage_legend)}
    life_stage_codes = df["Life_Stage"].map(life_stage_index)

    occupation_class = df["Q14"].apply(classify_occupation)
    n_unclassified = int((occupation_class == "ambiguous_unclassified").sum())
    assert n_unclassified == 0, f"{n_unclassified} Q14 values have no documented classification"
    occ_index = {v: i for i, v in enumerate(OCCUPATION_CLASS_LEGEND)}
    occupation_codes = occupation_class.map(occ_index)

    q23_raw = df["Q23A"]
    q23_blank = q23_raw == ""
    q23_has_mf = q23_raw.apply(tokset).apply(lambda t: MF_TOKEN in t)
    considers_mf = pd.Series("no", index=df.index)
    considers_mf[q23_blank] = "unknown"
    considers_mf[~q23_blank & q23_has_mf] = "yes"
    considers_index = {v: i for i, v in enumerate(CONSIDERS_MF_LEGEND)}
    considers_mf_codes = considers_mf.map(considers_index)

    mf_holding = df["Q22A_All"].apply(mf_holding_status)
    holding_index = {v: i for i, v in enumerate(MF_HOLDING_LEGEND)}
    mf_holding_codes = mf_holding.map(holding_index)

    in_focused_group = (
        completed_main
        & (df["Life_Stage"] == "Gen Z")
        & (occupation_class == "included_salaried_documented")
        & (considers_mf == "yes")
        & (mf_holding == "does_not_hold")
    )
    print("Focused-group size (recomputed here, must match docs/cohort_definition.md):", int(in_focused_group.sum()))
    assert int(in_focused_group.sum()) == 553

    payload = {
        "n": n_total,
        "legends": {
            "life_stage": life_stage_legend,
            "occupation_class": OCCUPATION_CLASS_LEGEND,
            "considers_mf": CONSIDERS_MF_LEGEND,
            "mf_holding_status": MF_HOLDING_LEGEND,
        },
        "columns": {
            "completed_main": completed_main.astype(bool).tolist(),
            "life_stage": life_stage_codes.astype(int).tolist(),
            "occupation_class": occupation_codes.astype(int).tolist(),
            "considers_mf": considers_mf_codes.astype(int).tolist(),
            "mf_holding_status": mf_holding_codes.astype(int).tolist(),
            "in_focused_group": in_focused_group.astype(bool).tolist(),
        },
    }

    out_path = OUT_DIR / "respondent_flags.json"
    with open(out_path, "w") as f:
        json.dump(payload, f, separators=(",", ":"))
    print("Wrote", out_path.relative_to(ROOT), f"({out_path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
