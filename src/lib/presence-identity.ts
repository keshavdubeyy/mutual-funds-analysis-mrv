const STORAGE_KEY = "presence-id"

const ADJECTIVES = [
  "Amber",
  "Blue",
  "Coral",
  "Golden",
  "Indigo",
  "Jade",
  "Quiet",
  "Rapid",
  "Silent",
  "Swift",
]

const ANIMALS = [
  "Falcon",
  "Fox",
  "Heron",
  "Lynx",
  "Otter",
  "Owl",
  "Panther",
  "Sparrow",
  "Tiger",
  "Wolf",
]

// Matches the --color-chart-1..5 tokens defined in globals.css, so avatar/cursor colors stay
// on the site's own palette (and adapt automatically between light/dark) instead of a one-off set.
const CHART_COLOR_VARS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * A per-tab anonymous id, stable across in-app navigation (client-side route changes don't
 * remount the root layout's provider) and across a reload of the same tab, but distinct from
 * other tabs/devices — sessionStorage, not localStorage, is what gives us "one avatar per open
 * tab" instead of merging every tab on one device into a single visitor.
 *
 * Must only be called from an effect: sessionStorage doesn't exist during SSR/RSC prerender.
 */
export function getOrCreatePresenceId(): string {
  const existing = sessionStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  sessionStorage.setItem(STORAGE_KEY, id)
  return id
}

/** Deterministic so the same tab keeps the same name/color for the life of its session id. */
export function generateIdentity(id: string): { name: string; color: string } {
  const hash = hashString(id)
  const name = `${ADJECTIVES[hash % ADJECTIVES.length]} ${ANIMALS[(hash >> 4) % ANIMALS.length]}`
  const color = CHART_COLOR_VARS[hash % CHART_COLOR_VARS.length]
  return { name, color }
}
