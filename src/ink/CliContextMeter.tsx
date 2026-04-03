import React from 'react';
import { Box, Text } from 'ink';
import type { CliTheme } from '../cli-theme.js';

export type CliContextMeterProps = {
  theme: CliTheme;
  /** Total width for the bar + label (columns). */
  width: number;
  /** 0–100 approximate context usage. */
  usedPct: number;
  /** Prefix label (default `ctx`). */
  label?: string;
};

/**
 * Horizontal bar (filled / empty blocks) + percentage — Claude Code–style session context hint.
 * Values are **approximate** unless the host passes model-accurate token counts.
 */
export function CliContextMeter(props: CliContextMeterProps) {
  const label = props.label ?? 'ctx';
  const pct = Math.max(0, Math.min(100, Math.round(props.usedPct)));
  const barMax = Math.max(8, Math.min(28, Math.floor(props.width * 0.22)));
  const filled = Math.round((barMax * pct) / 100);
  const empty = barMax - filled;
  const bar = `${'▓'.repeat(filled)}${'░'.repeat(empty)}`;
  return (
    <Box flexDirection="row">
      <Text color={props.theme.muted}>{label} </Text>
      <Text color={props.theme.asset}>{bar}</Text>
      <Text color={props.theme.asset}> {pct}%</Text>
    </Box>
  );
}
