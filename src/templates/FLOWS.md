# FLOWS.md Template

Template for `.teddy/FLOWS.md` — skill dependency mappings with auto-discovery results, project mappings, and enforcement metadata.

**Purpose:** Persist the skill flow configuration so that `/teddy:plan`, `/teddy:apply`, and `/teddy:unify` can detect, verify, and audit skill usage across the development loop.

---

## File Template

```markdown
# Flows: {project_name}

Configured: {date}
Last Updated: {date}
Skills: {N} required, {N} recommended, {N} optional

## Discovered Skills

| Skill | Description | Category | Source |
|-------|-------------|----------|--------|
| {skill_name} | {description from frontmatter} | {category} | {path relative to ~/.claude/commands/} |

## Project Mappings

| Work Type | Skill | Priority | Trigger | Confidence | Confirmed |
|-----------|-------|----------|---------|------------|-----------|
| {work_type} | {skill_name} | {priority} | {trigger} | {confidence} | {date} |

## Rejected Suggestions

| Skill | Reason Suggested | Reason Rejected | Date |
|-------|-----------------|-----------------|------|
| {skill_name} | {match reason from discovery} | {user-provided reason} | {date} |

## Phase Overrides

| Phase | Additional Skills | Notes |
|-------|-------------------|-------|
| {phase_id} | {skill_name} ({priority}) | {user note or empty} |

## Verification Checklist

- [ ] Required skills for current phase configured in PLAN.md <skills>
- [ ] All required skills present before /teddy:apply
- [ ] Skill usage audited before /teddy:unify

## Amendment History

| Date | Change | Reason |
|------|--------|--------|
| {date} | {description of change} | {reason for change} |
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{project_name}` | string | Yes | Project name from PROJECT.md | `my-saas-app` |
| `{date}` | date | Yes | ISO date (YYYY-MM-DD) | `2026-03-25` |
| `{N}` | number | Yes | Count of skills at that priority level | `3` |
| `{skill_name}` | string | Yes | Skill identifier (filename without .md) | `api-patterns` |
| `{description}` | string | Yes | Description from skill frontmatter | `REST API design patterns` |
| `{category}` | enum | Yes | Skill category | `backend`, `testing`, `security` |
| `{source}` | path | Yes | Path relative to ~/.claude/commands/ | `backend/api-patterns.md` |
| `{work_type}` | enum | Yes | Type of work the skill applies to | `design`, `backend`, `frontend`, `testing`, `devops`, `content`, `security`, `other` |
| `{priority}` | enum | Yes | Enforcement level | `required`, `recommended`, `optional` |
| `{trigger}` | enum | Yes | When the skill should be used | `always`, `phase-specific`, `manual` |
| `{confidence}` | enum | Yes | Auto-match confidence from discovery | `HIGH`, `MEDIUM`, `LOW` |
| `{phase_id}` | string | No | Phase identifier for override | `03-testing` |

## Section Specifications

### Discovered Skills
**Purpose:** Record all skills found during the discovery scan, regardless of whether they were matched or accepted. Serves as a reference catalog.
**Quality check:** Every skill in ~/.claude/commands/ that was scanned should appear here with accurate frontmatter data.

### Project Mappings
**Purpose:** The active skill-to-project bindings that drive enforcement. Only contains user-confirmed skills.
**Quality check:** Every row has a confirmed date. Priority and trigger are valid enum values. No duplicate skill entries.

### Rejected Suggestions
**Purpose:** Track which skills the user explicitly rejected so they are not re-suggested on future runs. Preserves user decisions.
**Quality check:** Every rejected skill has a user-provided reason. Date is recorded for context.

### Phase Overrides
**Purpose:** Allow phase-specific skill additions beyond the project-wide defaults. For example, a testing phase may need an e2e skill not required elsewhere.
**Quality check:** Phase identifiers match ROADMAP.md phase names. Additional skills reference valid skill names.

### Verification Checklist
**Purpose:** Checklist items that should be confirmed at each stage of the loop. Updated as skills are configured and verified.
**Quality check:** Items are specific to current phase and reflect actual FLOWS.md content.

### Amendment History
**Purpose:** Track manual changes made via `/teddy:flows add` or direct edits, providing an audit trail.
**Quality check:** Every `/teddy:flows add` invocation adds a row. Changes are described clearly.
