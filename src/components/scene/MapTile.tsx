import { useRef } from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { TileData } from '../../types';
import { TILE_COLORS, TILE_HEIGHTS, TILE_SIZE } from './constants';

interface MapTileProps {
  tile: TileData;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

export function MapTile({ tile, onClick }: MapTileProps) {
  const ref = useRef<Mesh>(null);
  const color = TILE_COLORS[tile.type];
  const height = TILE_HEIGHTS[tile.type];

  return (
    <mesh
      ref={ref}
      position={[tile.x, height / 2, tile.z]}
      onClick={onClick}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[TILE_SIZE * 0.98, height, TILE_SIZE * 0.98]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
