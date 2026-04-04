/**
 * TableFormatter — renders tabular data in ANSI table, plain text, JSON, or Markdown.
 * Used by all Magicborn CLIs for consistent non-interactive output.
 */
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
    static render(rows, options = {}) {
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
    static renderTable(rows, keys, options) {
        const useAnsi = options.ansi ?? Boolean(process.stdout?.isTTY);
        // Compute column widths
        const widths = keys.map(k => k.length);
        for (const row of rows) {
            keys.forEach((k, i) => {
                const val = row[k] == null ? '' : String(row[k]);
                widths[i] = Math.max(widths[i], val.length);
            });
        }
        const pad = (s, len) => s.padEnd(len);
        const sep = widths.map(w => '─'.repeat(w)).join('  ');
        const header = keys.map((k, i) => pad(k.toUpperCase(), widths[i])).join('  ');
        const lines = [];
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
    static renderMarkdown(rows, keys, title) {
        const lines = [];
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
