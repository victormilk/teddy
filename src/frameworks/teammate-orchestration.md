<teammate_orchestration>

## Purpose

Define how Teddy designs, composes, and orchestrates Agent Teams — named teams of role-specialized teammates with shared task lists, direct inter-teammate communication, and coordinated parallel execution. The key insight: a great team is not N identical workers, but a deliberately composed group where each member brings a distinct role to the objective.

## Core Concept: Agent Teams

Teddy uses `TeamCreate` to create named teams with shared task lists. Each teammate is spawned via `Agent` tool with `team_name` parameter, enabling:
- **Shared task list** — all teammates see and claim tasks from `~/.claude/tasks/{team-name}/`
- **Direct communication** — teammates message each other via `SendMessage` without going through the lead
- **Self-coordination** — teammates claim unassigned tasks, mark complete, and pick up next work
- **Team discovery** — teammates read `~/.claude/teams/{team-name}/config.json` to discover peers
- **Automatic idle notifications** — lead is notified when teammates finish their turn
- **Clean cleanup** — `TeamDelete` removes all team resources when done

```text
TeamCreate("teddy-{phase}-{plan}")
    │
    ├── TaskCreate × 8-15 tasks (distributed across roles)
    │
    ├── Agent(team_name, name: "backend-dev",  isolation: "worktree")  ← role: API + DB
    ├── Agent(team_name, name: "frontend-dev", isolation: "worktree")  ← role: UI + components
    ├── Agent(team_name, name: "test-eng",     isolation: "worktree")  ← role: tests + validation
    └── Agent(team_name, name: "infra-dev",    isolation: "worktree")  ← role: config + deploy
    │
    ▼ (each teammate claims tasks matching their role, executes, picks next)
    │
    ├── UNIFY: merge worktrees
    └── TeamDelete (cleanup)
```

## Team Composition: Designing the Right Team

A team is NOT "one agent per task" or "one agent per wave." A team is a deliberate composition of **specialized roles** where each teammate has a clear domain of expertise, owns a coherent set of files, and handles 5-6 tasks within that domain.

### Team Design Process

Before creating tasks or spawning agents, **design the team first:**

1. **Analyze the work** — What domains does this plan touch? (API, UI, data, tests, infra, docs)
2. **Identify natural roles** — Group work by expertise area, not by task order
3. **Size the team** — 3-5 teammates is the sweet spot. Each should have 5-6 tasks
4. **Name by role** — Use semantic names that describe what the teammate does
5. **Verify independence** — Same-wave teammates must not share files

### Team Composition Patterns

#### Pattern 1: Feature Team (most common)
When building a full-stack feature or module.

```text
Team: teddy-01-01 "User Authentication System"
├── backend-dev   → models, API routes, middleware (6 tasks)
├── frontend-dev  → login page, auth context, protected routes (5 tasks)
├── test-eng      → unit tests, integration tests, e2e tests (5 tasks)
└── infra-dev     → env config, JWT setup, session store (4 tasks)
```

#### Pattern 2: Module-per-Teammate
When building multiple independent modules in parallel.

```text
Team: teddy-02-01 "Core Data Models"
├── user-dev      → User model, migrations, validations, CRUD API (6 tasks)
├── product-dev   → Product model, migrations, validations, CRUD API (6 tasks)
├── order-dev     → Order model, migrations, validations, CRUD API (6 tasks)
└── shared-dev    → Shared types, base classes, common utilities (4 tasks)
```

#### Pattern 3: Cross-Layer Specialist
When changes span multiple layers with deep expertise needed.

```text
Team: teddy-03-01 "Performance Optimization"
├── db-specialist    → query optimization, indexing, connection pooling (5 tasks)
├── cache-eng        → Redis integration, cache invalidation, TTL strategy (5 tasks)
├── api-optimizer    → response compression, pagination, batch endpoints (5 tasks)
└── monitoring-eng   → metrics, dashboards, alerting rules (4 tasks)
```

