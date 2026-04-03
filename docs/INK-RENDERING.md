# Ink rendering — Claude Code–style partial updates

## Goals

- **Transcript / history** should not **blink** when an unrelated region updates (timers, spinners, “thinking…”, context meter).
- Ink **reconciles** the React tree like the DOM: only components whose **props/state** change should redraw.

## Practices

1. **Isolate volatile state** in **small subtrees** — e.g. put `CliActivityLine` (elapsed seconds) **next to** the transcript column, **not** as a parent that wraps both transcript and input.
2. **Stable list keys** — transcript rows should use stable ids (message id or monotonic id), not array index, when items can be prepended.
3. **`React.memo`** on pure row components if profiling shows unnecessary parent-driven rerenders.
4. **`useMemo`** for derived strings (markdown, joined text) when the parent re-renders often — not always needed; measure first.
5. **assistant-ui**: keep **`ThreadPrimitive.Messages`** as the scroll/history boundary; add **footer / activity** as **siblings** under the same column `Box`, not wrapping `ThreadPrimitive.Root`. **`OperatorChatApp`** uses **`useThreadIsRunning()`** from `@assistant-ui/core/react` and renders **`CliActivityLine`** between the message list and the composer (timer subtree only).

## Layout contract

See **`TuiVerticalSlot`** and **`defaultTuiLayoutBlueprint`** in `src/ink/tui-layout-contract.ts`. Typical order:

`banner` → `transcript` → `activity` → `panel` → `composer` → `footer`.

## Context meter

**`CliContextMeter`** is a **visual** estimate only. Accurate token counts require the **model tokenizer** server-side; the CLI may use **rough** heuristics (chars/4) for UX until **`global-tooling-04-05`** wires real counts.

## Interrupt

While **`thread.isRunning`**, **Ctrl+C** in **`OperatorChatApp`** calls **`AssistantRuntime.thread.cancelRun()`**, which aborts the in-flight **`fetch`** (same **`abortSignal`** path as timeout). When the thread is **not** running, **Ctrl+C** exits the Ink app (**Esc** always exits).

**Ctrl+E** (when **`repoRoot`** is passed and **`MAGICBORN_ACCEPT_EDITS_AUTO`** is unset) toggles **`acceptEditsAuto`** in **`.magicborn/cli-session.json`** and updates the second footer row.
