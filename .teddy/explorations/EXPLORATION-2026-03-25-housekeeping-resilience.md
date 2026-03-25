---
date: 2026-03-25
topic: Housekeeping v0.4 + Plan Resilience
confidence: HIGH
rounds: 3
direction: Sincronizar state files pós-v0.3, atualizar deps, e adicionar amend-plan + rollback para tornar o loop resiliente a mudanças mid-execution
---

# Exploration: Housekeeping v0.4 + Plan Resilience

## State Analysis

**Project:** teddy-framework v0.4.0 (package.json) / v0.3.0 (PROJECT.md — desatualizado)
**Milestone:** v0.3 Workflow Orchestration — COMPLETE (4/4 phases)
**Position:** Loop complete, aguardando próximo milestone
**Tests:** 76 passing (2 files: commands.test.js, install.test.js)

### What Was Analyzed
- PROJECT.md, ROADMAP.md, STATE.md — estado pós-v0.3
- Todos os 11 command files em src/commands/
- 4 SUMMARY.md files das fases completadas
- README.md — completude da documentação
- package.json — versão e dependências
- bin/install.js — 268 linhas, único código executável
- Test suite — vitest 3.2.4 (4.1.1 disponível)

### Key Observations
- Zero TODOs/FIXMEs no código real
- v0.3 milestone executou com sucesso (4 fases, 3 teammates/fase)
- State files ficaram defasados após bump para v0.4.0
- Loop PLAN → APPLY → UNIFY não tem mecanismo para mudanças mid-execution
- UNIFY não cria safety tag antes do merge

## Opportunities Identified

| # | Categoria | Finding | Prioridade | Esforço |
|---|-----------|---------|------------|---------|
| 1 | Bug | PROJECT.md diz v0.3.0, package.json diz v0.4.0 | HIGH | S |
| 2 | Stale State | ROADMAP.md e STATE.md referenciam v0.3 como corrente — sem v0.4+ | HIGH | S |
| 3 | Doc Gap | README.md não lista /teddy:cleanup na tabela de comandos | MEDIUM | S |
| 4 | Infra | Zero CI/CD — sem GitHub Actions | MEDIUM | M |
| 5 | Dependency | vitest 3.x → 4.x disponível (major upgrade) | LOW | S |
| 6 | Distribution | Sem workflow de release automatizado (npm publish) | MEDIUM | M |
| 7 | Feature | /teddy:amend-plan — modificar plano mid-execution | LOW | M |
| 8 | Feature | Rollback pós-UNIFY — reverter merge com safety tag | LOW | S |
| 9 | Validation | Framework só testado nele mesmo (dogfooding) | HIGH | L |
| 10 | DX | Sem onboarding tutorial ou exemplo para novos usuários | MEDIUM | M |
| 11 | Stale Docs | .teddy/codebase/ pode estar desatualizado pós-v0.3 | LOW | S |
| 12 | Feature | Sem métricas de execução de teammates | LOW | M |

## Discussion Summary

**Round 1:** Apresentação dos 12 findings com 3 recomendações top (housekeeping+CI, validação externa, release automation).

**Round 2:** Usuário selecionou #1, #2, #3, #5, #7, #8. Análise aprofundada de amend-plan (pausa teammates → modifica tasks → retoma) e rollback (git tag pré-merge + revert). Proposta de 2 fases.

**Round 3:** Convergência — usuário aprovou a divisão em 2 fases.

### Decisions
- Focar em housekeeping + plan resilience
- Excluídos: CI/CD (#4), release automation (#6), validação externa (#9), onboarding (#10), codebase docs (#11), métricas (#12)
- amend-plan pausa teammates via SendMessage, modifica task list, retoma
- rollback usa git tag `teddy/pre-unify/{plan-id}` criado pelo UNIFY

## Approved Direction

### Phase 05 — Housekeeping v0.4 (Small — execução direta)
- PROJECT.md: atualizar versão para v0.4.0
- STATE.md: limpar referências v0.3, marcar "awaiting next milestone"
- ROADMAP.md: adicionar milestone v0.4 com as 2 fases planejadas
- README.md: adicionar /teddy:cleanup na tabela de comandos
- vitest: upgrade 3.x → 4.x, confirmar 76 tests green

### Phase 06 — Plan Resilience (Medium — Agent Teams)
- `/teddy:amend-plan` command:
  - Pausar teammates ativos (SendMessage shutdown/pause)
  - Apresentar PLAN.md atual + diffs propostos ao usuário
  - Modificar tasks no shared task list (TaskCreate/TaskUpdate)
  - Atualizar PLAN.md com amendment log
  - Retomar teammates
  - UNIFY precisa saber que houve amendment para reconciliar
- `/teddy:rollback` command:
  - Modificar unify.md: criar git tag `teddy/pre-unify/{plan-id}` antes do merge
  - Novo rollback.md: revert ao tag + restaurar STATE.md pré-UNIFY
- Atualizar teddy.md entry point: adicionar ambos na tabela de comandos
- Atualizar README.md: adicionar ambos na documentação
- Testes: adicionar cobertura para novos commands em commands.test.js

### Estimated team for Phase 06:
- **command-dev**: amend-plan.md + rollback.md (novos commands)
- **state-eng**: modificações em unify.md (safety tag) + apply.md (amendment awareness) + state management
- **test-eng**: testes para novos commands + install.js awareness dos novos files

## How This Feeds Into Planning

- Phase 05: execução direta (sem Agent Teams) — /teddy:plan pode gerar plano simples
- Phase 06: Agent Teams com 3 roles — /teddy:plan gera plano completo com team composition

---
*Exploration: 2026-03-25*
*Confidence: HIGH — baseado em análise real do codebase + gaps identificados no loop*
