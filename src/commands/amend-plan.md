---
description: "Modify an active plan mid-execution — pause teammates, update tasks, resume"
---

<purpose>
Modify an active PLAN.md during APPLY phase. Pause running teammates, present proposed changes, update the shared task list, and resume execution with amended instructions.
</purpose>

<user-story>
As a developer, I want to modify a plan mid-execution when reality diverges from the original plan, so that teammates work with corrected instructions without restarting the entire loop.
</user-story>

<when-to-use>
- During APPLY when plan needs changes
- When a teammate reports a blocker that requires plan modification
- When scope changes mid-execution
- When new information invalidates original task definitions
- Entry point routes here via /teddy:amend-plan
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
@.teddy/phases/{phase}/{plan}-PLAN.md
</context>

<references>
@frameworks/loop-phases.md
@frameworks/teammate-orchestration.md
</references>

<steps>

<step name="validate_apply_in_progress" priority="first">
1. Read STATE.md — confirm loop position shows APPLY in progress
2. If not in APPLY: exit with message:
   ```
   Amendment requires an active APPLY phase.
   Current state: [current-state]
   Use /teddy:plan to create a new plan instead.
   ```
3. Get active team name and plan path from STATE.md
</step>

<step name="read_current_plan">
1. Read the active PLAN.md
2. Read current TaskList to see task statuses
3. Present current state to user:

```
════════════════════════════════════════
PLAN AMENDMENT — Current State
════════════════════════════════════════

Plan: [plan-path]
Team: [team-name]

Tasks:
  Completed: [N] (immutable)
  In Progress: [N]
  Pending: [N] (modifiable)

[list pending tasks with IDs]
```

4. Offer amendment options:
   - [1] Add new tasks
   - [2] Modify pending tasks
   - [3] Remove pending tasks
   - [4] Describe changes freely
5. Wait for user input
</step>

<step name="pause_teammates">
1. For each active teammate: SendMessage pause request
   - Message: "Amendment in progress — pause after current task completes"
2. Wait briefly for in-progress tasks to reach a safe stopping point
3. Log pause in STATE.md:
   ```yaml
   amendment:
     status: in_progress
     paused_at: [timestamp]
     reason: [user-provided reason]
   ```
</step>

<step name="apply_amendment">
1. Based on user input, modify the PLAN.md:
   - Add new tasks: append to task list with correct wave/role
   - Modify pending tasks: update action, files, verify, or done fields
   - Cancel pending tasks: mark as cancelled (do not delete)
2. IMPORTANT: Only pending tasks can be modified or cancelled. Completed tasks are immutable.
3. Add amendment log entry to PLAN.md:
   ```markdown
   ## Amendment Log

   ### Amendment [N] — [date]
   - **What changed:** [summary of changes]
   - **Why:** [user-provided reason]
   - **Tasks affected:** [list of task IDs]
   - **Tasks added:** [list of new task IDs, if any]
   - **Tasks cancelled:** [list of cancelled task IDs, if any]
   ```
4. Update shared task list:
   - New tasks: TaskCreate with correct role and dependencies
   - Modified tasks: TaskUpdate with new description
   - Cancelled tasks: TaskUpdate status to deleted
5. Require user confirmation before finalizing:
   ```
   Amendment summary:
   - [N] tasks modified
   - [N] tasks added
   - [N] tasks cancelled

   Confirm? [yes/no]
   ```
</step>

<step name="resume_teammates">
1. For each paused teammate: SendMessage resume notification
   - Include summary of what changed relevant to their role
2. Update STATE.md:
   ```yaml
   amendment:
     status: completed
     completed_at: [timestamp]
     changes: [summary]
   ```
3. Report amendment results:

```
════════════════════════════════════════
PLAN AMENDED
════════════════════════════════════════

Plan: [plan-path]
Amendment: #[N]

Changes:
  Modified: [N] tasks
  Added: [N] tasks
  Cancelled: [N] tasks

Teammates resumed with updated instructions.

---
Execution continues automatically.
```
</step>

</steps>

<output>
Modified PLAN.md with amendment log at `.teddy/phases/{phase}/{plan}-PLAN.md`
Updated shared task list reflecting amendments
STATE.md with amendment record
</output>

<acceptance-criteria>
- [ ] Validates APPLY is in progress before proceeding
- [ ] Shows current plan state and task statuses
- [ ] Pauses teammates before modifying plan
- [ ] Only modifies pending tasks (completed tasks are immutable)
- [ ] Amendment logged in PLAN.md with date, changes, and reason
- [ ] Shared task list updated (TaskCreate/TaskUpdate)
- [ ] Teammates resumed with notification of changes
- [ ] STATE.md updated with amendment note
- [ ] User confirmation required before applying changes
</acceptance-criteria>
