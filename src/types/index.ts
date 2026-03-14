export type TileType = 'empty' | 'grass' | 'dirt' | 'stone' | 'water' | 'wood';

export type Tool = 'select' | 'paint' | 'erase' | 'token';

export interface TileData {
  x: number;
  z: number;
  type: TileType;
}

export interface TokenData {
  id: string;
  x: number;
  z: number;
  label: string;
  color: string;
  size: number; // tile units (1 = 5ft)
}
