---
name: ship-it
description: Esteira obrigatória do projeto linus-first. Use SEMPRE que for fazer QUALQUER alteração no projeto (nova feature, correção, ajuste de UI, refactor, doc). Orquestra os estágios UX, UI, Testes, Security, QA, PR e Merge na ordem certa, garantindo qualidade e uma trilha de PRs classificados (feat/fix). Acione no início de toda tarefa.
---

# ship-it — a esteira do `linus-first`

Esta é a skill **orquestradora**. Toda mudança no projeto passa por aqui. Ela não faz o
trabalho sozinha: ela define a **ordem dos estágios** e chama a skill de cada estágio.

## Quando acionar
No **começo de qualquer tarefa** no `linus-first`: criar feature, corrigir bug, mexer em UI,
refatorar, atualizar doc. Se está tocando no projeto, comece por aqui.

## A trilha (ordem dos estágios)

Execute os estágios **em ordem**. Cada um tem sua própria skill — invoque-a quando chegar nele.

| # | Estágio   | Skill              | O que faz |
|---|-----------|--------------------|-----------|
| 0 | Planejar  | (este arquivo)     | Entender o pedido, classificar `feat` vs `fix`, criar branch |
| 1 | UX        | `ux-review`        | Fluxo, intuitividade, mobile, acessibilidade |
| 2 | UI        | `ui-polish`        | Consistência visual, tokens Tailwind, micro-interações |
| 3 | Testes    | `tests`            | Escrever/rodar testes (Vitest) da lógica afetada |
| 4 | Security  | `security-check`   | Sem segredos commitados, sanidade da cripto, deps |
| 5 | QA        | `qa`               | Rodar o app e validar a feature ponta a ponta |
| 6 | PR        | `pr-flow`          | Conventional commit, label `feature`/`fix`, abrir PR |
| 7 | Merge     | `merge-flow`       | Checks ok → merge → deploy Pages → conferir URL |

## Regras
- **Nunca** commite direto na `main`. Sempre branch → PR → merge.
- Branches: `feat/<slug>` ou `fix/<slug>`.
- Não pule o estágio de **security** nem o de **tests** quando mexer em lógica financeira ou cripto.
- O deploy só acontece no estágio Merge, depois que tudo passou.
- Mantenha cada PR pequeno e com um propósito só.

## Atalho mental
> UX → UI → Testes → Security → QA → PR → Merge. Sempre nessa ordem.
