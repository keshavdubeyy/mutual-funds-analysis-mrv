/**
 * Shared "scroll to and briefly highlight an element" behavior — used by the Analysis page's
 * existing hash-based deep-link effect and by the new Findings "View evidence" navigation, so
 * there's exactly one implementation of what a highlight looks like and how it respects
 * reduced-motion, not two that could drift apart.
 */

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Briefly rings an element in the primary color via an inline box-shadow — not Tailwind's
 * `ring-*` classes, which would collide with the Card component's own permanent `ring-1`
 * (added via classList, not through `cn()`, so nothing would merge the two). */
export function flashHighlight(el: HTMLElement) {
  const reduceMotion = prefersReducedMotion()
  el.style.transition = reduceMotion ? "none" : "box-shadow 200ms ease-out"
  el.style.boxShadow = "0 0 0 2px var(--primary), 0 0 0 5px var(--background)"
  window.setTimeout(
    () => {
      el.style.boxShadow = ""
    },
    reduceMotion ? 1400 : 2200
  )
}

/** Scrolls an element into view (instantly under reduced motion), highlights it, and moves
 * keyboard focus to it — adding a temporary `tabindex` first if it isn't already focusable,
 * removed again once focus moves on so it doesn't linger in the tab order. */
export function scrollHighlightAndFocus(el: HTMLElement) {
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" })
  flashHighlight(el)

  const hadTabIndex = el.hasAttribute("tabindex")
  if (!hadTabIndex) el.setAttribute("tabindex", "-1")
  el.focus({ preventScroll: true })
  if (!hadTabIndex) {
    const removeTabIndex = () => {
      el.removeAttribute("tabindex")
      el.removeEventListener("blur", removeTabIndex)
    }
    el.addEventListener("blur", removeTabIndex, { once: true })
  }
}

/** `getElementById` + `scrollHighlightAndFocus`, the common case — returns whether the target
 * was actually found, so a caller can fall back (e.g. show a "not visible yet" state) instead
 * of silently doing nothing. */
export function goToEvidenceElement(elementId: string): boolean {
  const el = document.getElementById(elementId)
  if (!el) return false
  scrollHighlightAndFocus(el)
  return true
}

/** A persistent (not auto-clearing) version of the same highlight, toggled on/off — for
 * hovering or keyboard-focusing a Finding row, which should highlight its evidence for as
 * long as the pointer/focus stays there and clear the moment it leaves, never on a timer. */
export function setHoverHighlight(el: HTMLElement, on: boolean) {
  el.style.transition = prefersReducedMotion() ? "none" : "box-shadow 150ms ease-out"
  el.style.boxShadow = on ? "0 0 0 2px var(--primary), 0 0 0 4px var(--background)" : ""
}
