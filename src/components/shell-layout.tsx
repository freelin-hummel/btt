import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type WorkspaceMode = "browser" | "scene"
type DockId = "left" | "right"

const PANEL_IDS = [
  "activity",
  "chat",
  "collections",
  "filters",
  "layers",
  "roster",
  "scene-tools",
  "selected",
] as const

type PanelId = (typeof PANEL_IDS)[number]
type DockLayout = Record<DockId, PanelId[]>
type ShellLayouts = Record<WorkspaceMode, DockLayout>

const INITIAL_LAYOUTS: ShellLayouts = {
  browser: {
    left: ["filters", "collections"],
    right: ["selected"],
  },
  scene: {
    left: ["roster", "activity", "chat"],
    right: ["scene-tools", "layers", "selected"],
  },
}

const PANEL_TITLES: Record<PanelId, string> = {
  activity: "Activity",
  chat: "Chat",
  collections: "Collections",
  filters: "Filters",
  layers: "Layers",
  roster: "Roster",
  "scene-tools": "Scene Tools",
  selected: "Selected",
}

const PANEL_SUBTITLES: Record<PanelId, string> = {
  activity: "Recent rolls and system events",
  chat: "Party messages and callouts",
  collections: "Compendiums and saved references",
  filters: "Entry scopes and quick facets",
  layers: "Visibility, terrain, and tokens",
  roster: "Party order and token shortcuts",
  "scene-tools": "Measure, ping, and edit tools",
  selected: "Focused entry or object details",
}

const PANEL_ITEMS: Record<Exclude<PanelId, "selected">, string[]> = {
  activity: ["Hit confirmed", "Door ping", "Initiative locked"],
  chat: ["Scout ahead", "Light source ready", "Need cover near gate"],
  collections: ["Characters", "Talents", "Creatures", "Scenes"],
  filters: ["System: Core", "Tags: Combat", "Owned only"],
  layers: ["Terrain", "Lighting", "Tokens", "Annotations"],
  roster: ["Iris", "Morrow", "Sable", "Tarin"],
  "scene-tools": ["Measure", "Ping", "Draw", "Target"],
}

function isPanelId(id: UniqueIdentifier): id is PanelId {
  return typeof id === "string" && PANEL_IDS.includes(id as PanelId)
}

function isDockId(id: UniqueIdentifier): id is DockId {
  return id === "left" || id === "right"
}

function findDock(layout: DockLayout, id: UniqueIdentifier): DockId | null {
  if (!isPanelId(id)) {
    return null
  }

  if (layout.left.includes(id)) {
    return "left"
  }

  if (layout.right.includes(id)) {
    return "right"
  }

  return null
}

function getInsertionIndex(
  dockId: DockId,
  items: PanelId[],
  overId: UniqueIdentifier,
) {
  const selectedIndex = items.indexOf("selected")

  if (isDockId(overId)) {
    return dockId === "right" && selectedIndex >= 0 ? selectedIndex : items.length
  }

  const overIndex = items.indexOf(overId as PanelId)

  if (overIndex >= 0) {
    return overIndex
  }

  return dockId === "right" && selectedIndex >= 0 ? selectedIndex : items.length
}

function DockPanel({
  dockId,
  panelId,
  children,
}: {
  dockId: DockId
  panelId: PanelId
  children: ReactNode
}) {
  const disabled = panelId === "selected"
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: panelId,
      disabled,
      data: {
        dockId,
      },
    })

  return (
    <section
      ref={setNodeRef}
      data-panel-id={panelId}
      data-region={panelId === "selected" ? "selected" : undefined}
      className={cn(
        "rounded-md border border-border/70 bg-card text-card-foreground shadow-xs",
        isDragging && "opacity-60 shadow-sm",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <header className="flex items-center justify-between border-b border-border/70 px-2 py-1">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {PANEL_TITLES[panelId]}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {PANEL_SUBTITLES[panelId]}
          </p>
        </div>
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon-xs"
          className={cn("shrink-0", disabled && "cursor-default opacity-50")}
          aria-label={
            disabled
              ? `${PANEL_TITLES[panelId]} is pinned to the inspector dock`
              : `Drag ${PANEL_TITLES[panelId]}`
          }
          type="button"
        >
          ≡
        </Button>
      </header>
      <div className="space-y-1 px-2 py-2">{children}</div>
    </section>
  )
}

function DockColumn({
  dockId,
  label,
  panels,
  renderPanel,
}: {
  dockId: DockId
  label: string
  panels: PanelId[]
  renderPanel: (panelId: PanelId) => ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: dockId,
  })

  return (
    <aside
      ref={setNodeRef}
      data-region={dockId}
      className={cn(
        "flex min-h-0 flex-col gap-1 overflow-auto rounded-md bg-muted/20 p-1",
        isOver && "ring-1 ring-inset ring-ring",
      )}
      aria-label={label}
    >
      <SortableContext items={panels} strategy={verticalListSortingStrategy}>
        {panels.map((panelId) => (
          <DockPanel key={panelId} dockId={dockId} panelId={panelId}>
            {renderPanel(panelId)}
          </DockPanel>
        ))}
      </SortableContext>
    </aside>
  )
}