#### Pattern 4: Review & Research Team
When investigating, reviewing, or exploring in parallel.

```text
Team: teddy-04-01 "Security Audit"
├── auth-reviewer     → authentication flows, token handling (5 tasks)
├── data-reviewer     → SQL injection, input validation, XSS (5 tasks)
├── infra-reviewer    → CORS, headers, rate limiting, secrets (5 tasks)
├── deps-reviewer     → dependency vulnerabilities, license compliance (4 tasks)
└── reporter          → synthesize findings, prioritize, create report (3 tasks)
```

### Teammate Naming Convention

Use **role-based semantic names**, not numeric identifiers:

```text
GOOD (role-based):
  backend-dev, frontend-dev, test-eng, infra-dev
  user-dev, product-dev, order-dev
  api-specialist, db-specialist, cache-eng
  security-reviewer, perf-reviewer

BAD (generic):
  teammate-1, teammate-2, teammate-3
  agent-a, agent-b
  worker-1, worker-2
```

**Why role names matter:**
- Teammates can identify peers by expertise when using `SendMessage`
- Lead can route issues to the right specialist
- Task claiming is more intuitive (each teammate gravitates to their domain)
- Monitoring and debugging is clearer ("db-specialist is stuck" vs "teammate-3 is stuck")

### Team Sizing Guide

| Work Scope | Teammates | Tasks per Teammate | Total Tasks |
|-----------|-----------|-------------------|-------------|
| Small feature | 3 | 4-5 | 12-15 |
| Medium feature | 3-4 | 5-6 | 15-24 |
| Large feature | 4-5 | 5-6 | 20-30 |
| Research/Review | 3-5 | 3-5 | 9-25 |

**Rules of thumb:**
- **Minimum 3 teammates** — below this, subagents or direct execution is better
- **Maximum 5 teammates** — beyond this, coordination overhead outweighs parallelism
- **5-6 tasks per teammate** — keeps each teammate productive without context overload
- **Each teammate should have enough work for meaningful parallelism** — if a role only has 1-2 tasks, merge it into another role

## Team Lifecycle

### 1. Design the Team
Before creating anything, analyze the plan and design the team composition:
- What roles are needed? (backend, frontend, testing, infra, etc.)
- How many teammates? (3-5, based on work scope)
- What does each role own? (files, domains, responsibilities)
- How are tasks distributed? (5-6 per teammate, grouped by role)

### 2. Create Team
```yaml
TeamCreate:
  team_name: "teddy-{phase}-{plan}"
  description: "[plan objective] — Team: [role-1], [role-2], [role-3], ..."
```

### 3. Populate Task List
For each task in PLAN.md, create it with role assignment in the description:
```yaml
TaskCreate:
  title: "[task name from PLAN.md]"
  description: |
    Role: [assigned role name, e.g., "backend-dev"]
    Wave: [wave number]
    Files: [file paths]

    ## Action
    [implementation instructions]

    ## Verification
    [verification criteria]

    ## Boundaries
    [scope limits]

    ## Done
    [acceptance criteria link]
```

