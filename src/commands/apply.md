<purpose>
Execute an approved PLAN.md by creating an Agent Team, populating its shared task list, and spawning teammates to work in parallel. Manages team lifecycle: create, populate, spawn, monitor, collect results.
</purpose>

<user-story>
As a developer, I want my approved plan automatically distributed to a coordinated Agent Team, so that independent tasks execute simultaneously with shared task lists and direct inter-teammate communication.
</user-story>

<when-to-use>
- User has approved a PLAN.md (explicit approval required)
- STATE.md shows loop position at PLAN complete, ready for APPLY
- No unresolved blockers from planning phase
- Entry point routes here via /teddy apply
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
@.teddy/phases/{phase}/{plan}-PLAN.md
</context>

<references>
@frameworks/teammate-orchestration.md (for team creation and teammate spawning)
@frameworks/loop-phases.md (for phase transitions)
</references>

<steps>

<step name="validate_approval" priority="first">
1. Confirm user has explicitly approved the plan
   - Do NOT assume approval
   - Look for explicit signal: "approved", "execute", "go ahead"
2. Read STATE.md to verify:
   - Loop position shows PLAN complete
   - Correct phase and plan identified
3. If approval unclear:
   - Ask: "Plan ready at [path]. Approve execution?"
   - Wait for explicit approval before proceeding
</step>

<step name="load_plan">
1. Read the PLAN.md file
2. Parse frontmatter including team composition:
   - team.name: team identifier (e.g., "teddy-01-01")
   - team.size: how many role-specialists to spawn (3-5)
   - team.parallel_waves: execution waves
   - team.roles[]: array of role definitions with name, domain, and owns
3. Extract tasks grouped by role AND by wave:
   - For each role: collect all tasks assigned to that role
   - For each wave: identify which tasks are parallel vs blocked
4. Note boundaries from <boundaries> section
5. Load acceptance criteria for verification reference
6. **Verify team composition quality:**
   - At least 3 roles defined
   - Each role has 4+ tasks
   - No file ownership overlaps between same-wave roles
</step>

<step name="create_team">
**Create the Agent Team:**

```
TeamCreate:
  team_name: "teddy-{NN}-{PP}"
  description: "[plan objective] — Roles: [role-1], [role-2], [role-3], ..."
```

**Populate the shared task list with TaskCreate (all tasks for all roles):**

For each task in PLAN.md:
```
TaskCreate:
  title: "[role-name]: [task name from PLAN.md]"
  description: |
    Role: [assigned role name, e.g., "backend-dev"]
    Wave: [wave number]
    Files: [file paths to create/modify]

    ## Action
    [action content from PLAN.md]

    ## Verification
    [verify content from PLAN.md]

    ## Boundaries
    ONLY modify files within your role domain.
    [boundaries from PLAN.md]

    ## Done
    [acceptance criteria link]
```

For Wave 2+ tasks, set dependencies on Wave 1 task IDs so they auto-unblock.

**Example: 4 roles × ~5 tasks each = ~20 TaskCreate calls total**
</step>

<step name="spawn_teammates">
**Spawn one teammate PER ROLE (NOT per task, NOT per wave).**

Each role in team.roles becomes one Agent with a role-specific prompt.
Spawn ALL roles in parallel (in a single message with multiple Agent tool calls).

For each role in the plan's team.roles:

```
Agent tool:
  team_name: "teddy-{NN}-{PP}"
  name: "[role-name]"              ← semantic name from team.roles[].name
  isolation: "worktree"
  run_in_background: true
  mode: "bypassPermissions"
  prompt: |
    You are the **[Role Name]** specialist on a Teddy Agent Team.

    ## Your Identity
    Team: teddy-{NN}-{PP}
    Your name: [role-name]
    Your expertise: [team.roles[].domain — what this role owns and why]

    ## Your Domain
    You own these areas of the codebase:
    [team.roles[].owns — explicit list of directories/file patterns]

    You have [N] tasks assigned to your role in the shared task list.
    Tasks assigned to you have "[role-name]:" prefix in their title.

    ## Your Peers
    This team has [N] specialists working in parallel:
    [For each OTHER role in team.roles:]
    - **[peer-role-name]**: [peer-domain] — owns [peer-owns]
    [End for]

    Use SendMessage(to: "[peer-name]") to coordinate when needed.

    ## Workflow
    1. Check TaskList for tasks with your role name that are unblocked
    2. Claim a task with TaskUpdate (set owner to your name)
    3. Execute the task following its action instructions exactly
    4. Run the verification command to prove completion
    5. Mark task completed with TaskUpdate (include verification results)
    6. Check TaskList for your next unblocked task
    7. Repeat until all your tasks are done
    8. When finished, just return — the lead is notified automatically

    ## Communication
    - Share discoveries that help peers (e.g., "created types at src/types/user.ts")
    - Report blockers by updating the task status and broadcasting via SendMessage(to: "*")
    - If you need something from a peer, message them directly by name

    ## Context
    [relevant project context, architecture decisions, tech stack details from PLAN.md]

    ## Boundaries
    ONLY modify files within your domain: [team.roles[].owns]
    DO NOT modify files owned by other roles.
    If you need a file outside your domain, coordinate via SendMessage.
    [additional boundaries from PLAN.md]

    ## Output
    For each completed task, update it with:
    1. Files created/modified (with absolute paths)
    2. Verification results (pass/fail with evidence)
    3. Any deviations from the plan and why
    4. Any blockers or discoveries for other teammates
```

