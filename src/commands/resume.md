---
description: "Resume work after session break with context restoration and single next action"
---

<purpose>
Resume Teddy work after a session break. Reads STATE.md to restore context, determines current loop position, and routes to exactly ONE next action.
</purpose>

<user-story>
As a developer, I want to instantly resume work from where I left off, so that session breaks don't lose context or momentum.
</user-story>

<when-to-use>
- Starting a new session on an existing Teddy project
- Context was cleared (new conversation)
- User asks to "continue" or "resume" work
- Entry point routes here via /teddy:resume
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
</context>

<references>
@frameworks/loop-phases.md (for determining next action)
</references>

<steps>

<step name="verify_teddy_exists" priority="first">
1. Check for .teddy/ directory:
   ```bash
   ls .teddy/STATE.md 2>/dev/null
   ```
2. If not found:
   - "No Teddy project found. Run /teddy:init first."
   - Exit workflow
3. If found: proceed with resume
</step>

<step name="load_state">
1. Read `.teddy/STATE.md`
2. Extract:
   - Current Position (phase, plan, status)
   - Loop Position (PLAN/APPLY/UNIFY markers)
   - Last activity
   - Session Continuity (stopped at, next action, resume file)
   - Active team name and status (if mid-APPLY)
   - Teammate status via TaskList (if team active)
</step>

<step name="determine_single_action">
Based on loop position, determine **exactly ONE** next action:

| Loop State | Single Next Action |
|------------|-------------------|
| PLAN ○ (no plan yet) | `/teddy:plan` |
| PLAN ✓, APPLY ○ (plan awaiting approval) | `/teddy:apply [plan-path]` |
| PLAN ✓, APPLY ✓, UNIFY ○ (executed, team active) | `/teddy:unify [plan-path]` |
| All ✓ (loop complete) | `/teddy:plan` (next phase) |
| Blocked | "Address blocker: [specific issue]" |

**Do NOT offer multiple options.** Pick the ONE correct action.
</step>

<step name="report_and_route">
Display:

```
════════════════════════════════════════
TEDDY PROJECT RESUMED
════════════════════════════════════════

Project: [from PROJECT.md]
Phase: [N] of [M] - [Phase Name]
Plan: [NN-PP] - [plan description]

Loop Position:
┌─────────────────────────────────────┐
│  PLAN ──▶ APPLY ──▶ UNIFY          │
│   [✓/○]    [✓/○]    [✓/○]          │
└─────────────────────────────────────┘

Last Session: [timestamp]
Stopped at: [what was happening]

────────────────────────────────────────
▶ NEXT: [single command with path]
  [brief description of what it does]
────────────────────────────────────────

Type "yes" to proceed, or provide context for a different action.
```

**IMPORTANT:** Show exactly ONE suggested action. No numbered options.
</step>

</steps>

<output>
- Context restored from STATE.md
- User informed of current position
- Exactly ONE next action suggested
</output>

<acceptance-criteria>
- [ ] STATE.md read and parsed correctly
- [ ] Loop position accurately determined
- [ ] Exactly ONE next action presented (not multiple options)
- [ ] Active team and task list status included if mid-APPLY
- [ ] User can proceed or redirect
</acceptance-criteria>
