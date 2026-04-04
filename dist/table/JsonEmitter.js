/**
 * JsonEmitter — consistent JSON output with TTY detection and `--json` flag support.
 * All Magicborn CLIs emit JSON in the same envelope: `{ data }` or `{ error }`.
 */
/**
 * Emit a JSON response to stdout (or stderr).
 * Always writes a trailing newline.
 */
export class JsonEmitter {
    /**
     * Emit a successful data response.
     * @example JsonEmitter.data({ roots: [] });  // → { "data": { "roots": [] } }
     */
    static data(payload, options) {
        const envelope = { data: payload };
        JsonEmitter.emit(envelope, options);
    }
    /**
     * Emit an error response.
     * @example JsonEmitter.error('phase not found');  // → { "error": "phase not found" }
     */
    static error(message, options) {
        const envelope = { error: message };
        JsonEmitter.emit(envelope, { ...options, stderr: true });
    }
    /**
     * Returns true if the process should use JSON output:
     * - `--json` flag is in process.argv, OR
     * - No TTY detected (piped) and no explicit format flag override
     */
    static shouldUseJson(argv = process.argv) {
        if (argv.includes('--json'))
            return true;
        if (argv.some(a => a.startsWith('--format=')))
            return false;
        if (argv.includes('--format'))
            return false;
        if (argv.includes('--md'))
            return false;
        // Non-TTY defaults to JSON (machine-readable)
        return !Boolean(process.stdout?.isTTY);
    }
    static emit(envelope, options) {
        const indent = options?.indent ?? 2;
        const out = JSON.stringify(envelope, null, indent) + '\n';
        if (options?.stderr) {
            process.stderr.write(out);
        }
        else {
            process.stdout.write(out);
        }
    }
}
