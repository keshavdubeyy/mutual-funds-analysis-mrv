import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

// Server-only, development-only. This route must never serve respondent-level data
// outside `next dev` — see docs/data_sources.md and scripts/export_respondent_table.py
// for what it reads and why. The check below is the actual protection; the
// "Respondent data" tab hiding itself in production (src/app/page.tsx) is a UX nicety
// on top of this, not a substitute for it.
export const dynamic = "force-dynamic"
export const revalidate = 0

const DATA_PATH = path.join(process.cwd(), "data", "processed", "respondent_table.json")

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404, headers: NO_STORE_HEADERS })
  }

  let raw: string
  try {
    raw = fs.readFileSync(DATA_PATH, "utf-8")
  } catch {
    return NextResponse.json(
      {
        error:
          "Local respondent extract not found. Run `python scripts/export_respondent_table.py` from the project root, then reload.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  return new NextResponse(raw, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...NO_STORE_HEADERS,
    },
  })
}
