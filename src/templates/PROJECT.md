# PROJECT.md Template

Template for `.teddy/PROJECT.md` — the project's business context and requirements.

**Purpose:** Define what we're building, why it matters, and constraints. This is the brief that informs all planning and teammate assignments.

---

## File Template

```markdown
# {project-name}

## What This Is

[One paragraph describing what we're building. Be specific about the product/feature, not the technology.]

## Core Value

[Single sentence: What problem does this solve for whom? This is THE thing that matters.]

## Current State

| Attribute | Value |
|-----------|-------|
| Version | {version} |
| Status | [Prototype / MVP / Beta / Production] |
| Last Updated | {date} |

## Requirements

### Validated (Shipped)

[Requirements that have been implemented and proven]

- [x] [Requirement] — {version}

### Active (In Progress)

- [ ] [Requirement] — [status/notes]

### Planned (Next)

- [ ] [Requirement]

### Out of Scope

- [Excluded feature] — [reason]

## Target Users

**Primary:** [Who is the main user]
- [Key characteristic]
- [Their main goal/need]

## Constraints

### Technical Constraints
- [Constraint: e.g., "Must run on Vercel serverless"]

### Business Constraints
- [Constraint: e.g., "No PII storage outside approved regions"]

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| [What was decided] | [Why] | {date} | Active / Superseded |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | [e.g., Next.js 14] | |
| Database | [e.g., PostgreSQL] | |
| Hosting | [e.g., Vercel] | |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: {date}*
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{project-name}` | variable | Yes | Project identifier | `expense-tracker` |
| `{version}` | variable | Yes | Current version | `0.1.0` |
| `{date}` | variable | Yes | Current date | `2026-03-24` |
| `[What This Is]` | prose | Yes | Product description | `A CLI tool for managing Docker containers` |
| `[Core Value]` | prose | Yes | Problem solved for whom | `Users can track expenses and see spending patterns` |

## Section Specifications

### Core Value
**Purpose:** The ONE thing that matters. Guides all decisions.
**Format:** Single sentence answering "What problem for whom?"
**Quality check:** Is it specific and measurable?

### Requirements
**Purpose:** Track feature state across development.
**Categories:** Validated (shipped), Active (in progress), Planned (future), Out of Scope (excluded).
**Quality check:** Each requirement is independently verifiable.

### Constraints
**Purpose:** Hard limits on solutions that teammates must respect.
**Quality check:** Would violating any constraint cause real harm?
