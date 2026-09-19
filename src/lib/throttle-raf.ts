/**
 * Coalesces fast-firing updates (pointermove, scroll) down to roughly one send per
 * `minIntervalMs`, always carrying the *latest* value rather than every intermediate one.
 * Scheduling rides requestAnimationFrame so it never runs faster than the display refresh, and
 * it stops scheduling itself the moment there's nothing queued — no permanently spinning loop.
 */
export function createRafSender<T>(minIntervalMs: number, send: (value: T) => void) {
  let latest: T | null = null
  let scheduled = false
  let lastSentAt = 0

  function tick() {
    scheduled = false
    if (latest === null) return

    const now = performance.now()
    if (now - lastSentAt < minIntervalMs) {
      schedule()
      return
    }

    lastSentAt = now
    const value = latest
    latest = null
    send(value)
  }

  function schedule() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(tick)
  }

  return {
    push(value: T) {
      latest = value
      schedule()
    },
    cancel() {
      latest = null
    },
  }
}
