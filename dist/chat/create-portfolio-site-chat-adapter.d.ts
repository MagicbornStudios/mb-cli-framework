import type { ChatModelAdapter } from '@assistant-ui/react-ink';
export type PortfolioSiteChatAdapterOptions = {
    chatApiUrl: string;
    fetchImpl?: typeof fetch;
};
/**
 * `ChatModelAdapter` that talks to a Next (or compatible) app implementing
 * `POST /api/chat` like the portfolio Site Copilot route (`app/api/chat/route.ts`).
 */
export declare function createPortfolioSiteChatAdapter(options: PortfolioSiteChatAdapterOptions): ChatModelAdapter;
