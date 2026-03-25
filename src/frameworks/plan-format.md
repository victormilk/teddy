<plan_format>

## Purpose

PLAN.md IS the executable prompt. It contains everything needed to orchestrate an Agent Team: objective, context, acceptance criteria, tasks with teammate assignments, boundaries, verification, and output specification.

**Core principle:** A plan is teammate-executable when each task can be created in the shared task list and claimed by a teammate without clarifying questions.

## Frontmatter

Every PLAN.md starts with YAML frontmatter:

```yaml
---
phase: XX-name
plan: NN
type: execute
wave: N
depends_on: []
files_modified: []
autonomous: true
team:
  name: teddy-{XX}-{NN}
  size: N                    # 3-5 teammates
  parallel_waves: N
  roles:
    - name: backend-dev
      domain: "API routes, middleware, database models"
      owns: ["src/api/", "src/models/", "prisma/"]
    - name: frontend-dev
      domain: "UI components, pages, client-side state"
      owns: ["src/components/", "src/pages/", "src/hooks/"]
    - name: test-eng
      domain: "Unit tests, integration tests, e2e tests"
      owns: ["tests/", "src/**/*.test.ts"]
    - name: infra-dev
      domain: "Config, deployment, environment setup"
      owns: ["config/", ".env*", "docker/"]
---
```

| Field | Required | Purpose |
|-------|----------|---------|
| `phase` | Yes | Phase identifier (e.g., `02-api-layer`) |
| `plan` | Yes | Plan number within phase |
| `type` | Yes | `execute`, `tdd`, or `research` |
| `wave` | Yes | Execution wave number |
| `depends_on` | Yes | Array of plan IDs this plan requires |
| `files_modified` | Yes | Files this plan touches (for conflict detection) |
| `autonomous` | Yes | `true` if no checkpoints, `false` if has checkpoints |
| `team` | Yes | Team composition: name, size, roles with domains and file ownership |
| `team.roles` | Yes | Array of role definitions — each with name, domain description, and owned paths |
| `skills` | No | Optional section for skill dependencies (populated by detect_required_skills) |

## Task Anatomy

Every `auto` task has five required fields plus role assignment:

### role
Which role-specialized teammate executes this task. Uses the semantic role name, NOT a numeric identifier.

```xml
<task type="auto" role="backend-dev" wave="1">
```

### files
Exact file paths created or modified.

```xml
<files>src/app/api/auth/login/route.ts, prisma/schema.prisma</files>
```

### action
Specific implementation instructions.

```xml
<action>
  Create POST endpoint accepting {email, password}.
  Query User by email, compare password with bcrypt.
  On match, create JWT with jose library (15-min expiry).
  Return 200. On mismatch, return 401.
  Avoid: jsonwebtoken (CommonJS issues with Edge runtime)
</action>
```

### verify
How to prove the task is complete.

```xml
<verify>curl -X POST localhost:3000/api/auth/login returns 200 with Set-Cookie header</verify>
```

### done
Acceptance criteria link for traceability.

```xml
<done>AC-1 satisfied: Valid credentials return 200 + JWT cookie</done>
```

**If you can't specify Files + Action + Verify + Done, the task is too vague for a teammate.**

## Wave Assignment Rules

```
Wave 1: depends_on: [] → parallel teammates
Wave 2: depends on Wave 1 output → sequential after merge
Wave 3: depends on Wave 2 output → sequential after merge
```

**With Agent Teams:** Wave management uses task dependencies in the shared task list.
- Wave 1 tasks are created unblocked — teammates claim immediately
- Wave 2+ tasks are created with dependencies — auto-unblock when prerequisites complete
- Teammates can pick up newly unblocked tasks without lead intervention

**Conflict detection:** Roles in the same wave must NOT modify the same files. Use the `owns` field in team.roles to enforce boundaries.

```yaml
# GOOD: Each role owns distinct paths
backend-dev:  src/api/, src/models/
frontend-dev: src/components/, src/pages/
test-eng:     tests/, src/**/*.test.ts

# BAD: Overlapping ownership
backend-dev:  src/models/, src/types/shared.ts
frontend-dev: src/components/, src/types/shared.ts  ← conflict!
```

