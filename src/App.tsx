import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import {
  MessageSquare,
  Search,
  Sparkles,
  Users,
  WandSparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { cn } from "@/lib/utils"

type InspectorTab = "selected" | "journal"
type SelectionSource = "scene" | "compendium"

type DetailItem = {
  id: string
  title: string
  subtitle: string
  summary: string
  tags: string[]
  stats: Array<{ label: string; value: string }>
}

type DockSectionData = {
  id: string
  label: string
  title: string
  rows: string[]
}

type MenuDefinition = {
  label: string
  items: Array<{
    label: string
    onSelect?: () => void
    disabled?: boolean
    separatorBefore?: boolean
  }>
}

const compendiumEntries: DetailItem[] = [
  {
    id: "ashen-keep",
    title: "Ashen Keep",
    subtitle: "Adventure dossier",
    summary:
      "A floating compendium entry with linked rooms, encounter notes, and travel hooks that can still route into the persistent inspector.",
    tags: ["document", "encounter", "travel"],
    stats: [
      { label: "Sections", value: "12" },
      { label: "Links", value: "24" },
      { label: "Last edit", value: "5m ago" },
    ],
  },
  {
    id: "storm-archive",
    title: "Storm Archive",
    subtitle: "Reference compendium",
    summary:
      "Rules and lore content browseable from a large centered window while the scene canvas and dock overlays remain visible behind it.",
    tags: ["rules", "lore", "index"],
    stats: [
      { label: "Articles", value: "86" },
      { label: "Tags", value: "14" },
      { label: "Owner", value: "GM" },
    ],
  },
  {
    id: "vault-ledger",
    title: "Vault Ledger",
    subtitle: "Asset browser",
    summary:
      "Media and handout records that can be reviewed in the compendium window without replacing the full-scene shell.",
    tags: ["assets", "maps", "handouts"],
    stats: [
      { label: "Assets", value: "39" },
      { label: "Collections", value: "7" },
      { label: "Pinned", value: "4" },
    ],
  },
]

const sceneEntities: DetailItem[] = [
  {
    id: "warden",
    title: "Warden",
    subtitle: "Front-line hero",
    summary:
      "A scene selection showing quick-read combat data, active resources, and contextual actions in the persistent inspector.",
    tags: ["player", "ready", "defender"],
    stats: [
      { label: "HP", value: "41 / 52" },
      { label: "Guard", value: "17" },
      { label: "Speed", value: "6" },
    ],
  },
  {
    id: "ember-wolf",
    title: "Ember Wolf",
    subtitle: "Roaming hazard",
    summary:
      "A hostile scene entity demonstrating how docked controls can overlay the canvas without shrinking the underlying scene.",
    tags: ["npc", "threat", "fire"],
    stats: [
      { label: "HP", value: "22 / 22" },
      { label: "Instinct", value: "Pounce" },
      { label: "Distance", value: "18 ft" },
    ],
  },
  {
    id: "rune-gate",
    title: "Rune Gate",
    subtitle: "Interactive scene object",
    summary:
      "A scene object selection showing that the inspector follows the current focus type instead of one fixed schema.",
    tags: ["object", "locked", "arcane"],
    stats: [
      { label: "State", value: "Dormant" },
      { label: "Charges", value: "2" },
      { label: "Trigger", value: "Sigil" },
    ],
  },
]

const leftDockSections: DockSectionData[] = [
  {
    id: "scene-roster",
    label: "roster",
    title: "Party Roster",
    rows: ["Warden — Ready", "Mender — Channeling", "Scout — Hidden"],
  },
  {
    id: "scene-log",
    label: "activity",
    title: "Activity Log",
    rows: ["Round 3 begins", "Rune Gate flickers", "Wolf closes distance"],
  },
  {
    id: "scene-chat",
    label: "chat",
    title: "Chat",
    rows: ["GM: Fog thickens", "Mender: Holding action"],
  },
]

const rightDockSections: DockSectionData[] = [
  {
    id: "scene-tools",
    label: "scene",
    title: "Scene Tools",
    rows: ["Lighting", "Terrain", "Layers", "Measure"],
  },
  {
    id: "layer-tools",
    label: "layers",
    title: "Layer Tools",
    rows: ["Tokens", "Hazards", "Props", "Notes"],
  },
]

const compendiumSections: DockSectionData[] = [
  {
    id: "compendium-nav",
    label: "compendium",
    title: "Navigation",
    rows: ["Rules", "Journals", "Assets", "Encounters"],
  },
  {
    id: "compendium-filters",
    label: "filters",
    title: "Filters",
    rows: ["Recent", "GM notes", "Player-safe", "Imported"],
  },
]

const sceneMarkerPositions = {
  warden: { top: "60%", left: "28%" },
  "ember-wolf": { top: "36%", left: "58%" },
  "rune-gate": { top: "20%", left: "42%" },
} as const

const tacticalPrompts = [
  "Initiative: Round 3, players act first.",
  "Ember Wolf threatens the northern path.",
  "Rune Gate can be primed from the right dock.",
]

const sceneActionBarActions = ["Move", "Target", "Draw Steel!"]
const rightDockWidth = "20rem"
const overlayEdgeInset = "0.75rem"
const overlayGap = "1rem"
const viewportInset = "1.5rem"
const dockTopOffset = "4rem"
const dockBottomOffset = "6rem"
const compendiumTopOffset = "5rem"
const bottomOverlayOffset = "7rem"
const footerBottomOffset = "1rem"
const maxCompendiumWidth = "64rem"
const rightDockContextOffset = `calc(${rightDockWidth} + ${overlayGap})`
const defaultCompendiumOpen = true
const defaultSelectionSource: SelectionSource = "compendium"

function OverlayPanel({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/92 shadow-xl backdrop-blur",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function DockSection({ label, title, rows }: DockSectionData) {
  return (
    <section className="border-b border-border last:border-b-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/45 px-3 py-2">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <Sparkles aria-hidden="true" className="text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 px-2 py-2">
        {rows.map((row) => (
          <div
            key={row}
            className="rounded-md border border-transparent px-2 py-1 text-sm text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
          >
            {row}
          </div>
        ))}
      </div>
    </section>
  )
}

function StatRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-2 py-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export default function App() {
  const [compendiumOpen, setCompendiumOpen] = useState(defaultCompendiumOpen)
  const [browserSelection, setBrowserSelection] = useState<string | null>(
    compendiumEntries[0].id,
  )
  const [sceneSelection, setSceneSelection] = useState<string | null>(
    sceneEntities[0].id,
  )
  const [selectionSource, setSelectionSource] =
    useState<SelectionSource>(defaultSelectionSource)
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("selected")
  const [overlayOpen, setOverlayOpen] = useState(false)

  const selectedItem = useMemo(() => {
    const source =
      selectionSource === "compendium" ? compendiumEntries : sceneEntities
    const selectionId =
      selectionSource === "compendium" ? browserSelection : sceneSelection

    return source.find((item) => item.id === selectionId) ?? null
  }, [browserSelection, sceneSelection, selectionSource])

  const previewEntry = useMemo(
    () =>
      compendiumEntries.find((entry) => entry.id === browserSelection) ?? null,
    [browserSelection],
  )

  const menuDefinitions: MenuDefinition[] = [
    {
      label: "File",
      items: [
        { label: "New scene", disabled: true },
        { label: "Save layout", disabled: true },
      ],
    },
    {
      label: "View",
      items: [
        {
          label: compendiumOpen ? "Hide Compendium" : "Show Compendium",
          onSelect: () => setCompendiumOpen((current) => !current),
        },
        {
          label: overlayOpen ? "Hide Focus Window" : "Show Focus Window",
          onSelect: () => setOverlayOpen((current) => !current),
        },
      ],
    },
    {
      label: "Window",
      items: [
        { label: "Inspector", disabled: true },
        { label: "Roster", disabled: true },
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Shortcuts", disabled: true },
        { label: "About shell", disabled: true },
      ],
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <section
        aria-labelledby="scene-canvas-heading"
        className="absolute inset-0 overflow-hidden"
        role="region"
      >
        <h2 id="scene-canvas-heading" className="sr-only">
          Scene canvas
        </h2>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--muted),_var(--card)_45%,_var(--background))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.28)_100%)]" />

        <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm backdrop-blur">
          scene
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectionSource("scene")
            setSceneSelection("warden")
          }}
          className={cn(
            "absolute rounded-full border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition-colors",
            sceneSelection === "warden" && selectionSource === "scene"
              ? "border-primary bg-primary/15"
              : "border-border bg-card/85 hover:bg-muted",
          )}
          style={sceneMarkerPositions.warden}
        >
          Warden
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectionSource("scene")
            setSceneSelection("ember-wolf")
          }}
          className={cn(
            "absolute rounded-full border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition-colors",
            sceneSelection === "ember-wolf" && selectionSource === "scene"
              ? "border-primary bg-primary/15"
              : "border-border bg-card/85 hover:bg-muted",
          )}
          style={sceneMarkerPositions["ember-wolf"]}
        >
          Ember Wolf
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectionSource("scene")
            setSceneSelection("rune-gate")
          }}
          className={cn(
            "absolute rounded-full border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition-colors",
            sceneSelection === "rune-gate" && selectionSource === "scene"
              ? "border-primary bg-primary/15"
              : "border-border bg-card/85 hover:bg-muted",
          )}
          style={sceneMarkerPositions["rune-gate"]}
        >
          Rune Gate
        </button>
      </section>

      <header
        className="absolute z-30 flex items-start justify-between gap-3"
        data-region="menu"
        style={{
          top: overlayEdgeInset,
          left: overlayEdgeInset,
          right: overlayEdgeInset,
        }}
      >
        <OverlayPanel className="p-1">
          <Menubar className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none">
            {menuDefinitions.map((menu) => (
              <MenubarMenu key={menu.label}>
                <MenubarTrigger>{menu.label}</MenubarTrigger>
                <MenubarContent>
                  {menu.items.map((item) => (
                    <div key={item.label}>
                      {item.separatorBefore ? (
                        <MenubarSeparator />
                      ) : null}
                      <MenubarItem
                        disabled={item.disabled}
                        onSelect={item.onSelect}
                      >
                        {item.label}
                      </MenubarItem>
                    </div>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            ))}
          </Menubar>
        </OverlayPanel>

        <OverlayPanel className="flex items-center gap-2 px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            <Search aria-hidden="true" />
            Search shell
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            <Users aria-hidden="true" />
            3 present
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOverlayOpen(true)}
          >
            <WandSparkles aria-hidden="true" data-icon="inline-start" />
            Focus window
          </Button>
        </OverlayPanel>
      </header>

      <aside
        className="absolute z-20 w-72 overflow-hidden"
        style={{
          top: dockTopOffset,
          left: overlayEdgeInset,
          bottom: dockBottomOffset,
        }}
      >
        <OverlayPanel className="flex h-full flex-col overflow-hidden">
          {leftDockSections.map((section) => (
            <DockSection key={section.id} {...section} />
          ))}
        </OverlayPanel>
      </aside>

      <aside
        className="absolute z-20 overflow-hidden"
        style={{
          top: dockTopOffset,
          right: overlayEdgeInset,
          bottom: dockBottomOffset,
          width: rightDockWidth,
        }}
      >
        <OverlayPanel className="flex h-full flex-col overflow-hidden">
          <div className="overflow-auto">
            {rightDockSections.map((section) => (
              <DockSection key={section.id} {...section} />
            ))}

            <section className="border-t border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/45 px-3 py-2">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    selected
                  </p>
                  <h2 className="text-sm font-semibold">Inspector</h2>
                </div>
                <MessageSquare
                  aria-hidden="true"
                  className="text-muted-foreground"
                />
              </div>

              <div className="border-b border-border p-2">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
                  <Button
                    size="sm"
                    variant={inspectorTab === "selected" ? "secondary" : "ghost"}
                    onClick={() => setInspectorTab("selected")}
                  >
                    Selected
                  </Button>
                  <Button
                    size="sm"
                    variant={inspectorTab === "journal" ? "secondary" : "ghost"}
                    onClick={() => setInspectorTab("journal")}
                  >
                    Journal
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-3">
                {inspectorTab === "selected" ? (
                  selectedItem ? (
                    <>
                      <div className="rounded-lg border border-border bg-background p-3">
                        <p className="text-sm font-semibold">
                          {selectedItem.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedItem.subtitle}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {selectedItem.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        {selectedItem.stats.map((stat) => (
                          <StatRow
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          Open sheet
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (selectionSource === "compendium") {
                              setBrowserSelection(null)
                              return
                            }

                            setSceneSelection(null)
                          }}
                        >
                          Clear selection
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold">Nothing selected</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The active inspector mode stays in place and shows its
                        own empty state until a compendium entry, token, or
                        scene object is selected.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-semibold">Journal context</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This tab keeps its own state while selection changes
                      elsewhere, so changing focus does not hijack the active
                      inspector mode.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                      <p>Current entry: Session notes / Ember Crossing</p>
                      <p>Bookmarks: 3 pinned, 1 unresolved</p>
                      <p>Last update: GM annotations synced</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </OverlayPanel>
      </aside>

      {compendiumOpen ? (
        <section
          className="absolute left-1/2 z-20 flex -translate-x-1/2"
          style={{
            top: compendiumTopOffset,
            bottom: bottomOverlayOffset,
            width: `min(${maxCompendiumWidth}, calc(100% - ${viewportInset} * 2))`,
          }}
        >
          <OverlayPanel className="flex h-full w-full overflow-hidden">
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    compendium
                  </p>
                  <h2 className="text-sm font-semibold">Floating browser window</h2>
                </div>
                <Button
                  aria-label="Close compendium"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setCompendiumOpen(false)}
                >
                  <X aria-hidden="true" />
                </Button>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[15rem_minmax(0,1fr)_18rem]">
                <div className="border-r border-border bg-muted/20">
                  {compendiumSections.map((section) => (
                    <DockSection key={section.id} {...section} />
                  ))}
                </div>

                <div className="min-h-0 overflow-auto border-r border-border">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        results
                      </p>
                      <h3 className="text-sm font-semibold">Entries</h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    {compendiumEntries.map((entry) => {
                      const isActive =
                        entry.id === browserSelection &&
                        selectionSource === "compendium"

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => {
                            setSelectionSource("compendium")
                            setBrowserSelection(entry.id)
                          }}
                          className={cn(
                            "rounded-lg border px-3 py-3 text-left transition-colors",
                            isActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:bg-muted/60",
                          )}
                        >
                          <p className="truncate text-sm font-semibold">
                            {entry.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {entry.subtitle}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {entry.summary}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="min-h-0 overflow-auto bg-background/60 p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    preview
                  </p>
                  <h3 className="mt-1 text-sm font-semibold">
                    Focused compendium entry
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The compendium floats over the full-scene shell instead of
                    becoming a separate full-page workspace.
                  </p>
                  <div className="mt-4 rounded-lg border border-border bg-card p-3">
                    <p className="text-sm font-medium">
                      {previewEntry?.title ?? "No entry selected"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {previewEntry?.summary ??
                        "Select a compendium entry to preview it here."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </OverlayPanel>
        </section>
      ) : null}

      <footer
        className="absolute left-1/2 z-30 -translate-x-1/2"
        data-region="action_bar"
        style={{ bottom: footerBottomOffset }}
      >
        <OverlayPanel className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                action_bar
              </p>
              <p className="text-sm font-semibold">Contextual combat actions</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {sceneActionBarActions.map((action) => (
                <Button
                  key={action}
                  size="sm"
                  variant={action === "Draw Steel!" ? "default" : "secondary"}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </OverlayPanel>
      </footer>

      <OverlayPanel
        className="absolute z-20 max-w-xs px-4 py-3"
        style={{ right: rightDockContextOffset, top: compendiumTopOffset }}
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          context
        </p>
        <h3 className="mt-1 text-sm font-semibold">Tactical prompts</h3>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm text-muted-foreground">
          {tacticalPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </OverlayPanel>

      {overlayOpen ? (
        <section
          className="absolute z-40 w-full max-w-md"
          style={{
            right: rightDockContextOffset,
            bottom: bottomOverlayOffset,
          }}
        >
          <OverlayPanel className="p-4">
            <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  transient window
                </p>
                <h3 className="text-sm font-semibold">
                  {selectedItem?.title ?? "Focused content"}
                </h3>
              </div>
              <Button
                aria-label="Close transient window"
                size="icon-sm"
                variant="ghost"
                onClick={() => setOverlayOpen(false)}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                This focused window stays layered over the canvas while the
                docks, menubar, and action bar remain overlaid on top of the
                scene.
              </p>
              <p>
                Use this surface for short document reads, entity sheets, or
                other focused workflows.
              </p>
            </div>
          </OverlayPanel>
        </section>
      ) : null}
    </main>
  )
}
