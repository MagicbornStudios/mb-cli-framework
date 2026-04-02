/**
 * Resolve the portfolio Site Copilot chat endpoint for terminal clients.
 * Same route the web UI uses: `POST /api/chat` with `{ messages }`.
 *
 * Precedence: `MAGICBORN_CHAT_URL` → `MAGICBORN_CHAT_BASE_URL` → `.magicborn/chat-dev.json`
 * (written while `magicborn chat --dev` is running) → default `http://127.0.0.1:3000`.
 */
export declare function resolvePortfolioChatApiUrl(cwd?: string): string;
