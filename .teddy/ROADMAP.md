# Roadmap: teddy-framework

## Overview

Evolução do Teddy de um conjunto de skills individuais para um framework completo de orquestração de trabalho, com planejamento estruturado em fases, execução paralela via times de agentes, e continuidade entre sessões.

## Current Milestone

**v0.7 Polish & Automation** (v0.7.0)
Status: Complete
Phases: 2 of 2 complete

## Milestones

### v0.7 Polish & Automation

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 08 | Bug Fixes + Test Gaps + Markdown Polish | 1 | Complete | 2026-03-25 |
| 09 | Explore Redesign + CHANGELOG + v0.7.0 Release | 1 | Complete | 2026-03-25 |

### v0.6 Skill Flows

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 07 | Skill Flows | 1 | Complete | 2026-03-25 |

### v0.5 Housekeeping + Plan Resilience

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 05 | Housekeeping v0.5 | 1 | Complete | 2026-03-25 |
| 06 | Plan Resilience | 1 | Complete | 2026-03-25 |

### v0.4 (Published)

No phases tracked — published directly.

### v0.3 Workflow Orchestration (Complete)

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 01 | Skill Metadata & Command References | 1 | Complete | 2026-03-24 |
| 02 | Fix Contradictions & Consistency | 1 | Complete | 2026-03-24 |
| 03 | Installer Hardening | 1 | Complete | 2026-03-24 |
| 04 | Session Resilience | 1 | Complete | 2026-03-25 |

## Phase Details

### Phase 08: Bug Fixes + Test Gaps + Markdown Polish

**Objetivo:** Corrigir bug no install.js (3 comandos ausentes no listing), adicionar teste de paridade install ↔ commands, e revisar todos os markdowns do projeto corrigindo formatação, typos e inconsistências.

**Origem:** EXPLORATION-2026-03-25-polish-automation.md (findings #1, #2, #5)

| Plan | Name | Status |
|------|------|--------|
| 08-01 | Install fix + test parity + markdown review | Complete |

### Phase 09: Explore Redesign + CHANGELOG + v0.7.0 Release

**Objetivo:** Melhorar explore skill (context loading, past explorations, parallel analysis), criar CHANGELOG.md com histórico completo, e bump para v0.7.0.

**Origem:** EXPLORATION-2026-03-25-polish-automation.md (findings #5, #6) — Phases 09+10 merged por sizing.

| Plan | Name | Status |
|------|------|--------|
| 09-01 | Explore redesign + CHANGELOG + v0.7.0 release | Complete |

### Phase 05: Housekeeping v0.5

**Objetivo:** Bump para v0.5.0, sincronizar state files, completar README, atualizar vitest para 4.x.

**Origem:** EXPLORATION-2026-03-25-housekeeping-resilience.md (findings #1, #2, #3, #5)

| Plan | Name | Status |
|------|------|--------|
| 05-01 | Version bump v0.5.0 + README + vitest upgrade | Complete |

### Phase 06: Plan Resilience

**Objetivo:** Adicionar /teddy:amend-plan para modificar planos mid-execution e /teddy:rollback para reverter merges pós-UNIFY com safety tags.

**Origem:** EXPLORATION-2026-03-25-housekeeping-resilience.md (findings #7, #8)

| Plan | Name | Status |
|------|------|--------|
| 06-01 | amend-plan + rollback commands | Complete |

### Phase 07: Skill Flows

**Objetivo:** Implementar /teddy:flows com auto-discovery de skills, matching semântico, confirmation flow, e integração no loop (detect no PLAN, gate no APPLY, audit no UNIFY).

**Origem:** EXPLORATION-2026-03-25-flows-auto-recognition.md

| Plan | Name | Status |
|------|------|--------|
| 07-01 | Skill Flows com Auto-Reconhecimento | Complete |

---

### Phase 01: Skill Metadata & Command References

**Objetivo:** Adicionar `description` no frontmatter de cada command file e corrigir todas as referências de comando para usar sintaxe `/teddy:command` (com dois-pontos).

| Plan | Name | Status |
|------|------|--------|
| 01-01 | Add descriptions + fix colon syntax | Complete |

### Phase 02: Fix Contradictions & Consistency

**Objetivo:** Corrigir contradições internas entre documentos (sizing guidance, versão) e inconsistências de routing entre comandos.

**Origem:** EXPLORATION-2026-03-24-stabilization.md (findings #1, #2, #7)

| Plan | Name | Status |
|------|------|--------|
| 02-01 | Align sizing guidance + fix version | Complete |

### Phase 03: Installer Hardening

**Objetivo:** Tornar install.js robusto para distribuição npm — input validation, testes unitários, verificação de @references, e security warnings nos commands.

**Origem:** EXPLORATION-2026-03-24-stabilization.md (findings #3, #4, #5, #12)

| Plan | Name | Status |
|------|------|--------|
| 03-01 | Harden install.js + test suite + security warnings | Complete |

### Phase 04: Session Resilience

**Objetivo:** Garantir que o framework se recupera de sessões interrompidas — cleanup de teams órfãos, validação de STATE.md, e pre-flight checks.

**Origem:** EXPLORATION-2026-03-24-stabilization.md (findings #6, #8)

| Plan | Name | Status |
|------|------|--------|
| 04-01 | Cleanup command + pre-flight checks + STATE.md validation | Complete |

---
*Roadmap created: 2026-03-24*
*Last updated: 2026-03-25*
