"use client"

import "@xyflow/react/dist/style.css"
import * as React from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useReactFlow,
  type NodeMouseHandler,
  type OnNodeDrag,
} from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Cancel01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ScanIcon,
  RefreshIcon,
  MaximizeScreenIcon,
  MinimizeScreenIcon,
  ArrowExpand01Icon,
} from "@hugeicons/core-free-icons"
import { getMeasureById } from "@/lib/research-plan-data"
import type { ResearchMapTheme } from "@/lib/research-map-data"
import { computeLayout, themeNodeId, questionNodeId, measureNodeId, type MapNode } from "./layout"
import { CentralNode } from "./central-node"
import { ThemeNode } from "./theme-node"
import { QuestionNode } from "./question-node"
import { MeasureNode } from "./measure-node"

const NODE_TYPES = { root: CentralNode, theme: ThemeNode, question: QuestionNode, measure: MeasureNode }

interface SearchEntry {
  key: string
  label: string
  kind: "theme" | "question" | "measure"
  themeId: string
  measureId?: string
  themeName: string
}

function buildSearchIndex(themes: ResearchMapTheme[]): SearchEntry[] {
  return themes.flatMap((theme) => {
    const entries: SearchEntry[] = [
      { key: `theme-${theme.id}`, label: theme.name, kind: "theme", themeId: theme.id, themeName: theme.name },
    ]
    for (const measureId of theme.measureIds) {
      const measure = getMeasureById(measureId)
      if (!measure) continue
      entries.push({
        key: `question-${measureId}`,
        label: measure.question,
        kind: "question",
        themeId: theme.id,
        measureId,
        themeName: theme.name,
      })
      entries.push({
        key: `measure-${measureId}`,
        label: measure.name,
        kind: "measure",
        themeId: theme.id,
        measureId,
        themeName: theme.name,
      })
    }
    return entries
  })
}

