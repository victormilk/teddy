<purpose>
Create an executable PLAN.md for the current or specified phase. The plan defines objective, acceptance criteria, tasks with teammate assignments, boundaries, and verification — everything needed for the APPLY phase to distribute work to agent teammates.
</purpose>

<user-story>
As a developer, I want to create structured plans that decompose work into teammate-assignable tasks, so that execution can happen in parallel via isolated worktrees.
</user-story>

<when-to-use>
- Starting a new phase (ROADMAP shows next phase ready)
- Previous plan completed (loop closed with UNIFY)
- First plan in a project (after init)
- After exploration informed the approach
- Entry point routes here via /teddy plan
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
@.teddy/ROADMAP.md
@.teddy/PROJECT.md
</context>

<references>
@frameworks/plan-format.md (for plan structure and task anatomy)
@frameworks/teammate-orchestration.md (for teammate assignment criteria)
@frameworks/quality-principles.md (for plan sizing)
@frameworks/loop-phases.md (for phase transitions)
@templates/PLAN.md (for plan template)
</references>

<steps>

<step name="validate_preconditions" priority="first">
1. Read STATE.md to confirm:
   - Loop position is ready for PLAN (prior UNIFY complete or first plan)
   - No blockers preventing planning
2. If STATE.md shows mid-loop (APPLY or UNIFY incomplete):
   - Warn user: "Previous loop not closed. Complete UNIFY first or reset."
   - Do not proceed until resolved
3. Check for EXPLORATION.md in current phase — load if exists for context
</step>

<step name="identify_phase">
1. Read ROADMAP.md to determine:
   - Which phase is next (first incomplete phase)
   - Phase scope and goals
   - Dependencies on prior phases
2. If multiple phases available, ask user which to plan
3. Confirm phase selection before proceeding
</step>

<step name="design_team_composition">
1. Review phase goals from ROADMAP.md
2. **Identify domains touched by this work:**
   - What areas of the codebase are involved? (API, UI, data, tests, infra, config, etc.)
   - What expertise is needed? (backend, frontend, testing, security, DevOps, etc.)
3. **Design the team (3-5 roles):**
   - Group work by domain expertise, NOT by task order or wave
   - Each role should own a distinct set of files/directories
   - Name roles semantically (e.g., "backend-dev", "frontend-dev", "test-eng")
   - Each role should have 5-6 tasks — if a role has < 3, merge into another
   - Verify no file ownership overlaps between roles
4. **Decompose into tasks (5-6 per role, 15-30 total):**
   - Each task: files + action + verify + done + role assignment
   - Tasks within the same role may depend on each other (sequential within role)
   - Tasks across roles in the same wave must be independent (no file conflicts)
5. **Assign waves:**
   - Wave 1: tasks with no dependencies → all roles work in parallel
   - Wave 2+: tasks depending on Wave 1 output → sequential after merge
   - Maximize Wave 1 work — most tasks should be Wave 1
6. Determine if checkpoints are needed:
   - Visual verification? → checkpoint:human-verify
   - Architecture decision? → checkpoint:decision
7. Set autonomous flag: true if no checkpoints, false otherwise
</step>

<step name="create_plan">
1. Create phase directory: `.teddy/phases/{NN}-{phase-name}/`
2. Generate PLAN.md following @templates/PLAN.md structure:

   **Frontmatter includes full team composition:**
   ```yaml
   phase: NN-name
   plan: NN
   type: execute
   wave: N
   depends_on: []
   files_modified: []
   autonomous: true
   team:
     name: teddy-{NN}-{PP}
     size: N
     parallel_waves: N
     roles:
       - name: backend-dev
         domain: "API routes, middleware, database models"
         owns: ["src/api/", "src/models/"]
       - name: frontend-dev
         domain: "UI components, pages, client-side state"
         owns: ["src/components/", "src/pages/"]
       - name: test-eng
         domain: "Unit tests, integration tests, e2e tests"
         owns: ["tests/"]
   ```

   **Task definitions include role assignment (NOT "teammate-N"):**
   ```xml
   <task type="auto" role="backend-dev" wave="1">
     <name>Task 1: [Action-oriented name]</name>
     <files>path/to/file.ext</files>
     <action>[Specific implementation]</action>
     <verify>[Command or check]</verify>
     <done>[Acceptance criteria - links to AC-N]</done>
   </task>
   ```

   **Wave assignment rules:**
   - Wave 1: Tasks with `depends_on: []` — all roles work in parallel
   - Wave 2+: Tasks depending on Wave 1 output — sequential after merge
   - Same wave = parallel roles in isolated worktrees
   - Different waves = sequential execution

3. Ensure every task has: files + action + verify + done + role assignment
4. Verify 5-6 tasks per role, 3-5 roles total
</step>

<step name="validate_plan">
1. Check all sections present
2. Verify acceptance criteria are testable
3. Confirm tasks are specific enough (files + action + verify + done)
4. **Validate team composition:**
   - 3-5 roles defined with semantic names
   - Each role has 5-6 tasks (not 1-2)
   - No file ownership overlaps between roles in the same wave
   - Dependencies correctly mapped across waves
   - Each role has a self-contained scope with clear domain
5. Ensure boundaries protect completed work
6. **Reject plans that:**
   - Use generic "teammate-N" names
   - Have fewer than 3 roles (unless work is genuinely single-domain)
   - Have fewer than 4 tasks per role
   - Have overlapping file ownership between same-wave roles
</step>

<step name="update_state">
1. Update STATE.md with plan created status
2. Update ROADMAP.md milestone status
3. Report with quick continuation:

```
════════════════════════════════════════
PLAN CREATED
════════════════════════════════════════

Plan: [plan-path]
Phase: [N] — [Phase Name]

## Team Composition
| Role | Domain | Tasks | Owned Paths |
|------|--------|-------|-------------|
| [role-1] | [domain] | [N] | [paths] |
| [role-2] | [domain] | [N] | [paths] |
| [role-3] | [domain] | [N] | [paths] |
| ... | ... | ... | ... |

Total: [N] roles, [N] tasks, [N] waves

[plan summary - key objectives per role]

---
Continue to APPLY?

[1] Approved, run APPLY | [2] Questions first | [3] Pause here
```

Accept quick inputs: "1", "approved", "yes", "go" → run `/teddy apply [plan-path]`
</step>

</steps>

<output>
PLAN.md at `.teddy/phases/{NN}-{phase-name}/{NN}-{plan}-PLAN.md`

Example: `.teddy/phases/01-foundation/01-01-PLAN.md`
</output>

<acceptance-criteria>
- [ ] PLAN.md created with all required sections
- [ ] Acceptance criteria are testable (Given/When/Then)
- [ ] Every task has files + action + verify + done
- [ ] Team composition has 3-5 roles with semantic names (NOT "teammate-N")
- [ ] Each role has 5-6 tasks within its domain
- [ ] Each role has explicit file ownership (owns field)
- [ ] No file ownership overlaps between same-wave roles
- [ ] Frontmatter includes full team section with roles array
- [ ] STATE.md updated with plan created status
- [ ] User informed of team composition with role table
- [ ] Plan approved before proceeding to APPLY
</acceptance-criteria>
