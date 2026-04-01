import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { AssistantRuntimeProvider, ComposerPrimitive, ThreadPrimitive, useAuiState, useLocalRuntime, } from '@assistant-ui/react-ink';
import { MarkdownText } from '@assistant-ui/react-ink-markdown';
import { createPortfolioSiteChatAdapter } from './create-portfolio-site-chat-adapter.js';
import { resolveCliTheme } from '../cli-theme.js';
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
function QuitListener() {
    const { exit } = useApp();
    useInput((input, key) => {
        if (input === 'q' || key.escape || (key.ctrl && input === 'c')) {
            exit();
        }
    });
    return null;
}
export function OperatorChatApp(props) {
    const theme = resolveCliTheme();
    const chatModel = useMemo(() => createPortfolioSiteChatAdapter({ chatApiUrl: props.chatApiUrl }), [props.chatApiUrl]);
    const runtime = useLocalRuntime(chatModel, {});
    const cols = Math.max(60, Math.min(100, process.stdout.columns ?? 80));
    return (_jsxs(AssistantRuntimeProvider, { runtime: runtime, children: [_jsx(QuitListener, {}), _jsxs(Box, { flexDirection: "column", width: cols, children: [_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { bold: true, color: theme.primary, children: "Site chat" }), _jsx(Text, { color: theme.muted, children: "Portfolio /api/chat (RAG + model on server)" }), _jsx(Text, { color: theme.description, children: props.chatApiUrl }), _jsx(Text, { color: theme.muted, children: "q \u00B7 Esc \u00B7 Ctrl+C quit" })] }), _jsxs(ThreadPrimitive.Root, { flexDirection: "column", children: [_jsx(ThreadPrimitive.Empty, { children: _jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: theme.muted, children: "Ask about public site content. Start the Next app if needed." }) }) }), _jsx(ThreadPrimitive.Messages, { children: () => _jsx(InkThreadMessage, {}) }), _jsx(Box, { borderStyle: "round", borderColor: theme.border, paddingX: 1, marginTop: 1, children: _jsx(ComposerPrimitive.Input, { submitOnEnter: true, placeholder: "Message\u2026", autoFocus: true }) })] })] })] }));
}
