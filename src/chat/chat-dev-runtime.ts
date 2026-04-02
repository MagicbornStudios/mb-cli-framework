import fs from 'node:fs';
import path from 'node:path';

/** Under monorepo root; gitignored via `.magicborn/` in portfolio. */
export const CHAT_DEV_RUNTIME_DIR = '.magicborn';
export const CHAT_DEV_RUNTIME_FILE = 'chat-dev.json';

export type PortfolioChatDevRuntimeV1 = {
  version: 1;
  baseUrl: string;
  port: number;
  chatApiUrl: string;
  /** PID of the `pnpm` process started by magicborn chat --dev (if any). */
  pnpmPid?: number;
  updatedAt: string;
};

export function monorepoRootFromCwd(start = process.cwd()): string | undefined {
  let dir = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

export function chatDevRuntimePath(repoRoot: string): string {
  return path.join(repoRoot, CHAT_DEV_RUNTIME_DIR, CHAT_DEV_RUNTIME_FILE);
}

export function readPortfolioChatDevRuntime(start = process.cwd()): PortfolioChatDevRuntimeV1 | null {
  const root = monorepoRootFromCwd(start);
  if (!root) {
    return null;
  }
  const file = chatDevRuntimePath(root);
  if (!fs.existsSync(file)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const j = JSON.parse(raw) as Partial<PortfolioChatDevRuntimeV1>;
    if (j.version !== 1 || typeof j.chatApiUrl !== 'string' || !j.chatApiUrl.trim()) {
      return null;
    }
    return j as PortfolioChatDevRuntimeV1;
  } catch {
    return null;
  }
}

export function writePortfolioChatDevRuntime(
  repoRoot: string,
  params: { port: number; baseUrl: string; chatApiUrl: string; pnpmPid?: number },
): void {
  const dir = path.join(repoRoot, CHAT_DEV_RUNTIME_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const payload: PortfolioChatDevRuntimeV1 = {
    version: 1,
    baseUrl: params.baseUrl.replace(/\/$/, ''),
    port: params.port,
    chatApiUrl: params.chatApiUrl.replace(/\/$/, ''),
    pnpmPid: params.pnpmPid,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(chatDevRuntimePath(repoRoot), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

export function clearPortfolioChatDevRuntime(repoRoot: string): void {
  try {
    fs.unlinkSync(chatDevRuntimePath(repoRoot));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }
    /* best-effort cleanup */
  }
}
