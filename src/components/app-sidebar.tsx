"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavTeam } from "@/components/nav-team"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Database02Icon,
  Analytics01Icon,
  Task02Icon,
  ClipboardIcon,
} from "@hugeicons/core-free-icons"

const data = {
  navMain: [
    {
      title: "Dataset and Method",
      url: "/dataset-and-method",
      icon: (
        <HugeiconsIcon icon={Database02Icon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Research Plan",
      url: "/research-plan",
      icon: (
        <HugeiconsIcon icon={Task02Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Findings",
      url: "/findings/who-is-in-sample",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
      isActive: true,
      items: [
        { title: "Who is in our sample?", url: "/findings/who-is-in-sample" },
        { title: "Analysis", url: "/findings/analysis" },
        ...(process.env.NODE_ENV !== "production"
          ? [{ title: "Respondent data", url: "/findings/respondent-data" }]
          : []),
      ],
    },
    {
      title: "Deliverables",
      url: "/deliverables",
      icon: (
        <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
      ),
    },
  ],
  githubRepoUrl: "https://github.com/keshavdubeyy/mutual-funds-analysis-mrv",
  team: {
    teamName: "Team 13",
    contributors: [
      { name: "Keshav Dubey", rollNumber: "2025204041" },
      { name: "Aasritha Kalluri", rollNumber: "2025204019" },
      { name: "Vigneshwar M", rollNumber: "2026204005" },
    ],
  },
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Team 13</span>
                <span className="truncate text-xs">Market Research and Validation</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTeam
          teamName={data.team.teamName}
          contributors={data.team.contributors}
          githubRepoUrl={data.githubRepoUrl}
        />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
