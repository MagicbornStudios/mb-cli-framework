/**
 * TableFormatter — renders tabular data in ANSI table, plain text, JSON, or Markdown.
 * Used by all Magicborn CLIs for consistent non-interactive output.
 */
export type TableFormat = 'table' | 'json' | 'md' | 'plain';
export interface TableFormatterOptions {
    /** Output format. Defaults to 'table'. */
    format?: TableFormat;
    /** Column headers. If omitted, derived from first row keys. */
    headers?: string[];
    /** Whether to emit ANSI colors in table mode. Defaults to TTY detection. */
    ansi?: boolean;
    /** Title shown above the table. */
    title?: string;
}
/**
 * Format an array of record objects as a human-readable table, JSON, or Markdown.
 *
 * @example
 * const out = TableFormatter.render([
 *   { id: 'root', path: '.', phase: '3/8' },
 * ], { title: 'GAD Workspaces' });
 * console.log(out);
 */
export declare class TableFormatter {
    static render(rows: Record<string, string | number | boolean | null | undefined>[], options?: TableFormatterOptions): string;
    private static renderTable;
    private static renderMarkdown;
}