function ResearchMapInner({ themes, rootLabel }: { themes: ResearchMapTheme[]; rootLabel: string }) {
  const rf = useReactFlow<MapNode>()
  const searchIndex = React.useMemo(() => buildSearchIndex(themes), [themes])
  const themeOf = React.useCallback(
    (measureId: string) => themes.find((t) => t.measureIds.includes(measureId))?.id,
    [themes]
  )
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [selectedMeasureId, setSelectedMeasureId] = React.useState<string | null>(null)
  const [manualPositions, setManualPositions] = React.useState<Record<string, { x: number; y: number }>>({})
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [searchOpen, setSearchOpen] = React.useState(false)
  const pendingCenterRef = React.useRef<string | null>(null)

  const { nodes: baseNodes, edges } = React.useMemo(
    () => computeLayout(themes, expanded, rootLabel),
    [themes, expanded, rootLabel]
  )

  const selectedThemeId = selectedMeasureId ? themeOf(selectedMeasureId) : undefined

  const nodes = React.useMemo<MapNode[]>(
    () =>
      baseNodes.map((n) => {
        const position = manualPositions[n.id] ?? n.position
        const data = n.data
        if (data.kind === "theme") {
          const themeId = data.themeId
          return { ...n, position, data: { ...data, highlighted: themeId === selectedThemeId, onToggle: () => toggleTheme(themeId) } }
        }
        if (data.kind === "question") {
          const measureId = data.measureId
          return { ...n, position, data: { ...data, highlighted: measureId === selectedMeasureId, onSelect: () => selectQuestion(measureId) } }
        }
        if (data.kind === "measure") {
          return { ...n, position, data: { ...data, highlighted: data.measureId === selectedMeasureId } }
        }
        return { ...n, position }
      }),
    [baseNodes, manualPositions, selectedThemeId, selectedMeasureId]
  )

  function toggleTheme(themeId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(themeId)) next.delete(themeId)
      else next.add(themeId)
      return next
    })
  }

  function expandAll() {
    setExpanded(new Set(themes.map((t) => t.id)))
  }

  function collapseAll() {
    setExpanded(new Set())
    setSelectedMeasureId(null)
  }

  function selectQuestion(measureId: string) {
    setSelectedMeasureId((prev) => (prev === measureId ? null : measureId))
  }

  const onNodeDragStop: OnNodeDrag<MapNode> = (_event, node) => {
    setManualPositions((prev) => ({ ...prev, [node.id]: node.position }))
  }

  const onNodeClick: NodeMouseHandler<MapNode> = (event) => {
    // Theme/question/measure nodes handle their own click via the button inside them
    // (onToggle/onSelect/the sheet trigger) — this only exists so clicking node "chrome"
    // outside that inner button doesn't fall through to onPaneClick and clear selection.
    event.stopPropagation()
  }

  function resetLayout() {
    setManualPositions({})
  }

  function resetView() {
    setManualPositions({})
    setExpanded(new Set())
    setSelectedMeasureId(null)
    requestAnimationFrame(() => rf.fitView({ padding: 0.3, duration: 400 }))
  }

  function fitMap() {
    rf.fitView({ padding: 0.3, duration: 400 })
  }

  // After expanding a search result's theme, its node doesn't exist until the next render
  // of `nodes` above — watch for it, then center on it once, rather than fitting the whole
  // map (per "preserve zoom/pan where practical").
  React.useEffect(() => {
    const targetId = pendingCenterRef.current
    if (!targetId) return
    const node = nodes.find((n) => n.id === targetId)
    if (!node) return
    rf.setCenter(node.position.x + 90, node.position.y, { zoom: 1, duration: 500 })
    pendingCenterRef.current = null
  }, [nodes, rf])

  function goToResult(entry: SearchEntry) {
    setExpanded((prev) => new Set(prev).add(entry.themeId))
    if (entry.kind === "measure" && entry.measureId) {
      setSelectedMeasureId(entry.measureId)
      pendingCenterRef.current = measureNodeId(entry.measureId)
    } else if (entry.kind === "question" && entry.measureId) {
      setSelectedMeasureId(entry.measureId)
      pendingCenterRef.current = questionNodeId(entry.measureId)
    } else {
      pendingCenterRef.current = themeNodeId(entry.themeId)
    }
    setQuery("")
    setSearchOpen(false)
  }

  const results = query.trim().length > 0
    ? searchIndex.filter((e) => e.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
    : []

  React.useEffect(() => {
    if (!isFullscreen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen])

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 flex flex-col bg-background" : "flex flex-col gap-3"}>
      <div className="flex flex-wrap items-center gap-2 px-1 empty:hidden [.fixed_&]:px-4 [.fixed_&]:pt-4">
        <div className="relative min-w-48 flex-1 sm:max-w-72">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search themes, questions, measures…"
            aria-label="Search the research map"
            className="pl-8"
          />
          {searchOpen && query.trim().length > 0 ? (
            <div className="absolute top-full z-20 mt-1 w-full rounded-lg border border-border bg-popover p-1 shadow-md">
              {results.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {results.map((r) => (
                    <li key={r.key}>
                      <button
                        type="button"
                        onClick={() => goToResult(r)}
                        className="flex w-full flex-col items-start gap-0.5 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                      >
                        <span className="text-foreground">{r.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.kind === "theme" ? "Theme" : r.kind === "question" ? `Question · ${r.themeName}` : `Measure · ${r.themeName}`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2.5 py-2 text-sm text-muted-foreground">No matches for “{query}.”</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand all
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse all
          </Button>
          <Button variant="outline" size="sm" onClick={resetLayout}>
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} data-icon="inline-start" />
            Reset layout
          </Button>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/20"
        style={{ height: isFullscreen ? "calc(100vh - 64px)" : 560 }}
        onClick={() => searchOpen && setSearchOpen(false)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedMeasureId(null)
            setSearchOpen(false)
          }}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable
          deleteKeyCode={null}
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          minZoom={0.3}
          maxZoom={1.5}
          defaultEdgeOptions={{ style: { strokeWidth: 1.5 } }}
          proOptions={{ hideAttribution: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-40" />
        </ReactFlow>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={() => rf.zoomIn({ duration: 200 })} aria-label="Zoom in">
            <HugeiconsIcon icon={ZoomInAreaIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => rf.zoomOut({ duration: 200 })} aria-label="Zoom out">
            <HugeiconsIcon icon={ZoomOutAreaIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="sm" onClick={fitMap}>
            <HugeiconsIcon icon={ScanIcon} strokeWidth={2} data-icon="inline-start" />
            Fit map
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            Reset view
          </Button>
        </div>

        <div className="absolute bottom-3 right-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <HugeiconsIcon icon={isFullscreen ? MinimizeScreenIcon : MaximizeScreenIcon} strokeWidth={2} />
          </Button>
        </div>

        {selectedThemeId ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-primary bg-card px-3 py-1 text-xs font-medium shadow-sm">
            <HugeiconsIcon icon={ArrowExpand01Icon} strokeWidth={2} className="size-3.5" aria-hidden="true" />
            Highlighting a question in “{themes.find((t) => t.id === selectedThemeId)?.name}”
            <button
              type="button"
              onClick={() => setSelectedMeasureId(null)}
              aria-label="Clear highlight"
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      {isFullscreen ? (
        <p className="sr-only" role="status">
          Fullscreen map open. Press Escape to exit.
        </p>
      ) : null}
    </div>
  )
}

export function ResearchMap({ themes, rootLabel }: { themes: ResearchMapTheme[]; rootLabel: string }) {
  return (
    <ReactFlowProvider>
      <ResearchMapInner themes={themes} rootLabel={rootLabel} />
    </ReactFlowProvider>
  )
}
