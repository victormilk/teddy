# Unify Gate Checklist

Validates teammate results and worktree changes before merging into main branch.

## Team & Task Results
- [ ] All tasks in shared task list marked completed (TaskList check)
- [ ] Each task's verification passed
- [ ] Deviations from plan are documented with rationale
- [ ] No teammate modified files outside its assigned scope

## Code Quality
- [ ] No obvious bugs or logic errors in teammate output
- [ ] Code follows project conventions (naming, structure, patterns)
- [ ] No hardcoded secrets or security vulnerabilities introduced
- [ ] No unnecessary dependencies added
- [ ] Tests pass for modified code

## Merge Readiness
- [ ] No file conflicts between teammate worktrees
- [ ] If conflicts exist: resolution strategy determined
- [ ] Worktree branches are clean (no uncommitted changes)
- [ ] Main branch is up to date before merge

## Acceptance Criteria
- [ ] All AC from PLAN.md verified (PASS/FAIL for each)
- [ ] No AC marked FAIL without documented blocker
- [ ] Verification commands from PLAN.md executed successfully
- [ ] Overall plan objective achieved

## Documentation & Cleanup
- [ ] SUMMARY.md ready to be created with all sections
- [ ] Team execution table populated (from TaskList)
- [ ] Merge results documented
- [ ] Deviations section accurate
- [ ] Teammates shut down (SendMessage shutdown_request)
- [ ] TeamDelete called to clean up team resources

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 100% | Merge | All clear — merge worktrees and close loop |
| 75-99% | Fix first | Address issues, then merge |
| 50-74% | Investigate | Too many issues — review with user |
| Below 50% | Reject | Teammate output needs rework |
