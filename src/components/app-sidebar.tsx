"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavTeam } from "@/components/nav-team"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Database02Icon, Analytics01Icon } from "@hugeicons/core-free-icons"

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
      title: "Findings",
      url: "/",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
    },
  ],
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
        <NavTeam teamName={data.team.teamName} contributors={data.team.contributors} />
      </SidebarContent>
    </Sidebar>
  )
}
