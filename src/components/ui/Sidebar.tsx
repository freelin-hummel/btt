import { useMapStore } from '../../store/useMapStore';
import type { TileType } from '../../types';
import { TILE_COLORS } from '../scene/constants';
import styles from './Sidebar.module.css';

const TILE_TYPES: TileType[] = ['grass', 'dirt', 'stone', 'water', 'wood'];

const TOKEN_COLORS = ['#e44', '#4e9', '#49f', '#f90', '#c4f', '#fff'];

export function Sidebar() {
  const {
    activeTool,
    activeTileType,
    setActiveTileType,
    activeTokenColor,
    setActiveTokenColor,
    tokens,
    selectedTokenId,
    selectToken,
    removeToken,
  } = useMapStore();

  return (
    <div className={styles.sidebar}>
      {(activeTool === 'paint') && (
        <section className={styles.section}>
          <h3>Terrain</h3>
          <div className={styles.palette}>
            {TILE_TYPES.map((type) => (
              <button
                key={type}
                className={`${styles.swatch} ${activeTileType === type ? styles.activeSwatchBorder : ''}`}
                style={{ background: TILE_COLORS[type] }}
                onClick={() => setActiveTileType(type)}
                title={type}
              >
                <span className={styles.swatchLabel}>{type}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTool === 'token' && (
        <section className={styles.section}>
          <h3>Token Color</h3>
          <div className={styles.palette}>
            {TOKEN_COLORS.map((c) => (
              <button
                key={c}
                className={`${styles.colorSwatch} ${activeTokenColor === c ? styles.activeSwatchBorder : ''}`}
                style={{ background: c }}
                onClick={() => setActiveTokenColor(c)}
                title={c}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h3>Tokens ({tokens.length})</h3>
        {tokens.length === 0 && <p className={styles.hint}>No tokens yet.<br />Use the 🧙 tool to place one.</p>}
        <ul className={styles.tokenList}>
          {tokens.map((t) => (
            <li
              key={t.id}
              className={`${styles.tokenItem} ${t.id === selectedTokenId ? styles.selected : ''}`}
              onClick={() => selectToken(t.id)}
            >
              <span className={styles.tokenDot} style={{ background: t.color }} />
              <span className={styles.tokenName}>{t.label}</span>
              <span className={styles.tokenCoord}>{t.x},{t.z}</span>
              <button
                className={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); removeToken(t.id); }}
                title="Remove"
              >✕</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.hint}>Controls</h3>
        <ul className={styles.helpList}>
          <li>🖌️ Click/drag to paint</li>
          <li>🧹 Click/drag to erase</li>
          <li>🧙 Click to place token</li>
          <li>🖱️ Orbit: left-drag</li>
          <li>🖱️ Pan: right-drag</li>
          <li>🖱️ Zoom: scroll</li>
        </ul>
      </section>
    </div>
  );
}
