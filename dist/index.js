/**
 * mb-cli-framework — shared helpers for Magicborn CLIs.
 * See: host monorepo `apps/portfolio/content/docs/global/planning/plans/mb-cli-framework/PLAN.mdx`
 */
export { isMagicbornPlainMode, shouldOfferMagicbornTui } from './cli-mode.js';
export { defaultCliTheme, resolveCliTheme } from './cli-theme.js';
export { resolvePortfolioChatApiUrl } from './chat/resolve-portfolio-chat-url.js';
export { createPortfolioSiteChatAdapter } from './chat/create-portfolio-site-chat-adapter.js';
export { renderOperatorChat } from './chat/run-operator-chat.js';
export { OperatorChatApp } from './chat/OperatorChatApp.js';
/** Suffix legend for plain-text completions (bash-safe). */
export const VENDOR_COMPLETION_LEGEND = '(cli)=controllable vendor bin exists; plain=id only';
/** `NO_COLOR` wins; `FORCE_COLOR` forces; else TTY. */
export function shouldEmitAnsiForCompletion() {
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
export function formatVendorCompletionToken(row, options) {
    if (!row.controllable) {
        return row.id;
    }
    const useAnsi = options?.ansi ?? shouldEmitAnsiForCompletion();
    if (useAnsi) {
        return `${row.id}${ansi.green}(cli)${ansi.reset}`;
    }
    return `${row.id}(cli)`;
}
