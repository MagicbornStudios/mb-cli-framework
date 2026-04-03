import type { ThreadMessage } from '@assistant-ui/core';
/**
 * Rough character count for **context window %** UX (chars/4 vs 128k until `global-tooling-04-05`).
 * Not a tokenizer — caps large binary-ish parts.
 */
export declare function approxCharsFromThreadMessages(messages: readonly ThreadMessage[]): number;
/** Map rough chars to 0–100 vs a 128k-token reference window (chars/4 heuristic). */
export declare function approxContextPctFromChars(chars: number): number;