function BrowserWorkspace() {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-md border border-border/70 bg-card">
      <header className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Browser Workspace
          </p>
          <h2 className="text-sm font-semibold">Rules and content search</h2>
        </div>
        <Button variant="outline" size="xs" type="button">
          New query
        </Button>
      </header>
      <div className="grid min-h-0 flex-1 gap-2 p-2 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-h-0 rounded-md border border-border/70 bg-background/70 p-2">
          <div className="mb-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
            <div className="rounded-sm border border-border/70 bg-card px-2 py-1">
              Source: Core Rules
            </div>
            <div className="rounded-sm border border-border/70 bg-card px-2 py-1">
              Tags: Combat
            </div>
            <div className="rounded-sm border border-border/70 bg-card px-2 py-1">
              Sort: Updated
            </div>
          </div>
          <ul className="space-y-1">
            {["Longsword", "Bandit Captain", "Guard Post", "Torch"].map((entry) => (
              <li
                key={entry}
                className="rounded-sm border border-border/70 bg-card px-2 py-1.5 text-sm"
              >
                {entry}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-dashed border-border/70 bg-muted/15 p-2 text-xs text-muted-foreground">
          Shift-click to pin entries into the current browser set.
        </div>
      </div>
    </section>
  )
}

function SceneWorkspace() {
  return (
    <section
      data-region="scene"
      className="flex h-full min-h-0 flex-col rounded-md border border-border/70 bg-card"
    >
      <header className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Scene Workspace
          </p>
          <h2 className="text-sm font-semibold">Gatehouse Ambush</h2>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="xs" type="button">
            Center map
          </Button>
          <Button variant="secondary" size="xs" type="button">
            Combat mode
          </Button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 gap-2 p-2 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="relative min-h-[24rem] rounded-md border border-border/70 bg-[linear-gradient(135deg,oklch(0.96_0.01_80),oklch(0.9_0.02_95))]">
          <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-sm border border-border/70 bg-card/90 px-2 py-1 text-xs">
            <span>Top-down view · 48 px grid</span>
            <span>3 selected units</span>
          </div>
          <div className="absolute left-[16%] top-[28%] size-4 rounded-full border border-primary/30 bg-primary/80" />
          <div className="absolute left-[48%] top-[44%] size-4 rounded-full border border-primary/30 bg-primary/80" />
          <div className="absolute left-[60%] top-[34%] size-4 rounded-full border border-destructive/40 bg-destructive/70" />
          <div className="absolute bottom-4 right-4 rounded-sm border border-border/70 bg-card/90 px-2 py-1 text-xs text-muted-foreground">
            Stylized scene surface placeholder
          </div>
        </div>
        <div className="space-y-1 rounded-md border border-border/70 bg-background/70 p-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Turn Summary
          </p>
          {[
            "Iris · Ready",
            "Bandit Captain · Exposed",
            "Torchlight · Dim",
            "Cover lines · Locked",
          ].map((item) => (
            <div
              key={item}
              className="rounded-sm border border-border/70 bg-card px-2 py-1.5 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ShellLayout() {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("scene")
  const [layouts, setLayouts] = useState(INITIAL_LAYOUTS)
  const [activePanelId, setActivePanelId] = useState<PanelId | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeLayout = layouts[workspaceMode]
  const selectedSummary = useMemo(
    () =>
      workspaceMode === "scene"
        ? {
            title: "Bandit Captain",
            detail: "HP 18 · Threatened by Iris · Cover: half",
          }
        : {
            title: "Longsword",
            detail: "Martial melee weapon · 1d8 slashing · versatile",
          },
    [workspaceMode],
  )

  function updateLayout(nextLayout: DockLayout) {
    setLayouts((currentLayouts) => ({
      ...currentLayouts,
      [workspaceMode]: nextLayout,
    }))
  }

  function handleDragStart(event: DragStartEvent) {
    if (isPanelId(event.active.id)) {
      setActivePanelId(event.active.id)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePanelId(null)

    const { active, over } = event

    if (!over || !isPanelId(active.id) || active.id === "selected") {
      return
    }

    const sourceDock = findDock(activeLayout, active.id)
    const targetDock = isDockId(over.id) ? over.id : findDock(activeLayout, over.id)

    if (!sourceDock || !targetDock) {
      return
    }

    if (sourceDock === targetDock) {
      const items = activeLayout[sourceDock]
      const oldIndex = items.indexOf(active.id)
      const newIndex = getInsertionIndex(sourceDock, items, over.id)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return
      }

      updateLayout({
        ...activeLayout,
        [sourceDock]: arrayMove(items, oldIndex, newIndex),
      })
      return
    }

    const sourceItems = [...activeLayout[sourceDock]]
    const targetItems = [...activeLayout[targetDock]]
    const sourceIndex = sourceItems.indexOf(active.id)

    if (sourceIndex === -1) {
      return
    }

    sourceItems.splice(sourceIndex, 1)
    const targetIndex = getInsertionIndex(targetDock, targetItems, over.id)
    targetItems.splice(targetIndex, 0, active.id)

    updateLayout({
      left: sourceDock === "left" ? sourceItems : targetDock === "left" ? targetItems : activeLayout.left,
      right:
        sourceDock === "right" ? sourceItems : targetDock === "right" ? targetItems : activeLayout.right,
    })
  }

  function renderPanel(panelId: PanelId) {
    if (panelId === "selected") {
      return (
        <>
          <div className="rounded-sm border border-primary/20 bg-primary/5 px-2 py-1.5">
            <p className="text-sm font-medium">{selectedSummary.title}</p>
            <p className="text-xs text-muted-foreground">{selectedSummary.detail}</p>
          </div>
          <div className="grid gap-1 text-xs text-muted-foreground">
            <div className="rounded-sm border border-border/70 bg-background px-2 py-1">
              Focus follows the active workspace context.
            </div>
            <div className="rounded-sm border border-border/70 bg-background px-2 py-1">
              Inspector tab stays pinned until the user changes it.
            </div>
          </div>
        </>
      )
    }

    return (
      <ul className="space-y-1">
        {PANEL_ITEMS[panelId].map((item) => (
          <li
            key={item}
            className="rounded-sm border border-border/70 bg-background px-2 py-1 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="grid min-h-screen grid-rows-[auto_minmax(0,1fr)_auto] bg-background text-foreground">
        <header
          data-region="menu"
          className="border-b border-border/70 bg-card px-3 py-2 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Tabletop Shell
              </p>
              <h1 className="text-sm font-semibold">Baseline layout</h1>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                size="xs"
                variant={workspaceMode === "browser" ? "secondary" : "outline"}
                onClick={() => setWorkspaceMode("browser")}
              >
                Browser
              </Button>
              <Button
                type="button"
                size="xs"
                variant={workspaceMode === "scene" ? "secondary" : "outline"}
                onClick={() => setWorkspaceMode("scene")}
              >
                Scene
              </Button>
              <Button type="button" size="xs" variant="ghost">
                Share
              </Button>
            </div>
          </div>
        </header>

        <section className="grid min-h-0 gap-px border-y border-border/70 bg-border lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
          <div className="min-h-0 bg-background p-1">
            <DockColumn
              dockId="left"
              label="Left dock"
              panels={activeLayout.left}
              renderPanel={renderPanel}
            />
          </div>

          <div data-region="center" className="min-h-0 bg-background p-1">
            {workspaceMode === "scene" ? <SceneWorkspace /> : <BrowserWorkspace />}
          </div>

          <div className="min-h-0 bg-background p-1">
            <DockColumn
              dockId="right"
              label="Right dock"
              panels={activeLayout.right}
              renderPanel={renderPanel}
            />
          </div>
        </section>

        {workspaceMode === "scene" ? (
          <footer
            data-region="action_bar"
            className="border-t border-border/70 bg-card px-3 py-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Action Bar
                </p>
                <p className="text-xs text-muted-foreground">
                  Contextual scene actions remain separate from the persistent inspector.
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button type="button" size="xs">
                  End turn
                </Button>
                <Button type="button" size="xs" variant="outline">
                  Measure
                </Button>
                <Button type="button" size="xs" variant="outline">
                  Target
                </Button>
              </div>
            </div>
          </footer>
        ) : null}
      </main>

      <DragOverlay>
        {activePanelId ? (
          <div className="rounded-md border border-border/70 bg-card px-3 py-2 text-sm shadow-lg">
            {PANEL_TITLES[activePanelId]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
