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

const ansi = {
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

/**
 * Format an array of record objects as a human-readable table, JSON, or Markdown.
 *
 * @example
 * const out = TableFormatter.render([
 *   { id: 'root', path: '.', phase: '3/8' },
 * ], { title: 'GAD Workspaces' });
 * console.log(out);
 */
export class TableFormatter {
  static render(
    rows: Record<string, string | number | boolean | null | undefined>[],
    options: TableFormatterOptions = {},
  ): string {
    const format = options.format ?? 'table';

    if (format === 'json') {
      return JSON.stringify(rows, null, 2);
    }

    const keys = options.headers ?? (rows.length > 0 ? Object.keys(rows[0]) : []);

    if (format === 'md') {
      return TableFormatter.renderMarkdown(rows, keys, options.title);
    }

    return TableFormatter.renderTable(rows, keys, options);
  }

  private static renderTable(
    rows: Record<string, unknown>[],
    keys: string[],
    options: TableFormatterOptions,
  ): string {
    const useAnsi = options.ansi ?? Boolean(process.stdout?.isTTY);

    // Compute column widths
    const widths: number[] = keys.map(k => k.length);
    for (const row of rows) {
      keys.forEach((k, i) => {
        const val = row[k] == null ? '' : String(row[k]);
        widths[i] = Math.max(widths[i], val.length);
      });
    }

    const pad = (s: string, len: number) => s.padEnd(len);
    const sep = widths.map(w => '─'.repeat(w)).join('  ');

    const header = keys.map((k, i) => pad(k.toUpperCase(), widths[i])).join('  ');
    const lines: string[] = [];

    if (options.title) {
      lines.push(useAnsi ? `${ansi.bold}${options.title}${ansi.reset}` : options.title);
      lines.push('');
    }

    lines.push(useAnsi ? `${ansi.bold}${header}${ansi.reset}` : header);
    lines.push(useAnsi ? `${ansi.dim}${sep}${ansi.reset}` : sep);

    for (const row of rows) {
      const line = keys.map((k, i) => {
        const val = row[k] == null ? '' : String(row[k]);
        return pad(val, widths[i]);
      }).join('  ');
      lines.push(line);
    }

    return lines.join('\n');
  }

  private static renderMarkdown(
    rows: Record<string, unknown>[],
    keys: string[],
    title?: string,
  ): string {
    const lines: string[] = [];

    if (title) {
      lines.push(`## ${title}`);
      lines.push('');
    }

    const header = `| ${keys.join(' | ')} |`;
    const sep = `| ${keys.map(() => '---').join(' | ')} |`;
    lines.push(header, sep);

    for (const row of rows) {
      const cells = keys.map(k => (row[k] == null ? '' : String(row[k])));
      lines.push(`| ${cells.join(' | ')} |`);
    }

    return lines.join('\n');
  }
}
