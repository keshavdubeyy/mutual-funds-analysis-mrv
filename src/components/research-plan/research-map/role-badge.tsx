import { roleColor, ROLE_LABEL, type CardRole } from "./theme-colors"

export function RoleBadge({ role }: { role: CardRole }) {
  return (
    <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: roleColor(role) }} aria-hidden="true" />
      {ROLE_LABEL[role]}
    </span>
  )
}
