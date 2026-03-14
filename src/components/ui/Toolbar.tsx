import { Flex, IconButton, Separator, Text, Tooltip } from '@radix-ui/themes';
import {
  CursorArrowIcon,
  Pencil1Icon,
  EraserIcon,
  PersonIcon,
  TrashIcon,
  TargetIcon,
} from '@radix-ui/react-icons';
import { useMapStore } from '../../store/useMapStore';
import type { Tool } from '../../types';

const TOOLS: { id: Tool; label: string; Icon: React.ComponentType<{ width?: string | number; height?: string | number }> }[] = [
  { id: 'select',  label: 'Select / Orbit',  Icon: CursorArrowIcon },
  { id: 'paint',   label: 'Paint Tile',       Icon: Pencil1Icon },
  { id: 'erase',   label: 'Erase Tile',       Icon: EraserIcon },
  { id: 'token',   label: 'Place Token',      Icon: PersonIcon },
];

export function Toolbar() {
  const { activeTool, setActiveTool, clearMap } = useMapStore();

  return (
    <Flex
      align="center"
      gap="2"
      px="3"
      style={{
        height: 49,
        borderBottom: '1px solid var(--gray-a4)',
        background: 'var(--color-panel-solid)',
        flexShrink: 0,
        zIndex: 100,
        position: 'relative',
      }}
    >
      {/* Brand */}
      <Flex align="center" gap="1" mr="2">
        <TargetIcon width={18} height={18} style={{ color: 'var(--amber-10)' }} />
        <Text size="3" weight="bold" style={{ color: 'var(--amber-10)', letterSpacing: '0.04em' }}>
          BTT
        </Text>
      </Flex>

      <Separator orientation="vertical" style={{ height: 24 }} />

      {/* Tool buttons */}
      <Flex gap="1">
        {TOOLS.map(({ id, label, Icon }) => (
          <Tooltip key={id} content={label}>
            <IconButton
              variant={activeTool === id ? 'solid' : 'ghost'}
              color={activeTool === id ? 'indigo' : 'gray'}
              size="2"
              onClick={() => setActiveTool(id)}
              aria-label={label}
            >
              <Icon width={16} height={16} />
            </IconButton>
          </Tooltip>
        ))}
      </Flex>

      <Separator orientation="vertical" style={{ height: 24 }} />

      {/* Active tool label */}
      <Text size="1" color="gray" style={{ flex: 1 }}>
        {TOOLS.find((t) => t.id === activeTool)?.label}
      </Text>

      {/* Clear */}
      <Tooltip content="Clear map">
        <IconButton variant="ghost" color="red" size="2" onClick={clearMap} aria-label="Clear map">
          <TrashIcon width={16} height={16} />
        </IconButton>
      </Tooltip>
    </Flex>
  );
}
