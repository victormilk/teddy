# Exploration: Polish & Automation (v0.7)

**Date:** 2026-03-25
**Depth:** Standard
**Confidence:** HIGH
**Decision it informs:** Scope and phasing do milestone v0.7

## Question

Após validação externa bem-sucedida do framework (v0.6), qual o próximo passo para polir a experiência antes de crescer?

## Findings

### State Analysis

- v0.1–v0.6 completos, 7 fases (01–07) entregues
- 88/88 testes passando, zero TODOs/FIXMEs
- Zero dependências desatualizadas
- Validação externa realizada com resultado positivo

### Issues Identified

| # | Category    | Finding                                                | Priority | Effort |
|---|-------------|--------------------------------------------------------|----------|--------|
| 1 | Bug         | install.js help listing missing 3 commands             | HIGH     | S      |
|   |             | (amend-plan, rollback, flows)                          |          |        |
| 2 | Test Gap    | Sem teste de paridade install.js ↔ src/commands/       | HIGH     | S      |
| 3 | Improvement | Explore redesign: tornar proativo (ler state primeiro) | LOW      | M      |
| 4 | Improvement | Sem CHANGELOG ou release notes system                  | LOW      | S      |
| 5 | Polish      | Revisão geral de markdowns: formatação, typos,         | MEDIUM   | S      |
|   |             | consistência entre documentos                          |          |        |

## Discussion Summary

- **Round 1:** Apresentei 6 findings. Usuário confirmou validação externa já feita com bom resultado. Selecionou itens #1, #2, #5, #6 + revisão de markdowns. CI/CD adiado.
- **Round 2:** Convergência em "v0.7 — Polish & Automation" com 2-3 fases estimadas.
- **Aprovação:** Confirmada pelo usuário.

## Recommendation

**Direction:** v0.7 — Polish & Automation

**Scope:**
1. Fix install.js listing (amend-plan, rollback, flows não aparecem no output)
2. Teste de paridade para garantir install.js ↔ src/commands/ sincronizados
3. Revisão geral de markdowns (formatação, typos, consistência)
4. Explore redesign (proativo: ler .teddy/ state antes de analisar codebase)
5. CHANGELOG + release notes system

**Excluded:**
- CI/CD pipeline (candidato a v0.8)
- Validação externa (já realizada com sucesso)

**Confidence:** HIGH — escopo claro, sem dependências externas, baseado em análise real do codebase.

## Impact on Planning

- Milestone v0.7 com 2-3 fases estimadas
- Phase 08: Bug fixes + test gaps + markdown polish (items 1-3)
- Phase 09: Explore redesign (item 4)
- Phase 10: CHANGELOG + release notes (item 5)
- Todas as mudanças são internas ao framework, sem breaking changes

## Open Questions

- Nenhuma — escopo e prioridades claros.

---
*Explored: 2026-03-25*
*Feeds into: v0.7 milestone planning*
