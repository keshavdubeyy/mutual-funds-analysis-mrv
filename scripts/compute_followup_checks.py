"""
Follow-up respondent-level checks requested during review of docs/analysis_pages_report.md:

1. Stopping reasons (AA4_DD4) x previous-investment class (Q24A) -- already available in the
   cohort extract.
2. Three barrier (AA2_DD2) x encouragement (AA3_DD3) comparisons, chosen before inspecting any
   result: full counts, answer bases, percentages and signed differences for both sides of
   each comparison (not only the largest gap).
3. Investor-education attendance (Q20AM) x awareness-source selection of "Investor Education
   Programmes run by prominent institutions/industry associations..." (one option within the
   Q4M awareness-source field) -- Q20AM is not in the pre-built cohort extract, so this
   retrieves it directly from the raw workbook and joins on Resp_ID_DP, the same respondent
   key already used throughout data/processed/cohort_focused_considered_mf_not_holding.csv.

Reads data/processed/cohort_focused_considered_mf_not_holding.csv and
data/raw/Respondent Data.XLSX (read-only, respondent-level fields never written back out).
Writes only aggregate counts/percentages to data/processed/analysis/ -- no respondent-level
values in any output file or printed table.

Reuses the already-verified reason-field tokenizer (resolve_reason, from
analysis/03_descriptive_analysis.ipynb / analysis/05_supplementary_measures.ipynb) against the
already-verified AA2_DD2/AA3_DD3 vocabularies in barrier_option_counts.csv -- not redefined or
re-derived here.

Run with: python scripts/compute_followup_checks.py
"""

from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
ANALYSIS_DIR = ROOT / "data" / "processed" / "analysis"
COHORT_CSV = ROOT / "data" / "processed" / "cohort_focused_considered_mf_not_holding.csv"
RAW_XLSX = ROOT / "data" / "raw" / "Respondent Data.XLSX"

SMALL_GROUP_MIN_N = 30


def resolve_reason(v, atomic, expected_items=3):
    """Greedy longest-match tokenizer for comma-delimited AA*_DD* values against a known,
    already-verified vocabulary -- correctly handles option labels that themselves contain
    commas (e.g. "High fees, charges and Management expenses"). Returns None if the value
    doesn't resolve into exactly `expected_items` known tokens."""
    frags = [f.strip() for f in v.split(",")]
    tokens, i = [], 0
    while i < len(frags):
        matched = False
        for j in range(len(frags), i, -1):
            candidate = ", ".join(frags[i:j])
            if candidate in atomic:
                tokens.append(candidate)
                i = j
                matched = True
                break
        if not matched:
            return None
    return tokens if len(tokens) == expected_items else None