**IMPORTANT: Spawn ALL roles in a single message (parallel Agent calls).**

Example for a 4-role team — the lead sends ONE message containing:
- Agent(name: "backend-dev", ...)
- Agent(name: "frontend-dev", ...)
- Agent(name: "test-eng", ...)
- Agent(name: "infra-dev", ...)

**Track the team:**
- Record team name and role names in STATE.md
- Log spawn time for duration tracking
- Update session context with active team and role composition
</step>

<step name="monitor_and_collect">
**Monitor teammate progress:**

- Teammates send automatic idle notifications when their turn ends
- Use `TaskList` to check overall progress:
  - Tasks assigned / in_progress / completed
  - Blocked tasks (waiting for dependencies)
- Use `SendMessage` to communicate with teammates by name if needed

**After all tasks in current wave complete:**

1. Check TaskList — all Wave N tasks should be completed
2. For each completed task:
   - Review task status and notes
   - Check verification: PASS or FAIL
   - Note any deviations
3. **If all PASS:** Wave N+1 tasks auto-unblock, teammates pick them up
4. **If any FAIL:**
   - Stop and report failure
   - Offer options: retry, skip, stop
   - Record resolution in STATE.md

**Handle checkpoints between waves:**
If wave contains checkpoint tasks:
- Stop and present checkpoint to user
- Wait for resolution before proceeding
- Record decision in STATE.md
</step>

<step name="finalize">
After all waves complete:

1. Summarize execution:
   - Team: [team name]
   - Teammates spawned: N
   - Tasks completed: N of M
   - Failures: list any
   - Deviations: list any
2. Update STATE.md:
   - Loop position: PLAN ✓ → APPLY ✓ → UNIFY ○
   - Active team: [team name]
   - Last activity: timestamp and completion status
   - Task completion summary
3. **Do NOT TeamDelete yet** — UNIFY needs team context for review
4. Report with quick continuation:

```
════════════════════════════════════════
APPLY COMPLETE
════════════════════════════════════════

Team: teddy-{NN}-{PP}

## Role Results
| Role | Tasks | Completed | Status |
|------|-------|-----------|--------|
| [role-1] | [N] | [N]/[N] | [status] |
| [role-2] | [N] | [N]/[N] | [status] |
| [role-3] | [N] | [N]/[N] | [status] |
| ... | ... | ... | ... |

Total: [N] roles, [N]/[M] tasks completed, [W] waves
Worktrees: [N] with changes pending merge

[execution summary — key deliverables per role]

---
Continue to UNIFY?

[1] Yes, run UNIFY | [2] Pause here
```

Accept quick inputs: "1", "yes" → run `/teddy unify [plan-path]`
</step>

</steps>

<output>
- Agent Team created with shared task list
- Modified files in teammate worktrees (pending merge)
- Task completion results in shared task list
- STATE.md updated with APPLY complete and active team
</output>

<acceptance-criteria>
- [ ] Plan approval explicitly confirmed before execution
- [ ] Agent Team created with TeamCreate
- [ ] Tasks populated in shared task list with TaskCreate (5-6 per role)
- [ ] Each task title prefixed with role name for easy claiming
- [ ] 3-5 role-specialists spawned with semantic names (NOT "teammate-N")
- [ ] All roles spawned in parallel (single message with multiple Agent calls)
- [ ] Each role received role-specific prompt with domain, owns, and peer list
- [ ] Wave execution order respected via task dependencies
- [ ] All task results collected via TaskList
- [ ] File conflicts detected and reported
- [ ] STATE.md updated with execution results, team name, and role composition
- [ ] User informed of results per role and routed to UNIFY
</acceptance-criteria>
