---
name: qa
description: Estágio 5 (QA) da esteira ship-it do linus-first. Roda o app de verdade e valida a feature ponta a ponta — criar/digitar senha, lançar dados, calculadora, cores da tabela de previsão. Acione depois de security-check e antes de pr-flow.
---

# qa — estágio QA

Validação manual ponta a ponta no app rodando (`npm run dev`).

## Roteiro base (ajuste ao que mudou)
1. **Cadeado**: primeiro acesso pede criar senha; recarregar pede a senha; senha errada é rejeitada.
2. **Renda**: definir salário reflete nos cálculos.
3. **Saídas fixas**: criar, marcar como pago no mês, desmarcar.
4. **Parcelas**: criar uma 3/12, marcar pago decrementa o contador.
5. **Cartões**: crédito (limite/fatura) e débito (saldo) somam certo.
6. **Calculadora "e se eu gastar"**: valor + conta mostra o saldo resultante antes de gastar.
7. **Tabela de previsibilidade**: meses ficam verde quando sobra e vermelho quando zera/negativa.
8. **Build**: `npm run build && npm run preview` abre com o `base` correto (`/linus-first/`).

## Regra
Anote o que testou e o resultado. Bug? Volte ao estágio adequado. Tudo passou → `pr-flow`.
