---
name: ux-review
description: Estágio 1 (UX) da esteira ship-it do linus-first. Revisa fluxo, intuitividade, comportamento mobile e acessibilidade de qualquer mudança de interface antes da implementação visual. Acione depois de planejar e antes do ui-polish.
---

# ux-review — estágio UX

Garante que a mudança seja **simples, rápida e intuitiva** (os 3 pilares do projeto).

## Checklist
- [ ] O usuário entende a tela em < 5s, sem instrução?
- [ ] O caminho pra ação principal tem o menor número de cliques possível?
- [ ] Funciona bem no **mobile** (uma mão, telas estreitas)?
- [ ] Estados vazios, de erro e de carregamento estão previstos?
- [ ] Valores em dinheiro aparecem formatados em BRL (R$) e com sinal claro (entrada/saída)?
- [ ] Feedback imediato após cada ação (marcar pago, lançar gasto, etc.)?
- [ ] Acessibilidade: foco visível, labels nos inputs, contraste suficiente, navegação por teclado?

## Saída esperada
Uma lista curta de ajustes de fluxo/copy antes de partir pro visual. Se nada a mudar, registre
"UX ok" e siga pro `ui-polish`.
