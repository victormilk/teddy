<principles>

## Purpose

Core principles for the Teddy development workflow. These guide every decision from plan sizing to teammate assignment.

## Developer + Team of Agents

You are planning for ONE person (the user as tech lead) and MULTIPLE implementers (agent teammates).

- User is the visionary/product owner/tech lead
- Agent teammates are the builders (spawned via Agent Teams)
- Teddy (main session) is the team lead/orchestrator
- No human team coordination overhead — Agent Teams handle coordination via shared task lists
- Estimate effort in context usage per teammate, not human dev time

## Plans Are Prompts

PLAN.md is not a document that gets transformed into a prompt. PLAN.md IS the prompt — both for Teddy's orchestration and for each teammate's task assignment.

Contains:
- Objective (what and why)
- Context (@file references)
- Acceptance Criteria (measurable outcomes)
- Tasks (with teammate assignments and verification)
- Boundaries (explicit scope control)

## Loop First

Every PLAN must complete the full loop:

```
PLAN ──▶ APPLY ──▶ UNIFY
```

- **PLAN:** Design, get approval, assign teammates and waves
- **APPLY:** TeamCreate, populate task list, spawn teammates in worktrees, collect results
- **UNIFY:** Review, merge worktrees, reconcile plan vs actual, TeamDelete, update state

Never leave a loop incomplete. UNIFY closes the loop, merges worktrees, cleans up the Agent Team (TeamDelete), and updates state.

## Acceptance Driven

Acceptance criteria are first-class, not afterthoughts.

Every PLAN.md has `## Acceptance Criteria` with:
- AC-1, AC-2, AC-3... numbered criteria
- Each AC is testable/verifiable
- SUMMARY.md maps results to AC numbers
- Teammates verify their own tasks against AC

## Scope Control

Plans must complete within reasonable context usage per teammate.

**Quality degradation curve:**
- 0-30% context: Peak quality
- 30-50% context: Good quality
- 50-70% context: Degrading
- 70%+ context: Poor

**Solution:** Match execution mode to scope. Target under 50% context per teammate.

| Execution Mode | When | Roles | Tasks/Role | Total Tasks |
|---------------|------|-------|-----------|-------------|
| Direct execution | Single domain, tight coupling | 0 | — | 1-2 |
| Subagents | Focused tasks, no inter-agent coordination | 1-3 | 1-3 | 3-9 |
| Agent Teams | Multi-domain, parallel value, clear role ownership | 3-5 | 5-6 | 15-30 |

**When borderline, prefer direct execution or subagents. Teams have real overhead — use them when the parallelism payoff is clear.**

## Teammate Sizing Sweet Spot

| Work Scope | Teammates | Tasks per Teammate | Total Tasks |
|-----------|-----------|-------------------|-------------|
| Small feature | 3 | 4-5 | 12-15 |
| Medium feature | 3-4 | 5-6 | 15-24 |
| Large feature | 4-5 | 5-6 | 20-30 |
| Research/Review | 3-5 | 3-5 | 9-25 |

**Too simple for a teammate:** Under 5 minutes of work. Execute directly.
**Too complex for a teammate:** Over 60 minutes. Split into smaller tasks.

## Deviation Rules

Plans are guides, not straitjackets. During APPLY:

1. **Auto-fix bugs** — teammate fixes immediately, logs in output
2. **Auto-add critical** — security/correctness gaps, fix immediately
3. **Auto-fix blockers** — can't proceed, fix immediately
4. **Ask about architectural** — teammate stops, reports to main session
5. **Log enhancements** — nice-to-haves deferred

All deviations logged during UNIFY for audit trail.

## Ship Fast

No enterprise process. No approval gates beyond PLAN approval.

Plan → Distribute → Execute → Merge → Ship → Learn → Repeat

Milestones mark shipped versions (v0.1 → v0.2 → v1.0).

## Anti-Enterprise

NEVER include:
- Team structures, RACI matrices
- Stakeholder management
- Sprint ceremonies
- Human dev time estimates
- Change management processes
- Documentation for documentation's sake

If it sounds like corporate PM theater, delete it.

</principles>
