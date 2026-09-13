import { cn } from "cn"

export function SectionHeading({
  id,
  title,
  description,
  className,
}: {
  id: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("scroll-mt-20", className)}>
      <h2 id={id} className="text-xl font-semibold text-foreground md:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
