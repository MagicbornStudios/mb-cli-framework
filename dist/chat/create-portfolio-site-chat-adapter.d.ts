import type { ChatModelAdapter } from '@assistant-ui/react-ink';
import type { SiteChatApiResponse } from './portfolio-site-chat-types.js';
import type { CliSessionV1 } from './cli-session.js';
export type PortfolioSiteChatAdapterOptions = {
    chatApiUrl: string;
    fetchImpl?: typeof fetch;
    /** Request timeout in ms. Falls back to `MAGICBORN_CHAT_TIMEOUT_MS` or 18_000. */
    fetchTimeoutMs?: number;
    /** Sent as JSON `client` on the POST body for server logging / future policy. */
    client?: {
        acceptEditsAuto?: boolean;
        source?: string;
    };
    /** When set, `/model` and `/rag` update session and short-circuit before POST. */
    getSession?: () => CliSessionV1;
    persistSession?: (patch: Partial<CliSessionV1>) => void;
    /** When true, POST includes `enableCopilotTools` (server must authorize). Also set via `MAGICBORN_COPILOT_TOOLS=1`. */
    enableCopilotTools?: boolean;
    /** Bearer for `Authorization` when using Copilot tools (or set `MAGICBORN_COPILOT_BEARER`). */
    copilotToolsBearer?: string;
    /** Called after a successful JSON parse of `/api/chat` (before the assistant message is yielded). */
    onChatResponse?: (data: SiteChatApiResponse) => void;
};
/**
 * `ChatModelAdapter` that talks to a Next (or compatible) app implementing
 * `POST /api/chat` like the portfolio Site Copilot route (`app/api/chat/route.ts`).
 */
export declare function createPortfolioSiteChatAdapter(options: PortfolioSiteChatAdapterOptions): ChatModelAdapter;
