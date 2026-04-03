/**
 * Terminal theme tokens (shadcn-aligned names; values are ANSI-oriented for Ink/Text).
 * Extend with CSS variable export in a later slice (global-tooling-03 follow-up).
 */
export type CliTheme = {
    /** Section / border emphasis */
    border: string;
    /** Primary labels (commands, verbs) */
    primary: string;
    /** Secondary body */
    muted: string;
    /** Asset / local actions */
    asset: string;
    /** Payload / CMS */
    payload: string;
    /** Vendor */
    vendor: string;
    /** OpenAI */
    openai: string;
    /** Model / style */
    model: string;
    /** Slash-command palette (`/…`) — Claude Code–style accent (see `global-tooling-04-01`). */
    slash: string;
    /** Footer chrome accent (hints, slot labels). */
    footerAccent: string;
    /** Shell / meta */
    shell: string;
    /** Descriptions (dim + accent) */
    description: string;
    /** Warnings */
    warn: string;
    /** Errors */
    error: string;
    /** Success */
    success: string;
};
/** Default palette for Ink `<Text color="…">` (string color names Ink supports + hex where supported). */
export declare const defaultCliTheme: CliTheme;
export declare function resolveCliTheme(_overrides?: Partial<CliTheme>): CliTheme;