### 4. Spawn Teammates (one per role, NOT one per task)
Each role becomes ONE teammate that handles ALL tasks for that role:
```yaml
Agent tool:
  team_name: "teddy-{phase}-{plan}"
  name: "[role-name]"          # semantic name, NOT "teammate-N"
  isolation: "worktree"
  run_in_background: true
  mode: "bypassPermissions"
  prompt: |
    You are the **[Role Name]** specialist on a Teddy Agent Team.

    ## Your Identity
    Team: teddy-{phase}-{plan}
    Your name: [role-name]
    Your expertise: [domain description — what this role owns and why]

    ## Your Domain
    You own these areas of the codebase:
    [list of directories/files this role is responsible for]

    ## Your Tasks
    You have ~[N] tasks assigned to your role "[role-name]" in the shared task list.
    Claim tasks where Role matches your name.

    ## Workflow
    1. Check TaskList for tasks assigned to your role that are unblocked
    2. Claim a task with TaskUpdate (set owner to your name)
    3. Execute the task following its action instructions exactly
    4. Run the verification command to prove completion
    5. Mark task completed with TaskUpdate (include verification results)
    6. Check TaskList for your next unblocked task
    7. When all your tasks are done, just return — the lead is notified automatically

    ## Communication
    - Use SendMessage to coordinate with other specialists:
      [list peer roles and their domains so this teammate knows who to ask]
    - Read ~/.claude/teams/{team-name}/config.json to discover peers
    - Report blockers by updating the task status and broadcasting via SendMessage(to: "*")
    - Share discoveries that help peers (e.g., "created SharedType at src/types/")

    ## Context
    [relevant project context, architecture decisions, tech stack details]

    ## Boundaries
    ONLY modify files within your domain:
    [explicit file ownership boundaries]
    DO NOT touch files owned by other roles.

    ## Output
    For each completed task, update it with:
    1. Files created/modified (with absolute paths)
    2. Verification results (pass/fail with evidence)
    3. Any deviations from the plan and why
    4. Any blockers or discoveries for other teammates
```

### 4. Monitor Progress
- Teammates send automatic idle notifications when their turn ends
- Use `TaskList` to check task status (assigned, in_progress, completed)
- Use `SendMessage` to communicate with specific teammates by name

### 5. Cleanup
After UNIFY phase:
- Send `SendMessage(message: {type: "shutdown_request"})` to each teammate
- Wait for all teammates to shut down
- Call `TeamDelete` to remove team and task resources

## When to Use Agent Teams (vs Subagents vs Direct)

| Approach | When | Team Size | Tasks |
|----------|------|-----------|-------|
| **Direct execution** | Simple work, < 3 tasks, tight coupling | 0 | 1-2 |
| **Subagents** | Focused tasks where only result matters, no inter-agent communication needed | 1-3 spawned | 1-2 per agent |
| **Agent Teams** | Parallel work needing coordination, cross-domain, 3+ independent domains | 3-5 teammates | 5-6 per teammate |

### Agent Teams Are Appropriate When:

1. **Multiple domains** — work spans 3+ distinct areas (backend, frontend, tests, infra, etc.)
2. **Parallel value** — teammates can genuinely work simultaneously without blocking each other
3. **Clear scope per role** — each role has well-defined file ownership and 5-6 concrete tasks
4. **Inter-teammate coordination value** — teammates benefit from sharing discoveries with peers

### Agent Teams Are NOT Appropriate When:

- **Work is sequential** — each step depends on the previous (use direct execution)
- **Single domain** — all work touches the same files (use direct execution or subagent)
- **Too few tasks** — less than ~12 total tasks (subagents are more efficient)
- **Uncertain requirements** — need to explore before committing to parallel execution
- **Tight file coupling** — tasks can't be isolated to separate file sets

**When borderline, prefer direct execution or subagents. Teams have real overhead — use them when the parallelism payoff is clear.**

## Wave Execution Model

Tasks are organized into waves for execution ordering:

```text
Wave 1 (parallel):     [Task A] [Task B] [Task C]
                            │       │       │
                            ▼       ▼       ▼
                        (all Wave 1 tasks completed)
                                │
Wave 2 (parallel):     [Task D] [Task E]
                            │       │
                            ▼       ▼
                        (all Wave 2 tasks completed)
```

**Wave Assignment Rules:**
- `depends_on: []` → Wave 1 (parallel candidate)
- Depends on Wave 1 task → Wave 2
- Depends on Wave 2 task → Wave 3
- Same wave = parallel teammates claiming from shared task list
- Different waves = Wave N+1 tasks are blocked until Wave N completes

**With Agent Teams, wave management leverages task dependencies:**
- Wave 1 tasks are created unblocked — teammates claim immediately
- Wave 2+ tasks are created with dependencies — auto-unblock when prerequisites complete

