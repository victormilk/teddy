# External Integrations

**Analysis Date:** 2026-03-24

## APIs & External Services

**Claude Code Native Tools (Framework-level integration):**
- Agent tool — Spawn subagents and Agent Teams
  - Used in: `src/commands/apply.md`, `src/commands/map-codebase.md`, `src/commands/explore.md`
  - Auth: Relies on user's Claude Code session authentication
- TeamCreate / TeamDelete — Manage agent team lifecycle
  - Used in: `src/commands/apply.md` (create), `src/commands/unify.md` (delete)
- TaskCreate / TaskUpdate / TaskList — Shared task list management
  - Used in: `src/commands/apply.md`, `src/commands/status.md`
- SendMessage — Inter-teammate communication
  - Used in: `src/commands/unify.md` (shutdown_request)

**External Service Integration:**
- None — Teddy itself has zero external service dependencies

## Data Storage

**File-Based (primary):**
- `.teddy/` directory — Project state, plans, summaries, codebase analysis
  - Created by: `/teddy:init`
  - Schema: `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `phases/`, `codebase/`

- Claude Code installation directories:
  - Global: `~/.claude/commands/teddy/` — Command definitions
  - Global: `~/.claude/teddy-framework/` — Frameworks, templates, checklists, context
  - Local: `./.claude/commands/teddy/` — Project-scoped commands
  - Installation script: `bin/install.js`

- Git worktrees — Teammate isolation during APPLY phase
  - Created by Claude Code Agent with `isolation: "worktree"`
  - Merged during UNIFY, cleaned up via TeamDelete

**Shared Task Lists:**
- Managed by Claude Code at `~/.claude/tasks/{team-name}/`
- Not directly managed by Teddy code

## Authentication & Identity

- None — Teddy has no authentication mechanism
- Relies entirely on user's Claude Code session

## Monitoring & Observability

- None — No monitoring, logging, or observability integrations
- Audit trail via `SUMMARY.md` documents generated during UNIFY

## CI/CD & Deployment

**Distribution:**
- npm registry — `npx teddy-framework` for installation
- Version bumped manually in `package.json` (currently 0.3.0)
- GitHub repository: `https://github.com/victormilk/teddy.git`

**No CI Pipeline:**
- No GitHub Actions, no automated tests, no deployment automation

## Environment Configuration

**Development:**
- Required env vars: None (optional: `CLAUDE_CONFIG_DIR`)
- No secrets to manage

**Installation Flags:**
- `--global` — Install to `~/.claude/`
- `--local` — Install to `./.claude/`
- `--config-dir <path>` — Custom path override
- Reference: `bin/install.js` (lines 15-25)

## Webhooks & Callbacks

- None — Teddy does not expose or consume webhooks

---

*Integration audit: 2026-03-24*
*Update when adding/removing external services*
