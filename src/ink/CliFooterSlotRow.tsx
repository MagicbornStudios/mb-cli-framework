import React from 'react';
import { Box, Text } from 'ink';
import type { CliTheme } from '../cli-theme.js';

export type CliFooterSlotRowProps = {
  theme: CliTheme;
  /** Three columns: e.g. next slash (accent) · model · cwd folder. */
  slots: readonly [React.ReactNode, React.ReactNode, React.ReactNode];
  width: number;
};

/**
 * Claude Code–style single footer line: `slot0 | slot1 | slot2` with muted separators.
 */
export function CliFooterSlotRow(props: CliFooterSlotRowProps) {
  const pipe = <Text color={props.theme.muted}> | </Text>;
  return (
    <Box flexDirection="row" width={props.width} marginTop={1}>
      <Box flexDirection="row" flexWrap="wrap">
        {props.slots[0]}
        {pipe}
        {props.slots[1]}
        {pipe}
        {props.slots[2]}
      </Box>
    </Box>
  );
}