## Inter-Teammate Communication

Agent Teams enable direct peer communication:

```text
Teammate-1 discovers a shared type needed by Teammate-2:
  → SendMessage(to: "teammate-2", message: "Created SharedType at src/types/shared.ts")

Teammate-2 hits a blocker related to Teammate-1's work:
  → SendMessage(to: "teammate-1", message: "Need the auth middleware export before I can proceed")
```

**Communication guidelines for teammates:**
- Use plain text messages, not structured JSON
- Report blockers to lead immediately
- Share discoveries that might help peers
- Don't over-communicate — focus on actionable information

## Conflict Resolution

If teammates in the same wave accidentally modify the same file:

1. **Detection** — compare file lists in task completion results
2. **Report** — show the conflict to user
3. **Resolution options:**
   - Keep teammate A's version
   - Keep teammate B's version
   - Manual merge by user
   - Re-run one teammate with updated context

## Team Naming Convention

```text
Team name: teddy-{NN}-{PP}
  NN = phase number (e.g., 01)
  PP = plan number (e.g., 01)

Example: teddy-01-01 (phase 01, plan 01)
```

## Anti-Patterns

| Anti-Pattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| **Generic "teammate-N" names** | No role clarity, poor communication, hard to debug | Use semantic role names: "backend-dev", "test-eng" |
| **1 teammate per wave** | No parallelism — just sequential execution with overhead | Design 3-5 teammates working in parallel within waves |
| **1 task per teammate** | Wasted spawn overhead, no sustained productivity | Give each teammate 5-6 tasks within their domain |
| **Identical generic prompts** | Teammates don't know their expertise or domain boundaries | Craft role-specific prompts with domain, files, and peers |
| **Teammate by default** | Small tasks have spawn overhead > value | Only use for genuinely parallel, independent work |
| **Teammate chains** | A → B → C serial, no parallel benefit | Plan as waves, or execute sequentially in main session |
| **Vague task descriptions** | "Implement the feature" — teammate will drift | Provide exact files, action, verify, done in TaskCreate |
| **Ignoring file conflicts** | Silent data loss or broken code | Always check for file overlaps between same-wave tasks |
| **Too many teammates** | Coordination overhead exceeds parallelism gains | 3-5 teammates per team is the sweet spot |
| **Forgetting TeamDelete** | Stale team resources persist on disk | Always TeamDelete after UNIFY completes |
| **Not shutting down teammates** | TeamDelete fails with active members | SendMessage shutdown_request to all before TeamDelete |

## Contrast: Bad vs Good Team Design

### BAD: Generic 2-Agent Setup
```text
Team: teddy-01-01 "Build Auth System"
├── teammate-1 → Task 1: Create User model (Wave 1)
└── teammate-2 → Task 2: Create Auth API (Wave 2, depends on Task 1)

Problems:
- Only 2 agents, one blocked by the other → no real parallelism
- Generic names → no role clarity
- 1 task each → wasted overhead
- Wave 2 agent sits idle until Wave 1 completes
```

### GOOD: Role-Specialized Team
```text
Team: teddy-01-01 "Build Auth System"
├── backend-dev    → 6 tasks: User model, Session model, login API,
│                    register API, password reset API, middleware
├── frontend-dev   → 5 tasks: Login page, Register page, Auth context,
│                    Protected route wrapper, Password reset flow
├── test-eng       → 5 tasks: Model unit tests, API integration tests,
│                    Auth flow e2e tests, Edge case tests, Load tests
└── security-eng   → 4 tasks: JWT config, CORS setup, Rate limiting,
                     Input sanitization rules

Result:
- 4 agents working simultaneously on 20 tasks
- Each agent has clear domain expertise and file ownership
- Real parallelism within Wave 1
- Wave 2 (if any) only for genuinely dependent integration work
```

</teammate_orchestration>
