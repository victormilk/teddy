# Plan Review Checklist

Validates a PLAN.md before approving for teammate execution.

## Structure
- [ ] Frontmatter has all required fields (phase, plan, type, wave, depends_on, files_modified, autonomous, teammates incl. team_name)
- [ ] Objective section has Goal, Purpose, and Output
- [ ] Acceptance criteria use Given/When/Then format
- [ ] Each AC is independently testable
- [ ] Boundaries section has DO NOT CHANGE and SCOPE LIMITS

## Task Quality
- [ ] Every auto task has: files, action, verify, done
- [ ] Action instructions are specific enough for a teammate to execute without questions
- [ ] Verify commands are concrete (not "it works")
- [ ] Done criteria link to AC-N numbers
- [ ] No task has vague instructions ("set up", "handle", "make it work")

## Teammate Assignment
- [ ] Each task has a teammate and wave assignment
- [ ] No file conflicts between same-wave teammates
- [ ] Each teammate's scope is self-contained
- [ ] TEAMMATE ISOLATION section defines file ownership
- [ ] Wave dependencies are genuine (not reflexive chaining)

## Scope
- [ ] Plan has 2-3 tasks maximum
- [ ] Estimated context per teammate is under 50%
- [ ] Vertical slices preferred over horizontal layers
- [ ] No task exceeds 60 minutes estimated effort

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 100% | Ship it | Approve for teammate execution |
| 75-99% | Fix and ship | Address gaps, then approve |
| 50-74% | Rework | Significant gaps — revise plan |
| Below 50% | Restart | Fundamental issues — redesign |
