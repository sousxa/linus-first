# linus-first

Dashboard financeiro pessoal — simples, rápido e intuitivo. SPA React, 100% client-side,
dados **criptografados** no navegador. Publicado em https://sousxa.github.io/linus-first/.

## Regra de ouro: toda mudança passa pela esteira

**Antes de qualquer alteração no projeto**, acione a skill **`ship-it`** e siga a trilha:

> UX → UI → Testes → Security → QA → PR → Merge

Nunca commite direto na `main`. Sempre `branch → PR → merge`. PRs são classificados como
`feat` (label `feature`) ou `fix` (label `fix`). As skills de cada estágio estão em
`.claude/skills/`. A trilha está documentada em `docs/WORKFLOW.md`.

## Stack
- React 18 + TypeScript + Vite + Tailwind CSS 3.
- Estado em `localStorage`, cifrado com WebCrypto (AES-GCM 256 + PBKDF2). Sem backend.
- Testes: Vitest. Deploy: branch `gh-pages` via `npm run deploy`.

## Comandos
```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes (vitest run)
npm run typecheck  # checagem de tipos
npm run build      # build de produção (base=/linus-first/)
npm run deploy     # build + publica no gh-pages
```

## Princípios
- Lógica financeira pura mora em `src/lib/finance.ts` e **tem teste**.
- Cripto em `src/lib/vault.ts`; a senha do usuário nunca é persistida nem trafega na rede.
- Verde = sobra/safe, amarelo = apertado, vermelho = zera/negativo (significado fixo no app todo).
- Valores sempre em BRL (R$), com sinal claro de entrada/saída.
