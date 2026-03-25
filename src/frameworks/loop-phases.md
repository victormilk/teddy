<loop_phases>

## Purpose

Explain the semantics of Teddy's three loop phases: PLAN, APPLY, UNIFY. Every unit of work follows this loop. Skipping phases breaks traceability and increases risk. Teddy extends the loop with Agent Teams orchestration during APPLY and team cleanup during UNIFY.

## The Loop

```text
    ┌─────────────────────────────────────────┐
    │                                         │
    ▼                                         │
  PLAN ────────► APPLY ────────► UNIFY ───────┘
    │              │  ▲            │
    │              │  │            │
 Define work    TeamCreate    Tag + Merge
 Get approval   Populate      Reconcile
 Assign waves   Spawn         TeamDelete
                Monitor       Update state
                   │
                ┌──┘
                ▼
           AMEND-PLAN        ROLLBACK
           (mid-APPLY)      (post-UNIFY)
           Pause team       Revert to tag
           Modify tasks     Restore state
           Resume team      Re-enter loop
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
7. **Detect skill dependencies** — if FLOWS.md exists, analyze tasks and suggest required skills (optional step)
8. **Wait for approval before proceeding**

**Exit Condition:**
- PLAN.md created with all required sections including teammate assignments
- User has approved the plan
- STATE.md updated to show "ready for APPLY"

## APPLY Phase

**Purpose:** Execute the approved plan by creating an Agent Team, populating its shared task list, spawning teammates in worktrees, and monitoring progress.

**Teddy APPLY leverages Agent Teams for coordination:**

```text
Sequential (old):          Agent Teams (Teddy):
Task 1 ──► Task 2 ──► 3   TeamCreate
                           ├── TaskCreate × N
                           ├── Agent(team_name) × N
                           └── Teammates self-coordinate
                               via shared task list
```

**Activities:**
1. **TeamCreate** — create named team (e.g., "teddy-01-01")
1b. **Verify required skills** — if PLAN has `<skills>` section, check required skills are loaded (blocking gate)
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
6b. **Audit skill usage** — if FLOWS.md exists, cross-reference skill declarations with execution (warn, don't block)
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

## AMEND-PLAN (Mid-APPLY)

**Purpose:** Modify an active plan during execution when reality diverges from the original plan.

**When Triggered:**
- User requests changes ("amend", "change the plan", "modify tasks")
- A teammate reports a blocker that requires plan-level changes
- User realizes scope needs adjustment mid-execution

**Activities:**
1. Pause active teammates (send pause signal)
2. Present current state: completed tasks, in-progress tasks, pending tasks
3. Apply user-requested changes to PLAN.md and task list
4. Add amendment log entry to PLAN.md with timestamp and reason
5. Update task list (TaskCreate for new tasks, TaskUpdate for modified/removed tasks)
6. Resume teammates with updated task list
7. Update STATE.md with amendment count

**Constraints:**
- Only pending tasks are modifiable
- Completed tasks are immutable (already merged or in worktree)
- In-progress tasks finish their current work first
- Each amendment is logged for UNIFY reconciliation

**Exit Condition:**
- PLAN.md updated with amendments and amendment log
- Task list reflects changes (new, modified, or removed tasks)
- Teammates resumed with refreshed task list
- APPLY continues monitoring with amended plan

## ROLLBACK (Post-UNIFY)

**Purpose:** Revert a completed UNIFY by restoring the pre-merge state using the safety tag.

**When Triggered:**
- UNIFY introduced bugs or regressions
- Merge produced incorrect results
- User wants to take a different approach

**Prerequisites:**
- Safety tag exists (`teddy/pre-unify/{plan-id}`)
- No uncommitted changes in working directory

**Activities:**
1. List available safety tags: `git tag -l "teddy/pre-unify/*"`
2. Show scope of what will be reverted (commits since tag)
3. Create backup tag at current HEAD: `teddy/pre-rollback/{plan-id}`
4. Reset to safety tag: `git reset --hard teddy/pre-unify/{plan-id}`
5. STATE.md is auto-restored to pre-unify state (it was tagged too)

**After Rollback Options:**
- Re-run UNIFY with different merge strategy
- Amend the plan and re-APPLY
- Start fresh with a new PLAN

**Safety:**
- Backup tag created before reset (teddy/pre-rollback/{plan-id})
- Explicit user confirmation required ("yes" to proceed)
- Handle uncommitted changes (warn and abort if dirty)
- Never auto-delete safety or backup tags

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
- [ ] Skills section present if FLOWS.md configured (optional)

### APPLY → UNIFY
Trigger: All tasks completed in shared task list OR blockers documented
Validation:
- [ ] Each task verification passed (or blocker recorded in TaskList)
- [ ] No skipped tasks
- [ ] Deviations noted
- [ ] Skill overrides logged if verify_required_skills was bypassed

### UNIFY → PLAN (next)
Trigger: All worktrees merged, team cleaned up, SUMMARY.md created, STATE.md updated
Validation:
- [ ] SUMMARY.md has AC results
- [ ] All worktrees cleaned up
- [ ] TeamDelete completed
- [ ] STATE.md reflects new position

### APPLY → AMEND-PLAN (side-loop)
Trigger: User requests plan changes during APPLY
Validation:
- [ ] APPLY is in progress (not complete)
- [ ] Active team exists
- [ ] Changes target pending tasks only

### UNIFY → ROLLBACK (revert)
Trigger: User requests rollback after UNIFY completed
Validation:
- [ ] Pre-unify safety tag exists
- [ ] No uncommitted changes
- [ ] User explicitly confirmed with "yes"

## Anti-Patterns

**Partial loops:** PLAN → APPLY → (skip UNIFY) — leaves dangling worktrees and stale team resources.

**Implicit approval:** "I assume the plan is approved" — may execute on flawed teammate assignments.

**Merging without review:** Blindly merging teammate output without checking quality.

**Forgetting TeamDelete:** Stale team configs persist in `~/.claude/teams/` and can block future team creation.

**Rollback without backup:** Always verify teddy/pre-rollback tag was created before proceeding.

</loop_phases>
