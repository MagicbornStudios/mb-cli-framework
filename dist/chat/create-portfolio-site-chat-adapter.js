const MAX_MESSAGES = 12;
function joinTextParts(content) {
    return content
        .filter((p) => p.type === 'text' && typeof p.text === 'string')
        .map((p) => p.text)
        .join('')
        .trim();
}
function threadToSiteConversation(messages) {
    const out = [];
    for (const m of messages) {
        if (m.role !== 'user' && m.role !== 'assistant' && m.role !== 'system') {
            continue;
        }
        const text = joinTextParts(m.content);
        if (!text) {
            continue;
        }
        out.push({ role: m.role, content: text });
    }
    return out.slice(-MAX_MESSAGES);
}
function formatHitsFooter(hits) {
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
/**
 * `ChatModelAdapter` that talks to a Next (or compatible) app implementing
 * `POST /api/chat` like the portfolio Site Copilot route (`app/api/chat/route.ts`).
 */
export function createPortfolioSiteChatAdapter(options) {
    const fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
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
            const res = await fetchFn(options.chatApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversation }),
                signal: abortSignal,
            });
            const data = (await res.json().catch(() => null));
            if (!res.ok) {
                const msg = data && typeof data.message === 'string' && data.message.trim()
                    ? data.message.trim()
                    : `Chat request failed (${res.status}). Is the app running and OPENAI_API_KEY set on the server?`;
                yield {
                    content: [{ type: 'text', text: msg }],
                    status: { type: 'complete', reason: 'stop' },
                };
                return;
            }
            let text = (data?.text?.trim() && data.text) ||
                'I could not produce an answer from the current public-site context.';
            text += formatHitsFooter(data?.hits);
            yield {
                content: [{ type: 'text', text }],
                status: { type: 'complete', reason: 'stop' },
            };
        },
    };
}
