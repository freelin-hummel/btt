import { useRef } from 'react';
import { type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { TokenData } from '../../types';

interface TokenProps {
  token: TokenData;
  selected: boolean;
  onSelect: () => void;
}

export function Token({ token, selected, onSelect }: TokenProps) {
  const ref = useRef<Mesh>(null);
  const r = token.size * 0.4;

  return (
    <group position={[token.x, 0, token.z]}>
      {/* Base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[r * 0.9, r, 32]} />
        <meshBasicMaterial color={selected ? '#facc15' : token.color} />
      </mesh>
      {/* Body */}
      <mesh ref={ref} position={[0, r + 0.05, 0]} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(); }} castShadow>
        <capsuleGeometry args={[r * 0.5, r * 0.8, 4, 16]} />
        <meshStandardMaterial color={token.color} roughness={0.4} metalness={0.3} emissive={selected ? '#facc15' : '#000000'} emissiveIntensity={selected ? 0.3 : 0} />
      </mesh>
      {/* Label */}
      <Html position={[0, r * 2 + 0.3, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <span style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontSize: '10px',
          padding: '1px 4px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          {token.label}
        </span>
      </Html>
    </group>
  );
}
