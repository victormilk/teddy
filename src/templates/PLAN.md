# PLAN.md Template

Template for `.teddy/phases/{phase-number}-{name}/{phase}-{plan}-PLAN.md` — executable phase plans with teammate assignments.

**Naming:** `{phase}-{plan}-PLAN.md` (e.g., `01-02-PLAN.md` for Phase 1, Plan 2)

---

## File Template

```markdown
---
phase: XX-name
plan: NN
type: execute                    # execute | tdd | research
wave: N                          # Execution wave (1, 2, 3...)
depends_on: []                   # Plan IDs this plan requires
files_modified: []               # Files this plan modifies
autonomous: true                 # false if plan has checkpoints
team:
  name: teddy-{XX}-{NN}         # Team identifier
  size: N                        # Number of role-specialists (3-5)
  parallel_waves: N              # Number of execution waves
  roles:
    - name: backend-dev          # Semantic role name
      domain: "API routes, middleware, database models"
      owns: ["src/api/", "src/models/", "prisma/"]
    - name: frontend-dev
      domain: "UI components, pages, client-side state"
      owns: ["src/components/", "src/pages/", "src/hooks/"]
    - name: test-eng
      domain: "Unit tests, integration tests, e2e tests"
      owns: ["tests/", "src/**/*.test.ts"]
---

<objective>
## Goal
[What this plan accomplishes — specific, measurable]

## Purpose
[Why this matters for the project]

## Output
[What artifacts will be created/modified]
</objective>

<context>
## Project Context
@.teddy/PROJECT.md
@.teddy/ROADMAP.md
@.teddy/STATE.md

## Source Files
@path/to/relevant/source.ts
</context>

<acceptance_criteria>

## AC-1: [Criterion Name]
```gherkin
Given [precondition / system state]
When [user action / trigger]
Then [expected outcome / observable result]
```

## AC-2: [Criterion Name]
```gherkin
Given [precondition]
When [action]
Then [outcome]
```

</acceptance_criteria>

<tasks>

<!-- backend-dev tasks (5-6 tasks) -->
<task type="auto" role="backend-dev" wave="1">
  <name>Task 1: [Action-oriented name]</name>
  <files>src/api/auth/route.ts, src/models/user.ts</files>
  <action>
    [Specific implementation instructions]
    - What to do
    - How to do it
    - What to avoid and WHY
  </action>
  <verify>[Command or check to prove it worked]</verify>
  <done>[Acceptance criteria — links to AC-N]</done>
</task>

<task type="auto" role="backend-dev" wave="1">
  <name>Task 2: [Action-oriented name]</name>
  <files>src/api/another/route.ts</files>
  <action>[Specific implementation]</action>
  <verify>[Command or check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<!-- frontend-dev tasks (5-6 tasks) -->
<task type="auto" role="frontend-dev" wave="1">
  <name>Task 3: [Action-oriented name]</name>
  <files>src/components/LoginForm.tsx</files>
  <action>[Specific implementation]</action>
  <verify>[Command or check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<!-- test-eng tasks (5-6 tasks) -->
<task type="auto" role="test-eng" wave="1">
  <name>Task 4: [Action-oriented name]</name>
  <files>tests/auth.test.ts</files>
  <action>[Specific implementation]</action>
  <verify>[Command or check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<!-- Checkpoint (optional) -->
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[What was built that needs verification]</what-built>
  <how-to-verify>
    1. Run: [command]
    2. Visit: [URL]
    3. Confirm: [Expected behaviors]
  </how-to-verify>
  <resume-signal>Type "approved" to continue, or describe issues</resume-signal>
</task>

</tasks>

<boundaries>

## DO NOT CHANGE
- [Protected file or pattern]

## SCOPE LIMITS
- [What's explicitly out of scope]

## ROLE ISOLATION (enforced by team.roles.owns)
- backend-dev owns: src/api/, src/models/, prisma/
- frontend-dev owns: src/components/, src/pages/, src/hooks/
- test-eng owns: tests/, src/**/*.test.ts
- No cross-ownership modifications without SendMessage coordination

</boundaries>

<verification>
Before declaring plan complete:
- [ ] [Specific test command]
- [ ] [Build/type check passes]
- [ ] All acceptance criteria met
</verification>

<success_criteria>
- All role-specialists completed their tasks
- All verification checks pass
- All worktrees ready for merge
- [Plan-specific criteria]
</success_criteria>

<output>
After completion, create `.teddy/phases/XX-name/{phase}-{plan}-SUMMARY.md`
</output>
```

---

## Frontmatter Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `phase` | Yes | Phase identifier |
| `plan` | Yes | Plan number within phase |
| `type` | Yes | `execute`, `tdd`, or `research` |
| `wave` | Yes | Execution wave number |
| `depends_on` | Yes | Plan ID dependencies |
| `files_modified` | Yes | For conflict detection |
| `autonomous` | Yes | `true`/`false` for checkpoints |
| `team` | Yes | Full team composition with roles |
| `team.name` | Yes | Team identifier (e.g., `teddy-01-01`) |
| `team.size` | Yes | Number of role-specialists (3-5) |
| `team.roles[]` | Yes | Array of {name, domain, owns} |

## Task Types

| Type | Use For | Role-assigned? |
|------|---------|----------------|
| `auto` | Independent implementation | Yes — runs in role's worktree |
| `checkpoint:decision` | Implementation choice | No — main session only |
| `checkpoint:human-verify` | Visual/functional check | No — main session only |

## Role Assignment Rules

- Each role = one Agent with semantic name (NOT "teammate-N")
- Each role should have 5-6 tasks within its domain
- Same wave = parallel execution in isolated worktrees
- Different waves = sequential after merge
- No file overlap between same-wave roles (enforced by `owns`)
- Tasks grouped by comments per role for readability
