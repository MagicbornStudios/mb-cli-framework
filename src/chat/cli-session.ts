import fs from 'node:fs';
import path from 'node:path';
import type { SiteChatRagMode } from './portfolio-site-chat-types.js';

export const CLI_SESSION_REL_PATH = path.join('.magicborn', 'cli-session.json');

export type CliSessionV1 = {
  version?: 1;
  /** When true, show **auto** in the footer (future: skip approval gates). Default false = confirm each destructive action. */
  acceptEditsAuto?: boolean;
  /** Preferred chat model id for `POST /api/chat` (optional). */
  chatModel?: string;
  /** Per-session RAG mode; omit to follow server `SITE_CHAT_RAG`. */
  ragMode?: SiteChatRagMode;
};

function parseRagModeField(v: unknown): SiteChatRagMode | undefined {
  if (v === 'off' || v === 'books' || v === 'books_planning' || v === 'books_planning_repo') {
    return v;
  }
  return undefined;
}

function parseChatModelField(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  if (!t || t.length > 128) return undefined;
  if (!/^[a-zA-Z0-9._-]+$/.test(t)) return undefined;
  return t;
}

function parseEnvAcceptEditsAuto(): boolean | undefined {
  const env = process.env.MAGICBORN_ACCEPT_EDITS_AUTO?.trim().toLowerCase();
  if (env === '1' || env === 'true' || env === 'yes') {
    return true;
  }
  if (env === '0' || env === 'false' || env === 'no') {
    return false;
  }
  return undefined;
}

/** True when **`MAGICBORN_ACCEPT_EDITS_AUTO`** overrides **`.magicborn/cli-session.json`**. */
export function isAcceptEditsAutoEnvLocked(): boolean {
  return parseEnvAcceptEditsAuto() !== undefined;
}

/** File contents only (no env). Used when merging writes. */
export function readCliSessionFile(repoRoot: string): CliSessionV1 {
  const p = path.join(repoRoot, CLI_SESSION_REL_PATH);
  try {
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw) as unknown;
    if (typeof j !== 'object' || j === null) {
      return {};
    }
    const o = j as Record<string, unknown>;
    const acceptEditsAuto = typeof o.acceptEditsAuto === 'boolean' ? o.acceptEditsAuto : undefined;
    return {
      version: 1,
      acceptEditsAuto,
      chatModel: parseChatModelField(o.chatModel),
      ragMode: parseRagModeField(o.ragMode),
    };
  } catch {
    return {};
  }
}

/**
 * Effective session for UI: **`MAGICBORN_ACCEPT_EDITS_AUTO`** wins over the file when set.
 * Other file fields (`chatModel`, `ragMode`, …) are preserved.
 */
export function readCliSession(repoRoot: string): CliSessionV1 {
  const file = readCliSessionFile(repoRoot);
  const fromEnv = parseEnvAcceptEditsAuto();
  if (fromEnv !== undefined) {
    return { ...file, version: 1, acceptEditsAuto: fromEnv };
  }
  return { ...file, version: 1 };
}

/** Merge into **`.magicborn/cli-session.json`** (creates dirs). Returns **`readCliSession(repoRoot)`** after write (env still wins). */
export function writeCliSessionMerge(repoRoot: string, patch: Partial<CliSessionV1>): CliSessionV1 {
  const base = readCliSessionFile(repoRoot);
  const next: CliSessionV1 = {
    version: 1,
    ...base,
    ...patch,
  };
  if ('ragMode' in patch && patch.ragMode === undefined) {
    delete next.ragMode;
  }
  if ('chatModel' in patch && patch.chatModel === undefined) {
    delete next.chatModel;
  }
  const dir = path.join(repoRoot, '.magicborn');
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(repoRoot, CLI_SESSION_REL_PATH);
  fs.writeFileSync(p, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return readCliSession(repoRoot);
}

export function toggleAcceptEditsAuto(repoRoot: string, current: boolean): CliSessionV1 {
  return writeCliSessionMerge(repoRoot, { acceptEditsAuto: !current });
}
