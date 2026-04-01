/**
 * When to offer Ink / TUI vs plain stdout (Commander help, --json, pipes).
 */
/** Force plain output (no Ink dashboard, no interactive TUI). */
export declare function isMagicbornPlainMode(): boolean;
/** TTY + not plain + not CI-ish (optional). */
export declare function shouldOfferMagicbornTui(): boolean;
