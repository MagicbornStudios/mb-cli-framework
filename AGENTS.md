# Agent guide — mb-cli-framework

This project is managed under the **GAD framework**. Use `gad` CLI for all planning context.

## Context re-hydration

```sh
gad state --projectid mb-cli-framework
gad tasks --projectid mb-cli-framework
gad decisions --projectid mb-cli-framework
```

Or full snapshot:
```sh
gad snapshot --projectid mb-cli-framework
```

## Planning loop

1. `gad state --projectid mb-cli-framework` — read current phase and next action
2. Pick one planned task from `gad tasks --projectid mb-cli-framework`
3. Implement it
4. Update `.planning/TASK-REGISTRY.xml` — mark task done
5. Update `.planning/STATE.xml` — update next-action
6. `gad sink sync` — propagate to docs sink
7. Commit

## Planning files

| File | Purpose |
|------|---------|
| `.planning/STATE.xml` | Current phase, milestone, status, next-action |
| `.planning/ROADMAP.xml` | Phase breakdown |
| `.planning/TASK-REGISTRY.xml` | All tasks by phase with status |
| `.planning/DECISIONS.xml` | Architectural decisions |

## Docs sink

Planning docs compile to: `apps/portfolio/content/docs/mb-cli-framework/planning/`

```sh
gad sink sync                                  # compile all projects
gad sink status --projectid mb-cli-framework   # check sync state
```
