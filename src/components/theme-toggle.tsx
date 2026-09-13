"use client"

import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun01Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons"

type ThemePref = "light" | "dark" | "system"
const STORAGE_KEY = "theme"
const THEME_OPTIONS: { value: ThemePref; label: string; icon: typeof Sun01Icon }[] = [
  { value: "light", label: "Light theme", icon: Sun01Icon },
  { value: "dark", label: "Dark theme", icon: Moon02Icon },
  { value: "system", label: "Match system theme", icon: ComputerIcon },
]

function applyTheme(pref: ThemePref) {
  const isDark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", isDark)
}

export function ThemeToggle() {
  const [pref, setPref] = React.useState<ThemePref | null>(null)

  React.useEffect(() => {
    // localStorage isn't available during SSR, so the real preference can only be
    // read after mount — this one-time sync read-then-set is the standard pattern
    // for client-only storage (matches the theme-init script in layout.tsx).
    const stored = localStorage.getItem(STORAGE_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, which only exists client-side
    setPref(stored === "light" || stored === "dark" ? stored : "system")
  }, [])

  React.useEffect(() => {
    if (!pref) return
    applyTheme(pref)
    if (pref !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [pref])

  function handleChange(values: string[]) {
    const newest = values.find((v) => v !== pref) ?? values[0]
    if (!newest) return
    setPref(newest as ThemePref)
    localStorage.setItem(STORAGE_KEY, newest)
  }

  // Renders the same three-item control before/after mount (defaulting to
  // "system" pre-mount) — avoids a hydration mismatch without needing to
  // hide the control on first paint.
  return (
    <ToggleGroup
      value={[pref ?? "system"]}
      onValueChange={handleChange}
      variant="outline"
      size="sm"
      spacing={0}
      className="w-full"
    >
      {THEME_OPTIONS.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value} aria-label={opt.label} className="flex-1">
          <HugeiconsIcon icon={opt.icon} strokeWidth={2} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
