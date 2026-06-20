---
name: pr-flow
description: Estágio 6 (PR) da esteira ship-it do linus-first. Cria branch, faz conventional commits, classifica a mudança como feature (feat) ou fix, e abre o Pull Request no GitHub com a label correta. Acione depois de qa e antes de merge-flow.
---

# pr-flow — estágio PR

Transforma o trabalho validado em um PR rastreável e **classificado**.

## Classificação
- **feat** → nova funcionalidade ou capacidade. Label `feature`.
- **fix** → correção de comportamento/bug. Label `fix`.
- (suporte: `chore`, `docs`, `refactor`, `test` quando aplicável.)

## Passos
```bash
git checkout -b feat/<slug>           # ou fix/<slug>
git add -A
git commit -m "feat: <descrição curta no imperativo>"
git push -u origin HEAD
gh pr create --title "feat: ..." --body "<o que muda e por quê>" --label feature
```

## Regras
- Título = conventional commit (`feat:` / `fix:`).
- Body explica **o que** muda e **por quê**, e como testar.
- Uma label de tipo por PR (`feature` ou `fix`).
- PR pequeno e focado. Vincule o estágio onde algo foi validado.

Aberto e classificado → siga pro `merge-flow`.
