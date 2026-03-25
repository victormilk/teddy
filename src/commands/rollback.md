---
description: "Revert a completed UNIFY by restoring pre-merge state from safety tag"
---

<purpose>
Revert the last UNIFY operation by restoring the codebase to the pre-merge state captured in a git safety tag. Restores STATE.md and ROADMAP.md to their pre-UNIFY values.
</purpose>

<user-story>
As a developer, I want to undo a bad merge from UNIFY, so that I can return to the pre-merge state without losing the ability to re-execute or fix the plan.
</user-story>

<when-to-use>
- After UNIFY introduced bugs or unwanted changes
- When merge produced incorrect results
- When wanting to re-execute with a different approach
- When post-merge testing reveals integration failures
- Entry point routes here via /teddy:rollback
</when-to-use>

<context>
@context/session.md
@.teddy/STATE.md
</context>

<references>
@frameworks/loop-phases.md
</references>

<steps>

<step name="find_safety_tag" priority="first">
1. List git tags matching `teddy/pre-unify/*`:
   ```bash
   git tag -l "teddy/pre-unify/*" --sort=-creatordate
   ```
2. If no tags found: exit with message:
   ```
   No safety tags found.
   Safety tags are created by UNIFY before merging.
   Nothing to roll back to.
   ```
3. Show available tags with age and associated plan:
   ```
   ════════════════════════════════════════
   ROLLBACK — Available Safety Tags
   ════════════════════════════════════════

   [1] teddy/pre-unify/06-01 (2 hours ago) — Phase 06, Plan 01
   [2] teddy/pre-unify/05-02 (3 days ago) — Phase 05, Plan 02

   Select tag to roll back to [1]:
   ```
4. Default to most recent tag. Wait for user selection.
</step>

<step name="show_revert_scope">
1. Show what will be reverted:
   ```bash
   git diff [selected-tag]..HEAD --stat
   ```
2. Show commits that will be undone:
   ```bash
   git log [selected-tag]..HEAD --oneline
   ```
3. Check for uncommitted changes:
   ```bash
   git status --porcelain
   ```
4. If uncommitted changes exist, warn:
   ```
   WARNING: You have uncommitted changes that will be LOST:
   [list of changes]

   Stash or commit them before proceeding.
   ```
   - Do NOT proceed if uncommitted changes exist
5. Require explicit "yes" confirmation:
   ```
   This will:
   - Revert [N] commits
   - Restore [N] files to pre-UNIFY state
   - STATE.md and ROADMAP.md will be restored automatically

   Type "yes" to confirm rollback:
   ```
   - Only accept literal "yes" — not "y", "ok", or "sure"
</step>

<step name="execute_rollback">
1. Create backup tag before destructive operation:
   ```bash
   git tag teddy/pre-rollback/{plan-id}
   ```
2. Reset to safety tag:
   ```bash
   git reset --hard [selected-tag]
   ```
3. Verify STATE.md shows loop position at APPLY complete
4. If verification fails: warn user but do not auto-recover
</step>

<step name="post_rollback">
1. Report results with next-step options:

```
════════════════════════════════════════
ROLLBACK COMPLETE
════════════════════════════════════════

Restored to: [selected-tag]
Backup tag: teddy/pre-rollback/[plan-id]
Commits reverted: [N]

STATE.md now shows: APPLY complete

---
What next?

[1] Re-run UNIFY with different strategy
[2] Amend plan and re-execute (/teddy:amend-plan)
[3] Pause and review

To undo this rollback:
  git reset --hard teddy/pre-rollback/[plan-id]
```

2. Do NOT auto-delete any tags — safety tags and backup tags are preserved
3. Accept quick inputs: "1" -> run `/teddy:unify`, "2" -> run `/teddy:amend-plan`
</step>

</steps>

<output>
Codebase reverted to pre-UNIFY state
Backup tag created at `teddy/pre-rollback/{plan-id}`
STATE.md restored to APPLY complete position
</output>

<acceptance-criteria>
- [ ] Lists available pre-unify safety tags with age and plan info
- [ ] Shows revert scope (commits, files) before proceeding
- [ ] Warns about uncommitted changes
- [ ] Requires explicit "yes" confirmation (not ambiguous input)
- [ ] Creates backup tag before destructive operation
- [ ] Restores codebase to pre-merge state via git reset
- [ ] STATE.md automatically restored (part of repo state)
- [ ] Reports results with clear next-step options
- [ ] Handles edge cases: no tags found, uncommitted changes, already at tag
</acceptance-criteria>
