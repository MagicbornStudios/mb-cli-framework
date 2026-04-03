import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useThreadIsRunning, useThreadMessages } from '@assistant-ui/core/react';
import { CliActivityLine } from '../ink/CliActivityLine.js';
import { CliContextMeter } from '../ink/CliContextMeter.js';
import { CliFooterSlotRow } from '../ink/CliFooterSlotRow.js';
import { CliScreenBanner } from '../ink/CliScreenBanner.js';
import { AssistantRuntimeProvider, ComposerPrimitive, ThreadPrimitive, useAuiState, useLocalRuntime, } from '@assistant-ui/react-ink';
import { MarkdownText } from '@assistant-ui/react-ink-markdown';
import { createPortfolioSiteChatAdapter } from './create-portfolio-site-chat-adapter.js';
import { CliCopilotFormPanel } from './CliCopilotFormPanel.js';
import { isAcceptEditsAutoEnvLocked, readCliSession, toggleAcceptEditsAuto, writeCliSessionMerge, } from './cli-session.js';
import { formatRagModeLabel } from './slash-chat-commands.js';
import { approxCharsFromThreadMessages, approxContextPctFromChars } from './thread-context-estimate.js';
import { resolveCliTheme } from '../cli-theme.js';
function chatFooterHost(chatApiUrl) {
    try {
        return new URL(chatApiUrl).host;
    }
    catch {
        return '—';
    }
}
function joinThreadText(content) {
    return content
        .filter((p) => p.type === 'text' && typeof p.text === 'string')
        .map((p) => p.text)
        .join('')
        .trim();
}
function InkThreadMessage() {
    const theme = resolveCliTheme();
    const role = useAuiState((s) => s.message.role);
    const content = useAuiState((s) => s.message.content);
    const text = joinThreadText(content);
    const isUser = role === 'user';
    if (isUser) {
        return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { bold: true, color: theme.vendor, children: "You" }), _jsx(Text, { wrap: "wrap", children: text })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { bold: true, color: theme.openai, children: "Assistant" }), _jsx(MarkdownText, { text: text || '…' })] }));
}
/**
 * Esc always exits. Ctrl+C aborts an in-flight model request (`runtime.thread.cancelRun` → fetch
 * `AbortSignal`) when `thread.isRunning`; otherwise exits — see **`global-tooling-04-04`**.
 * Ctrl+E toggles **`.magicborn/cli-session.json`** when **`repoRoot`** is set and env does not lock.
 */
