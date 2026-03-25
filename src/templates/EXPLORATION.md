# EXPLORATION.md Template

Template for `.teddy/phases/{phase}/EXPLORATION.md` — structured output from the explore workflow that feeds into planning.

**Purpose:** Capture research findings, comparisons, and recommendations that inform the next PLAN.md.

---

## File Template

```markdown
# Exploration: {topic}

**Date:** {date}
**Depth:** [Quick / Standard / Deep]
**Confidence:** [HIGH / MEDIUM / LOW]
**Decision it informs:** [What planning decision this feeds]
**Prior explorations reviewed:** [List of EXPLORATION files checked, or "None — first exploration"]

## Question

[The specific question or topic being explored]

## Options Evaluated

### Option A: {option-name}

**What it is:** [Brief description]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Limitation 1]
- [Limitation 2]

**Compatibility:** [How it fits with existing stack/approach]

### Option B: {option-name}

**What it is:** [Brief description]

**Pros:**
- [Advantage 1]

**Cons:**
- [Limitation 1]

**Compatibility:** [How it fits]

## Comparison

| Criterion | Option A | Option B |
|-----------|----------|----------|
| [Criterion 1] | [Rating/notes] | [Rating/notes] |
| [Criterion 2] | [Rating/notes] | [Rating/notes] |
| [Criterion 3] | [Rating/notes] | [Rating/notes] |

## Recommendation

**Choice:** [Recommended option]
**Rationale:** [Why this option wins]
**Confidence:** [HIGH / MEDIUM / LOW] — [reason for confidence level]

## Impact on Planning

- [How this affects the plan structure]
- [Teammate implications (if any)]
- [Dependencies or constraints introduced]

## Open Questions

- [Anything unresolved that may need revisiting]

---
*Explored: {date}*
*Feeds into: Phase {phase} planning*
```

---

## Field Documentation

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `{topic}` | variable | Yes | Exploration topic | `auth-library-choice` |
| `{date}` | variable | Yes | Exploration date | `2026-03-24` |
| `{option-name}` | variable | Yes | Option identifier | `jose`, `jsonwebtoken` |
| `[Question]` | prose | Yes | What's being explored | `Which JWT library for Edge runtime?` |
| `[Recommendation]` | prose | Yes | Chosen option with rationale | `jose — native Edge support, active maintenance` |
| `[Prior explorations]` | prose | Yes | Which past explorations were reviewed | `EXPLORATION-2026-03-24-stabilization.md, EXPLORATION-2026-03-25-flows.md` |

## Section Specifications

### Options Evaluated
**Purpose:** Structured comparison of alternatives.
**Quality check:** Each option has pros, cons, and compatibility assessment.

### Recommendation
**Purpose:** Clear decision with rationale and confidence.
**Quality check:** Would someone disagree? If not, why did we need exploration?

### Impact on Planning
**Purpose:** Bridge from exploration to plan creation.
**Quality check:** Does this translate directly into plan decisions?
