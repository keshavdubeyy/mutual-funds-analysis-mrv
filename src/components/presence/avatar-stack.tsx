"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePresence } from "@/components/presence/presence-provider"
import { cn } from "cn"

function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
}

/**
 * "Who's here" roster, Figma-style: meant to sit inline in each page header's right-hand
 * (`ml-auto`) button group, alongside "View data" / "Explore the findings", not as a floating
 * overlay — floating on top of that group is what put it on top of the CTA buttons before.
 * Click anyone else's avatar to follow them (mirrors their navigation, scroll, cursor, and
 * clicks — see PresenceProvider); click again, or the explicit stop control, to unfollow.
 * Renders nothing when Supabase isn't configured, since `usePresence()` only returns a
 * non-null value once the provider actually opened a channel.
 */
export function AvatarStack() {
  const presence = usePresence()
  if (!presence || !presence.selfId) return null

  const { selfId, roster, followingId, follow, unfollow } = presence
  const others = roster.filter((member) => member.id !== selfId)
  const self = roster.find((member) => member.id === selfId)
  const followedMember = others.find((member) => member.id === followingId)

  return (
    <TooltipProvider delay={150} closeDelay={0}>
      <div data-presence-ui className="flex items-center gap-2">
        {followedMember && (
          <div className="hidden items-center gap-1.5 rounded-full bg-muted py-1 pr-1 pl-3 text-xs text-muted-foreground sm:flex">
            Following {followedMember.name}
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-full"
              onClick={unfollow}
              aria-label={`Stop following ${followedMember.name}`}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </div>
        )}

        <div className="flex -space-x-2">
          {self && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Avatar className="ring-2 ring-background">
                    <AvatarFallback
                      style={{ backgroundColor: self.color, color: "var(--background)" }}
                    >
                      {initials(self.name)}
                    </AvatarFallback>
                  </Avatar>
                }
              />
              <TooltipContent>{self.name} (you)</TooltipContent>
            </Tooltip>
          )}

          {others.map((member) => {
            const isFollowing = member.id === followingId
            return (
              <Tooltip key={member.id}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => follow(member.id)}
                      className="rounded-full transition-transform hover:z-10 hover:-translate-y-0.5"
                      aria-pressed={isFollowing}
                      aria-label={isFollowing ? `Stop following ${member.name}` : `Follow ${member.name}`}
                    >
                      <Avatar
                        className={cn(
                          "ring-2 ring-background",
                          isFollowing && "ring-2 ring-primary"
                        )}
                      >
                        <AvatarFallback
                          style={{ backgroundColor: member.color, color: "var(--background)" }}
                        >
                          {initials(member.name)}
                        </AvatarFallback>
                        {isFollowing && <AvatarBadge />}
                      </Avatar>
                    </button>
                  }
                />
                <TooltipContent>{member.name}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
