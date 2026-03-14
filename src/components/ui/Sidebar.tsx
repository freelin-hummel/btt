import {
  Box,
  Flex,
  Text,
  IconButton,
  Separator,
  Tooltip,
  ScrollArea,
  Badge,
} from '@radix-ui/themes';
import { Cross2Icon, PersonIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useMapStore } from '../../store/useMapStore';
import type { TileType } from '../../types';
import { TILE_COLORS } from '../scene/constants';

const TILE_TYPES: TileType[] = ['grass', 'dirt', 'stone', 'water', 'wood'];
const TOKEN_COLORS = ['#e44', '#4e9', '#49f', '#f90', '#c4f', '#f1f5f9'];

const TILE_LABELS: Record<TileType, string> = {
  empty: 'Empty',
  grass: 'Grass',
  dirt: 'Dirt',
  stone: 'Stone',
  water: 'Water',
  wood: 'Wood',
};

const CONTROLS = [
  { key: 'Paint', desc: 'Click / drag tiles' },
  { key: 'Erase', desc: 'Click / drag tiles' },
  { key: 'Token', desc: 'Click to place' },
  { key: 'Orbit', desc: 'Left drag (select mode)' },
  { key: 'Pan',   desc: 'Right drag' },
  { key: 'Zoom',  desc: 'Scroll wheel' },
];

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
    <Box
      style={{
        position: 'fixed',
        top: 49,
        right: 0,
        width: 220,
        bottom: 0,
        borderLeft: '1px solid var(--gray-a4)',
        background: 'var(--color-panel-solid)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScrollArea style={{ flex: 1 }}>
        <Flex direction="column" gap="4" p="3">

          {/* Terrain palette */}
          {activeTool === 'paint' && (
            <Flex direction="column" gap="2">
              <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Terrain
              </Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {TILE_TYPES.map((type) => (
                  <Tooltip key={type} content={TILE_LABELS[type]}>
                    <button
                      onClick={() => setActiveTileType(type)}
                      style={{
                        height: 44,
                        borderRadius: 'var(--radius-2)',
                        border: activeTileType === type
                          ? '2px solid var(--indigo-9)'
                          : '2px solid transparent',
                        background: TILE_COLORS[type],
                        cursor: 'pointer',
                        outline: activeTileType === type ? '2px solid var(--indigo-a7)' : 'none',
                        outlineOffset: 1,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: 3,
                        transition: 'border-color 0.1s',
                      }}
                    >
                      <Text size="1" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.8)', textTransform: 'capitalize' }}>
                        {type}
                      </Text>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </Flex>
          )}

          {/* Token color picker */}
          {activeTool === 'token' && (
            <Flex direction="column" gap="2">
              <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Token Color
              </Text>
              <Flex gap="2" wrap="wrap">
                {TOKEN_COLORS.map((c) => (
                  <Tooltip key={c} content={c}>
                    <button
                      onClick={() => setActiveTokenColor(c)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: c,
                        border: activeTokenColor === c ? '2px solid var(--indigo-9)' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: activeTokenColor === c ? '2px solid var(--indigo-a7)' : 'none',
                        outlineOffset: 1,
                        transition: 'transform 0.1s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Tooltip>
                ))}
              </Flex>
            </Flex>
          )}

          <Separator size="4" />

          {/* Token list */}
          <Flex direction="column" gap="2">
            <Flex align="center" justify="between">
              <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Tokens
              </Text>
              <Badge color="gray" size="1" variant="surface">{tokens.length}</Badge>
            </Flex>

            {tokens.length === 0 ? (
              <Flex align="center" gap="1" style={{ opacity: 0.5 }}>
                <PersonIcon width={13} height={13} />
                <Text size="1" color="gray">Use the place-token tool</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="1">
                {tokens.map((t) => (
                  <Flex
                    key={t.id}
                    align="center"
                    gap="2"
                    px="2"
                    py="1"
                    onClick={() => selectToken(t.id)}
                    style={{
                      borderRadius: 'var(--radius-2)',
                      background: t.id === selectedTokenId ? 'var(--indigo-a4)' : 'var(--gray-a2)',
                      border: t.id === selectedTokenId ? '1px solid var(--indigo-a6)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, flexShrink: 0, display: 'inline-block' }} />
                    <Text size="1" style={{ flex: 1 }}>{t.label}</Text>
                    <Text size="1" color="gray">{t.x},{t.z}</Text>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="gray"
                      onClick={(e) => { e.stopPropagation(); removeToken(t.id); }}
                      aria-label="Remove token"
                    >
                      <Cross2Icon width={11} height={11} />
                    </IconButton>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>

          <Separator size="4" />

          {/* Controls reference */}
          <Flex direction="column" gap="2">
            <Flex align="center" gap="1">
              <QuestionMarkCircledIcon width={13} height={13} style={{ color: 'var(--gray-9)' }} />
              <Text size="1" weight="medium" color="gray" style={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Controls
              </Text>
            </Flex>
            <Flex direction="column" gap="1">
              {CONTROLS.map(({ key, desc }) => (
                <Flex key={key} justify="between" gap="2">
                  <Text size="1" weight="medium" style={{ color: 'var(--gray-11)', flexShrink: 0 }}>{key}</Text>
                  <Text size="1" color="gray" style={{ textAlign: 'right' }}>{desc}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>

        </Flex>
      </ScrollArea>
    </Box>
  );
}
