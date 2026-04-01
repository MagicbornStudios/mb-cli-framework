/**
 * Terminal theme tokens (shadcn-aligned names; values are ANSI-oriented for Ink/Text).
 * Extend with CSS variable export in a later slice (global-tooling-03 follow-up).
 */
/** Default palette for Ink `<Text color="…">` (string color names Ink supports + hex where supported). */
export const defaultCliTheme = {
    border: 'gray',
    primary: 'white',
    muted: 'gray',
    asset: 'yellow',
    payload: 'cyan',
    vendor: 'green',
    openai: 'blue',
    model: 'magenta',
    shell: 'gray',
    description: 'magenta',
    warn: 'yellow',
    error: 'red',
    success: 'green',
};
export function resolveCliTheme(_overrides) {
    // Future: read MAGICBORN_THEME=json or file
    return { ...defaultCliTheme, ..._overrides };
}
