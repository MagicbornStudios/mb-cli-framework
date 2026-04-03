import type { AssistantRuntime } from '@assistant-ui/core';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useThreadIsRunning, useThreadMessages } from '@assistant-ui/core/react';
import { CliActivityLine } from '../ink/CliActivityLine.js';
import { CliContextMeter } from '../ink/CliContextMeter.js';
import { CliFooterSlotRow } from '../ink/CliFooterSlotRow.js';
import { CliScreenBanner } from '../ink/CliScreenBanner.js';
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
import { CliCopilotFormPanel } from './CliCopilotFormPanel.js';
import type { CopilotFormDescriptor, SiteChatApiResponse } from './portfolio-site-chat-types.js';
import {
  isAcceptEditsAutoEnvLocked,
  readCliSession,
  toggleAcceptEditsAuto,
  writeCliSessionMerge,
  type CliSessionV1,
} from './cli-session.js';
import { formatRagModeLabel } from './slash-chat-commands.js';
import { approxCharsFromThreadMessages, approxContextPctFromChars } from './thread-context-estimate.js';
import { resolveCliTheme } from '../cli-theme.js';

function chatFooterHost(chatApiUrl: string): string {
  try {
    return new URL(chatApiUrl).host;
  } catch {
    return '—';
  }
}

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

/**
 * Esc always exits. Ctrl+C aborts an in-flight model request (`runtime.thread.cancelRun` → fetch
 * `AbortSignal`) when `thread.isRunning`; otherwise exits — see **`global-tooling-04-04`**.
 * Ctrl+E toggles **`.magicborn/cli-session.json`** when **`repoRoot`** is set and env does not lock.
 */
function ChatKeyboardControls(props: {
  runtime: AssistantRuntime;
  repoRoot?: string;
  onToggleAcceptEdits?: () => void;
}) {
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
  return (
    <Box marginBottom={1}>
      <CliActivityLine theme={theme} label="Thinking" showElapsed />
    </Box>
  );
}

function ThreadContextFooterRow(props: {
  cols: number;
  acceptEditsAuto: boolean;
  envLocked: boolean;
}) {
  const theme = resolveCliTheme();
  const messages = useThreadMessages();
  const usedPct = useMemo(
    () => approxContextPctFromChars(approxCharsFromThreadMessages(messages)),
    [messages],
  );
  const modeLabel = props.acceptEditsAuto ? 'auto' : 'confirm';
  const suffix = props.envLocked ? ' (env)' : '';

  return (
    <Box flexDirection="row" width={props.cols} justifyContent="space-between" marginTop={0}>
      <CliContextMeter theme={theme} width={Math.max(40, props.cols - 36)} usedPct={usedPct} />
      <Text color={theme.description} dimColor>
        » accept edits · {modeLabel}
        {suffix}
      </Text>
    </Box>
  );
}

export function OperatorChatApp(props: { chatApiUrl: string; repoRoot?: string }) {
  const theme = resolveCliTheme();
  const [session, setSession] = useState<CliSessionV1>(() =>
    props.repoRoot ? readCliSession(props.repoRoot) : { acceptEditsAuto: false },
  );
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const acceptEditsAuto = session.acceptEditsAuto === true;
  const envLocked = isAcceptEditsAutoEnvLocked();

  const persistSession = useCallback(
    (patch: Partial<CliSessionV1>) => {
      if (props.repoRoot) {
        setSession(writeCliSessionMerge(props.repoRoot, patch));
      } else {
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
    },
    [props.repoRoot],
  );

  const getSession = useCallback(() => sessionRef.current, []);

  const [copilotForm, setCopilotForm] = useState<CopilotFormDescriptor | undefined>(undefined);
  const onChatResponse = useCallback((data: SiteChatApiResponse) => {
    setCopilotForm(data.copilotForm);
  }, []);

  const chatModel = useMemo(
    () =>
      createPortfolioSiteChatAdapter({
        chatApiUrl: props.chatApiUrl,
        client: { acceptEditsAuto, source: 'magicborn-cli' },
        getSession,
        persistSession,
        onChatResponse,
      }),
    [props.chatApiUrl, acceptEditsAuto, getSession, persistSession, onChatResponse],
  );
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

  const keyboardHints =
    props.repoRoot && !envLocked
      ? 'Esc quit · Ctrl+C cancel request or quit · Ctrl+E accept edits mode'
      : 'Esc quit · Ctrl+C cancel request or quit';

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatKeyboardControls
        runtime={runtime}
        repoRoot={props.repoRoot}
        onToggleAcceptEdits={onToggleAcceptEdits}
      />
      <Box flexDirection="column" width={cols}>
        <CliScreenBanner
          theme={theme}
          width={cols}
          headline={
            <Text bold color={theme.primary}>
              Site chat
            </Text>
          }
        >
          <Text color={theme.muted}>Portfolio /api/chat (RAG + model on server)</Text>
          <Text color={theme.description}>{props.chatApiUrl}</Text>
          <Text color={theme.muted}>{keyboardHints}</Text>
        </CliScreenBanner>
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
          <ThreadActivityLine />
          {copilotForm ? <CliCopilotFormPanel form={copilotForm} cols={cols} /> : null}
          <Box borderStyle="round" borderColor={theme.border} paddingX={1} marginTop={1}>
            <ComposerPrimitive.Input submitOnEnter placeholder="Message…" autoFocus />
          </Box>
        </ThreadPrimitive.Root>
        <CliFooterSlotRow
          theme={theme}
          width={cols}
          slots={[
            <Text key="hint" color={theme.asset}>
              ↑ /rag
            </Text>,
            <Text key="model" color={theme.model}>
              {footerModel} · {footerRag}
            </Text>,
            <Text key="host" color={theme.muted}>
              {footerHost}
            </Text>,
          ]}
        />
        <ThreadContextFooterRow cols={cols} acceptEditsAuto={acceptEditsAuto} envLocked={envLocked} />
      </Box>
    </AssistantRuntimeProvider>
  );
}
