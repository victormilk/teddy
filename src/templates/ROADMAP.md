# ROADMAP.md Template

Template for `.teddy/ROADMAP.md` — the project's phase structure and milestone tracking.

**Purpose:** Define milestones and phases. Provides structure, not detailed tasks.

---

## File Template

```markdown
# Roadmap: {project-name}

## Overview

[One paragraph describing the journey from start to finish]

## Current Milestone

**{milestone-name}** ({version})
Status: [Not started | In progress | Complete]
Phases: [X] of [Y] complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | [Name] | [N] | Not started | - |
| 2 | [Name] | [N] | Not started | - |
| 3 | [Name] | [N] | Not started | - |

## Phase Details

### Phase 1: [Name]

**Goal:** [What this phase delivers — specific outcome]
**Depends on:** Nothing (first phase)
**Teammate potential:** [High / Medium / Low] — [reason]

**Scope:**
- [Deliverable 1]
- [Deliverable 2]

**Plans:**
- [ ] 01-01: [Brief description]
- [ ] 01-02: [Brief description]

### Phase 2: [Name]

**Goal:** [What this phase delivers]
**Depends on:** Phase 1 ([specific dependency])
**Teammate potential:** [High / Medium / Low]

**Scope:**
- [Deliverable 1]
- [Deliverable 2]

**Plans:**
- [ ] 02-01: [Brief description]

---
*Roadmap created: {date}*
*Last updated: {date}*
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{project-name}` | variable | Yes | Project identifier | `expense-tracker` |
| `{milestone-name}` | variable | Yes | Milestone name | `v0.1 Initial Release` |
| `{version}` | variable | Yes | Milestone version | `v0.1.0` |
| `{date}` | variable | Yes | Date | `2026-03-24` |
| `[Goal]` | prose | Yes | Phase deliverable | `User auth system with JWT` |

## Section Specifications

### Teammate Potential
**Purpose:** Pre-assess parallelization opportunity per phase.
**High:** Multiple independent features — ideal for parallel teammates.
**Medium:** Some independent work but shared dependencies.
**Low:** Sequential work, limited parallelization.
