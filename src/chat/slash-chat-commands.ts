import type { CliSessionV1 } from './cli-session.js';
import type { SiteChatRagMode } from './portfolio-site-chat-types.js';

export type ParsedSlashChat =
  | { kind: 'model'; args: string[] }
  | { kind: 'rag'; sub: 'off' | 'cycle' };

/** Order after `undefined` (follow env): off → narrowing modes → back to env. */
const RAG_CYCLE: Array<SiteChatRagMode | undefined> = [
  'off',
  'books',
  'books_planning',
  'books_planning_repo',
  undefined,
];

export function parseSlashChatLine(line: string): ParsedSlashChat | null {
  const t = line.trim();
  if (!t.startsWith('/')) return null;
  const parts = t
    .slice(1)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  const cmd = parts[0]!.toLowerCase();
  if (cmd === 'model') {
    return { kind: 'model', args: parts.slice(1) };
  }
  if (cmd === 'rag' || cmd === 'index') {
    const sub = parts[1]?.toLowerCase();
    if (sub === 'off') return { kind: 'rag', sub: 'off' };
    return { kind: 'rag', sub: 'cycle' };
  }
  return null;
}

export function formatRagModeLabel(mode: SiteChatRagMode | undefined): string {
  if (mode === undefined) return 'env (SITE_CHAT_RAG)';
  if (mode === 'off') return 'off';
  if (mode === 'books') return 'books';
  if (mode === 'books_planning') return 'books_planning';
  return 'books_planning_repo';
}

export function cycleRagMode(stored: SiteChatRagMode | undefined): SiteChatRagMode | undefined {
  const idx = RAG_CYCLE.indexOf(stored);
  const nextIdx = (idx < 0 ? 0 : idx + 1) % RAG_CYCLE.length;
  return RAG_CYCLE[nextIdx];
}

const MODEL_ID_RE = /^[a-zA-Z0-9._-]{1,128}$/;

export function isValidChatModelId(id: string): boolean {
  return MODEL_ID_RE.test(id.trim());
}

export async function fetchOpenAiChatModelIds(): Promise<string[]> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return [];
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return [];
  const data = (await res.json().catch(() => null)) as { data?: Array<{ id?: string }> } | null;
  const ids = (data?.data ?? [])
    .map((m) => m.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
  return ids
    .filter(
      (id) =>
        /gpt-|o1|o3|gpt-4o|chatgpt-4o/i.test(id) || (id.includes('gpt') && !id.includes('embedding')),
    )
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Handles `/model`, `/rag`, `/index` in the chat composer (local session + assistant reply).
 * Returns `null` when the line is not a recognized slash command.
 */
export async function handleSlashChatLine(input: {
  userLine: string;
  getSession: () => CliSessionV1;
  persistSession: (patch: Partial<CliSessionV1>) => void;
  fetchModels?: () => Promise<string[]>;
}): Promise<{ assistantText: string } | null> {
  const parsed = parseSlashChatLine(input.userLine);
  if (!parsed) return null;

  const fetchModels = input.fetchModels ?? fetchOpenAiChatModelIds;

  if (parsed.kind === 'model') {
    if (parsed.args.length >= 1) {
      const id = parsed.args.join(' ').trim();
      if (!isValidChatModelId(id)) {
        return {
          assistantText: '└ Invalid model id. Use letters, digits, dots, dashes, underscores (e.g. gpt-4o-mini).',
        };
      }
      input.persistSession({ chatModel: id });
      return { assistantText: `└ Model set to ${id} (saved in session).` };
    }
    const models = await fetchModels();
    if (!models.length) {
      return {
        assistantText:
          '└ OPENAI_API_KEY missing or models list empty. Set a model with: /model gpt-4o-mini',
      };
    }
    const preview = models.slice(0, 24).join(', ');
    return {
      assistantText: `└ Chat-capable models (sample): ${preview}${models.length > 24 ? ' …' : ''}\n  Set: /model <id>`,
    };
  }

  if (parsed.kind === 'rag') {
    if (parsed.sub === 'off') {
      input.persistSession({ ragMode: 'off' });
      return { assistantText: `└ RAG: off (no retrieval this session).` };
    }
    const cur = input.getSession().ragMode;
    const next = cycleRagMode(cur);
    if (next === undefined) {
      input.persistSession({ ragMode: undefined });
    } else {
      input.persistSession({ ragMode: next });
    }
    return { assistantText: `└ RAG mode: ${formatRagModeLabel(next)}` };
  }

  return null;
}
