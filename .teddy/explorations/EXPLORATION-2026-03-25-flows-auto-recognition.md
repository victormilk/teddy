# Exploration: Flows — Skill Dependencies com Auto-Reconhecimento

**Date:** 2026-03-25
**Depth:** Deep
**Confidence:** HIGH
**Decision it informs:** Implementação do sistema /teddy:flows para v0.6.0

## Question

Como implementar um sistema de skill dependencies no Teddy, inspirado no paul:flows, mas com auto-reconhecimento de quando/como usar skills — pedindo confirmação ao usuário?

## Options Evaluated

### Option A: Port direto do Paul (manual-only)

**What it is:** Replicar o SPECIAL-FLOWS.md do Paul — usuário declara manualmente quais skills usar, mapeando skill → work type → trigger. Discovery limitado a `ls ~/.claude/commands/`.

**Pros:**
- Implementação simples e rápida
- Pattern já validado pelo Paul (443 stars)
- Menor risco de sugestões incorretas

**Cons:**
- Depende da memória do usuário para mapear skills
- Sem análise semântica — não sabe o que cada skill faz
- Skill configuration fica obsoleta quando o projeto evolui
- Não resolve o problema real: usuário esquece de usar skills relevantes

**Compatibility:** Encaixa direto no loop PLAN → APPLY → UNIFY existente

### Option B: Auto-reconhecimento com confirmação (proposto)

**What it is:** Sistema de 3 camadas — Discovery (ler frontmatter dos skills), Matching (cruzar com contexto do projeto/fase/tasks), Confirmation (apresentar sugestões e pedir validação). O mapeamento é sugerido automaticamente mas sempre confirmado pelo usuário.

**Pros:**
- Proativo: surfacea skills que o usuário poderia esquecer
- Contextual: sugestões variam por fase/plan baseado no conteúdo real
- Aprendizado: skills rejeitados são marcados para não sugerir novamente
- Diferencial claro vs Paul — transforma de "declarativo" para "inteligente"
- Confirmation flow preserva o controle do usuário

**Cons:**
- Mais complexo de implementar (análise semântica do frontmatter)
- Sugestões incorretas podem ser irritantes se calibragem ruim
- Depende de skills terem bom frontmatter (description, when-to-use)

**Compatibility:** Integra naturalmente nos steps existentes de plan.md e apply.md

## Comparison

| Critério | Option A (Manual) | Option B (Auto + Confirm) |
|----------|-------------------|---------------------------|
| Esforço de implementação | S (1 fase simples) | M (1 fase, mais files) |
| Valor para o usuário | Médio (tracking) | Alto (proativo + tracking) |
| Diferencial vs Paul | Nenhum (clone) | Forte (inovação) |
| Risco de irritar user | Baixo | Baixo (confirmation flow) |
| Manutenção | Baixa | Média (matching heuristics) |
| Escalabilidade | Linear (manual) | Sublinear (auto-detect) |

## Recommendation

**Choice:** Option B — Auto-reconhecimento com confirmação
**Rationale:** É o diferencial real do Teddy vs Paul. Transforma skill management de "manual e esquecível" para "proativo e confirmado". O confirmation flow mitiga o risco de sugestões erradas. Usuários de Claude Code tipicamente têm skills com bom frontmatter (description obrigatório), então a base para matching semântico já existe.
**Confidence:** HIGH — O pattern de auto-detect + confirm é bem estabelecido (IDEs fazem isso com imports/plugins). Paul já validou o modelo base de enforcement.

## Arquitetura do Sistema

### 3 Camadas de Auto-Reconhecimento

