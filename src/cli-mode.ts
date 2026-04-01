/**
 * When to offer Ink / TUI vs plain stdout (Commander help, --json, pipes).
 */

/** Force plain output (no Ink dashboard, no interactive TUI). */
export function isMagicbornPlainMode(): boolean {
  return process.env.MAGICBORN_PLAIN === '1' || process.env.MAGICBORN_PLAIN === 'true';
}

/** TTY + not plain + not CI-ish (optional). */
export function shouldOfferMagicbornTui(): boolean {
  if (isMagicbornPlainMode()) {
    return false;
  }
  if (process.env.CI === 'true' || process.env.CI === '1') {
    return false;
  }
  return Boolean(process.stdout.isTTY);
}
