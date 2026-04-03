import type { ChatModelAdapter, ThreadMessage } from '@assistant-ui/react-ink';
import type { SiteChatApiResponse, SiteChatConversationMessage, SiteChatRagMode } from './portfolio-site-chat-types.js';
import type { CliSessionV1 } from './cli-session.js';
import { handleSlashChatLine } from './slash-chat-commands.js';

const MAX_MESSAGES = 12;

function joinTextParts(content: readonly { type?: string; text?: string }[]): string {
  return content
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('')
    .trim();
}

function threadToSiteConversation(messages: readonly ThreadMessage[]): SiteChatConversationMessage[] {
  const out: SiteChatConversationMessage[] = [];
  for (const m of messages) {
    if (m.role !== 'user' && m.role !== 'assistant' && m.role !== 'system') {
      continue;
    }
    const text = joinTextParts(m.content as { type?: string; text?: string }[]);
    if (!text) {
      continue;
    }
    out.push({ role: m.role, content: text });
  }
  return out.slice(-MAX_MESSAGES);
}

function formatHitsFooter(hits: SiteChatApiResponse['hits']): string {
  if (!hits?.length) {
    return '';
  }
  const line = hits
    .slice(0, 5)
    .map((h) => h.title || h.publicUrl || h.heading || 'source')
    .filter(Boolean)
    .join(' · ');
  return `\n\n— ${hits.length} excerpt(s): ${line}`;
}

export type PortfolioSiteChatAdapterOptions = {
  chatApiUrl: string;
  fetchImpl?: typeof fetch;
  /** Request timeout in ms. Falls back to `MAGICBORN_CHAT_TIMEOUT_MS` or 18_000. */
  fetchTimeoutMs?: number;
  /** Sent as JSON `client` on the POST body for server logging / future policy. */
  client?: { acceptEditsAuto?: boolean; source?: string };
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

function resolveFetchTimeoutMs(explicit?: number): number {
  if (explicit !== undefined && Number.isFinite(explicit) && explicit > 0) {
    return explicit;
  }
  const raw = process.env.MAGICBORN_CHAT_TIMEOUT_MS?.trim();
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 18_000;
}

function abortSignalWithTimeout(signal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const t = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([t, signal]) : t;
}

/**
 * `ChatModelAdapter` that talks to a Next (or compatible) app implementing
 * `POST /api/chat` like the portfolio Site Copilot route (`app/api/chat/route.ts`).
 */
export function createPortfolioSiteChatAdapter(
  options: PortfolioSiteChatAdapterOptions,
): ChatModelAdapter {
  const fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const fetchTimeoutMs = resolveFetchTimeoutMs(options.fetchTimeoutMs);

  return {
    async *run({ messages, abortSignal }) {
      const conversation = threadToSiteConversation(messages);
      const lastUser = [...conversation].reverse().find((m) => m.role === 'user');
      if (!lastUser?.content.trim()) {
        yield {
          content: [{ type: 'text', text: 'Ask a question first.' }],
          status: { type: 'complete', reason: 'stop' },
        };
        return;
      }

      const signal = abortSignalWithTimeout(abortSignal, fetchTimeoutMs);

      if (options.getSession && options.persistSession) {
        const slash = await handleSlashChatLine({
          userLine: lastUser.content.trim(),
          getSession: options.getSession,
          persistSession: options.persistSession,
        });
        if (slash) {
          yield {
            content: [{ type: 'text', text: slash.assistantText }],
            status: { type: 'complete', reason: 'stop' },
          };
          return;
        }
      }

      let res: Response;
      try {
        const body: {
          messages: typeof conversation;
          client?: NonNullable<PortfolioSiteChatAdapterOptions['client']>;
          model?: string;
          ragMode?: SiteChatRagMode;
          enableCopilotTools?: boolean;
        } = {
          messages: conversation,
        };
        if (options.client && Object.keys(options.client).length > 0) {
          body.client = options.client;
        }
        const sess = options.getSession?.();
        const m = sess?.chatModel?.trim();
        if (m) {
          body.model = m;
        }
        if (sess?.ragMode !== undefined) {
          body.ragMode = sess.ragMode;
        }
        const enableCopilotTools =
          options.enableCopilotTools === true ||
          process.env.MAGICBORN_COPILOT_TOOLS?.trim().toLowerCase() === '1';
        if (enableCopilotTools) {
          body.enableCopilotTools = true;
        }
        const copilotBearer =
          options.copilotToolsBearer?.trim() || process.env.MAGICBORN_COPILOT_BEARER?.trim();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (copilotBearer) {
          headers.Authorization = `Bearer ${copilotBearer}`;
        }
        res = await fetchFn(options.chatApiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal,
        });
      } catch (e) {
        const isAbort = e instanceof Error && e.name === 'AbortError';
        const hint = isAbort
          ? `Request timed out after ${Math.round(fetchTimeoutMs / 1000)}s or was cancelled. Start the portfolio app (e.g. pnpm dev) or set MAGICBORN_CHAT_BASE_URL / MAGICBORN_CHAT_URL.`
          : `Could not reach ${options.chatApiUrl}. ${e instanceof Error ? e.message : String(e)}`;
        yield {
          content: [{ type: 'text', text: hint }],
          status: { type: 'complete', reason: 'stop' },
        };
        return;
      }

      const data = (await res.json().catch(() => null)) as SiteChatApiResponse | null;
      if (res.ok && data && options.onChatResponse) {
        options.onChatResponse(data);
      }
      if (!res.ok) {
        const msg =
          data && typeof data.message === 'string' && data.message.trim()
            ? data.message.trim()
            : `Chat request failed (${res.status}). Is the app running and OPENAI_API_KEY set on the server?`;
        yield {
          content: [{ type: 'text', text: msg }],
          status: { type: 'complete', reason: 'stop' },
        };
        return;
      }

      let text =
        (data?.text?.trim() && data.text) ||
        'I could not produce an answer from the current public-site context.';
      text += formatHitsFooter(data?.hits);

      yield {
        content: [{ type: 'text', text }],
        status: { type: 'complete', reason: 'stop' },
      };
    },
  };
}
