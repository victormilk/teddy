# Codebase Concerns

**Analysis Date:** 2026-03-24

## Tech Debt

**Conflicting Task Sizing Guidance:**
- Issue: `src/checklists/plan-review.md` states "2-3 tasks maximum" but `src/frameworks/teammate-orchestration.md` suggests "5-6 tasks per role" and team sizing guide suggests 15-30 total tasks per plan
- Files: `src/checklists/plan-review.md` (line 27), `src/frameworks/quality-principles.md` (line 63), `src/frameworks/teammate-orchestration.md`
- Impact: Plans validated against the checklist will fail if they follow team composition guidelines
- Fix approach: Consolidate to single standard — either small plans (2-3 tasks total) or 5-6 per role. Update checklist to match

**Incomplete Explore Command Specification:**
- Issue: Acceptance criteria states "Real codebase analyzed" but implementation steps don't explicitly assign which sub-step validates "roadmap vs reality" detection
- Files: `src/commands/explore.md` (lines 58-72, 215-221)
- Impact: Explore might surface TODOs/FIXMEs but miss actual roadmap divergence
- Fix approach: Break `analyze_codebase` step into explicit sub-steps with assigned verification

**Agent Team Cleanup Risk on Session Termination:**
- Issue: TeamDelete runs during UNIFY, but if session terminates before UNIFY completes, stale teams remain in `~/.claude/teams/` and `~/.claude/tasks/`
- Files: `src/commands/unify.md` (lines 116-128), `src/frameworks/loop-phases.md` (line 108)
- Impact: Stale team resources may block future team creation
- Fix approach: Add pre-flight check in `apply.md` that warns if stale teams exist. Consider `/teddy:cleanup` command

**Brittle Path Prefix Logic in Installer:**
- Issue: Internal references rewritten via regex (`content.replace(/~\/\.claude\//g, pathPrefix)`). If reference format changes, regex silently fails
- Files: `bin/install.js` (lines 74-77, 105-109)
- Impact: Global installations may have stale path references after format changes
- Fix approach: Add post-install validation to verify all `@` references resolve correctly

## Known Bugs

**Plan-Review Checklist Contradictions:**
- Symptoms: Plans following team composition guidelines fail checklist validation
- Trigger: Create plan with 5+ tasks per role, then run plan-review checklist
- Files: `src/checklists/plan-review.md`, `src/frameworks/teammate-orchestration.md`
- Root cause: Checklist and framework docs written at different times with different assumptions

**Explore Command Routing Inconsistency:**
- Symptoms: Explore says "Do NOT invoke /teddy:plan automatically" but other commands auto-route
- Files: `src/commands/explore.md` (lines 156-199)
- Impact: Inconsistent user experience across commands
- Fix approach: Standardize routing pattern across all commands

## Security Considerations

**Secrets in Debug/Exploration Output:**
- Risk: Teammates analyzing codebase could surface API keys, DB passwords, or credentials in analysis output
- Files: `src/commands/debug.md`, `src/commands/explore.md`
- Current mitigation: `src/commands/map-codebase.md` warns about secrets, but debug and explore don't
- Recommendations: Add security callout to explore.md and debug.md: "Never include actual secrets in findings"

**No Input Validation in Interactive Installer:**
- Risk: Custom config-dir path used directly in `fs.mkdirSync()` without sanitization
- Files: `bin/install.js` (lines 155-177)
- Current mitigation: None
- Recommendations: Validate config-dir path — must be within home directory or project root, no parent traversal (`..`)

## Fragile Areas

**STATE.md as Single Point of Truth:**
- Files: `.teddy/STATE.md`, referenced in `src/commands/resume.md`, `plan.md`, `apply.md`, `unify.md`
- Why fragile: Entire loop state depends on STATE.md being accurate. No backup or versioning
- Common failures: Manual edit corruption, git merge conflict on STATE.md
- Safe modification: Only modify via Teddy commands, never edit manually
- Fix approach: Add `/teddy:verify-state` command that validates STATE.md against filesystem

**Worktree Isolation Not Validated:**
- Files: `src/commands/apply.md` (lines 102-184)
- Why fragile: Teammates could modify files outside their domain. Only detected at UNIFY (too late)
- Fix approach: Add runtime guard in UNIFY to reject merges with out-of-domain modifications

## Scaling Limits

**Team Size Undocumented:**
- Current capacity: Tested with up to 5 teammates
- Limit: Unclear — no documentation of what breaks beyond 5
- Files: `src/frameworks/teammate-orchestration.md` (lines 43, 127-130)
- Scaling path: Document degradation points (TaskList response time, context window, coordination overhead)

**Plan Size Ambiguous:**
- Current capacity: Context degradation curve suggests "0-30% peak, 70%+ poor"
- Limit: Unclear if metric is per-teammate or total plan
- Files: `src/frameworks/quality-principles.md` (lines 56-66)
- Scaling path: Define explicitly: "Context % = (plan + context files size) / teammate context window"

## Dependencies at Risk

**Claude Code Agent Teams API:**
- Risk: Entire framework assumes TeamCreate, TaskCreate, Agent, SendMessage, TeamDelete are available. No version pinning or API stability commitment
- Files: `src/frameworks/teammate-orchestration.md` (lines 8-31), `src/commands/teddy.md`
- Impact: If Claude Code removes or changes these APIs, framework breaks completely
- Migration plan: Document required Claude Code version. Add `/teddy:health-check` to validate API availability

## Missing Critical Features

**No Plan Amendment Support:**
- Problem: Once plan is approved and execution starts, no mechanism to amend it mid-APPLY
- Files: `src/commands/plan.md`, `src/commands/apply.md`
- Current workaround: Abandon and restart, or continue with wrong plan
- Implementation complexity: Medium — requires `/teddy:amend-plan` command with approval step

**No Rollback Mechanism:**
- Problem: UNIFY merges and commits. Only recovery is manual git revert
- Files: `src/commands/unify.md`
- Current workaround: `git revert` or `git reset`
- Implementation complexity: Low — tag rollback points in SUMMARY.md after merge

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: Entire codebase (0% coverage)
- Files: `bin/install.js` (only testable code)
- Risk: Installer bugs go undetected (path resolution, file copying, content rewriting)
- Priority: Medium — framework is primarily markdown, but installer has real logic
- Difficulty to test: Low for `install.js` functions (pure logic, mockable fs)

**No End-to-End Workflow Validation:**
- What's not tested: Complete PLAN -> APPLY -> UNIFY cycle
- Risk: Integration issues between phases go undetected
- Priority: Low — dogfooding (`.teddy/phases/01-skill-metadata/`) provides manual validation
- Difficulty to test: High — requires Claude Code runtime environment

---

*Concerns audit: 2026-03-24*
*Update as issues are fixed or new ones discovered*