function ChatKeyboardControls(props) {
    const { exit } = useApp();
    const isRunning = useThreadIsRunning();
    useInput((input, key) => {
        if (key.escape) {
            exit();
            return;
        }
        if (key.ctrl && input === 'c') {
            if (isRunning) {
                props.runtime.thread.cancelRun();
                return;
            }
            exit();
            return;
        }
        if (key.ctrl && input === 'e') {
            if (props.repoRoot && !isAcceptEditsAutoEnvLocked()) {
                props.onToggleAcceptEdits?.();
            }
        }
    });
    return null;
}
/** Subscribes to `thread.isRunning` — keep outside `ThreadPrimitive.Messages` so the timer does not redraw history. */
function ThreadActivityLine() {
    const theme = resolveCliTheme();
    const isRunning = useThreadIsRunning();
    if (!isRunning) {
        return null;
    }
    return (_jsx(Box, { marginBottom: 1, children: _jsx(CliActivityLine, { theme: theme, label: "Thinking", showElapsed: true }) }));
}
function ThreadContextFooterRow(props) {
    const theme = resolveCliTheme();
    const messages = useThreadMessages();
    const usedPct = useMemo(() => approxContextPctFromChars(approxCharsFromThreadMessages(messages)), [messages]);
    const modeLabel = props.acceptEditsAuto ? 'auto' : 'confirm';
    const suffix = props.envLocked ? ' (env)' : '';
    return (_jsxs(Box, { flexDirection: "row", width: props.cols, justifyContent: "space-between", marginTop: 0, children: [_jsx(CliContextMeter, { theme: theme, width: Math.max(40, props.cols - 36), usedPct: usedPct }), _jsxs(Text, { color: theme.description, dimColor: true, children: ["\u00BB accept edits \u00B7 ", modeLabel, suffix] })] }));
}
export function OperatorChatApp(props) {
    const theme = resolveCliTheme();
    const [session, setSession] = useState(() => props.repoRoot ? readCliSession(props.repoRoot) : { acceptEditsAuto: false });
    const sessionRef = useRef(session);
    sessionRef.current = session;
    const acceptEditsAuto = session.acceptEditsAuto === true;
    const envLocked = isAcceptEditsAutoEnvLocked();
    const persistSession = useCallback((patch) => {
        if (props.repoRoot) {
            setSession(writeCliSessionMerge(props.repoRoot, patch));
        }
        else {
            setSession((prev) => {
                const next = { ...prev, ...patch };
                if ('ragMode' in patch && patch.ragMode === undefined) {
                    delete next.ragMode;
                }
                if ('chatModel' in patch && patch.chatModel === undefined) {
                    delete next.chatModel;
                }
                return next;
            });
        }
    }, [props.repoRoot]);
    const getSession = useCallback(() => sessionRef.current, []);
    const [copilotForm, setCopilotForm] = useState(undefined);
    const onChatResponse = useCallback((data) => {
        setCopilotForm(data.copilotForm);
    }, []);
    const chatModel = useMemo(() => createPortfolioSiteChatAdapter({
        chatApiUrl: props.chatApiUrl,
        client: { acceptEditsAuto, source: 'magicborn-cli' },
        getSession,
        persistSession,
        onChatResponse,
    }), [props.chatApiUrl, acceptEditsAuto, getSession, persistSession, onChatResponse]);
    const runtime = useLocalRuntime(chatModel, {});
    const cols = Math.max(60, Math.min(100, process.stdout.columns ?? 80));
    const footerModel = session.chatModel?.trim() || process.env.OPENAI_CHAT_MODEL?.trim() || 'server default';
    const footerRag = formatRagModeLabel(session.ragMode);
    const footerHost = chatFooterHost(props.chatApiUrl);
    const onToggleAcceptEdits = useCallback(() => {
        if (!props.repoRoot) {
            return;
        }
        setSession(toggleAcceptEditsAuto(props.repoRoot, acceptEditsAuto));
    }, [props.repoRoot, acceptEditsAuto]);
    const keyboardHints = props.repoRoot && !envLocked
        ? 'Esc quit · Ctrl+C cancel request or quit · Ctrl+E accept edits mode'
        : 'Esc quit · Ctrl+C cancel request or quit';
    return (_jsxs(AssistantRuntimeProvider, { runtime: runtime, children: [_jsx(ChatKeyboardControls, { runtime: runtime, repoRoot: props.repoRoot, onToggleAcceptEdits: onToggleAcceptEdits }), _jsxs(Box, { flexDirection: "column", width: cols, children: [_jsxs(CliScreenBanner, { theme: theme, width: cols, headline: _jsx(Text, { bold: true, color: theme.primary, children: "Site chat" }), children: [_jsx(Text, { color: theme.muted, children: "Portfolio /api/chat (RAG + model on server)" }), _jsx(Text, { color: theme.description, children: props.chatApiUrl }), _jsx(Text, { color: theme.muted, children: keyboardHints })] }), _jsxs(ThreadPrimitive.Root, { flexDirection: "column", flexGrow: 1, children: [_jsx(ThreadPrimitive.Empty, { children: _jsx(Box, { marginBottom: 1, flexDirection: "column", children: _jsxs(Text, { color: theme.muted, children: ["Messages appear above once you send. The portfolio app must be running (default", ' ', _jsx(Text, { color: theme.description, children: "http://127.0.0.1:3000" }), ") unless you set MAGICBORN_CHAT_BASE_URL or MAGICBORN_CHAT_URL."] }) }) }), _jsx(Box, { flexDirection: "column", marginBottom: 1, minHeight: 1, children: _jsx(ThreadPrimitive.Messages, { children: () => _jsx(InkThreadMessage, {}) }) }), _jsx(ThreadActivityLine, {}), copilotForm ? _jsx(CliCopilotFormPanel, { form: copilotForm, cols: cols }) : null, _jsx(Box, { borderStyle: "round", borderColor: theme.border, paddingX: 1, marginTop: 1, children: _jsx(ComposerPrimitive.Input, { submitOnEnter: true, placeholder: "Message\u2026", autoFocus: true }) })] }), _jsx(CliFooterSlotRow, { theme: theme, width: cols, slots: [
                            _jsx(Text, { color: theme.asset, children: "\u2191 /rag" }, "hint"),
                            _jsxs(Text, { color: theme.model, children: [footerModel, " \u00B7 ", footerRag] }, "model"),
                            _jsx(Text, { color: theme.muted, children: footerHost }, "host"),
                        ] }), _jsx(ThreadContextFooterRow, { cols: cols, acceptEditsAuto: acceptEditsAuto, envLocked: envLocked })] })] }));
}