## Sizing Guidance

**Good plan size:** 3-5 roles, 5-6 tasks per role, 15-30 total tasks per plan.

| Plan Scope | Roles | Tasks/Role | Total Tasks |
|-----------|-------|-----------|-------------|
| Small feature | 3 | 4-5 | 12-15 |
| Medium feature | 3-4 | 5-6 | 15-24 |
| Large feature | 4-5 | 5-6 | 20-30 |

**When to split into multiple plans:**
- More than 30 total tasks
- More than 5 distinct roles needed
- Risk of context overflow per teammate
- File conflicts that can't be resolved by role boundaries

**Prefer role-based vertical slices over horizontal layers:**
```
PREFER: Plan 01 = Auth System
          → backend-dev (6 tasks: models, APIs, middleware)
          → frontend-dev (5 tasks: login, register, auth context)
          → test-eng (5 tasks: unit, integration, e2e)
          → security-eng (4 tasks: JWT, CORS, rate limiting)

AVOID:  Plan 01 = All models → 1 agent (sequential, no parallelism)
        Plan 02 = All APIs → 1 agent (depends on Plan 01)
        Plan 03 = All tests → 1 agent (depends on Plan 02)
```

## Boundaries Section

```markdown
<boundaries>
## DO NOT CHANGE
- database/migrations/* (schema locked for this phase)
- src/lib/auth.ts (auth system stable)

## SCOPE LIMITS
- This plan creates API only — no UI
- Do not add new dependencies

## ROLE ISOLATION (enforced by team.roles.owns)
- backend-dev owns: src/api/, src/models/, prisma/
- frontend-dev owns: src/components/, src/pages/, src/hooks/
- test-eng owns: tests/, src/**/*.test.ts
- infra-dev owns: config/, docker/, .env*
- No cross-ownership modifications without SendMessage coordination
</boundaries>
```

## Skills Section (Optional)

Plans may include a `<skills>` section when the project has skill dependencies configured via `/teddy:flows`. This section is populated by the `detect_required_skills` step during `/teddy:plan`.

The `<skills>` section sits after `<tasks>` and before `<boundaries>` in PLAN.md:

```xml
<skills>
| Skill | Priority | Reason |
|-------|----------|--------|
| /lint | required | Tasks touch src/ — code quality enforcement |
| /test-e2e | optional | Tasks touch src/api/ — end-to-end coverage |
</skills>
```

**Priority levels:**
- **required** — APPLY's `verify_required_skills` step blocks execution if the skill is not available. UNIFY's `audit_skill_usage` step documents a gap if the skill was not invoked during execution.
- **optional** — Informational only. Neither APPLY nor UNIFY enforces availability or usage. Serves as a recommendation for the team.

**Behavior by phase:**
- **PLAN** — `detect_required_skills` analyzes tasks against FLOWS.md triggers and suggests skills. User confirms, adjusts, or skips.
- **APPLY** — `verify_required_skills` checks that all required skills are loaded before spawning teammates. This is the only hard gate in the skill flows system.
- **UNIFY** — `audit_skill_usage` cross-references declared skills with execution results. Advisory only — warns about gaps but never blocks.

**When absent:** If no `<skills>` section is present, all three phases skip their skill-related steps silently. No verification, no audit, no warnings.

| Field | Required | Purpose |
|-------|----------|---------|
| `skills` | No | Optional section for skill dependencies |

## Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Vague actions ("Set up auth") | Specific: files, steps, what to avoid and why |
| Unverifiable completion ("It works") | Measurable: command output, test result |
| Reflexive dependencies | Only chain when genuine data dependency exists |
| All tasks in same wave | Identify truly independent work for parallelism |
| Generic "teammate-N" names | Use semantic role names matching the work domain |
| Missing role boundaries | Explicit file ownership via `team.roles.owns` prevents conflicts |
| 1-2 tasks per agent | Target 5-6 tasks per role for sustained productivity |
| Missing team section in frontmatter | Always include full team composition with roles |

</plan_format>
