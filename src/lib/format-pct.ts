/** Rounds n/total to one decimal place as a percentage — display formatting only, never a new analysis result. */
export function pctOf(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 1000) / 10 : 0
}

function formatN(n: number): string {
  return n.toLocaleString("en-IN")
}

/**
 * The one plain-language line every Analysis chart card uses to say who answered — no
 * "focused group," "denominator," "substantive answerers" or other survey jargon, just a
 * count. "All 553 people answered" when everyone did; "266 of 553 people answered" when not.
 */
export function answeredLine(n: number, total: number): string {
  return n >= total ? `All ${formatN(total)} people answered.` : `${formatN(n)} of ${formatN(total)} people answered.`
}
