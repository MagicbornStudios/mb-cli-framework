import React from 'react';
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
export declare function CliFooterSlotRow(props: CliFooterSlotRowProps): import("react/jsx-runtime").JSX.Element;
