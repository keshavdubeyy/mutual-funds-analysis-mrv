"""
Generate docs/survey_schema_reference.md — a full inventory of every column in the
SEBI Investor Survey 2025 respondent workbook (448 columns), grouped by topic, with
observed example values, for planning what else could be shown or analyzed.

This is a planning document, not a new analysis: every number in it is either already
in data/processed/data_dictionary.csv (question wording, dtype, missing/distinct
counts) or a fresh, read-only, aggregate-only value-count pass over
data/raw/Respondent Data.XLSX for columns with few distinct values (never
respondent-level values, never free text). No cohort logic, no new derived
classification, no significance test.

Run with: python scripts/generate_schema_reference.py
"""

import csv
import html
import re
from pathlib import Path

import pandas as pd
from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
DATA_DICT = ROOT / "data" / "processed" / "data_dictionary.csv"
RESPONDENT_FILE = ROOT / "data" / "raw" / "Respondent Data.XLSX"
OUT_PATH = ROOT / "docs" / "survey_schema_reference.md"

MOJIBAKE_FIXES = {"â€“": "–", "â€”": "—", "â€™": "’", "â€œ": "“", "â€\x9d": "”"}


def clean(value: str) -> str:
    for bad, good in MOJIBAKE_FIXES.items():
        value = value.replace(bad, good)
    value = html.unescape(value)
    return re.sub(r"</?[a-zA-Z][^>]*>", "", value).strip()


# Fields already surfaced somewhere in the app today (Dataset & Method field catalogue
# enrichment, or the Findings demographics/psychographics card, or the respondent-table
# extract's raw fields) — kept as a plain list here so this doc can flag them, rather
# than re-deriving "used" status from application code.
ALREADY_USED = {
    "Resp_ID_DP", "UniqueId_DP", "WeightMainM2", "Weight_to_Sample", "INT_TYPE",
    "MAIN_COMP_STATUS", "QLISTMAIN", "QFL", "Life_Stage", "Q14", "CWE", "Q10", "Q10A",
    "Q21A", "Q1A", "Q29", "Q23A", "Q25A", "Q22A_All", "Q24A",
    "A11_D11", "A12_D12", "A13_D13", "A14_D14", "A15_D15",
    "AA1_DD1", "AA2_DD2", "AA3_DD3", "AA4_DD4",
    "Q1", "Q3D", "Q13", "Q5A", "URBANRURAL", "Q10M", "Q11M", "Q12M",
    "SELECTED_STATE", "Zone_DP", "SECNEW", "Q9", "Q8", "Q11", "Q12",
    "QRT", "Q20AM", "Q20E", "Q20CM", "Q20DM", "Q20F",
    "g_Q1B[{_1}].Q1B", "g_Q1B[{_2}].Q1B", "g_Q1B[{_3}].Q1B",
    "g_Q1B[{_4}].Q1B", "g_Q1B[{_5}].Q1B", "g_Q1B[{_6}].Q1B",
    "Q1M_DP[{_1}].Q1M", "Q1M_DP[{_2}].Q1M", "Q1M_DP[{_3}].Q1M",
    "Q1M_DP[{_4}].Q1M", "Q1M_DP[{_5}].Q1M",
}

# code -> (topic, blurb). Grouping is structural (naming/description-based), not
# invented: every prefix family here was confirmed by reading its row-2 description
# (see scripts/export_dataset_method_data.py and scripts/export_demographics_psychographics.py
# for the same fields' verified wording).
GRID_PREFIX_TOPIC = [
    (re.compile(r"^(SS_B\d+)$"), "Product journey: Stocks/Shares (not MF)"),
    (re.compile(r"^(SS_BB\d+)$"), "Product journey: Stocks/Shares (not MF)"),
    (re.compile(r"^(FO_C\d+)$"), "Product journey: Futures & Options (not MF)"),
    (re.compile(r"^(FO_CC\d+)$"), "Product journey: Futures & Options (not MF)"),
    (re.compile(r"^(REIT_INVIT_E\d+)$"), "Product journey: REITs/InvITs (not MF)"),
    (re.compile(r"^(RI_EE\d+)$"), "Product journey: REITs/InvITs (not MF)"),
    (re.compile(r"^(GC_BONDS_F\d+)$"), "Product journey: Corporate Bonds (not MF)"),
    (re.compile(r"^(GC_FF\d+)$"), "Product journey: Corporate Bonds (not MF)"),
    (re.compile(r"^(AIF_G\d+)$"), "Product journey: Alternate Investment Funds (not MF)"),
    (re.compile(r"^(AIF_GG\d+)$"), "Product journey: Alternate Investment Funds (not MF)"),
    (re.compile(r"^(A[1-9]_D[1-9]|A10_D10)$"), "Barriers/behavior: other products (not MF+ETF)"),
]

