import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

// Server-only, development-only — same protection pattern as
// src/app/api/dev/respondent-table/route.ts. This route serves the ENTIRE raw survey
// workbook (109,430 respondents x 448 columns, see scripts/export_full_raw_table.py), so
// it must never be reachable outside `next dev`.
export const dynamic = "force-dynamic"
export const revalidate = 0

const PROCESSED_DIR = path.join(process.cwd(), "data", "processed")
const NDJSON_PATH = path.join(PROCESSED_DIR, "full_raw_respondents.ndjson")
const INDEX_PATH = path.join(PROCESSED_DIR, "full_raw_respondents_index.json")

const DEFAULT_PAGE_SIZE = 25
const MAX_PAGE_SIZE = 200

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
}

interface RawIndex {
  field_codes: string[]
  question_wording: string[]
  row_count: number
  row_offsets: number[]
}

// The index (field codes, wording, and the byte-offset table) is ~1.2MB — small enough to
// keep resident for the life of the dev process instead of re-reading it on every request.
// Regenerating full_raw_respondents_index.json requires a dev-server restart to pick up.
let cachedIndex: RawIndex | null = null

function loadIndex(): RawIndex {
  if (!cachedIndex) {
    cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")) as RawIndex
  }
  return cachedIndex
}

/** Reads exactly the byte range covering rows [rowStart, rowEnd) via a positioned read —
 * never loads the 500MB ndjson file itself into memory, regardless of how many rows exist. */
async function readRows(rowStart: number, rowEnd: number, offsets: number[]): Promise<unknown[][]> {
  const byteStart = offsets[rowStart]
  const byteEnd = offsets[rowEnd]
  const length = byteEnd - byteStart
  if (length <= 0) return []

  const fh = await fs.promises.open(NDJSON_PATH, "r")
  try {
    const buffer = Buffer.alloc(length)
    await fh.read(buffer, 0, length, byteStart)
    return buffer
      .toString("utf-8")
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as unknown[])
  } finally {
    await fh.close()
  }
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404, headers: NO_STORE_HEADERS })
  }

  let index: RawIndex
  try {
    index = loadIndex()
  } catch {
    return NextResponse.json(
      {
        error:
          "Local full raw table not found. Run `python scripts/export_full_raw_table.py` from the project root, then reload.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  const rowStart = Math.min((page - 1) * pageSize, index.row_count)
  const rowEnd = Math.min(rowStart + pageSize, index.row_count)

  let rows: unknown[][]
  try {
    rows = await readRows(rowStart, rowEnd, index.row_offsets)
  } catch {
    return NextResponse.json(
      {
        error:
          "Local full raw table ndjson file not found. Run `python scripts/export_full_raw_table.py` from the project root, then reload.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  return NextResponse.json(
    {
      total: index.row_count,
      page,
      pageSize,
      fieldCodes: index.field_codes,
      questionWording: index.question_wording,
      rows,
    },
    { headers: NO_STORE_HEADERS }
  )
}
