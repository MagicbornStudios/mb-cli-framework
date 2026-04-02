import type { ChatModelAdapter } from '@assistant-ui/react-ink';
export type PortfolioSiteChatAdapterOptions = {
    chatApiUrl: string;
    fetchImpl?: typeof fetch;
    /** Request timeout in ms. Falls back to `MAGICBORN_CHAT_TIMEOUT_MS` or 18_000. */
    fetchTimeoutMs?: number;
};
/**
 * `ChatModelAdapter` that talks to a Next (or compatible) app implementing
 * `POST /api/chat` like the portfolio Site Copilot route (`app/api/chat/route.ts`).
 */
export declare function createPortfolioSiteChatAdapter(options: PortfolioSiteChatAdapterOptions): ChatModelAdapter;
