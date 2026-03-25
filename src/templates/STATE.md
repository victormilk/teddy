# STATE.md Template

Template for `.teddy/STATE.md` — the project's living memory and teammate coordination hub.

**Purpose:** Single source of truth for current position, teammate status, accumulated context, and session continuity.

---

## File Template

```markdown
# Project State

## Project Reference

See: .teddy/PROJECT.md (updated {date})

**Core value:** [One-liner from PROJECT.md]
**Current focus:** [Current milestone and phase name]

## Current Position

Milestone: [Name] ({version})
Phase: [X] of [Y] ([Phase Name])
Plan: [A] of [B] in current phase
Status: [Ready to plan | Planning | Approved | Applying | Unifying | Complete | Blocked]
Last activity: {timestamp} — [What happened]

Progress:
- Milestone: [░░░░░░░░░░] 0%
- Phase: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Description]
```

## Teammates

### Active
| Teammate | Task | Wave | Status | Started | Worktree |
|----------|------|------|--------|---------|----------|
| [None active] | | | | | |

### Last Execution
| Teammate | Task | Result | Duration | Files Modified |
|----------|------|--------|----------|----------------|
| [No prior execution] | | | | |

## Accumulated Context

### Decisions

| Decision | Phase | Impact |
|----------|-------|--------|
| [None yet] | | |

### Deferred Issues

| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| [None yet] | | | |

### Blockers/Concerns

| Blocker | Impact | Resolution Path |
|---------|--------|-----------------|
| [None] | | |

## Session Continuity

Last session: {timestamp}
Stopped at: [Description of last completed action]
Next action: [What to do when resuming]
Resume file: [Path to relevant file]

---
*STATE.md — Updated after every significant action*
*Size target: <100 lines (digest, not archive)*
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{date}` | variable | Yes | Last update date | `2026-03-24` |
| `{version}` | variable | Yes | Milestone version | `v0.1` |
| `{timestamp}` | variable | Yes | ISO timestamp | `2026-03-24 14:30` |
| `[Core value]` | prose | Yes | From PROJECT.md | `Users can track expenses` |

## Section Specifications

### Teammates
**Purpose:** Track active and recent teammate execution.
**Active:** Currently running teammates with worktree references.
**Last Execution:** Most recent completed teammate run for context.
**Update:** During APPLY (active), after UNIFY (last execution).

### Loop Position
**Purpose:** Visual indicator of PLAN → APPLY → UNIFY state.
**Symbols:** ✓ = complete, ○ = pending, ◉ = in progress
**Update:** At each loop phase transition.

### Session Continuity
**Purpose:** Enable instant session resumption.
**Update:** At end of each session or significant pause.
**Quality check:** Can someone resume from this section alone?