# NOTE: grid-family headings are NOT hand-typed guesses — seven of them were
# originally guessed by naming-convention resemblance and turned out wrong once
# checked directly (e.g. Q6_RANK_GRID is not "per product" at all — its slots are
# financial goals like "Buying a house"; GridxQ8M asks respondents to *define*
# short/mid/long term, it isn't per-product either). Every family's heading below is
# instead extracted mechanically from its own row-2 description (the text after the
# first " : ", which is identical across every slot in a family — verified in
# main() with an assertion) so this document never repeats that mistake.

STANDALONE_TOPIC = {
    "Resp_ID_DP": "Identifiers & weights",
    "UniqueId_DP": "Identifiers & weights",
    "WeightMainM2": "Identifiers & weights",
    "Weight_to_Sample": "Identifiers & weights",
    "INT_TYPE": "Survey stage & sampling",
    "MAIN_COMP_STATUS": "Survey stage & sampling",
    "QLISTMAIN": "Survey stage & sampling",
    "QFL": "Survey stage & sampling",
    "Life_Stage": "Demographics",
    "SELECTED_STATE": "Demographics",
    "URBANRURAL": "Demographics",
    "Q1": "Demographics",
    "SECNEW": "Demographics",
    "Zone_DP": "Demographics",
    "SELECTED_CLASS": "Demographics",
    "AOL_VAR_CENTRE": "Demographics",
    "CWE": "Demographics",
    "Q3D": "Demographics",
    "Q5A": "Demographics",
    "Q8": "Demographics",
    "Q9": "Demographics",
    "Q10": "Demographics",
    "Q10A": "Demographics",
    "Q11": "Demographics",
    "Q12": "Demographics",
    "Q13": "Demographics",
    "Q13A": "Demographics",
    "Q14": "Demographics",
    "QC1": "Demographics",
    "CON_ISEC": "Demographics",
    "Q21A": "Investment awareness & attitudes",
    "Q1A": "Investment awareness & attitudes",
    "QRT": "Investment awareness & attitudes",
    "Q29": "Investment awareness & attitudes",
    "Q22A_All": "Product consideration & holdings (all products)",
    "Q23A": "Product consideration & holdings (all products)",
    "Q24A": "Product consideration & holdings (all products)",
    "Q25A": "Product consideration & holdings (all products)",
    "A11_D11": "MF+ETF barriers & encouragement (used in this study)",
    "A12_D12": "MF+ETF barriers & encouragement (used in this study)",
    "A13_D13": "MF+ETF barriers & encouragement (used in this study)",
    "A14_D14": "MF+ETF barriers & encouragement (used in this study)",
    "A15_D15": "MF+ETF barriers & encouragement (used in this study)",
    "AA1_DD1": "MF+ETF barriers & encouragement (used in this study)",
    "AA2_DD2": "MF+ETF barriers & encouragement (used in this study)",
    "AA3_DD3": "MF+ETF barriers & encouragement (used in this study)",
    "AA4_DD4": "MF+ETF barriers & encouragement (used in this study)",
    "M1A": "Media & internet habits",
    "M1B": "Media & internet habits",
    "M1C": "Media & internet habits",
    "M1D": "Media & internet habits",
    "M2": "Media & internet habits",
    "M3": "Media & internet habits",
    "M4": "Media & internet habits",
    "M5": "Media & internet habits",
    "M7": "Media & internet habits",
    "M8": "Media & internet habits",
    "M9": "Media & internet habits",
    "M10": "Media & internet habits",
    "Q10M": "Risk attitude & financial literacy",
    "Q10M_POSTCODE": "Risk attitude & financial literacy",
    "Q11M": "Risk attitude & financial literacy",
    "Q12M": "Risk attitude & financial literacy",
    "Q13M": "Risk attitude & financial literacy",
    "Q16M": "Regulator/grievance awareness",
    "Q17M": "Regulator/grievance awareness",
    "Q20AM": "Investor education",
    "Q20BM": "Investor education",
    "Q20CM": "Investor education",
    "Q20DM": "Investor education",
    "Q20E": "Investor education",
    "Q20F": "Investor education",
}

