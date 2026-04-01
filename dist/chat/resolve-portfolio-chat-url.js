/**
 * Resolve the portfolio Site Copilot chat endpoint for terminal clients.
 * Same route the web UI uses: `POST /api/chat` with `{ messages }`.
 */
export function resolvePortfolioChatApiUrl() {
    const explicit = process.env.MAGICBORN_CHAT_URL?.trim();
    if (explicit) {
        return explicit.replace(/\/$/, '');
    }
    const base = process.env.MAGICBORN_CHAT_BASE_URL?.trim() || 'http://127.0.0.1:3000';
    return `${base.replace(/\/$/, '')}/api/chat`;
}
