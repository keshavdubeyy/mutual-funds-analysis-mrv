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
  Table02Icon,
  Task02Icon,
  ClipboardIcon,
  UserSearch01Icon,
  UserIcon,
  BrickWallShieldIcon,
  Megaphone01Icon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons"
import { GROUPS, TOPICS, TOPIC_ICON, topicPageUrl } from "@/lib/analysis-topics"

// Every group's sidebar entry links straight to its first topic's page (groups have no page
// of their own), and lists that group's 3 topics as its sub-items — the single source of
// truth for both is src/lib/analysis-topics.ts, so this can't drift from the pages themselves.
const GROUP_NAV_ITEMS = GROUPS.map((group) => ({
  title: group.label,
  url: topicPageUrl(group.topics[0]),
  icon: <HugeiconsIcon icon={group.key === "understanding-the-user" ? UserIcon : group.key === "understanding-the-barriers" ? BrickWallShieldIcon : Megaphone01Icon} strokeWidth={2} />,
  items: group.topics.map((key) => ({
    title: TOPICS.find((t) => t.key === key)!.label,
    url: topicPageUrl(key),
    icon: <HugeiconsIcon icon={TOPIC_ICON[key]} strokeWidth={2} />,
  })),
}))

const data = {
  navMain: [
    {
      title: "Platform",
      url: "/dataset-and-method",
      icon: (
        <HugeiconsIcon icon={Database02Icon} strokeWidth={2} />
      ),
      isActive: true,
      items: [
        { title: "Dataset and Method", url: "/dataset-and-method", icon: <HugeiconsIcon icon={Table02Icon} strokeWidth={2} /> },
        { title: "Research Plan", url: "/research-plan", icon: <HugeiconsIcon icon={Task02Icon} strokeWidth={2} /> },
      ],
    },
    {
      title: "Who is in our sample?",
      url: "/who-is-in-sample",
      icon: (
        <HugeiconsIcon icon={UserSearch01Icon} strokeWidth={2} />
      ),
    },
    ...GROUP_NAV_ITEMS,
    {
      title: "Deliverables",
      url: "/deliverables",
      icon: (
        <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
      ),
    },
    ...(process.env.NODE_ENV !== "production"
      ? [
          {
            title: "Respondent data",
            url: "/respondent-data",
            icon: (
              <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
            ),
          },
        ]
      : []),
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
