---
description: "Reconcile plan vs. results, merge worktrees, clean up teams, and close the loop"
---

<purpose>
Reconcile what was planned vs. what teammates built. Review worktree changes, merge results, create SUMMARY.md, update STATE.md, clean up the Agent Team, and close the loop to prepare for next PLAN.
</purpose>

<user-story>
As a developer, I want teammate results automatically reconciled, worktrees merged, and the Agent Team cleaned up, so that parallel work integrates cleanly and I have a clear record of what was built.
</user-story>

<when-to-use>
- APPLY phase complete (all teammates finished)
- Ready to close the current loop
- Need to merge worktree changes and record results
- Entry point routes here via /teddy:unify
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
@.teddy/phases/{phase}/{plan}-PLAN.md
</context>

<references>
@frameworks/loop-phases.md (for reconciliation process)
@templates/SUMMARY.md (for summary structure)
</references>

<steps>

<step name="gather_results" priority="first">
1. Read STATE.md to get active team name (e.g., "teddy-01-01")
2. Use `TaskList` to get all task statuses from the team's shared task list:
   - Which tasks completed successfully
   - Which tasks failed (if any)
   - Task completion notes and deviations
3. Read PLAN.md to refresh:
   - Original acceptance criteria
   - Expected outputs
   - Task definitions and teammate assignments
</step>

<step name="review_worktree_changes">
**For each teammate worktree with changes:**

1. Review the diff of changes made:
   - Files created/modified
   - Lines changed
   - Quality of implementation
2. Check for:
   - Boundary violations (files that shouldn't be modified)
   - Incomplete implementations
   - Code quality issues
3. Run verification commands from PLAN.md verify sections
4. Report review findings to user if issues found

**Wait for user approval on any flagged issues before merging.**
</step>

<step name="create_safety_tag">
**Create a safety tag before merging (rollback point):**

1. Determine plan ID from STATE.md (e.g., "05-01")
2. Create git tag on current HEAD:
   `git tag teddy/pre-unify/{plan-id}`
3. Verify tag was created:
   `git tag -l "teddy/pre-unify/{plan-id}"`
4. Log in output: "Safety tag created: teddy/pre-unify/{plan-id}"

This tag enables /teddy:rollback to revert if the merge produces unwanted results.
Do NOT delete this tag during cleanup — it serves as a permanent rollback point.
</step>

<step name="merge_worktrees">
**Merge teammate worktree changes into main branch:**

1. For each worktree (in dependency order):
   - Check for merge conflicts
   - If clean: merge changes
   - If conflicts: present to user for resolution

2. After all merges:
   - Run full verification suite
   - Confirm all acceptance criteria met

3. **If merge conflicts:**
   ```
   ════════════════════════════════════════
   MERGE CONFLICT
   ════════════════════════════════════════

   Teammate: [name]
   Files: [conflicting files]

   Resolution options:
   [1] I'll resolve manually
   [2] Keep teammate's version
   [3] Keep main branch version
   ════════════════════════════════════════
   ```
   Wait for resolution.
</step>

<step name="compare_plan_vs_actual">
1. For each acceptance criterion:
   - Was it satisfied? (PASS/FAIL)
   - Evidence of satisfaction
2. For each task (cross-reference TaskList results):
   - Did teammate complete as specified?
   - Any modifications to approach?
3. Note deviations:
   - What differed from plan
   - Why it differed
   - Impact on outcomes
</step>

<step name="create_summary">
Create SUMMARY.md at `.teddy/phases/{phase}/{plan}-SUMMARY.md` using @templates/SUMMARY.md:

Include teammate-specific sections:
- Team name and teammate roster
- Task completion results from shared task list
- Per-teammate files modified
- Merge status and any conflict resolutions
- Overall acceptance criteria results
</step>

<step name="cleanup_team">
**Gracefully shut down the Agent Team (resilient to partial failures):**

1. **Shutdown teammates (tolerant of missing teammates):**
   For each teammate:
   - Try SendMessage(to: "[name]", message: {type: "shutdown_request"})
   - If teammate is already gone (error/no response): log "teammate [name] already shut down" and continue
   - Do NOT fail the entire cleanup if one teammate is unreachable

2. **TeamDelete (tolerant of missing team):**
   - Try TeamDelete(team_name)
   - If team doesn't exist (already cleaned): log "team [name] already cleaned" and continue
   - If TeamDelete fails for another reason: log warning and continue with manual cleanup suggestion:
     ```
     ⚠ TeamDelete failed for [team-name]: [error]
     Manual cleanup: rm -rf ~/.claude/teams/[team-name] ~/.claude/tasks/[team-name]
     ```

3. **Worktree cleanup:**
   - Run `git worktree list` to find any remaining teddy worktrees
   - For each stale teddy worktree found:
     - Try `git worktree remove <path>`
     - If removal fails (locked): log warning with manual removal command:
       ```
       ⚠ Could not remove worktree: [path]
       Manual cleanup: git worktree remove --force [path]
       ```

4. **STATE.md update:**
   - Clear active team from Teammates section
   - If any cleanup failed partially, add note to Blockers section:
     ```
     Partial cleanup — manual intervention may be needed. See warnings above.
     ```

Do NOT delete teddy/pre-unify/* tags — they are permanent rollback points managed by /teddy:rollback.
</step>

<step name="update_state">
1. Update STATE.md:
   - Loop position: PLAN ✓ → APPLY ✓ → UNIFY ✓
   - Active team: [cleared]
   - Progress percentages updated
   - Session continuity: next action
2. Update ROADMAP.md if phase complete
3. Report with quick continuation:

```
════════════════════════════════════════
LOOP COMPLETE
════════════════════════════════════════

Plan: {NN}-{plan} — [description]
Team: teddy-{NN}-{PP} [cleaned up]
Teammates: [N] completed
Merge: [clean / N conflicts resolved]

[summary of what was built]
[deviations if any]

Phase {N} progress: {X}/{Y} plans complete

---
Continue to next plan?

[1] Yes, plan next | [2] Pause here
════════════════════════════════════════
```
</step>

</steps>

<output>
- SUMMARY.md at `.teddy/phases/{phase}/{plan}-SUMMARY.md`
- Worktree changes merged into main branch
- Agent Team cleaned up (TeamDelete)
- Updated STATE.md
- Updated ROADMAP.md (if phase complete)
</output>

<acceptance-criteria>
- [ ] All task results gathered from shared task list (TaskList)
- [ ] All teammate worktree changes reviewed
- [ ] Merge conflicts detected and resolved
- [ ] All worktrees merged into main branch
- [ ] Acceptance criteria results documented (PASS/FAIL each)
- [ ] SUMMARY.md created with team execution details
- [ ] Teammates gracefully shut down (shutdown_request)
- [ ] TeamDelete called to clean up team resources
- [ ] STATE.md updated with loop complete and team cleared
- [ ] ROADMAP.md updated if phase is complete
- [ ] User informed of results and next steps
</acceptance-criteria>
