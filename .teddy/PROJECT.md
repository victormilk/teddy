# teddy-framework

## What This Is

Um framework de workflow para Claude Code que decompõe trabalho em unidades atômicas e orquestra times de agentes para execução paralela coordenada.

## Core Value

Usuários podem planejar trabalho em fases e delegar para agentes em paralelo.

## Current State

| Attribute | Value |
|-----------|-------|
| Version | 0.3.0 |
| Status | Prototype |
| Last Updated | 2026-03-24 |

## Requirements

### Validated (Shipped)

- [x] Skill-based architecture with slash commands — v0.1.0
- [x] npx installer — v0.1.0
- [x] Codebase mapping templates — v0.2.0

### Active (In Progress)

- [ ] Structured planning and phase decomposition
- [ ] Agent team orchestration with shared task lists

### Planned (Next)

- [ ] Session resumption and state continuity
- [ ] Debug and review workflows

### Out of Scope

- GUI/web interface — CLI-first approach

## Target Users

**Primary:** Developers using Claude Code for complex projects
- Comfortable with CLI workflows
- Need to coordinate multi-step development tasks
- Want structured planning with parallel execution

## Constraints

### Technical Constraints
- Must run as Claude Code skills (no external runtime)
- Must work with npx installation flow

### Business Constraints
- Open source framework

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Skill-based architecture | Leverage Claude Code's native skill system for zero-config setup | 2026-03-24 | Active |
| Colon separator syntax (/teddy:command) | Consistent with Claude Code skill conventions | 2026-03-24 | Active |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Runtime | Claude Code | Skill execution environment |
| Language | Markdown + Shell | Skills defined as markdown templates |
| Distribution | npm/npx | `npx teddy-framework` installer |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-03-24*
