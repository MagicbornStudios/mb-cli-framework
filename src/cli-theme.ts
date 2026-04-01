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
export const defaultCliTheme: CliTheme = {
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

export function resolveCliTheme(_overrides?: Partial<CliTheme>): CliTheme {
  // Future: read MAGICBORN_THEME=json or file
  return { ...defaultCliTheme, ..._overrides };
}
