---
name: ui-polish
description: Estágio 2 (UI) da esteira ship-it do linus-first. Garante consistência visual, uso dos tokens Tailwind, tipografia, espaçamento e micro-interações em qualquer componente novo ou alterado. Acione depois do ux-review e antes de tests.
---

# ui-polish — estágio UI

Deixa a interface coesa e agradável, sem reinventar padrões a cada tela.

## Checklist
- [ ] Usa os tokens do tema (cores `bg-surface`, `text-muted`, etc.) em vez de cores soltas.
- [ ] Espaçamento e raio de borda consistentes com os cards existentes.
- [ ] Verde = safe, amarelo = apertado, vermelho = perigo — sempre o mesmo significado.
- [ ] Tipografia: números financeiros tabulares e legíveis; hierarquia clara de título/valor.
- [ ] Micro-interações sutis (hover, transições) sem exagero; nada que atrapalhe a leitura rápida.
- [ ] Dark mode consistente em toda a tela.
- [ ] Componentes reutilizados (Card, Botão, Input) em vez de markup duplicado.

## Saída esperada
Componente alinhado ao design system do projeto. Siga pro estágio `tests`.