TOPIC_ORDER = [
    "Identifiers & weights",
    "Survey stage & sampling",
    "Demographics",
    "Investment awareness & attitudes",
    "Perceptions of securities-market regulators (Q1B battery)",
    "Product consideration & holdings (all products)",
    "MF+ETF barriers & encouragement (used in this study)",
    "Barriers/behavior: other products (not MF+ETF)",
    "Product journey: Stocks/Shares (not MF)",
    "Product journey: Futures & Options (not MF)",
    "Product journey: REITs/InvITs (not MF)",
    "Product journey: Corporate Bonds (not MF)",
    "Product journey: Alternate Investment Funds (not MF)",
    "Repeated-slot grids (one row per item — usually a financial product, sometimes a goal or a time-horizon label)",
    "Media & internet habits",
    "Risk attitude & financial literacy",
    "Regulator/grievance awareness",
    "Investor education",
    "Monthly income allocation (used in this study)",
]


def slugify(heading: str) -> str:
    """Approximate GitHub's heading-to-anchor slug rule: lowercase, drop anything that
    isn't a letter/digit/space/hyphen, then turn spaces into hyphens."""
    s = heading.lower()
    s = re.sub(r"[^a-z0-9 \-]", "", s)
    return re.sub(r"\s+", "-", s).strip("-")


def family_of(code: str):
    """Return (family_key, index) for a bracket-indexed grid column, else (None, None)."""
    m = re.match(r"^(.+)\[\{_([\w]+)\}\]\.(\w+)$", code)
    if not m:
        return None, None
    base, idx, suffix = m.groups()
    return f"{base}.{suffix}", idx


