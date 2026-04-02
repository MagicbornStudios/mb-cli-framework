/**
 * mb-cli-framework — shared helpers for Magicborn CLIs.
 * See: host monorepo `apps/portfolio/content/docs/global/planning/plans/mb-cli-framework/PLAN.mdx`
 */
export { isMagicbornPlainMode, shouldOfferMagicbornTui } from './cli-mode.js';
export { defaultCliTheme, resolveCliTheme, type CliTheme } from './cli-theme.js';
export { CHAT_DEV_RUNTIME_DIR, CHAT_DEV_RUNTIME_FILE, chatDevRuntimePath, clearPortfolioChatDevRuntime, monorepoRootFromCwd, readPortfolioChatDevRuntime, writePortfolioChatDevRuntime, } from './chat/chat-dev-runtime.js';
export type { PortfolioChatDevRuntimeV1 } from './chat/chat-dev-runtime.js';
export { resolvePortfolioChatApiUrl } from './chat/resolve-portfolio-chat-url.js';
export { createPortfolioSiteChatAdapter } from './chat/create-portfolio-site-chat-adapter.js';
export type { PortfolioSiteChatAdapterOptions } from './chat/create-portfolio-site-chat-adapter.js';
export type { SiteChatApiHit, SiteChatApiResponse, SiteChatConversationMessage, } from './chat/portfolio-site-chat-types.js';
export { renderOperatorChat } from './chat/run-operator-chat.js';
export { OperatorChatApp } from './chat/OperatorChatApp.js';
/** Suffix legend for plain-text completions (bash-safe). */
export declare const VENDOR_COMPLETION_LEGEND = "(cli)=controllable vendor bin exists; plain=id only";
export type VendorCompletionRow = {
    id: string;
    /** When true, vendor bin exists on disk (parent CLI can forward). */
    controllable: boolean;
};
/** `NO_COLOR` wins; `FORCE_COLOR` forces; else TTY. */
export declare function shouldEmitAnsiForCompletion(): boolean;
/** One compgen word: `id` or `id(cli)`; optional green `(cli)` when ANSI allowed. */
export declare function formatVendorCompletionToken(row: VendorCompletionRow, options?: {
    ansi?: boolean;
}): string;
