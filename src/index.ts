/**
 * mb-cli-framework — shared helpers for Magicborn CLIs.
 * See: host monorepo `apps/portfolio/content/docs/global/planning/plans/mb-cli-framework/PLAN.mdx`
 */

export { TableFormatter, type TableFormat, type TableFormatterOptions } from './table/TableFormatter.js';
export { JsonEmitter, type JsonEmitterOptions, type JsonEnvelope } from './table/JsonEmitter.js';

export {
  buildCmdCdExecLine,
  buildMsysBashCdExecScript,
  runExternalCliViaCmdCdExec,
  runExternalCliViaMsysBashCdExec,
  shouldUseMsysBashExecWrapper,
} from './platform/run-external-cli-msys.js';

export { isMagicbornPlainMode, shouldOfferMagicbornTui } from './cli-mode.js';
export { defaultCliTheme, resolveCliTheme, type CliTheme } from './cli-theme.js';

export {
  CHAT_DEV_RUNTIME_DIR,
  CHAT_DEV_RUNTIME_FILE,
  chatDevRuntimePath,
  clearPortfolioChatDevRuntime,
  monorepoRootFromCwd,
  readPortfolioChatDevRuntime,
  writePortfolioChatDevRuntime,
} from './chat/chat-dev-runtime.js';
export type { PortfolioChatDevRuntimeV1 } from './chat/chat-dev-runtime.js';
export { resolvePortfolioChatApiUrl } from './chat/resolve-portfolio-chat-url.js';
export { createPortfolioSiteChatAdapter } from './chat/create-portfolio-site-chat-adapter.js';
export type { PortfolioSiteChatAdapterOptions } from './chat/create-portfolio-site-chat-adapter.js';
export {
  approxCharsFromThreadMessages,
  approxContextPctFromChars,
} from './chat/thread-context-estimate.js';
export {
  CLI_SESSION_REL_PATH,
  readCliSession,
  readCliSessionFile,
  writeCliSessionMerge,
  toggleAcceptEditsAuto,
  isAcceptEditsAutoEnvLocked,
} from './chat/cli-session.js';
export type { CliSessionV1 } from './chat/cli-session.js';
export type {
  CopilotFormDescriptor,
  CopilotFormFieldDescriptor,
  CopilotFormFieldKind,
  SiteChatApiHit,
  SiteChatApiResponse,
  SiteChatClientMetadata,
  SiteChatConversationMessage,
  SiteChatRagMode,
} from './chat/portfolio-site-chat-types.js';
export { CliCopilotFormPanel } from './chat/CliCopilotFormPanel.js';
export {
  parseSlashChatLine,
  formatRagModeLabel,
  cycleRagMode,
  handleSlashChatLine,
  fetchOpenAiChatModelIds,
  isValidChatModelId,
} from './chat/slash-chat-commands.js';
export { renderOperatorChat } from './chat/run-operator-chat.js';
export { OperatorChatApp } from './chat/OperatorChatApp.js';

export {
  defaultTuiLayoutBlueprint,
  type TuiLayoutBlueprint,
  type TuiVerticalSlot,
} from './ink/tui-layout-contract.js';
export { CliScreenBanner, type CliScreenBannerProps } from './ink/CliScreenBanner.js';
export { CliFooterSlotRow, type CliFooterSlotRowProps } from './ink/CliFooterSlotRow.js';
export { CliActivityLine, type CliActivityLineProps } from './ink/CliActivityLine.js';
export { CliContextMeter, type CliContextMeterProps } from './ink/CliContextMeter.js';

/** Suffix legend for plain-text completions (bash-safe). */
export const VENDOR_COMPLETION_LEGEND = '(cli)=controllable vendor bin exists; plain=id only';

export type VendorCompletionRow = {
  id: string;
  /** When true, vendor bin exists on disk (parent CLI can forward). */
  controllable: boolean;
};

/** `NO_COLOR` wins; `FORCE_COLOR` forces; else TTY. */
export function shouldEmitAnsiForCompletion(): boolean {
  if (process.env.NO_COLOR != null && process.env.NO_COLOR !== '') {
    return false;
  }
  if (process.env.FORCE_COLOR != null && process.env.FORCE_COLOR !== '0') {
    return true;
  }
  return Boolean(process.stdout?.isTTY);
}

const ansi = {
  green: '\u001b[32m',
  dim: '\u001b[2m',
  reset: '\u001b[0m',
};

/** One compgen word: `id` or `id(cli)`; optional green `(cli)` when ANSI allowed. */
export function formatVendorCompletionToken(
  row: VendorCompletionRow,
  options?: { ansi?: boolean },
): string {
  if (!row.controllable) {
    return row.id;
  }
  const useAnsi = options?.ansi ?? shouldEmitAnsiForCompletion();
  if (useAnsi) {
    return `${row.id}${ansi.green}(cli)${ansi.reset}`;
  }
  return `${row.id}(cli)`;
}
