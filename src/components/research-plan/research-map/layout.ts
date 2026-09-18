import type { Edge, Node } from "@xyflow/react"
import type { ResearchMapTheme } from "@/lib/research-map-data"
import { getMeasureById } from "@/lib/research-plan-data"

export const ROOT_ID = "root"

export const ROW_HEIGHT = 96
const THEME_X = 300
const QUESTION_X = 620
const MEASURE_X = 940

// `highlighted` and the callbacks are never set by computeLayout (a pure positioning
// function) — the map component enriches nodes with them afterward, from selection/expand
// state, right before handing the array to <ReactFlow nodes={...}>. Declared here (rather
// than cast in each node component) so every consumer shares one typed shape. No per-theme
// color or `side` here — every card is styled by its role (KPI / question / metric), the
// same way regardless of which theme it belongs to, and the layout only flows one direction
// (root → KPI → question → metric, left to right), so handle position never varies either.
export type MapNodeData =
  | { kind: "root"; label: string }
  | {
      kind: "theme"
      themeId: string
      name: string
      questionCount: number
      expanded: boolean
      highlighted?: boolean
      onToggle?: () => void
    }
  | {
      kind: "question"
      themeId: string
      measureId: string
      question: string
      highlighted?: boolean
      onSelect?: () => void
    }
  | {
      kind: "measure"
      themeId: string
      measureId: string
      name: string
      excluded: boolean
      highlighted?: boolean
    }

export type MapNode = Node<MapNodeData>

export function themeNodeId(themeId: string) {
  return `theme-${themeId}`
}
export function questionNodeId(measureId: string) {
  return `question-${measureId}`
}
export function measureNodeId(measureId: string) {
  return `measure-${measureId}`
}

/**
 * Deterministic, from-scratch layout: given the full theme list for this map (6 for Research
 * Plan, 9 for Deliverables) and which theme IDs are currently expanded, computes every visible
 * node's position. Re-run in full on every expand/collapse rather than patched incrementally —
 * themes after the one that just changed simply get pushed down (or pulled back up), which is
 * also what keeps a theme's own questions/measures always contiguous and never overlapping a
 * neighboring theme's rows.
 *
 * One direction only: all KPI themes stack in a single left-hand column, with questions and
 * then metrics branching rightward from each — not a bidirectional mind map.
 */
export function computeLayout(
  themes: ResearchMapTheme[],
  expandedThemeIds: Set<string>,
  rootLabel: string
): { nodes: MapNode[]; edges: Edge[] } {
  const nodes: MapNode[] = [{ id: ROOT_ID, type: "root", position: { x: 0, y: 0 }, data: { kind: "root", label: rootLabel } }]
  const edges: Edge[] = []

  let cursorY = 0
  const blocks = themes.map((theme) => {
    const expanded = expandedThemeIds.has(theme.id)
    const rows = expanded ? Math.max(theme.measureIds.length, 1) : 1
    const blockStartY = cursorY
    cursorY += rows * ROW_HEIGHT
    return { theme, expanded, rows, blockStartY }
  })
  const totalHeight = cursorY
  const offset = -totalHeight / 2

  for (const block of blocks) {
    const { theme, expanded, rows, blockStartY } = block
    const themeY = blockStartY + (rows * ROW_HEIGHT) / 2 + offset

    nodes.push({
      id: themeNodeId(theme.id),
      type: "theme",
      position: { x: THEME_X, y: themeY },
      data: { kind: "theme", themeId: theme.id, name: theme.name, questionCount: theme.measureIds.length, expanded },
    })
    edges.push({
      id: `edge-root-${theme.id}`,
      source: ROOT_ID,
      target: themeNodeId(theme.id),
      type: "bezier",
    })

    if (!expanded) continue

    theme.measureIds.forEach((measureId, i) => {
      const measure = getMeasureById(measureId)
      if (!measure) return
      const rowY = blockStartY + (i + 0.5) * ROW_HEIGHT + offset

      nodes.push({
        id: questionNodeId(measureId),
        type: "question",
        position: { x: QUESTION_X, y: rowY },
        data: { kind: "question", themeId: theme.id, measureId, question: measure.question },
      })
      edges.push({
        id: `edge-${theme.id}-${measureId}-q`,
        source: themeNodeId(theme.id),
        target: questionNodeId(measureId),
        type: "bezier",
      })

      nodes.push({
        id: measureNodeId(measureId),
        type: "measure",
        position: { x: MEASURE_X, y: rowY },
        data: { kind: "measure", themeId: theme.id, measureId, name: measure.name, excluded: measure.status !== "calculated" },
      })
      edges.push({
        id: `edge-${measureId}-m`,
        source: questionNodeId(measureId),
        target: measureNodeId(measureId),
        type: "bezier",
      })
    })
  }

  return { nodes, edges }
}
