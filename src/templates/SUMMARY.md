# SUMMARY.md Template

Template for `.teddy/phases/{phase-number}-{name}/{phase}-{plan}-SUMMARY.md` — plan completion documentation with teammate execution details.

**Purpose:** Document what teammates built, decisions made, deviations from plan, merge results, and readiness for next phase.

---

## File Template

```markdown
---
phase: XX-name
plan: NN
completed: {iso-timestamp}
duration: {duration}
teammates_spawned: {count}
merge_status: [clean / conflicts-resolved]
---

# Phase {phase-number} Plan {plan-number}: {name} Summary

**{substantive-one-liner}**

## Performance

| Metric | Value |
|--------|-------|
| Duration | {duration} |
| Started | {iso-timestamp} |
| Completed | {iso-timestamp} |
| Tasks | {count} completed |
| Teammates | {count} spawned |
| Waves | {count} executed |

## Teammate Execution

| Teammate | Task | Wave | Duration | Result | Files Modified |
|----------|------|------|----------|--------|----------------|
| teammate-1 | [task name] | 1 | [time] | PASS/FAIL | [file list] |
| teammate-2 | [task name] | 1 | [time] | PASS/FAIL | [file list] |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: [Name] | Pass / Fail | [Details] |
| AC-2: [Name] | Pass / Fail | [Details] |

## Merge Results

| Worktree | Branch | Merge Status | Conflicts |
|----------|--------|-------------|-----------|
| teammate-1 | [branch] | Clean / Resolved | [details if any] |
| teammate-2 | [branch] | Clean / Resolved | [details if any] |

## Accomplishments

- [Most important outcome — specific, substantive]
- [Second key accomplishment]

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Auto-fixed | [N] | [Brief assessment] |
| Scope additions | [N] | [Brief assessment] |
| Deferred | [N] | Logged to issues |

Or: "None — plan executed exactly as written"

## Next Phase Readiness

**Ready:**
- [What's ready for next phase]

**Concerns:**
- [Potential issues]

**Blockers:**
- [Anything blocking next phase] or "None"

---
*Phase: XX-name, Plan: NN*
*Completed: {date}*
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{iso-timestamp}` | variable | Yes | ISO 8601 timestamp | `2026-03-24T14:30:00Z` |
| `{duration}` | variable | Yes | Execution time | `12min` |
| `{count}` | variable | Yes | Numeric count | `3` |
| `{substantive-one-liner}` | prose | Yes | What actually shipped | `JWT auth with refresh rotation` |

## Section Specifications

### Teammate Execution
**Purpose:** Record per-teammate results for audit trail.
**Quality check:** Every teammate accounted for with pass/fail and duration.

### Merge Results
**Purpose:** Document worktree merge status.
**Quality check:** All worktrees merged or conflicts documented.
