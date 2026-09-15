"""
Export verified aggregate JSON for the supplementary measures computed in
analysis/05_supplementary_measures.ipynb: awareness sources/media, corrected income
allocation, financial-goal ranking, and the three planned relationships.

Reads only already-verified aggregate CSVs in data/processed/analysis/ (never the
respondent-level cohort extract) and writes aggregate/derived JSON to
public/data/findings/. No respondent-level values anywhere in the output.

Q12M and Q20AM are NOT re-exported here — both are already correctly exported in
public/data/findings/demographics.json (see scripts/export_demographics_psychographics.py);
q12m_recheck.csv exists only as an independent verification artifact, not a new export.

Run with: python scripts/export_supplementary_measures.py
"""

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
ANALYSIS_DIR = ROOT / "data" / "processed" / "analysis"
OUT_DIR = ROOT / "public" / "data" / "findings"
OUT_DIR.mkdir(parents=True, exist_ok=True)


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


def main():
    # --- Awareness sources and media ---
    aware = pd.read_csv(ANALYSIS_DIR / "awareness_sources_media.csv")
    denom = int(aware["denominator"].iloc[0])
    awareness_sources = {
        "note": (
            "Focused group, restricted to the 266 respondents who substantively answered AA2_DD2 — "
            "verified to be the identical answer base for this field. Multi-select, percentages sum "
            "to more than 100%. Only a combined MF+ETF slot exists for this population (no MF-only "
            "slot) — a property of the survey, not a scope choice made here. Reports where respondents "
            "say they heard about these products, not whether that source caused them to invest."
        ),
        "denominator": denom,
        "focused_group_size": 553,
        "sources": aware[aware.field == "sources"][["option", "n", "pct_of_answered"]].to_dict(orient="records"),
        "media": aware[aware.field == "media"][["option", "n", "pct_of_answered"]].to_dict(orient="records"),
    }
    dump_json(awareness_sources, OUT_DIR / "awareness_sources.json")

    # --- Corrected income allocation ---
    alloc = pd.read_csv(ANALYSIS_DIR / "income_allocation_corrected.csv")
    categories = []
    for slot, g in alloc.groupby("slot"):
        categories.append({
            "slot": int(slot),
            "category": g["category"].iloc[0],
            "denominator": int(g["denominator"].iloc[0]),
            "n_blank": int(g["n_blank"].iloc[0]),
            "focused_group_size": 553,
            "options": g[["option", "n", "pct_of_answered"]].to_dict(orient="records"),
        })
    categories.sort(key=lambda c: c["slot"])
    income_allocation = {
        "note": (
            "Recomputed from the raw Q1MXGrid percentage field, not the derived Q1M_DP field — "
            "Q1M_DP silently converts \"not administered\" into a \"0%\" category. Each category is "
            "its own independent distribution; these five are not validated as a joint budget and "
            "should not be summed into a disposable-income figure."
        ),
        "focused_group_size": 553,
        "categories": categories,
    }
    dump_json(income_allocation, OUT_DIR / "income_allocation.json")

    # --- Financial-goal ranking ---
    goals = pd.read_csv(ANALYSIS_DIR / "financial_goal_ranking.csv")
    financial_goals = {
        "note": (
            "Share of the 553-respondent focused group who ranked each goal anywhere in their top 3 "
            "priorities (Q6_RANK_GRID) — not a rank-weighted score. All 553 answered at least one slot. "
            "\"Others (free text)\" is its own separate count, not a named goal."
        ),
        "focused_group_size": 553,
        "goals": goals.sort_values("n_ranked_in_top3", ascending=False).to_dict(orient="records"),
    }
    dump_json(financial_goals, OUT_DIR / "financial_goals.json")

    # --- Three relationships ---
    def relationship_block(csv_name, pct_col, group_label, target_option, overall_pct):
        df = pd.read_csv(ANALYSIS_DIR / csv_name)
        return {
            "group_label": group_label,
            "target_option": target_option,
            "denominator": int(df["n"].sum()),
            "overall_pct": overall_pct,
            "rows": df.rename(columns={pct_col: "pct_selecting"}).to_dict(orient="records"),
        }

    relationships = {
        "note": (
            "Each relationship uses actual joint answers from the same 266 respondents (a genuine "
            "respondent-level join, not derived from separate marginal totals). Percentages are shown "
            "only for categories with at least 30 respondents (the same small-group rule used "
            "elsewhere in this project); smaller categories are counts only. These describe observed "
            "associations in this sample, not causes, and no significance test is applied."
        ),
        "small_group_min_n": 30,
        "qrt_fear_of_loss": relationship_block(
            "relationship_qrt_fear_of_loss.csv",
            "pct_selecting_fear_of_loss",
            "Risk / return preference (QRT)",
            "Fear of losing money due to market risks",
            30.5,
        ),
        "knowledge_item1_education": relationship_block(
            "relationship_knowledge_item1_education.csv",
            "pct_selecting_better_education",
            "Response to \"Direct plans in mutual funds have a lower expense ratio than regular plans\"",
            "Better education on how mutual funds work",
            36.5,
        ),
        "kyc_simple_process": relationship_block(
            "relationship_kyc_simple_process.csv",
            "pct_selecting_simple_process",
            "Response to \"KYC can be completed online\"",
            "Simple and easy process for investing",
            44.0,
        ),
    }
    dump_json(relationships, OUT_DIR / "relationships.json")

    print("Done. Wrote:")
    for name in ["awareness_sources.json", "income_allocation.json", "financial_goals.json", "relationships.json"]:
        p = OUT_DIR / name
        print(" -", p.relative_to(ROOT), f"({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
