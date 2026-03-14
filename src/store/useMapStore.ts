import { create } from 'zustand';
import type { TileData, TileType, TokenData, Tool } from '../types';

interface MapState {
  // Map
  tiles: Map<string, TileData>;
  gridSize: number;

  // Tools
  activeTool: Tool;
  activeTileType: TileType;
  activeTokenColor: string;

  // Tokens
  tokens: TokenData[];
  selectedTokenId: string | null;

  // Actions
  setActiveTool: (tool: Tool) => void;
  setActiveTileType: (type: TileType) => void;
  setActiveTokenColor: (color: string) => void;

  paintTile: (x: number, z: number) => void;
  eraseTile: (x: number, z: number) => void;
  getTile: (x: number, z: number) => TileData | undefined;

  addToken: (x: number, z: number) => void;
  moveToken: (id: string, x: number, z: number) => void;
  removeToken: (id: string) => void;
  selectToken: (id: string | null) => void;

  clearMap: () => void;
}

function tileKey(x: number, z: number) {
  return `${x},${z}`;
}

let tokenCounter = 1;

export const useMapStore = create<MapState>((set, get) => ({
  tiles: new Map(),
  gridSize: 30,

  activeTool: 'paint',
  activeTileType: 'grass',
  activeTokenColor: '#e44',

  tokens: [],
  selectedTokenId: null,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveTileType: (type) => set({ activeTileType: type }),
  setActiveTokenColor: (color) => set({ activeTokenColor: color }),

  paintTile: (x, z) => {
    const { tiles, activeTileType, gridSize } = get();
    if (Math.abs(x) > gridSize / 2 || Math.abs(z) > gridSize / 2) return;
    const next = new Map(tiles);
    next.set(tileKey(x, z), { x, z, type: activeTileType });
    set({ tiles: next });
  },

  eraseTile: (x, z) => {
    const { tiles } = get();
    const next = new Map(tiles);
    next.delete(tileKey(x, z));
    set({ tiles: next });
  },

  getTile: (x, z) => get().tiles.get(tileKey(x, z)),

  addToken: (x, z) => {
    const { tokens, activeTokenColor } = get();
    const id = `token-${tokenCounter++}`;
    set({
      tokens: [...tokens, { id, x, z, label: `T${tokenCounter - 1}`, color: activeTokenColor, size: 1 }],
      selectedTokenId: id,
    });
  },

  moveToken: (id, x, z) => {
    set((state) => ({
      tokens: state.tokens.map((t) => (t.id === id ? { ...t, x, z } : t)),
    }));
  },

  removeToken: (id) => {
    set((state) => ({
      tokens: state.tokens.filter((t) => t.id !== id),
      selectedTokenId: state.selectedTokenId === id ? null : state.selectedTokenId,
    }));
  },

  selectToken: (id) => set({ selectedTokenId: id }),

  clearMap: () => set({ tiles: new Map(), tokens: [], selectedTokenId: null }),
}));
