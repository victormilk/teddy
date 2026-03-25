---
date: 2026-03-24
topic: Framework Stabilization
confidence: HIGH
rounds: 2
direction: Estabilizar o framework para uso real — corrigir bugs, hardening do installer, e resiliência de sessão
---

# Exploration: Framework Stabilization

## State Analysis

**Project:** teddy-framework v0.3.0
**Milestone:** v0.3 Workflow Orchestration
**Position:** Phase 01 complete (Skill Metadata & Command References), loop fechado

### What Was Analyzed
- PROJECT.md, ROADMAP.md, STATE.md — estado do projeto
- Todos os 11 command files em src/commands/
- Frameworks: teammate-orchestration.md, plan-review.md, quality-principles.md
- bin/install.js — instalador (267 linhas, único código executável)
- .teddy/codebase/CONCERNS.md — concerns já identificados

### Key Observations
- Zero TODOs/FIXMEs no código real
- Zero arquivos de teste (0% coverage)
- Phase 01 executou com sucesso via 3 teammates em ~2min
- Framework está se dogfooding (`.teddy/` commitado no repo)

## Opportunities Identified

| # | Categoria | Finding | Prioridade | Esforço |
|---|-----------|---------|------------|---------|
| 1 | Bug | Contradição sizing: plan-review "2-3 tasks max" vs orchestration "5-6/role, 15-30 total" | HIGH | S |
| 2 | Bug | Versão inconsistente: PROJECT.md v0.2.0 vs package.json v0.3.0 | HIGH | S |
| 3 | Security | Installer aceita --config-dir sem validação (path traversal) | HIGH | S |
| 4 | Security | explore.md e debug.md não alertam contra secrets nos findings | MEDIUM | S |
| 5 | Tech Debt | Zero testes — install.js tem lógica testável | MEDIUM | M |
| 6 | Improvement | Sem cleanup para teams órfãos (sessão morre antes do UNIFY) | MEDIUM | M |
| 7 | Improvement | Routing inconsistente entre comandos | MEDIUM | S |
| 8 | Resilience | STATE.md ponto único de falha — sem backup/validação | MEDIUM | M |
| 9 | Feature | Sem /teddy:amend-plan | LOW | M |
| 10 | Feature | Sem rollback pós-UNIFY | LOW | S |
| 11 | Docs | Limites de escalabilidade não documentados | LOW | S |
| 12 | Improvement | @references não validadas no install | LOW | S |

## Discussion Summary

**Round 1:** Apresentação dos 12 findings com 3 recomendações top.
**Round 2:** Usuário aprovou phasear as 3 recomendações como direção.

### Decisions
- Focar em estabilização antes de features novas
- 3 phases sequenciais: bugs → installer → resiliência
- Features (#9, #10) e docs de scaling (#11) excluídos do escopo

## Approved Direction

### Phase 02 — Fix Contradictions (Small)
- Consolidar sizing guidance: plan-review.md vs teammate-orchestration.md vs teddy.md
- Definir standard único (5-6 tasks/role é o correto, plan-review precisa ser atualizado)
- Corrigir versão em PROJECT.md para v0.3.0
- Corrigir routing inconsistente no explore.md

### Phase 03 — Installer Hardening (Medium)
- Validação de --config-dir (path sanitization, sem traversal)
- Testes unitários para install.js (copyRecursive, resolveTarget, countFiles, path rewriting)
- Verificação pós-install que @references resolvem corretamente
- Adicionar secrets warning em explore.md e debug.md

### Phase 04 — Session Resilience (Medium)
- `/teddy:cleanup` command para teams/tasks órfãos
- Validação de integridade do STATE.md (cross-check com filesystem)
- Pre-flight check no apply.md que alerta sobre teams stale

## How This Feeds Into Planning

Cada phase acima vira um `/teddy:plan` separado:
- Phase 02: ~3-5 tasks, possivelmente execução direta (escopo pequeno)
- Phase 03: ~12-15 tasks, 3 teammates (test-eng, installer-dev, security-dev)
- Phase 04: ~10-12 tasks, 3 teammates (command-dev, state-eng, test-eng)

---
*Exploration: 2026-03-24*
*Confidence: HIGH — baseado em análise real do codebase + concerns existentes*
