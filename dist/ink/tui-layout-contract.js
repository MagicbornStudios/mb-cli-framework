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
/** Default Claude-style stack (extend in product). */
export const defaultTuiLayoutBlueprint = {
    slots: ['banner', 'transcript', 'activity', 'panel', 'composer', 'footer'],
};
