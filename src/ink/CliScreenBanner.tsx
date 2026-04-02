import React from 'react';
import { Box, Text } from 'ink';
import type { CliTheme } from '../cli-theme.js';

export type CliScreenBannerProps = {
  theme: CliTheme;
  /** Content width (columns). */
  width: number;
  /** Primary headline (e.g. product name + version). */
  headline: React.ReactNode;
  /** Extra lines below headline (tagline, cwd, …). */
  children?: React.ReactNode;
};

/**
 * Rounded bordered header card — Claude-style top region. Keeps layout consistent across
 * `magicborn`, `grimetime`, and other hosts.
 */
export function CliScreenBanner(props: CliScreenBannerProps) {
  return (
    <Box
      borderStyle="round"
      borderColor={props.theme.border}
      flexDirection="column"
      paddingX={1}
      paddingY={0}
      marginBottom={1}
      width={props.width}
    >
      <Box flexDirection="column">
        {typeof props.headline === 'string' ? (
          <Text bold color={props.theme.primary}>
            {props.headline}
          </Text>
        ) : (
          props.headline
        )}
        {props.children}
      </Box>
    </Box>
  );
}