def main():
    rows = list(csv.DictReader(open(DATA_DICT)))
    by_code = {r["column_code"]: r for r in rows}

    print("Reading raw respondent workbook (read-only, aggregate value-counts only) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    codes, raw_rows = data[0], data[2:]
    raw_df = pd.DataFrame(raw_rows, columns=codes)

    def example_values(code: str, n_distinct: int, non_missing: int, limit=4):
        if non_missing == 0 or n_distinct == 0:
            return None
        if n_distinct > 25:
            return None
        col = raw_df[code]
        vc = col[col.astype(str) != ""].astype(str).value_counts()
        return [clean(v) for v in vc.index[:limit]]

    # --- classify every column ---
    standalone_rows = []
    grid_families: dict[str, list[dict]] = {}
    grid_prefix_rows: dict[str, list[dict]] = {}

    for r in rows:
        code = r["column_code"]
        family, idx = family_of(code)
        if family:
            grid_families.setdefault(family, []).append(r | {"_idx": idx})
            continue
        matched_prefix_topic = None
        for pattern, topic in GRID_PREFIX_TOPIC:
            if pattern.match(code):
                matched_prefix_topic = topic
                break
        if matched_prefix_topic:
            grid_prefix_rows.setdefault(matched_prefix_topic, []).append(r)
            continue
        standalone_rows.append(r)

    # --- build topic -> list of standalone field entries ---
    topics: dict[str, list[str]] = {t: [] for t in TOPIC_ORDER}

    def fmt_examples(examples):
        if examples is None:
            return "_(high-cardinality / not enumerated)_"
        return "; ".join(f"`{e}`" for e in examples) if examples else "_(none observed)_"

    for r in standalone_rows:
        code = r["column_code"]
        topic = STANDALONE_TOPIC.get(code)
        if topic is None:
            continue
        wording = clean(r["question_description"]) or "_(no description in source)_"
        n_distinct = int(r["n_distinct_non_missing"])
        non_missing = int(r["non_missing_count"])
        examples = example_values(code, n_distinct, non_missing)
        used = "Yes" if code in ALREADY_USED else "No"
        line = (
            f"| `{code}` | {wording} | {r['observed_dtype']} | {non_missing:,} / 109,430 | "
            f"{n_distinct:,} | {fmt_examples(examples)} | {used} |"
        )
        topics[topic].append(line)

    # g_Q1B battery -> its own topic section (already grouped under STANDALONE_TOPIC? no,
    # those codes are bracket-indexed, so they landed in grid_families, not standalone).
    q1b_lines = []
    for r in grid_families.get("g_Q1B.Q1B", []):
        code = r["column_code"]
        wording = clean(r["question_description"])
        n_distinct = int(r["n_distinct_non_missing"])
        non_missing = int(r["non_missing_count"])
        examples = example_values(code, n_distinct, non_missing)
        used = "Yes" if code in ALREADY_USED else "No"
        q1b_lines.append(
            f"| `{code}` | {wording} | {r['observed_dtype']} | {non_missing:,} / 109,430 | "
            f"{n_distinct:,} | {fmt_examples(examples)} | {used} |"
        )
    topics["Perceptions of securities-market regulators (Q1B battery)"] = q1b_lines

    q1m_lines = []
    for r in grid_families.get("Q1M_DP.Q1M", []):
        code = r["column_code"]
        wording = clean(r["question_description"])
        n_distinct = int(r["n_distinct_non_missing"])
        non_missing = int(r["non_missing_count"])
        examples = example_values(code, n_distinct, non_missing)
        used = "Yes" if code in ALREADY_USED else "No"
        q1m_lines.append(
            f"| `{code}` | {wording} | {r['observed_dtype']} | {non_missing:,} / 109,430 | "
            f"{n_distinct:,} | {fmt_examples(examples)} | {used} |"
        )
    topics["Monthly income allocation (used in this study)"] = q1m_lines

    # --- grid-prefix families (per-product journey blocks) ---
    prefix_section_lines: dict[str, list[str]] = {}
    for topic, rs in grid_prefix_rows.items():
        lines = []
        for r in sorted(rs, key=lambda x: x["column_code"]):
            code = r["column_code"]
            wording = clean(r["question_description"])
            n_distinct = int(r["n_distinct_non_missing"])
            non_missing = int(r["non_missing_count"])
            if non_missing == 0:
                lines.append(f"| `{code}` | {wording} | _all-blank in this fielding_ | — | — |")
                continue
            examples = example_values(code, n_distinct, non_missing)
            lines.append(f"| `{code}` | {wording} | {non_missing:,} / 109,430 | {n_distinct:,} | {fmt_examples(examples)} |")
        prefix_section_lines[topic] = lines

    # --- bracket-indexed per-product grid families (excluding g_Q1B / Q1M_DP handled above) ---
    grid_family_sections: dict[str, list[str]] = {}
    for family, rs in grid_families.items():
        if family in ("g_Q1B.Q1B", "Q1M_DP.Q1M"):
            continue
        # Mechanically derive the heading from the row-2 description shared by every
        # slot in this family (the text after " : "), instead of a hand-typed guess —
        # verified consistent across all slots, not assumed.
        parents = {
            (clean(r["question_description"]).split(" : ", 1)[1] if " : " in clean(r["question_description"]) else clean(r["question_description"]))
            for r in rs
        }
        assert len(parents) == 1, f"{family} slots don't share one parent question: {parents}"
        topic_label = f"{family} — {parents.pop()}"
        lines = []
        for r in sorted(rs, key=lambda x: (len(x["_idx"]), x["_idx"])):
            code = r["column_code"]
            desc = clean(r["question_description"])
            # The slot dimension isn't always a financial product (e.g. Q6_RANK_GRID's
            # slots are financial goals, GridxQ8M's are Short/Mid/Long Term labels) —
            # "item" describes it neutrally rather than assuming "product".
            item = desc.split(" : ")[0].strip("'\" ") if " : " in desc else desc
            n_distinct = int(r["n_distinct_non_missing"])
            non_missing = int(r["non_missing_count"])
            if non_missing == 0:
                lines.append(f"| slot `{r['_idx']}` | {item} | _all-blank in this fielding_ | — |")
                continue
            examples = example_values(code, n_distinct, non_missing)
            lines.append(f"| slot `{r['_idx']}` | {item} | {non_missing:,} / 109,430 | {fmt_examples(examples)} |")
        grid_family_sections.setdefault(topic_label, []).extend([f"**`{family}`**", ""] + [
            "| Slot | Item | Answered | Example values |",
            "|---|---|---|---|",
        ] + lines + [""])

    # --- write the document ---
    out = []
    out.append("# Survey Schema Reference — SEBI Investor Survey 2025 (Respondent Workbook)\n")
    out.append(
        "Every column in `data/raw/Respondent Data.XLSX` (448 total, 109,430 respondent records), "
        "grouped by topic, with a few observed example values per field — generated for planning "
        "what else could be shown or analyzed, not itself a new analysis.\n"
    )
    out.append(
        "- **Wording** is the row-2 source description (verbatim, cleaned of source-file HTML/encoding artifacts).\n"
        "- **Example values** are read-only, aggregate value counts from the raw workbook (top values only), shown "
        "only for fields with 25 or fewer distinct values workbook-wide — never respondent-level data, never free text. "
        "A handful of low-cardinality fields (e.g. `M10`) are themselves multi-select, so their \"distinct values\" are "
        "comma-joined combinations, not atomic options — shown as observed, not yet tokenized like the barrier fields "
        "(see `docs/data_inspection.md` for why that tokenizer is needed before treating these as separate options).\n"
        "- **Used in Findings?** means the field is already surfaced *somewhere* on the site (as of this "
        "document's generation) — see `scripts/export_dataset_method_data.py`, "
        "`scripts/export_demographics_psychographics.py`, and `scripts/export_respondent_table.py`. This is not "
        "the same as \"used as a finding\": `A11_D11`–`A15_D15`, for example, show `Yes` because they appear in "
        "the Dataset & Method coverage table — explicitly marked *not used* there (wrong population / unresolved "
        "routing per `docs/barrier_coverage.md`), not because any chart is built from them.\n"
        "- Fields already covered in `docs/data_inspection.md`, `docs/cohort_definition.md`, and "
        "`docs/barrier_coverage.md` are not re-explained here beyond their wording and examples — see those docs "
        "for the verified cohort-definition and barrier-routing analysis.\n"
    )

    out.append("## Contents\n")
    for t in TOPIC_ORDER:
        if t in topics and topics[t]:
            out.append(f"- [{t}](#{slugify(t)})")
    for t in prefix_section_lines:
        out.append(f"- [{t}](#{slugify(t)})")
    out.append("- [Repeated-slot grids](#repeated-slot-grids-one-row-per-item-usually-a-financial-product-sometimes-a-goal-or-a-time-horizon-label)")
    out.append("")

    for t in TOPIC_ORDER:
        lines = topics.get(t)
        if not lines:
            continue
        out.append(f"## {t}\n")
        out.append("| Code | Wording | Type | Answered | Distinct | Example values | Used in Findings? |")
        out.append("|---|---|---|---|---|---|---|")
        out.extend(lines)
        out.append("")

    for t, lines in prefix_section_lines.items():
        out.append(f"## {t}\n")
        out.append("| Code | Wording | Answered | Distinct | Example values |")
        out.append("|---|---|---|---|---|")
        out.extend(lines)
        out.append("")

    out.append("## Repeated-slot grids (one row per item — usually a financial product, sometimes a goal or a time-horizon label)\n")
    out.append(
        "Each family below repeats the same question once per item (up to 21 slots) — for most families the item is a "
        "financial product, but `Q6_RANK_GRID` repeats per financial *goal* and `GridxQ8M` repeats per time-horizon label "
        "(Short/Mid/Long Term) — the heading states the family's own verified parent question, not an assumption. "
        "Per `docs/data_inspection.md`, many slots are entirely blank in this fielding — only the item(s) "
        "shown with an answered count actually have data.\n"
    )
    for topic_label, lines in grid_family_sections.items():
        out.append(f"### {topic_label}\n")
        out.extend(lines)

    OUT_PATH.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {OUT_PATH.relative_to(ROOT)} ({OUT_PATH.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
