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
export declare function CliContextMeter(props: CliContextMeterProps): import("react/jsx-runtime").JSX.Element;
