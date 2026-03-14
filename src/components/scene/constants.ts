import type { TileType } from '../../types';

export const TILE_SIZE = 1; // world units per tile

export const TILE_COLORS: Record<TileType, string> = {
  empty: '#1a1a2e',
  grass: '#4a7c59',
  dirt: '#8b6914',
  stone: '#6b7280',
  water: '#2563eb',
  wood: '#92400e',
};

export const TILE_HEIGHTS: Record<TileType, number> = {
  empty: 0.02,
  grass: 0.05,
  dirt: 0.04,
  stone: 0.1,
  water: 0.02,
  wood: 0.06,
};
