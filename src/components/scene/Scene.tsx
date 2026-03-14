import { useRef, useCallback } from 'react';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useMapStore } from '../../store/useMapStore';
import { MapGrid } from './MapGrid';
import { MapTile } from './MapTile';
import { Token } from './Token';
import { Lights } from './Lights';

function snapToGrid(v: number) {
  return Math.round(v);
}

/** Invisible ground plane that captures pointer events for painting/placing */
function Ground() {
  const ref = useRef<Mesh>(null);
  const isPointerDown = useRef(false);
  const { activeTool, paintTile, eraseTile, addToken, gridSize } = useMapStore();

  const handlePointer = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isPointerDown.current) return;
      const x = snapToGrid(e.point.x);
      const z = snapToGrid(e.point.z);
      if (activeTool === 'paint') paintTile(x, z);
      else if (activeTool === 'erase') eraseTile(x, z);
    },
    [activeTool, paintTile, eraseTile],
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const x = snapToGrid(e.point.x);
      const z = snapToGrid(e.point.z);
      if (activeTool === 'paint') paintTile(x, z);
      else if (activeTool === 'erase') eraseTile(x, z);
      else if (activeTool === 'token') addToken(x, z);
    },
    [activeTool, paintTile, eraseTile, addToken],
  );

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={() => { isPointerDown.current = true; }}
      onPointerUp={() => { isPointerDown.current = false; }}
      onPointerMove={handlePointer}
      onClick={handleClick}
      receiveShadow
    >
      <planeGeometry args={[gridSize + 2, gridSize + 2]} />
      <meshStandardMaterial color="#0f172a" roughness={1} />
    </mesh>
  );
}

export function Scene() {
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const { tiles, tokens, selectedTokenId, selectToken, activeTool } = useMapStore();

  // Disable orbit when painting/erasing/placing tokens
  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.enabled = activeTool === 'select';
    }
  });

  return (
    <>
      <Lights />
      <MapGrid />
      <Ground />

      {/* Tiles */}
      {[...tiles.values()].map((tile) => (
        <MapTile key={`${tile.x},${tile.z}`} tile={tile} />
      ))}

      {/* Tokens */}
      {tokens.map((token) => (
        <Token
          key={token.id}
          token={token}
          selected={token.id === selectedTokenId}
          onSelect={() => selectToken(token.id)}
        />
      ))}

      <OrbitControls
        ref={orbitRef}
        makeDefault
        minDistance={3}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 - 0.05}
        mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: 2 }}
      />
    </>
  );
}
