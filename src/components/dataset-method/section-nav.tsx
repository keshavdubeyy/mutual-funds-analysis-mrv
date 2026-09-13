const SECTIONS = [
  { id: "dataset-introduction", label: "Dataset introduction" },
  { id: "survey-participation", label: "Survey participation" },
  { id: "what-respondents-were-asked", label: "What respondents were asked" },
  { id: "how-we-checked-the-data", label: "How we checked and interpreted the data" },
  { id: "how-we-selected-the-sample", label: "How we narrowed the dataset" },
  { id: "how-much-information-is-available", label: "How much information is available" },
  { id: "what-this-allows", label: "What this dataset allows us to study" },
] as const

export function SectionNav() {
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

export { SECTIONS }
