import type { ThreadMessage } from '@assistant-ui/core';

/**
 * Rough character count for **context window %** UX (chars/4 vs 128k until `global-tooling-04-05`).
 * Not a tokenizer — caps large binary-ish parts.
 */
export function approxCharsFromThreadMessages(messages: readonly ThreadMessage[]): number {
  let n = 0;
  for (const m of messages) {
    for (const p of m.content) {
      switch (p.type) {
        case 'text':
        case 'reasoning':
          n += p.text.length;
          break;
        case 'tool-call': {
          n += p.argsText.length;
          if (p.result !== undefined) {
            try {
              n += Math.min(8000, JSON.stringify(p.result).length);
            } catch {
              n += 64;
            }
          }
          break;
        }
        case 'source':
          n += p.url.length + (p.title?.length ?? 0);
          break;
        case 'file':
          n += Math.min(4000, p.data.length);
          break;
        case 'image':
          n += Math.min(4000, p.image.length);
          break;
        default:
          break;
      }
    }
  }
  return n;
}

/** Map rough chars to 0–100 vs a 128k-token reference window (chars/4 heuristic). */
export function approxContextPctFromChars(chars: number): number {
  const approxTokens = chars / 4;
  return Math.min(100, Math.round((approxTokens / 128_000) * 100));
}
