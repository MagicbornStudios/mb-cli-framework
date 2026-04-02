import fs from 'node:fs';
import path from 'node:path';
/** Under monorepo root; gitignored via `.magicborn/` in portfolio. */
export const CHAT_DEV_RUNTIME_DIR = '.magicborn';
export const CHAT_DEV_RUNTIME_FILE = 'chat-dev.json';
export function monorepoRootFromCwd(start = process.cwd()) {
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
export function chatDevRuntimePath(repoRoot) {
    return path.join(repoRoot, CHAT_DEV_RUNTIME_DIR, CHAT_DEV_RUNTIME_FILE);
}
export function readPortfolioChatDevRuntime(start = process.cwd()) {
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
        const j = JSON.parse(raw);
        if (j.version !== 1 || typeof j.chatApiUrl !== 'string' || !j.chatApiUrl.trim()) {
            return null;
        }
        return j;
    }
    catch {
        return null;
    }
}
export function writePortfolioChatDevRuntime(repoRoot, params) {
    const dir = path.join(repoRoot, CHAT_DEV_RUNTIME_DIR);
    fs.mkdirSync(dir, { recursive: true });
    const payload = {
        version: 1,
        baseUrl: params.baseUrl.replace(/\/$/, ''),
        port: params.port,
        chatApiUrl: params.chatApiUrl.replace(/\/$/, ''),
        pnpmPid: params.pnpmPid,
        updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(chatDevRuntimePath(repoRoot), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}
export function clearPortfolioChatDevRuntime(repoRoot) {
    try {
        fs.unlinkSync(chatDevRuntimePath(repoRoot));
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            return;
        }
        /* best-effort cleanup */
    }
}
