import React, { useMemo } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  useLocalRuntime,
} from '@assistant-ui/react-ink';
import { MarkdownText } from '@assistant-ui/react-ink-markdown';
import { createPortfolioSiteChatAdapter } from './create-portfolio-site-chat-adapter.js';
import { resolveCliTheme } from '../cli-theme.js';

function joinThreadText(content: readonly { type?: string; text?: string }[]): string {
  return content
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('')
    .trim();
}

function InkThreadMessage() {
  const theme = resolveCliTheme();
  const role = useAuiState((s) => s.message.role);
  const content = useAuiState((s) => s.message.content);
  const text = joinThreadText(content as { type?: string; text?: string }[]);
  const isUser = role === 'user';

  if (isUser) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color={theme.vendor}>
          You
        </Text>
        <Text wrap="wrap">{text}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={theme.openai}>
        Assistant
      </Text>
      <MarkdownText text={text || '…'} />
    </Box>
  );
}

function QuitListener() {
  const { exit } = useApp();
  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === 'c')) {
      exit();
    }
  });
  return null;
}

export function OperatorChatApp(props: { chatApiUrl: string }) {
  const theme = resolveCliTheme();
  const chatModel = useMemo(
    () => createPortfolioSiteChatAdapter({ chatApiUrl: props.chatApiUrl }),
    [props.chatApiUrl],
  );
  const runtime = useLocalRuntime(chatModel, {});
  const cols = Math.max(60, Math.min(100, process.stdout.columns ?? 80));

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <QuitListener />
      <Box flexDirection="column" width={cols}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={theme.primary}>
            Site chat
          </Text>
          <Text color={theme.muted}>Portfolio /api/chat (RAG + model on server)</Text>
          <Text color={theme.description}>{props.chatApiUrl}</Text>
          <Text color={theme.muted}>Esc · Ctrl+C quit</Text>
        </Box>
        <ThreadPrimitive.Root flexDirection="column" flexGrow={1}>
          <ThreadPrimitive.Empty>
            <Box marginBottom={1} flexDirection="column">
              <Text color={theme.muted}>
                Messages appear above once you send. The portfolio app must be running (default{' '}
                <Text color={theme.description}>http://127.0.0.1:3000</Text>
                ) unless you set MAGICBORN_CHAT_BASE_URL or MAGICBORN_CHAT_URL.
              </Text>
            </Box>
          </ThreadPrimitive.Empty>
          <Box flexDirection="column" marginBottom={1} minHeight={1}>
            <ThreadPrimitive.Messages>{() => <InkThreadMessage />}</ThreadPrimitive.Messages>
          </Box>
          <Box borderStyle="round" borderColor={theme.border} paddingX={1} marginTop={1}>
            <ComposerPrimitive.Input submitOnEnter placeholder="Message…" autoFocus />
          </Box>
        </ThreadPrimitive.Root>
      </Box>
    </AssistantRuntimeProvider>
  );
}
