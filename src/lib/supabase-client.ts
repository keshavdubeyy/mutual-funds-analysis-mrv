import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// undefined = not yet resolved, null = resolved but unavailable (env vars missing)
let client: SupabaseClient | null | undefined

/**
 * Browser-only Realtime client for the live presence/follow feature. Returns `null` instead of
 * throwing when the env vars aren't set, so any deploy without a Supabase project configured
 * yet just silently runs without presence rather than crashing the dashboard.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (client !== undefined) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  client =
    url && publishableKey
      ? createClient(url, publishableKey, { realtime: { params: { eventsPerSecond: 25 } } })
      : null

  return client
}
