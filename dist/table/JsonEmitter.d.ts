/**
 * JsonEmitter — consistent JSON output with TTY detection and `--json` flag support.
 * All Magicborn CLIs emit JSON in the same envelope: `{ data }` or `{ error }`.
 */
export interface JsonEmitterOptions {
    /** Indent spaces. Defaults to 2. */
    indent?: number;
    /** If true, emit to stderr instead of stdout. */
    stderr?: boolean;
}
export interface JsonEnvelope<T = unknown> {
    data?: T;
    error?: string;
}
/**
 * Emit a JSON response to stdout (or stderr).
 * Always writes a trailing newline.
 */
export declare class JsonEmitter {
    /**
     * Emit a successful data response.
     * @example JsonEmitter.data({ roots: [] });  // → { "data": { "roots": [] } }
     */
    static data<T>(payload: T, options?: JsonEmitterOptions): void;
    /**
     * Emit an error response.
     * @example JsonEmitter.error('phase not found');  // → { "error": "phase not found" }
     */
    static error(message: string, options?: JsonEmitterOptions): void;
    /**
     * Returns true if the process should use JSON output:
     * - `--json` flag is in process.argv, OR
     * - No TTY detected (piped) and no explicit format flag override
     */
    static shouldUseJson(argv?: string[]): boolean;
    private static emit;
}
