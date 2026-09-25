"""
Build the LOCAL, dev-only full raw respondent table for the /full-data page.

Unlike scripts/export_respondent_table.py (which produces a small, curated, identifier-
stripped extract of just the 553-person focused group), this script dumps the ENTIRE raw
SEBI Investor Survey 2025 workbook exactly as calamine reads it: all ~109,430 respondents,
all 448 columns, values unmodified except for two purely cosmetic fixes (see below). No
cohort filtering, no column selection, no ID stripping — this is meant to be the raw sheet,
not a research extract.

Because the raw workbook is 164MB / 109,430 rows x 448 columns, it is written as:
  - data/processed/full_raw_respondents.ndjson — one JSON array (row values) per line.
  - data/processed/full_raw_respondents_index.json — field codes, question wording, row
    count, and a byte-offset index (row_offsets[i]..row_offsets[i+1] = row i's byte range)
    so the dev-only API route can seek directly to any page of rows without ever reading
    the whole file into memory.

Both outputs land only in data/processed/ (gitignored except its own README) and are read
exclusively by src/app/api/dev/full-raw-table/route.ts, which refuses to serve them outside
`next dev` — same protection pattern as scripts/export_respondent_table.py.

Run with: python scripts/export_full_raw_table.py
"""

import json
from pathlib import Path

from python_calamine import CalamineWorkbook

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
RESPONDENT_FILE = RAW_DIR / "Respondent Data.XLSX"
NDJSON_PATH = PROCESSED_DIR / "full_raw_respondents.ndjson"
INDEX_PATH = PROCESSED_DIR / "full_raw_respondents_index.json"

# Confirmed in docs/data_inspection.md: the source workbook's own sharedStrings.xml contains
# these exact mojibake byte sequences for punctuation. Fixing them is a display-encoding
# correction only — it does not change or reinterpret any answer's substance.
MOJIBAKE_FIXES = {
    "â€“": "–",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€\x9d": "”",
}


def fix_value(v):
    if isinstance(v, str):
        for bad, good in MOJIBAKE_FIXES.items():
            v = v.replace(bad, good)
        return v
    if isinstance(v, float) and v.is_integer():
        # Cosmetic only (e.g. 1.0 -> 1) — calamine reads every numeric cell as a float;
        # this does not change the value, just how whole numbers display.
        return int(v)
    return v


def main():
    print("Reading raw respondent workbook (this is the full 164MB file, expect ~10-20s) ...")
    wb = CalamineWorkbook.from_path(str(RESPONDENT_FILE))
    sheet = wb.get_sheet_by_name(wb.sheet_names[0])
    data = sheet.to_python(skip_empty_area=True)
    field_codes, question_wording, rows = data[0], data[1], data[2:]

    assert len(field_codes) == len(question_wording)
    print(f"{len(rows):,} rows x {len(field_codes)} columns")

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # Binary mode throughout, so the byte offsets recorded here exactly match what's on
    # disk regardless of platform newline translation — the index is only ever correct if
    # it's built from the literal bytes written, not from Python's text-mode str lengths.
    row_offsets = []
    offset = 0
    print(f"Writing {NDJSON_PATH.relative_to(ROOT)} ...")
    with open(NDJSON_PATH, "wb") as f:
        for row in rows:
            row_offsets.append(offset)
            line = json.dumps([fix_value(v) for v in row], ensure_ascii=False)
            encoded = (line + "\n").encode("utf-8")
            f.write(encoded)
            offset += len(encoded)
    row_offsets.append(offset)  # sentinel: total byte length, closes the last row's range

    index = {
        "field_codes": field_codes,
        "question_wording": question_wording,
        "row_count": len(rows),
        "row_offsets": row_offsets,
    }
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False)

    print(f"Wrote {len(rows):,} rows ({NDJSON_PATH.stat().st_size:,} bytes) to {NDJSON_PATH.relative_to(ROOT)}")
    print(f"Wrote index ({INDEX_PATH.stat().st_size:,} bytes) to {INDEX_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
