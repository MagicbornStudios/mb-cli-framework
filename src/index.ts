/**
 * mb-cli-framework — shared helpers for Magicborn CLIs.
 * See: custom_portfolio docs global/planning/plans/mb-cli-framework/PLAN.mdx
 */

/** Suffix legend for plain-text completions (bash-safe; use when ANSI is disabled). */
export const VENDOR_COMPLETION_LEGEND = '(cli)=controllable bin per .magicborn/cli.toml; plain=id only';

export type VendorCompletionRow = {
  id: string;
  /** When true, manifest declares a bin the parent CLI can forward to. */
  controllable: boolean;
};

/** Format one completion word for `compgen -W` (no spaces). */
export function formatVendorCompletionToken(row: VendorCompletionRow): string {
  return row.controllable ? `${row.id}(cli)` : row.id;
}