def main():
    cohort = pd.read_csv(COHORT_CSV)
    assert len(cohort) == 553

    barrier_counts = pd.read_csv(ANALYSIS_DIR / "barrier_option_counts.csv")
    aa2_vocab = set(barrier_counts.loc[barrier_counts.field == "AA2_DD2", "option"])
    aa3_vocab = set(barrier_counts.loc[barrier_counts.field == "AA3_DD3", "option"])
    assert len(aa2_vocab) == 18
    assert len(aa3_vocab) == 10

    # --- 1. Stopping reasons x previous-investment class ---
    answered_aa4 = cohort["AA4_DD4_raw"].notna() & (cohort["AA4_DD4_raw"].astype(str).str.strip() != "")
    print(f"=== (1) AA4_DD4 answerers by prev_mf_investment_class -- n={answered_aa4.sum()} of 553 ===")
    stopping_by_class = (
        cohort.loc[answered_aa4, "prev_mf_investment_class"]
        .value_counts()
        .rename_axis("prev_mf_investment_class")
        .reset_index(name="n_answered_aa4")
    )
    print(stopping_by_class.to_string(index=False))
    stopping_by_class.to_csv(ANALYSIS_DIR / "followup_stopping_reasons_by_experience.csv", index=False)

    # --- 2. Barrier x encouragement pairs, full detail both sides ---
    both = cohort[cohort["AA2_DD2_raw"].notna() & cohort["AA3_DD3_raw"].notna()].copy()
    assert len(both) == 266
    both["aa2_tokens"] = both["AA2_DD2_raw"].apply(lambda v: resolve_reason(v, aa2_vocab))
    both["aa3_tokens"] = both["AA3_DD3_raw"].apply(lambda v: resolve_reason(v, aa3_vocab))
    n_unresolved = both["aa2_tokens"].isna().sum() + both["aa3_tokens"].isna().sum()
    assert n_unresolved == 0, f"{n_unresolved} unresolved fragment(s) -- tokenizer failed to fully resolve"

    pairs = [
        ("I don't know how to start investing in Mutual funds",
         "Simple and easy process for investing (e.g. account opening, documentation, etc.)"),
        ("Lack of knowledge about how mutual funds work",
         "Better education on how mutual funds work"),
        ("Requires large amount to start investing",
         "Reducing the minimum investment requirement"),
    ]

    rows = []
    print("\n=== (2) Barrier x matching-encouragement, full detail (n=266 both answered) ===")
    for barrier, encouragement in pairs:
        selected_barrier = both["aa2_tokens"].apply(lambda toks: barrier in toks)
        selected_enc = both["aa3_tokens"].apply(lambda toks: encouragement in toks)
        for side_label, mask in [("selected_barrier", selected_barrier), ("did_not_select_barrier", ~selected_barrier)]:
            sub = selected_enc[mask]
            n = int(len(sub))
            n_sel = int(sub.sum())
            meets_min = n >= SMALL_GROUP_MIN_N
            pct = round(100 * n_sel / n, 1) if meets_min else None
            rows.append({
                "barrier": barrier, "encouragement": encouragement, "side": side_label,
                "n": n, "n_selecting_encouragement": n_sel, "meets_small_group_min": meets_min,
                "pct_selecting_encouragement": pct,
            })
    detail = pd.DataFrame(rows)

    # Signed difference: selected-barrier minus did-not-select-barrier, from raw counts.
    diffs = []
    for barrier, encouragement in pairs:
        sel = detail[(detail.barrier == barrier) & (detail.side == "selected_barrier")].iloc[0]
        not_sel = detail[(detail.barrier == barrier) & (detail.side == "did_not_select_barrier")].iloc[0]
        pp_diff = round(100 * (sel.n_selecting_encouragement / sel.n - not_sel.n_selecting_encouragement / not_sel.n), 1)
        diffs.append({"barrier": barrier, "encouragement": encouragement, "pp_diff_selected_minus_not": pp_diff})
    diffs_df = pd.DataFrame(diffs)

    print(detail.to_string(index=False))
    print()
    print(diffs_df.to_string(index=False))
    detail.to_csv(ANALYSIS_DIR / "followup_barrier_encouragement_pairs.csv", index=False)
    diffs_df.to_csv(ANALYSIS_DIR / "followup_barrier_encouragement_pairs_diffs.csv", index=False)

    # --- 3. Education attendance (Q20AM, raw workbook) x awareness-source selection ---
    raw = pd.read_excel(RAW_XLSX, sheet_name=0, header=[0, 1])
    raw.columns = [c[0] for c in raw.columns]  # keep the short field-code row only
    q20am_col = "Q20AM"
    q4m_col = "Q4_Q5_NONInv_Filt[{_1_2}].Q4M"
    assert q20am_col in raw.columns and q4m_col in raw.columns

    id_col = "Resp_ID_DP"
    joined = cohort[[id_col, "AA2_DD2_raw"]].merge(
        raw[[id_col, q20am_col, q4m_col]], on=id_col, how="left", validate="one_to_one"
    )
    # Same 266-person answer base as everywhere else in this project for this field.
    aware_answered = joined[q4m_col].notna() & (joined[q4m_col].astype(str).str.strip() != "")
    assert int(aware_answered.sum()) == 266

    institutional_program_label = (
        "Investor Education Programmes run by prominent institutions/industry associations "
        "(SEBI, NISM, Exchanges, Depositories, AMFI/Mutual fund sahi hai etc)"
    )
    cited_institutional_source = joined.loc[aware_answered, q4m_col].astype(str).str.contains(
        institutional_program_label, regex=False
    )
    n_cited = int(cited_institutional_source.sum())

    q20am_values = joined.loc[aware_answered, q20am_col]
    attended_mask = q20am_values.astype(str).str.startswith("Yes,")

    print(f"\n=== (3) Among the 266 who answered the awareness-source question ===")
    print(f"Cited the institutional-education-program awareness source: n={n_cited}")
    # cited_institutional_source and attended_mask are both derived from the same
    # joined.loc[aware_answered, ...] slice, so they already share an identical index.
    both_mask = cited_institutional_source & attended_mask
    n_both = int(both_mask.sum())
    print(f"Of those {n_cited}, also report attending an investor-education program (Q20AM): n={n_both}")
    n_attended_overall = int(attended_mask.sum())
    print(f"Attended an investor-education program among all 266 awareness-source answerers: n={n_attended_overall}")

    overlap = pd.DataFrame([{
        "cited_institutional_program_as_awareness_source": n_cited,
        "of_those_also_attended_per_q20am": n_both,
        "attended_among_all_266_awareness_answerers": n_attended_overall,
        "denominator_awareness_answerers": 266,
    }])
    print(overlap.to_string(index=False))
    overlap.to_csv(ANALYSIS_DIR / "followup_education_attendance_vs_awareness_source.csv", index=False)

    print("\nWrote:")
    for name in [
        "followup_stopping_reasons_by_experience.csv",
        "followup_barrier_encouragement_pairs.csv",
        "followup_barrier_encouragement_pairs_diffs.csv",
        "followup_education_attendance_vs_awareness_source.csv",
    ]:
        p = ANALYSIS_DIR / name
        print(" -", p.relative_to(ROOT), f"({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
