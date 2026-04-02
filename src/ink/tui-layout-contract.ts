/**
 * Claude Code–style terminal layout: split vertical regions so **status** / “thinking…” lines
 * can update on a timer **without** implying a full-screen redraw of **transcript** or **composer**.
 *
 * Ink reconciles by React tree; keep **stable component boundaries** (and keys for list rows)
 * so only the subtree whose props change re-renders. Avoid lifting volatile state above the
 * transcript when possible.
 *
 * Consumers: `magicborn` Ink home/chat, `grimetime`, any `@magicborn/mb-cli-framework` host.
 */

/** Vertical regions from top to bottom (typical fixed order). */
export type TuiVerticalSlot =
  | 'banner'
  | 'transcript'
  /** Ephemeral ticks: “thinking 12s…”, progress — isolate from transcript body */
  | 'activity'
  /** Slash picker, forms — bottom overlay */
  | 'panel'
  | 'composer'
  /** Row 1: next slash · model · cwd; row 2: context % · approvals */
  | 'footer';

/** Document intended layout for a screen; implement as nested `<Box>` regions in Ink. */
export type TuiLayoutBlueprint = {
  readonly slots: readonly TuiVerticalSlot[];
};

/** Default Claude-style stack (extend in product). */
export const defaultTuiLayoutBlueprint: TuiLayoutBlueprint = {
  slots: ['banner', 'transcript', 'activity', 'panel', 'composer', 'footer'],
};