```
DISCOVERY (o que existe?)
  └─ Scan ~/.claude/commands/ recursivamente
  └─ Ler frontmatter: description, when-to-use (se existir)
  └─ Categorizar: design, backend, testing, devops, etc.
  └─ Cache em FLOWS.md para não re-scanear toda hora

MATCHING (o que é relevante?)
  └─ Cruzar PROJECT.md (stack, constraints) com skill metadata
  └─ Cruzar ROADMAP.md (fase atual, goals) com skill triggers
  └─ Cruzar tasks do PLAN.md com skill when-to-use
  └─ Gerar sugestões com confidence: HIGH / MEDIUM / LOW
  └─ Match reasons: "Stack inclui React → /frontend-design"

CONFIRMATION (user valida)
  └─ Apresentar tabela de sugestões
  └─ User aceita/rejeita/ajusta cada sugestão
  └─ Gravar em FLOWS.md com metadata:
     - match_reason (porque foi sugerido)
     - confidence (HIGH/MEDIUM/LOW)
     - user_confirmed (true/false)
     - user_rejected (true/false — para não sugerir de novo)
```

### Componentes a Implementar

| Componente | Tipo | Arquivo |
|------------|------|---------|
| /teddy:flows | command | src/commands/flows.md |
| FLOWS.md template | template | src/templates/FLOWS.md |
| detect_required_skills step | integração | src/commands/plan.md (novo step) |
| verify_required_skills step | integração | src/commands/apply.md (novo step) |
| audit_skill_usage step | integração | src/commands/unify.md (novo step) |
| Skill matching reference | framework | src/frameworks/skill-flows.md |

### Subcommands do /teddy:flows

| Subcommand | Ação |
|------------|------|
| (sem argumento) | Config interativa completa com auto-discovery + confirmation |
| add | Quick-add de um skill específico |
| audit | Verificar skills da fase atual vs declaração |
| list | Mostrar configuração atual |

### Integração no Loop Existente

```
/teddy:plan
  └─ Novo step "detect_required_skills" (antes de validate_plan):
     → Lê FLOWS.md (se existir)
     → Analisa tasks do plano
     → Sugere skills adicionais baseado no conteúdo
     → User confirma → grava no PLAN.md seção <skills>

/teddy:apply
  └─ Novo step "verify_required_skills" (priority: blocking, após validate_approval):
     → Se PLAN.md tem <skills> com required:
       → Verifica se skills estão loaded na sessão
       → Se faltam: BLOQUEIA com lista de missing skills
       → User pode: load skills OU override (logged em STATE.md)

/teddy:unify
  └─ Novo step "audit_skill_usage" (após merge, antes de cleanup):
     → Cruza FLOWS.md + PLAN.md <skills> com uso real
     → Gaps documentados em SUMMARY.md (Deviations)
     → Warn, don't block — UNIFY sempre completa
```

### Formato do FLOWS.md

```markdown
# Flows: {project-name}

## Discovered Skills
| Skill | Description | Category | Source |
|-------|-------------|----------|--------|
| /frontend-design | UI component design | design | ~/.claude/commands/ |
| /revops-expert | Persuasion copywriting | content | ~/.claude/commands/ |

## Project Mappings
| Work Type | Skill | Priority | Trigger | Confidence | Confirmed |
|-----------|-------|----------|---------|------------|-----------|
| UI components | /frontend-design | required | HTML/CSS tasks | HIGH | yes |
| Marketing copy | /revops-expert | optional | Landing pages | MEDIUM | yes |
| API routes | /backend-patterns | required | API tasks | HIGH | yes |

## Rejected Suggestions
| Skill | Reason Suggested | Reason Rejected | Date |
|-------|-----------------|-----------------|------|
| /mobile-design | Stack includes React | Web-only project | 2026-03-25 |

## Phase Overrides
| Phase | Additional Skills | Notes |
|-------|-------------------|-------|
| 03 | /perf-audit | Performance phase |

## Amendment History
| Date | Change | Reason |
|------|--------|--------|
```

## Impact on Planning

- v0.6.0 milestone com 1 fase (7-8 tasks no total)
- 6 arquivos novos/modificados
- 3 integrações em commands existentes (plan, apply, unify)
- 1 novo command (/teddy:flows)
- 1 novo framework (skill-flows.md)
- 1 novo template (FLOWS.md)
- Bumps: package.json, PROJECT.md, ROADMAP.md, README.md

## Open Questions

- Nenhuma — direção aprovada com escopo claro.

---
*Explored: 2026-03-25*
*Feeds into: v0.6.0 Skill Flows milestone*
