import { Grid } from '@react-three/drei';
import { useMapStore } from '../../store/useMapStore';

export function MapGrid() {
  const gridSize = useMapStore((s) => s.gridSize);

  return (
    <Grid
      args={[gridSize, gridSize]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#334155"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#475569"
      fadeDistance={80}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid={false}
      position={[0, 0, 0]}
    />
  );
}
