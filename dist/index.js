/**
 * mb-cli-framework — shared helpers for Magicborn CLIs.
 * See: custom_portfolio docs global/planning/plans/mb-cli-framework/PLAN.mdx
 */
/** Suffix legend for plain-text completions (bash-safe; use when ANSI is disabled). */
export const VENDOR_COMPLETION_LEGEND = '(cli)=controllable bin per .magicborn/cli.toml; plain=id only';
/** Format one completion word for `compgen -W` (no spaces). */
export function formatVendorCompletionToken(row) {
    return row.controllable ? `${row.id}(cli)` : row.id;
}
