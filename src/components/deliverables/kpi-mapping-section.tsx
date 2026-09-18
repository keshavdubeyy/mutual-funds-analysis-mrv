"use client"

import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ResearchMap } from "@/components/research-plan/research-map/research-map"
import { RESEARCH_MAP_ALL_THEMES } from "@/lib/research-map-data"
import { KpiMappingTable } from "./kpi-mapping-table"

type View = "table" | "map"

export function KpiMappingSection() {
  const [view, setView] = React.useState<View>("table")

  function handleViewChange(values: string[]) {
    const newest = values.find((v) => v !== view) ?? values[0]
    if (newest) setView(newest as View)
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <ToggleGroup value={[view]} onValueChange={handleViewChange} variant="outline" size="sm" spacing={0} className="self-start">
        <ToggleGroupItem value="table">Table</ToggleGroupItem>
        <ToggleGroupItem value="map">Map</ToggleGroupItem>
      </ToggleGroup>

      {view === "table" ? (
        <KpiMappingTable />
      ) : (
        <ResearchMap themes={RESEARCH_MAP_ALL_THEMES} rootLabel="Industry KPIs and Marketing metrics" />
      )}
    </div>
  )
}
