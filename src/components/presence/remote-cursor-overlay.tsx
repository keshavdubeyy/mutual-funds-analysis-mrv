"use client"

import * as React from "react"
import { usePresence } from "@/components/presence/presence-provider"
import { flashHighlight, prefersReducedMotion } from "@/lib/dom-highlight"

interface Ripple {
  id: number
  x: number
  y: number
}

let rippleSeq = 0

/**
 * Renders the currently-followed person's live cursor and click ripples — nothing else's,
 * per the "only the person you're actively following" scope decision. Cursor position is
 * mutated directly on the DOM node (not via React state) so ~25 updates/sec from
 * PresenceProvider never trigger a React re-render; only the low-frequency click ripples are
 * real state.
 */
export function RemoteCursorOverlay() {
  const presence = usePresence()
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const [visible, setVisible] = React.useState(false)

  const followingId = presence?.followingId ?? null
  const followedMember = presence?.roster.find((member) => member.id === followingId)
  const subscribeFollowedStream = presence?.subscribeFollowedStream

  React.useEffect(() => {
    if (!subscribeFollowedStream || !followingId) {
      setVisible(false)
      return
    }

    const reduceMotion = prefersReducedMotion()

    return subscribeFollowedStream((event) => {
      if (event.type === "cursor") {
        setVisible(true)
        const node = cursorRef.current
        if (node) node.style.transform = `translate(${event.x * 100}vw, ${event.y * 100}vh)`
        return
      }

      // event.type === "click"
      const el = event.elementId ? document.getElementById(event.elementId) : null
      if (el) {
        flashHighlight(el)
        return
      }

      const ripple: Ripple = { id: rippleSeq++, x: event.x, y: event.y }
      setRipples((current) => [...current, ripple])
      window.setTimeout(
        () => setRipples((current) => current.filter((r) => r.id !== ripple.id)),
        reduceMotion ? 300 : 700
      )
    })
  }, [subscribeFollowedStream, followingId])

  if (!followingId || !followedMember) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {visible && (
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 flex items-center gap-1.5 transition-transform duration-75 ease-linear will-change-transform"
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className="drop-shadow">
            <path
              d="M1 1L1 15.5L4.5 12.5L6.8 17L9 16L6.8 11.5L11.5 11.5L1 1Z"
              fill={followedMember.color}
              stroke="var(--background)"
              strokeWidth="1"
            />
          </svg>
          <span
            className="rounded-full px-2 py-0.5 text-xs whitespace-nowrap text-background"
            style={{ backgroundColor: followedMember.color }}
          >
            {followedMember.name}
          </span>
        </div>
      )}

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-ping"
          style={{
            left: `${ripple.x * 100}vw`,
            top: `${ripple.y * 100}vh`,
            backgroundColor: followedMember.color,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  )
}
