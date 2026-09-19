"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { getOrCreatePresenceId, generateIdentity } from "@/lib/presence-identity"
import { createRafSender } from "@/lib/throttle-raf"

export interface RosterMember {
  id: string
  name: string
  color: string
  path: string
}

export type FollowedStreamEvent =
  | { type: "cursor"; x: number; y: number }
  | { type: "click"; x: number; y: number; elementId: string | null }

interface PresenceContextValue {
  selfId: string | null
  roster: RosterMember[]
  followingId: string | null
  follow: (id: string) => void
  unfollow: () => void
  /** Bypasses React state for the high-frequency followed-user stream (cursor/click) so a
   *  consumer (the cursor overlay) can mutate the DOM directly instead of re-rendering on
   *  every packet. Returns an unsubscribe function. */
  subscribeFollowedStream: (cb: (event: FollowedStreamEvent) => void) => () => void
}

const PresenceContext = React.createContext<PresenceContextValue | null>(null)

const CHANNEL_NAME = "global-presence"
const SEND_INTERVAL_MS = 40 // ~25 sends/sec

type PresencePayload = { id: string; name: string; color: string; path: string }

function flattenPresenceState(
  state: Record<string, PresencePayload[]>,
  selfId: string
): RosterMember[] {
  const members: RosterMember[] = []
  for (const presences of Object.values(state)) {
    const latest = presences[presences.length - 1]
    if (latest) members.push({ id: latest.id, name: latest.name, color: latest.color, path: latest.path })
  }
  return members.sort((a, b) =>
    a.id === selfId ? -1 : b.id === selfId ? 1 : a.name.localeCompare(b.name)
  )
}

/**
 * Global "who's viewing the site right now, and who am I following" provider. Mounted once in
 * the root layout so the avatar stack and cursor overlay work on every route. No-ops entirely
 * (empty roster, follow()/unfollow() as harmless stubs) when Supabase isn't configured — see
 * `getSupabaseBrowserClient`.
 */
export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [roster, setRoster] = React.useState<RosterMember[]>([])
  const [followingId, setFollowingId] = React.useState<string | null>(null)
  const [selfId, setSelfId] = React.useState<string | null>(null)

  const channelRef = React.useRef<RealtimeChannel | null>(null)
  const isSubscribedRef = React.useRef(false)
  const followingIdRef = React.useRef<string | null>(null)
  const pathnameRef = React.useRef(pathname)
  const selfIdRef = React.useRef<string | null>(null)
  const streamListenersRef = React.useRef(new Set<(event: FollowedStreamEvent) => void>())

  const unfollow = React.useCallback(() => setFollowingId(null), [])

  const follow = React.useCallback((id: string) => {
    if (id === selfIdRef.current) return
    setFollowingId((current) => (current === id ? null : id))
  }, [])

  const subscribeFollowedStream = React.useCallback(
    (cb: (event: FollowedStreamEvent) => void) => {
      streamListenersRef.current.add(cb)
      return () => {
        streamListenersRef.current.delete(cb)
      }
    },
    []
  )

  React.useEffect(() => {
    followingIdRef.current = followingId
  }, [followingId])

  // Main channel lifecycle. Deliberately runs once — the pathname effect below re-tracks and
  // broadcasts on navigation without tearing down and reopening the channel.
  React.useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const id = getOrCreatePresenceId()
    const { name, color } = generateIdentity(id)
    selfIdRef.current = id
    setSelfId(id)

    const applyRemoteScroll = (pct: number) => {
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight
      // `behavior: "instant"` is required here: <html> carries Tailwind's `scroll-smooth`
      // class, so without it every incoming update would animate and the mirror would stutter.
      document.documentElement.scrollTo({ top: pct * Math.max(max, 0), behavior: "instant" })
    }

    const channel = supabase.channel(CHANNEL_NAME, {
      config: { broadcast: { self: false, ack: false }, presence: { key: id } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresencePayload>()
        setRoster(flattenPresenceState(state, id))
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key === followingIdRef.current) unfollow()
      })
      .on<{ id: string; x: number; y: number }>("broadcast", { event: "cursor" }, ({ payload }) => {
        if (payload.id !== followingIdRef.current) return
        for (const cb of streamListenersRef.current) cb({ type: "cursor", x: payload.x, y: payload.y })
      })
      .on<{ id: string; x: number; y: number; elementId: string | null }>(
        "broadcast",
        { event: "click" },
        ({ payload }) => {
          if (payload.id !== followingIdRef.current) return
          for (const cb of streamListenersRef.current)
            cb({ type: "click", x: payload.x, y: payload.y, elementId: payload.elementId })
        }
      )
      .on<{ id: string; pct: number }>("broadcast", { event: "scroll" }, ({ payload }) => {
        if (payload.id === followingIdRef.current) applyRemoteScroll(payload.pct)
      })
      .on<{ id: string; path: string }>("broadcast", { event: "route" }, ({ payload }) => {
        if (payload.id === followingIdRef.current) router.push(payload.path)
      })
      .subscribe(async (status) => {
        isSubscribedRef.current = status === "SUBSCRIBED"
        // Re-tracking here (not just once) is what makes reconnects self-heal — supabase-js
        // re-invokes this callback with "SUBSCRIBED" after every automatic rejoin.
        if (status === "SUBSCRIBED") {
          await channel.track({ id, name, color, path: pathnameRef.current } satisfies PresencePayload)
        }
      })

    channelRef.current = channel

    const cursorSender = createRafSender<{ x: number; y: number }>(SEND_INTERVAL_MS, ({ x, y }) => {
      channel.send({ type: "broadcast", event: "cursor", payload: { id, x, y } })
    })
    const scrollSender = createRafSender<{ pct: number }>(SEND_INTERVAL_MS, ({ pct }) => {
      channel.send({ type: "broadcast", event: "scroll", payload: { id, pct } })
    })

    const handlePointerMove = (e: PointerEvent) => {
      cursorSender.push({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight
      scrollSender.push({ pct: max > 0 ? document.documentElement.scrollTop / max : 0 })
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("[data-presence-ui]")) return
      channel.send({
        type: "broadcast",
        event: "click",
        payload: {
          id,
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          elementId: target?.closest("[id]")?.id ?? null,
        },
      })
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    document.addEventListener("click", handleClick, { capture: true })

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("scroll", handleScroll, { capture: true })
      document.removeEventListener("click", handleClick, { capture: true })
      cursorSender.cancel()
      scrollSender.cancel()
      channelRef.current = null
      isSubscribedRef.current = false
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-track and broadcast on every navigation, so followers' routers mirror it and late
  // joiners see the right current path.
  React.useEffect(() => {
    pathnameRef.current = pathname
    const channel = channelRef.current
    const id = selfIdRef.current
    if (!channel || !id || !isSubscribedRef.current) return
    const { name, color } = generateIdentity(id)
    channel.track({ id, name, color, path: pathname } satisfies PresencePayload)
    channel.send({ type: "broadcast", event: "route", payload: { id, path: pathname } })
  }, [pathname])

  const value = React.useMemo<PresenceContextValue>(
    () => ({ selfId, roster, followingId, follow, unfollow, subscribeFollowedStream }),
    [selfId, roster, followingId, follow, unfollow, subscribeFollowedStream]
  )

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
}

export function usePresence() {
  return React.useContext(PresenceContext)
}
