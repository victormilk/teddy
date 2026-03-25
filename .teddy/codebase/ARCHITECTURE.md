# Architecture

**Analysis Date:** 2026-03-24

## Pattern Overview

**Overall:** Skill-Based Orchestration Framework with Three-Phase Loop (PLAN -> APPLY -> UNIFY)

**Key Characteristics:**
- Skill-first design — Distributed as Claude Code slash commands (`/teddy:init`, `/teddy:plan`, etc.)
- Plans as executable prompts — `PLAN.md` files ARE the prompts, not transformed into them
- Markdown-first — All orchestration expressed in markdown templates
- Stateful session management — `STATE.md` tracks loop position across sessions
- Loop-based methodology — Every work unit follows PLAN -> APPLY -> UNIFY

## Layers

```
USER LAYER (Tech Lead / Product Owner)
  - Approves plans, makes architectural decisions, reviews results
        |
ORCHESTRATION LAYER (Main Teddy Session)
  - /teddy commands, state management, team lifecycle, phase progression
        |
EXECUTION LAYER (Agent Teams)
  - Parallel teammates, shared task lists, worktree-isolated modifications
        |
CODEBASE LAYER (Project Files & Worktrees)
  - Main branch code, teammate worktrees, .teddy/ project directory
```

**Orchestration Layer:**
- Purpose: Route user commands, manage state, create/destroy teams
- Contains: Command definitions (`src/commands/`), frameworks (`src/frameworks/`), checklists (`src/checklists/`)
- Depends on: Claude Code tools (Agent, TeamCreate, TaskCreate, etc.)
- Used by: User via `/teddy:command` slash commands

**Execution Layer:**
- Purpose: Execute plan tasks in parallel via role-specialized teammates
- Contains: Spawned Agent instances with team_name and worktree isolation
- Depends on: Orchestration layer (creates teams), shared task lists
- Used by: Orchestration layer (monitors progress, collects results)

**Codebase Layer:**
- Purpose: Persistent project state and file modifications
- Contains: `.teddy/` directory, git worktrees, project source code
- Depends on: Git for version control and worktree management
- Used by: Both orchestration (reads state) and execution (modifies code)

## Data Flow

**Three-Phase Loop Lifecycle:**

1. `/teddy:init` — Creates `.teddy/` with PROJECT.md, ROADMAP.md, STATE.md
2. `/teddy:explore` (optional) — Analyzes codebase, surfaces opportunities
3. `/teddy:plan` — Reads ROADMAP.md, designs team, decomposes into tasks, creates PLAN.md
4. User approves plan
5. `/teddy:apply` — TeamCreate -> TaskCreate (all tasks) -> Agent spawn per role (worktree isolation)
6. Teammates execute in parallel: claim tasks -> execute -> verify -> complete -> next task
7. `/teddy:unify` — Collect results -> review worktrees -> merge -> verify ACs -> create SUMMARY.md -> TeamDelete -> update STATE.md
8. Loop complete — Ready for next `/teddy:plan`

**State Management:**
- `STATE.md` — Single source of truth for loop position, active teams, decisions, blockers
- `PLAN.md` — Immutable once approved (no mid-execution amendments)
- `SUMMARY.md` — Generated at UNIFY, captures execution history

## Key Abstractions

**Agent Teams:**
- Purpose: Named groups of role-specialized teammates with shared task lists
- Examples: `teddy-01-01` (phase 01, plan 01) with roles like `backend-dev`, `frontend-dev`, `test-eng`
- Pattern: One agent per role (not per task), 5-6 tasks per role

**Task Waves:**
- Purpose: Sequential execution stages within a plan
- Pattern: Wave 1 tasks are independent (parallel). Wave 2+ tasks depend on prior waves (auto-unblock)

**Worktree Isolation:**
- Purpose: Each teammate works in separate git worktree, preventing file conflicts
- Pattern: Created at Agent spawn, merged at UNIFY, cleaned up via TeamDelete

**Acceptance-Driven Development:**
- Purpose: Plans define measurable ACs (Given/When/Then), SUMMARY maps results back
- Pattern: Every PLAN has ACs; every SUMMARY maps each AC to PASS/FAIL

## Entry Points

**CLI Installation:**
- Location: `bin/install.js`
- Triggers: `npx teddy-framework [--global|--local]`
- Responsibilities: Copy framework files to Claude Code config directory

**Skill Suite Router:**
- Location: `src/commands/teddy.md`
- Triggers: User types `/teddy` in Claude Code
- Responsibilities: Define persona, list commands, route to specific handlers

**Command Handlers:**
- Location: `src/commands/{command}.md`
- Triggers: `/teddy:{command}` slash commands
- Responsibilities: Execute specific workflow phase (init, plan, apply, unify, etc.)

## Error Handling

**Strategy:** Explicit approval gates + validation checklists + loop invariants

**Patterns:**
- Approval gates: No plan execution without explicit user approval
- Plan validation: `src/checklists/plan-review.md` validates structure before APPLY
- Merge validation: `src/checklists/unify-gate.md` validates quality before closing loop
- Loop invariants: Never skip PLAN, never execute without approval, always close with UNIFY
- Teammate blockers: Tasks updated with blocker status, broadcast via SendMessage
- CLI errors: `process.exit(1)` with descriptive `console.error()` messages in `bin/install.js`

## Cross-Cutting Concerns

**Audit Trail:**
- SUMMARY.md captures full execution history per phase: team, tasks, ACs, deviations, duration

**Validation:**
- Phase transitions validated via checklists (plan-review, unify-gate)
- STATE.md updated after every significant action

**State Continuity:**
- STATE.md tracks session position, enabling `/teddy:resume` across sessions
- `.teddy/phases/` persists all plans and summaries

**Quality Gates:**
- `src/checklists/plan-review.md` — Pre-APPLY validation
- `src/checklists/unify-gate.md` — Pre-merge quality gate

---

*Architecture analysis: 2026-03-24*
*Update when major patterns change*
