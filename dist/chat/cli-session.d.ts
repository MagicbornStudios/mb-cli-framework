import type { SiteChatRagMode } from './portfolio-site-chat-types.js';
export declare const CLI_SESSION_REL_PATH: string;
export type CliSessionV1 = {
    version?: 1;
    /** When true, show **auto** in the footer (future: skip approval gates). Default false = confirm each destructive action. */
    acceptEditsAuto?: boolean;
    /** Preferred chat model id for `POST /api/chat` (optional). */
    chatModel?: string;
    /** Per-session RAG mode; omit to follow server `SITE_CHAT_RAG`. */
    ragMode?: SiteChatRagMode;
};
/** True when **`MAGICBORN_ACCEPT_EDITS_AUTO`** overrides **`.magicborn/cli-session.json`**. */
export declare function isAcceptEditsAutoEnvLocked(): boolean;
/** File contents only (no env). Used when merging writes. */
export declare function readCliSessionFile(repoRoot: string): CliSessionV1;
/**
 * Effective session for UI: **`MAGICBORN_ACCEPT_EDITS_AUTO`** wins over the file when set.
 * Other file fields (`chatModel`, `ragMode`, …) are preserved.
 */
export declare function readCliSession(repoRoot: string): CliSessionV1;
/** Merge into **`.magicborn/cli-session.json`** (creates dirs). Returns **`readCliSession(repoRoot)`** after write (env still wins). */
export declare function writeCliSessionMerge(repoRoot: string, patch: Partial<CliSessionV1>): CliSessionV1;
export declare function toggleAcceptEditsAuto(repoRoot: string, current: boolean): CliSessionV1;
