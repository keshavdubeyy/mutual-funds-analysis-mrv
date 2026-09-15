"""
Export verified aggregate JSON for the "Findings" page's Analysis tab.

Reads only already-verified aggregate CSVs in data/processed/analysis/ (never the
respondent-level cohort extracts) and writes aggregate/derived JSON to
public/data/findings/. No respondent-level values anywhere in the output.

The broader-group MF-holding-share context and the per-field coverage/routing-evidence
tables are intentionally NOT re-exported here — the Analysis tab reuses
public/data/dataset-method/sample_selection.json and coverage.json directly, per
instructions to treat existing exports as the source of truth rather than duplicating
them.

Run with: python scripts/export_findings_data.py
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
    barrier_counts = pd.read_csv(ANALYSIS_DIR / "barrier_option_counts.csv")
    prev_investment = pd.read_csv(ANALYSIS_DIR / "prev_investment_distribution.csv")  # group sizes only, not re-exported
    barrier_meta = pd.read_csv(ANALYSIS_DIR / "barrier_field_metadata.csv").set_index("field_code")
    cmp_aa2_prev = pd.read_csv(ANALYSIS_DIR / "comparison_AA2_DD2_by_prev_investment.csv")
    cmp_aa3_prev = pd.read_csv(ANALYSIS_DIR / "comparison_AA3_DD3_by_prev_investment.csv")
    cmp_aa2_income = pd.read_csv(ANALYSIS_DIR / "comparison_AA2_DD2_by_income_tier.csv")
    coverage_income = pd.read_csv(ANALYSIS_DIR / "coverage_AA2_DD2_by_income_tier.csv")
    income_tier_def = pd.read_csv(ANALYSIS_DIR / "income_tier_definition.csv")
    # AA3_DD3 is answered by the identical 266 respondents who answer AA2_DD2 (verified
    # directly, docs/segment_findings.md §4) — this coverage-by-previous-investment table
    # therefore applies identically to both AA2_DD2 and AA3_DD3, not just AA3_DD3.
    coverage_prev = pd.read_csv(ANALYSIS_DIR / "coverage_AA3_DD3_by_prev_investment.csv")

    # Previous investment experience (Q24A, 382/136/35) is already exported at
    # public/data/dataset-method/coverage.json -> previous_investment_q24a — reused
    # directly by the Analysis tab rather than re-exported here.

    # --- Barriers (AA2_DD2) and encouragement (AA3_DD3) ---
    def field_block(field_code):
        meta = barrier_meta.loc[field_code]
        options = barrier_counts[barrier_counts.field == field_code][["option", "n", "pct_of_answered"]]
        return {
            "field_code": field_code,
            "question_wording": meta["question_wording"],
            "denominator": int(meta["n_substantive_answer"]),
            "focused_group_size": int(meta["focused_group_size"]),
            "intended_respondent_group": meta["intended_respondent_group"],
            "routing_evidence": meta["routing_evidence"],
            "options": options.to_dict(orient="records"),
        }

    dump_json(field_block("AA1_DD1"), OUT_DIR / "motivations.json")
    dump_json(field_block("AA2_DD2"), OUT_DIR / "barriers.json")
    dump_json(field_block("AA3_DD3"), OUT_DIR / "encouragement.json")
    dump_json(field_block("AA4_DD4"), OUT_DIR / "stopping_reasons.json")

    # --- Comparison by previous investment experience ---
    prev_group_sizes = {row["category_fine"]: int(row["n"]) for _, row in prev_investment.iterrows()}
    comparison_by_experience = {
        "note": "Descriptive only — no significance test, no causal claim. MF+ETF combined scope.",
        "group_sizes": prev_group_sizes,
        "coverage": coverage_prev.to_dict(orient="records"),
        "barriers_AA2_DD2": cmp_aa2_prev.rename(columns={cmp_aa2_prev.columns[0]: "option"}).to_dict(
            orient="records"
        ),
        "encouragement_AA3_DD3": cmp_aa3_prev.to_dict(orient="records"),
    }
    dump_json(comparison_by_experience, OUT_DIR / "comparison_by_experience.json")

    # --- Comparison by income tier ---
    comparison_by_income = {
        "note": "Descriptive only — no significance test, no causal claim. MF+ETF combined scope. Income = Q10A, Monthly Personal Income (all sources, before tax), never salary.",
        "tier_sizes": income_tier_def.to_dict(orient="records"),
        "coverage": coverage_income.to_dict(orient="records"),
        "barriers_AA2_DD2": cmp_aa2_income.to_dict(orient="records"),
    }
    dump_json(comparison_by_income, OUT_DIR / "comparison_by_income.json")

    print("Done. Wrote:")
    for p in sorted(OUT_DIR.glob("*.json")):
        print(" -", p.relative_to(ROOT), f"({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
