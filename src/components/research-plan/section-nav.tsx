const SECTIONS = [
  { id: "research-plan-understand", label: "What we want to understand" },
  { id: "research-plan-indicators", label: "Key research indicators" },
  { id: "research-plan-limitations", label: "Limitations" },
  { id: "research-plan-conclusion", label: "Conclusion" },
] as const

export function ResearchPlanSectionNav() {
  return (
    <nav aria-label="Sections on this page" className="rounded-3xl border border-border bg-card p-4">
      <p className="mb-3 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ol className="flex flex-col gap-0.5">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="flex items-baseline rounded-xl px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { SECTIONS as RESEARCH_PLAN_SECTIONS }
