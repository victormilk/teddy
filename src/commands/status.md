---
description: "Display project status, active team progress, and recommended next action"
---

<purpose>
Display current project status including active Agent Team, task list progress, teammate status, overall loop position, and project health metrics.
</purpose>

<user-story>
As a developer, I want to see at a glance what the team is doing and overall project progress, so that I can make informed decisions about next steps.
</user-story>

<when-to-use>
- Checking on team progress during APPLY phase
- Reviewing overall project status at any time
- Before deciding next action
- Entry point routes here via /teddy:status
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
</context>

<steps>

<step name="load_state" priority="first">
1. Read `.teddy/STATE.md`
2. Read `.teddy/ROADMAP.md`
3. Check for active team (if in APPLY phase):
   - Read team name from STATE.md
   - Use `TaskList` to get task statuses from shared task list
</step>

<step name="display_status">
Display comprehensive status:

```
════════════════════════════════════════
TEDDY STATUS
════════════════════════════════════════

Project: [name]
Core value: [one-liner]

Milestone: [name] ([version])
Phase: [X] of [Y] — [Phase Name]
Plan: [A] of [B] in current phase

Loop Position:
┌─────────────────────────────────────┐
│  PLAN ──▶ APPLY ──▶ UNIFY          │
│   [✓/○]    [✓/○]    [✓/○]          │
└─────────────────────────────────────┘

Progress:
- Milestone: [██████░░░░] 60%
- Phase:     [████░░░░░░] 40%

Last activity: [timestamp] — [description]
```

**If Agent Team is active (APPLY in progress):**

```
────────────────────────────────────────
ACTIVE TEAM: teddy-{NN}-{PP}
────────────────────────────────────────

Task List Progress:
| Task | Owner | Wave | Status |
|------|-------|------|--------|
| [task-1 name] | teammate-1 | 1 | completed |
| [task-2 name] | teammate-2 | 1 | in_progress |
| [task-3 name] | unassigned | 2 | blocked |

Teammates:
| Name | Status | Current Task |
|------|--------|-------------|
| teammate-1 | idle | — (finished) |
| teammate-2 | active | task-2 name |
| teammate-3 | idle | waiting for wave 2 |

Tasks: [N]/[M] completed | [N] in progress | [N] blocked
```

**If no active work:**

```
────────────────────────────────────────
▶ NEXT: [single next action based on state]
────────────────────────────────────────
```
</step>

</steps>

<output>
Project status display with:
- Loop position and progress
- Active team and task list status (if applicable)
- Teammate roster and status
- Next recommended action
</output>

<acceptance-criteria>
- [ ] STATE.md read and parsed correctly
- [ ] Loop position displayed visually
- [ ] Progress bars show milestone and phase completion
- [ ] Active team listed with TaskList results (if in APPLY)
- [ ] Teammate roster shown with current status
- [ ] Next action recommended based on current state
</acceptance-criteria>
