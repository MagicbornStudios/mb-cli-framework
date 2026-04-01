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

Server-side chat (on the portfolio app) still needs `OPENAI_API_KEY`, optional `SITE_CHAT_RAG`, etc.—see that app’s `.env.example`.

## Terminal chat vs web Site Copilot

| | **This package (`renderOperatorChat`)** | **Portfolio `SiteCopilot.tsx`** |
| --- | --- | --- |
| UI | Ink + `@assistant-ui/react-ink` | Browser + `@assistant-ui/react` + `react-ui` |
| Backend | HTTP `POST` to configurable `/api/chat` | Same `/api/chat` route |
| RAG | Returned as text footnote (hit titles) in the assistant message | Rich **source cards** (`SiteCopilotSources`) |
| Media / cover flows | Not wired (no `/api/media/generate` from CLI) | **Cover context** + `fetch('/api/media/generate', { credentials })` |
| DevTools | No | Optional `DevToolsFrame` in development |

So the **CLI uses the same RAG + chat pipeline on the server** as the site; the **extra** portfolio pieces are web-only UX (sources panel, image generation in-thread, devtools).

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
await renderOperatorChat({ chatApiUrl: url });
```

`createPortfolioSiteChatAdapter` is available if you build a custom Ink shell but want the same `ThreadMessage` → `POST /api/chat` mapping.

## Chat request contract

Request body: `{ messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> }`  
Success response: `{ text: string, hits?: [...], query?: string, model?: string }` — aligned with `apps/portfolio/lib/site-chat.ts` and `app/api/chat/route.ts`.

## Build

```bash
pnpm exec tsc -p tsconfig.json
```
