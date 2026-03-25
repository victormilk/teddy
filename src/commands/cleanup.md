---
description: "Detect and clean orphaned teams, tasks, and worktrees from interrupted sessions"
---

<purpose>
Detect and clean orphaned Agent Team resources (teams, tasks, worktrees) left by interrupted sessions. Validates STATE.md consistency and performs safe recovery with user confirmation.
</purpose>

<user-story>
As a developer, I want to clean up resources from crashed sessions, so that the framework can resume normal operation without stale teams or orphaned worktrees blocking new work.
</user-story>

<when-to-use>
- After a session crash or interruption during APPLY/UNIFY
- When /teddy:resume or /teddy:apply warns about stale resources
- Preventive health check before starting new work
- Entry point routes here via /teddy:cleanup
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
</context>

<references>
@frameworks/loop-phases.md (for understanding loop state)
@frameworks/teammate-orchestration.md (for team lifecycle)
</references>

<steps>

<step name="scan_teams" priority="first">
1. Check for `.teddy/STATE.md`:
   - If not found: "No STATE.md found. Run /teddy:init first." — exit workflow
2. Read STATE.md to identify any actively referenced team
3. List directories in `~/.claude/teams/` matching `teddy-*` pattern
   - If teams directory doesn't exist: "No teams directory found. Nothing to clean."
4. For each team found:
   - Check if STATE.md references it as the active team
   - Determine age (directory modification time)
   - Count tasks via `~/.claude/tasks/{team-name}/`
5. Classify: teams NOT referenced in STATE.md as active = orphaned
6. **Safety guard:** Never flag a team as orphaned if STATE.md shows loop in APPLY with that team name actively running
7. Show table:

```
| Team | Age | Tasks | Status |
|------|-----|-------|--------|
| teddy-01-01 | 3h | 12 | orphaned |
| teddy-02-01 | 10m | 8 | active |
```
</step>

<step name="scan_tasks">
1. List directories in `~/.claude/tasks/` matching `teddy-*` pattern
2. Cross-reference each with active teams from scan_teams
3. Orphaned task directories = those with no matching active team
4. Report count and names of orphaned task directories
</step>

<step name="scan_worktrees">
1. Run `git worktree list` and identify worktrees matching teddy patterns
2. Cross-reference with active teams
3. Stale worktrees = those with no matching active team
4. Report each stale worktree path and its associated team name
</step>

<step name="validate_state">
Read STATE.md and cross-check for inconsistencies:

1. If STATE.md says a team is active, verify team exists in `~/.claude/teams/`
2. If STATE.md says APPLY in progress, verify tasks exist in `~/.claude/tasks/`
3. If STATE.md loop position is inconsistent (e.g., APPLY marked complete but no UNIFY and no active team), flag it
4. Report inconsistencies as warnings:

```
Warnings:
- STATE.md references team "teddy-01-01" but no team directory found
- Loop shows APPLY complete but UNIFY never started and no active team
```
</step>

<step name="report_and_act">
Display consolidated findings:

```
════════════════════════════════════════
CLEANUP SCAN RESULTS
════════════════════════════════════════

Orphaned teams: [N]
Stale worktrees: [N]
Orphaned task dirs: [N]
STATE.md issues: [N]

[table of orphaned resources]

────────────────────────────────────────
Actions:
[1] Clean all — remove orphaned resources
[2] Clean selectively — choose what to remove
[3] Report only — no changes
════════════════════════════════════════
```

**If no orphaned resources found:**
"All clean. No orphaned resources detected."

Require explicit user selection before proceeding.
</step>

<step name="execute_cleanup">
On user confirmation only:

1. **Show exactly what will be deleted before acting:**
   - List each team, worktree, and task directory to be removed
   - Ask for final confirmation: "Proceed with cleanup? (yes/no)"
2. For orphaned teams: call `TeamDelete` for each
3. For stale worktrees: run `git worktree remove [path]` for each
4. For orphaned task directories: remove via filesystem
5. For STATE.md inconsistencies: update STATE.md to reflect actual state
   - Clear stale team references
   - Fix loop position to match reality
6. Report results:

```
════════════════════════════════════════
CLEANUP COMPLETE
════════════════════════════════════════

Removed: [N] teams, [N] worktrees, [N] task dirs
STATE.md: [updated / no changes needed]

[warnings about any resources that couldn't be cleaned and why]
════════════════════════════════════════
```
</step>

</steps>

<output>
- Cleaned resources summary (teams, worktrees, task directories removed)
- Updated STATE.md (if inconsistencies were fixed)
- Warnings about any resources that couldn't be cleaned (and why)
</output>

<acceptance-criteria>
- [ ] Scans ~/.claude/teams/ for orphaned teddy-* teams
- [ ] Scans ~/.claude/tasks/ for orphaned task directories
- [ ] Scans git worktrees for stale teddy worktrees
- [ ] Validates STATE.md consistency against actual resources
- [ ] Never deletes a team that STATE.md shows as actively running
- [ ] Requires explicit user confirmation before any destructive action
- [ ] Shows exactly what will be deleted before acting
- [ ] Handles edge cases: no STATE.md, no teams directory, no orphans found
- [ ] Reports cleanup results with warnings for anything that failed
</acceptance-criteria>
