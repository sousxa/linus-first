---
name: tests
description: Estágio 3 (Testes) da esteira ship-it do linus-first. Escreve e roda testes unitários (Vitest) para a lógica financeira pura (saldo, calculadora "e se eu gastar", projeção mês a mês) e para a cripto. Acione depois do ui-polish e antes de security-check.
---

# tests — estágio Testes

A lógica financeira é o núcleo do app: ela precisa de teste. UI pode ser validada manualmente
no estágio QA, mas **cálculo e cripto têm que ter teste automatizado**.

## O que cobrir
- `src/lib/finance.ts`: saldo atual, motor da calculadora, projeção mês a mês (cores verde/amarelo/vermelho), arredondamento de centavos.
- `src/lib/vault.ts`: encrypt→decrypt roundtrip; senha errada falha; salt/IV aleatórios.

## Como rodar
```bash
npm test          # roda tudo uma vez (vitest run)
npm run test:watch
npm run typecheck # checagem de tipos (tsc --noEmit)
```

## Regra
Toda função pura nova em `src/lib/` entra com pelo menos um teste de caso feliz e um de borda
(valor zero, negativo, virada de mês). Só siga pro `security-check` com a suíte **verde**.
