import { readPortfolioChatDevRuntime } from './chat-dev-runtime.js';

/**
 * Resolve the portfolio Site Copilot chat endpoint for terminal clients.
 * Same route the web UI uses: `POST /api/chat` with `{ messages }`.
 *
 * Precedence: `MAGICBORN_CHAT_URL` → `MAGICBORN_CHAT_BASE_URL` → `.magicborn/chat-dev.json`
 * (written while `magicborn chat --dev` is running) → default `http://127.0.0.1:3000`.
 */
export function resolvePortfolioChatApiUrl(cwd?: string): string {
  const explicit = process.env.MAGICBORN_CHAT_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const envBase = process.env.MAGICBORN_CHAT_BASE_URL?.trim();
  if (envBase) {
    return `${envBase.replace(/\/$/, '')}/api/chat`;
  }
  const runtime = readPortfolioChatDevRuntime(cwd ?? process.cwd());
  if (runtime?.chatApiUrl) {
    return runtime.chatApiUrl.replace(/\/$/, '');
  }
  const base = 'http://127.0.0.1:3000';
  return `${base}/api/chat`;
}
