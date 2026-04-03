# @magicborn/mb-cli-framework

Shared helpers for **Magicborn operator CLIs** (`magicborn`, vendor CLIs, …): completion tokens, vendor scope, TTY/plain mode, CLI theme tokens, and an optional **terminal chat** built with [assistant-ui for Ink](https://www.assistant-ui.com/docs/ink).

## Install

This package is consumed as a workspace dependency from the monorepo. Published consumers should install matching peers:

- `react` ^19
- `ink` ^6

Runtime dependencies (bundled with the package): `@assistant-ui/react-ink`, `@assistant-ui/react-ink-markdown`.

## Environment

Copy `.env.example` into your shell or monorepo `.env` as needed. Variables are read from `process.env` when CLIs run.

| Variable | Purpose |
| --- | --- |
| `MAGICBORN_CHAT_BASE_URL` | Origin of the Next app; default `http://127.0.0.1:3000`. Chat client POSTs to `{origin}/api/chat`. |
| `MAGICBORN_CHAT_URL` | Full override for the chat endpoint (wins over base + `/api/chat`). |
| `MAGICBORN_PLAIN` | When `1` or `true`, skip Ink TUIs (home + chat). |
| `CI` | When set, TUIs are not offered (non-TTY behavior). |
| `MAGICBORN_ACCEPT_EDITS_AUTO` | Optional `0`/`1` / `true`/`false`: overrides **`.magicborn/cli-session.json`** for the **accept edits** footer (`confirm` vs `auto`). When set, **Ctrl+E** in **`OperatorChatApp`** does not change the visible mode (file may still update). |
| `MAGICBORN_CHAT_TIMEOUT_MS` | Chat `fetch` timeout (ms); default `18000`. |

Server-side chat (on the portfolio app) still needs `OPENAI_API_KEY`, optional `SITE_CHAT_RAG`, etc.—see that app’s `.env.example`.

### Session file (repo root)

**`.magicborn/cli-session.json`** (gitignored in this monorepo) stores operator UI prefs, e.g. `{ "version": 1, "acceptEditsAuto": false }`. **`readCliSession` / `writeCliSessionMerge` / `toggleAcceptEditsAuto`** manage it. **`magicborn chat`** passes **`repoRoot`** into **`renderOperatorChat`** so **Ctrl+E** can toggle when env does not lock the mode.

## Vendor CLI forward (`magicborn vendor <id> …`)

In the host monorepo, the nested vendor process gets:

1. The parent `process.env`.
2. `vendor/<id>/.env` parsed as simple `KEY=value` lines (no variable expansion), merged **on top** so vendor keys override the host on collision.
3. `MAGICBORN_VENDOR_ID` and `MAGICBORN_VENDOR_ROOT` set after that merge.

Merged env is never printed to the terminal.

## Terminal chat vs web Site Copilot

| | **This package (`renderOperatorChat`)** | **Portfolio `SiteCopilot.tsx`** |
| --- | --- | --- |
| UI | Ink + `@assistant-ui/react-ink` | Browser + `@assistant-ui/react` + `react-ui` |
| Backend | HTTP `POST` to configurable `/api/chat` | Same `/api/chat` route |
| RAG | Returned as text footnote (hit titles) in the assistant message | Rich **source cards** (`SiteCopilotSources`) |
| Media / cover flows | Not wired (no `/api/media/generate` from CLI) | **Cover context** + `fetch('/api/media/generate', { credentials })` |
| DevTools | No | Optional `DevToolsFrame` in development |

So the **CLI uses the same RAG + chat pipeline on the server** as the site; the **extra** portfolio pieces are web-only UX (sources panel, image generation in-thread, devtools).

## Ink layout primitives

See **[docs/INK-RENDERING.md](docs/INK-RENDERING.md)** for partial-update practices (where to put timers, context meter, and transcript boundaries).

| Export | Role |
| --- | --- |
| `TuiVerticalSlot` / `defaultTuiLayoutBlueprint` | Named regions (banner, transcript, activity, panel, composer, footer). |
| `CliScreenBanner` | Bordered header card (headline + children). |
| `CliFooterSlotRow` | Claude-style footer row: three slots separated by `\|`. |
| `CliActivityLine` | Optional elapsed timer (`Thinking · Ns`); render **outside** the transcript so only this subtree updates on the tick. **`renderOperatorChat` / `OperatorChatApp`** show this line while **`useThreadIsRunning()`** is true (active model stream). |
| `CliContextMeter` | `▓`/`░` bar + `%` — **approximate** context usage; host should pass model-accurate `usedPct` when available. |
| **`CliTheme`** (`resolveCliTheme`) | Tokens include **`slash`** (slash-command palette) and **`footerAccent`** (footer chrome); **`NO_COLOR`** / TTY behavior via **`cli-mode`** helpers. |
| `approxContextPctFromChars` / `approxCharsFromThreadMessages` | Heuristic for **`usedPct`** (chars÷4 vs 128k ref window; thread messages sum text / tool / capped binary). Used by **magicborn home** + **`OperatorChatApp`** second footer row. |

**`OperatorChatApp`** footer: row 1 = `↑ message` · model · API host; row 2 = context meter + **`» accept edits · confirm`** or **`auto`** (from **`.magicborn/cli-session.json`** or **`MAGICBORN_ACCEPT_EDITS_AUTO`**). **Keyboard:** Esc exits; **Ctrl+C** cancels an in-flight chat request when the thread is running, otherwise exits; **Ctrl+E** toggles accept-edits mode when **`repoRoot`** is passed and env does not lock the mode.

## API

```ts
import {
  resolvePortfolioChatApiUrl,
  renderOperatorChat,
  createPortfolioSiteChatAdapter,
  isMagicbornPlainMode,
  shouldOfferMagicbornTui,
  resolveCliTheme,
} from '@magicborn/mb-cli-framework';

const url = resolvePortfolioChatApiUrl();
await renderOperatorChat({ chatApiUrl: url, repoRoot: '/path/to/monorepo' });
```

`createPortfolioSiteChatAdapter` is available if you build a custom Ink shell but want the same `ThreadMessage` → `POST /api/chat` mapping.

## Chat request contract

Request body: `{ messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>; client?: { acceptEditsAuto?: boolean; source?: string } }` — **`client`** is optional (server may log; does not change model output today).  
Success response: `{ text: string, hits?: [...], query?: string, model?: string }` — aligned with `apps/portfolio/lib/site-chat.ts` and `app/api/chat/route.ts`.

## Build

```bash
pnpm exec tsc -p tsconfig.json
```
