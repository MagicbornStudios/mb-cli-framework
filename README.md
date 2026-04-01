# mb-cli-framework

Shared **completion**, **vendor scope** (`use` / `clear`), and future **command-discovery** helpers for Magicborn CLIs (`magicborn`, `grimetime`, …).

## Consumers

- **custom_portfolio** — `@magicborn/cli` (vendored under `vendor/mb-cli-framework`)
- **grime_time_site** — add the same submodule path and depend on `@magicborn/mb-cli-framework`

## Contract

- TypeScript package **`@magicborn/mb-cli-framework`**
- Respects **`NO_COLOR`** / **`FORCE_COLOR`** at call sites (this library stays string-oriented for bash `compgen` compatibility; ANSI is optional in shell glue)

## Plan

Host monorepo docs: `apps/portfolio/content/docs/global/planning/plans/mb-cli-framework/PLAN.mdx` (task phase **`global-tooling-02`**).