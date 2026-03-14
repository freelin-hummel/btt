import { useMapStore } from '../../store/useMapStore';
import type { Tool } from '../../types';
import styles from './Toolbar.module.css';

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'select', label: 'Select / Orbit', icon: '🖱️' },
  { id: 'paint', label: 'Paint Tile', icon: '🖌️' },
  { id: 'erase', label: 'Erase Tile', icon: '🧹' },
  { id: 'token', label: 'Place Token', icon: '🧙' },
];

export function Toolbar() {
  const { activeTool, setActiveTool, clearMap } = useMapStore();

  return (
    <div className={styles.toolbar}>
      <span className={styles.brand}>⚔️ BTT</span>
      <div className={styles.tools}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`${styles.toolBtn} ${activeTool === t.id ? styles.active : ''}`}
            onClick={() => setActiveTool(t.id)}
            title={t.label}
          >
            {t.icon} <span>{t.label}</span>
          </button>
        ))}
      </div>
      <button className={styles.clearBtn} onClick={clearMap} title="Clear map">
        🗑️ Clear
      </button>
    </div>
  );
}
