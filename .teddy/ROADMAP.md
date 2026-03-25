# Roadmap: teddy-framework

## Overview

Evolução do Teddy de um conjunto de skills individuais para um framework completo de orquestração de trabalho, com planejamento estruturado em fases, execução paralela via times de agentes, e continuidade entre sessões.

## Current Milestone

**v0.3 Workflow Orchestration** (v0.3.0)
Status: Complete
Phases: 4 of 4 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 01 | Skill Metadata & Command References | 1 | Complete | 2026-03-24 |
| 02 | Fix Contradictions & Consistency | 1 | Complete | 2026-03-24 |
| 03 | Installer Hardening | 1 | Complete | 2026-03-24 |
| 04 | Session Resilience | 1 | Complete | 2026-03-25 |

## Phase Details

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
*Last updated: 2026-03-24*
