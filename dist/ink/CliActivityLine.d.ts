import type { CliTheme } from '../cli-theme.js';
export type CliActivityLineProps = {
    theme: CliTheme;
    /** Static label, e.g. `Thinking` or `Waiting`. */
    label: string;
    /** Append ` · Ns` with N incrementing every second (isolated subtree — safe for frequent ticks). */
    showElapsed?: boolean;
};
/**
 * Status line for long-running work (Claude Code “thinking…” pattern). Keep **outside** the
 * transcript column so only this node re-renders on the timer.
 */
export declare function CliActivityLine(props: CliActivityLineProps): import("react/jsx-runtime").JSX.Element;
