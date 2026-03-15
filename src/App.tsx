import { useMemo, useState } from "react"
import {
  BookOpen,
  Compass,
  FolderTree,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Users,
  WandSparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Workspace = "browser" | "scene"
type InspectorTab = "selected" | "journal"

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

const browserEntries: DetailItem[] = [
  {
    id: "ashen-keep",
    title: "Ashen Keep",
    subtitle: "Adventure dossier",
    summary:
      "A compact browser entry with linked rooms, encounter notes, and travel hooks for the selected inspector.",
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
      "Rules and lore content with taxonomy filters on the left and current details routed into the right dock.",
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
      "Media and handout records ready for focused preview windows without replacing the shell layout underneath.",
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
      "A hostile scene entity that demonstrates how scene selections move through the same `selected` role as browser entries.",
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

const leftDockByWorkspace: Record<Workspace, DockSectionData[]> = {
  browser: [
    {
      id: "browser-nav",
      label: "menu",
      title: "Navigation",
      rows: ["Compendium", "Journals", "Assets", "Encounters"],
    },
    {
      id: "browser-filters",
      label: "filters",
      title: "Filters",
      rows: ["Recent", "GM notes", "Player-safe", "Imported"],
    },
  ],
  scene: [
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
  ],
}

const rightDockByWorkspace: Record<Workspace, DockSectionData[]> = {
  browser: [
    {
      id: "browser-tools",
      label: "tools",
      title: "Browser Tools",
      rows: ["Global search", "Saved views", "Pinned entries"],
    },
  ],
  scene: [
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
  ],
}

function DockSection({ label, title, rows }: DockSectionData) {
  return (
    <section className="border-b border-border last:border-b-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <Sparkles className="text-muted-foreground" />
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
  const [workspace, setWorkspace] = useState<Workspace>("scene")
  const [browserSelection, setBrowserSelection] = useState<string>(
    browserEntries[0].id,
  )
  const [sceneSelection, setSceneSelection] = useState<string>(sceneEntities[0].id)
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("selected")
  const [overlayOpen, setOverlayOpen] = useState(false)

  const selectedItem = useMemo(() => {
    const source = workspace === "browser" ? browserEntries : sceneEntities
    const selectionId =
      workspace === "browser" ? browserSelection : sceneSelection

    return source.find((item) => item.id === selectionId) ?? null
  }, [browserSelection, sceneSelection, workspace])

  const currentLeftDock = leftDockByWorkspace[workspace]
  const currentRightDock = rightDockByWorkspace[workspace]
  const isSceneWorkspace = workspace === "scene"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
        <header
          className="border-b border-border bg-card/95 backdrop-blur"
          data-region="menu"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                menu
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold uppercase tracking-[0.2em]">
                  Tabletop Shell
                </h1>
                <p className="truncate text-xs text-muted-foreground">
                  Persistent layout with browser and scene workspaces
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/60 p-1">
                <Button
                  size="sm"
                  variant={workspace === "browser" ? "secondary" : "ghost"}
                  onClick={() => setWorkspace("browser")}
                >
                  <BookOpen data-icon="inline-start" />
                  Browser
                </Button>
                <Button
                  size="sm"
                  variant={workspace === "scene" ? "secondary" : "ghost"}
                  onClick={() => setWorkspace("scene")}
                >
                  <Compass data-icon="inline-start" />
                  Scene
                </Button>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <Search />
                Search shell
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <Users />
                3 present
              </div>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 grid-cols-[17rem_minmax(0,1fr)_20rem] bg-border">
          <aside className="min-h-0 overflow-auto bg-card">
            {currentLeftDock.map((section) => (
              <DockSection key={section.id} {...section} />
            ))}
          </aside>

          <section className="relative min-h-0 overflow-hidden bg-background">
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between border-b border-border bg-card/70 px-4 py-2">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {workspace === "browser" ? "browser" : "scene"}
                  </p>
                  <h2 className="text-sm font-semibold">
                    {workspace === "browser"
                      ? "Content workspace"
                      : "Scene workspace"}
                  </h2>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOverlayOpen(true)}
                >
                  <WandSparkles data-icon="inline-start" />
                  Open window
                </Button>
              </div>

              {workspace === "browser" ? (
                <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] gap-4 p-4">
                  <div className="min-h-0 overflow-auto rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          browser
                        </p>
                        <h3 className="text-sm font-semibold">Entries</h3>
                      </div>
                      <FolderTree className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-2 p-3">
                      {browserEntries.map((entry) => {
                        const isActive = entry.id === browserSelection

                        return (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => setBrowserSelection(entry.id)}
                            className={cn(
                              "rounded-lg border px-3 py-3 text-left transition-colors",
                              isActive
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background hover:bg-muted/60",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {entry.title}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {entry.subtitle}
                                </p>
                              </div>
                              <Shield className="text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {entry.summary}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Preview
                    </p>
                    <h3 className="mt-1 text-sm font-semibold">
                      Focused entry workspace
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Browse long-form documents, compendium cards, or media here
                      while the right dock keeps the persistent selected inspector.
                    </p>
                    <div className="mt-4 rounded-lg border border-border bg-card p-3">
                      <p className="text-sm font-medium">
                        {selectedItem?.title ?? "No selection"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedItem?.summary ??
                          "Select a browser entry to populate the inspector."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_18rem] gap-4 p-4">
                  <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          scene
                        </p>
                        <h3 className="text-sm font-semibold">Ember Crossing</h3>
                      </div>
                      <Layers className="text-muted-foreground" />
                    </div>
                    <div className="relative h-full bg-[radial-gradient(circle_at_top,_var(--color-muted),_var(--color-card)_50%,_var(--color-background))]">
                      <button
                        type="button"
                        onClick={() => setSceneSelection("warden")}
                        className={cn(
                          "absolute top-[60%] left-[28%] rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors",
                          sceneSelection === "warden"
                            ? "border-primary bg-primary/15"
                            : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        Warden
                      </button>
                      <button
                        type="button"
                        onClick={() => setSceneSelection("ember-wolf")}
                        className={cn(
                          "absolute top-[36%] left-[58%] rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors",
                          sceneSelection === "ember-wolf"
                            ? "border-primary bg-primary/15"
                            : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        Ember Wolf
                      </button>
                      <button
                        type="button"
                        onClick={() => setSceneSelection("rune-gate")}
                        className={cn(
                          "absolute top-[20%] left-[42%] rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-colors",
                          sceneSelection === "rune-gate"
                            ? "border-primary bg-primary/15"
                            : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        Rune Gate
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Context
                    </p>
                    <h3 className="mt-1 text-sm font-semibold">
                      Tactical prompts
                    </h3>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                      <p>• Initiative: Round 3, players act first.</p>
                      <p>• Ember Wolf threatens the northern path.</p>
                      <p>• Rune Gate can be primed from the right dock.</p>
                    </div>
                  </div>
                </div>
              )}

              {overlayOpen ? (
                <div className="absolute inset-4 rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur">
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
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setOverlayOpen(false)}
                    >
                      <X />
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                    <p>
                      This focused window sits over the center workspace while
                      the menu and dock structure remain visible underneath.
                    </p>
                    <p>
                      Use this surface for short document reads, entity sheets,
                      or context-heavy workflows that should not replace the
                      persistent shell.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="min-h-0 overflow-auto bg-card">
            {currentRightDock.map((section) => (
              <DockSection key={section.id} {...section} />
            ))}

            <section className="border-t border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    selected
                  </p>
                  <h2 className="text-sm font-semibold">Inspector</h2>
                </div>
                <MessageSquare className="text-muted-foreground" />
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
                            if (workspace === "browser") {
                              setBrowserSelection("")
                              return
                            }

                            setSceneSelection("")
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
                        own empty state until a browser entry, token, or scene
                        object is selected.
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
          </aside>
        </div>

        {isSceneWorkspace ? (
          <footer
            className="border-t border-border bg-card"
            data-region="action_bar"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  action_bar
                </p>
                <p className="text-sm font-semibold">Contextual combat actions</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary">
                  Move
                </Button>
                <Button size="sm" variant="secondary">
                  Target
                </Button>
                <Button size="sm">Draw Steel!</Button>
              </div>
            </div>
          </footer>
        ) : null}
      </div>
    </main>
  )
}
