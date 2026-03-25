<loop_phases>

## Purpose

Explain the semantics of Teddy's three loop phases: PLAN, APPLY, UNIFY. Every unit of work follows this loop. Skipping phases breaks traceability and increases risk. Teddy extends the loop with Agent Teams orchestration during APPLY and team cleanup during UNIFY.

## The Loop

```
    ┌─────────────────────────────────────────┐
    │                                         │
    ▼                                         │
  PLAN ────────► APPLY ────────► UNIFY ───────┘
    │              │               │
    │              │               │
 Define work   TeamCreate       Reconcile
 Get approval  Populate tasks   Merge worktrees
 Assign waves  Spawn teammates  TeamDelete
               Monitor/collect  Update state
```

## PLAN Phase

**Purpose:** Define what will be built, how it will be verified, what's out of scope, and which tasks go to which teammates.

**Artifacts Created:**
- `{phase}-{plan}-PLAN.md` in `.teddy/phases/{phase-name}/`

**Activities:**
1. Analyze requirements and context
2. Define objective (Goal, Purpose, Output)
3. Write acceptance criteria (Given/When/Then)
4. Break down into tasks with Files, Action, Verify, Done
5. **Assign teammates and waves** (Teddy-specific)
6. Set boundaries (DO NOT CHANGE, SCOPE LIMITS)
7. **Wait for approval before proceeding**

**Exit Condition:**
- PLAN.md created with all required sections including teammate assignments
- User has approved the plan
- STATE.md updated to show "ready for APPLY"

## APPLY Phase

**Purpose:** Execute the approved plan by creating an Agent Team, populating its shared task list, spawning teammates in worktrees, and monitoring progress.

**Teddy APPLY leverages Agent Teams for coordination:**

```
Sequential (old):          Agent Teams (Teddy):
Task 1 ──► Task 2 ──► 3   TeamCreate
                           ├── TaskCreate × N
                           ├── Agent(team_name) × N
                           └── Teammates self-coordinate
                               via shared task list
```

**Activities:**
1. **TeamCreate** — create named team (e.g., "teddy-01-01")
2. **TaskCreate** — populate shared task list with plan tasks
3. **Spawn teammates** — Agent with team_name + isolation: "worktree"
4. Teammates claim tasks from shared list, execute, mark complete
5. Monitor via TaskList and automatic idle notifications
6. Handle checkpoints between waves
7. If multiple waves: tasks auto-unblock via dependencies
8. Track deviations from plan

**Exit Condition:**
- All tasks completed in shared task list (or blocked with documentation)
- All verifications passed
- Team still active (cleanup happens in UNIFY)
- Ready for reconciliation and merge

## UNIFY Phase

**Purpose:** Reconcile what was planned vs. what teammates built. Review changes, merge worktrees, clean up the Agent Team, create SUMMARY.md, close the loop.

**Teddy UNIFY includes team cleanup:**

**Activities:**
1. Gather task results from shared task list (TaskList)
2. Compare PLAN.md tasks to actual results
3. **Review each teammate's worktree changes**
4. **Merge worktrees into main branch** (resolve conflicts if any)
5. Document acceptance criteria results (PASS/FAIL)
6. Note deviations and why
7. Create SUMMARY.md with team execution details
8. **Shut down teammates** (SendMessage shutdown_request)
9. **TeamDelete** — clean up team and task resources
10. Update STATE.md (loop position, progress, clear active team)
11. Update ROADMAP.md if phase complete

**Exit Condition:**
- All worktrees merged
- SUMMARY.md created with results
- Agent Team cleaned up (TeamDelete)
- STATE.md updated with new position
- Loop closed, ready for next PLAN

## Loop Invariants

**Never Skip PLAN:** No plan = no acceptance criteria = no way to verify = no way to assign teammates.

**Never Execute Without Approval:** Plans may have incorrect assumptions or bad teammate assignments.

**Always Close With UNIFY:** No UNIFY = worktrees left dangling + stale team resources on disk.

**Always TeamDelete in UNIFY:** No cleanup = stale teams in `~/.claude/teams/` blocking future team creation.

## Phase Transitions

### PLAN → APPLY
Trigger: User approves plan (explicit signal)
Validation:
- [ ] PLAN.md has all required sections
- [ ] Teammate assignments present
- [ ] No file conflicts between same-wave tasks
- [ ] Acceptance criteria are testable

### APPLY → UNIFY
Trigger: All tasks completed in shared task list OR blockers documented
Validation:
- [ ] Each task verification passed (or blocker recorded in TaskList)
- [ ] No skipped tasks
- [ ] Deviations noted

### UNIFY → PLAN (next)
Trigger: All worktrees merged, team cleaned up, SUMMARY.md created, STATE.md updated
Validation:
- [ ] SUMMARY.md has AC results
- [ ] All worktrees cleaned up
- [ ] TeamDelete completed
- [ ] STATE.md reflects new position

## Anti-Patterns

**Partial loops:** PLAN → APPLY → (skip UNIFY) — leaves dangling worktrees and stale team resources.

**Implicit approval:** "I assume the plan is approved" — may execute on flawed teammate assignments.

**Merging without review:** Blindly merging teammate output without checking quality.

**Forgetting TeamDelete:** Stale team configs persist in `~/.claude/teams/` and can block future team creation.

</loop_phases>
