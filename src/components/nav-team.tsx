import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon } from "@hugeicons/core-free-icons"

export type TeamContributor = {
  name: string
  rollNumber: string
}

export function NavTeam({
  teamName,
  contributors,
  githubRepoUrl,
}: {
  teamName: string
  contributors: TeamContributor[]
  githubRepoUrl: string
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
          <SidebarMenuItem className="mt-1">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="w-full bg-background"
              render={<a href={githubRepoUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <HugeiconsIcon icon={GithubIcon} strokeWidth={2} data-icon="inline-start" />
              GitHub repository
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
