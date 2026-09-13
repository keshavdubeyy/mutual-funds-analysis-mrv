import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type TeamContributor = {
  name: string
  rollNumber: string
}

export function NavTeam({
  teamName,
  contributors,
}: {
  teamName: string
  contributors: TeamContributor[]
}) {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu className="gap-2 rounded-lg border px-2 py-2 text-sm">
          <SidebarMenuItem className="truncate font-medium">
            {teamName}
          </SidebarMenuItem>
          {contributors.map((contributor) => (
            <SidebarMenuItem
              key={contributor.name}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <span className="truncate">{contributor.name}</span>
              <span className="shrink-0">{contributor.rollNumber}</span>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
