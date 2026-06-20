---
name: merge-flow
description: Estágio 7 (Merge) da esteira ship-it do linus-first. Faz o merge do PR aprovado na main, publica o site no GitHub Pages (branch gh-pages) e confirma que a URL https://sousxa.github.io/linus-first/ está no ar. Último estágio da trilha.
---

# merge-flow — estágio Merge & Deploy

Fecha o ciclo: integra na `main` e coloca a mudança no ar.

## Passos
```bash
gh pr merge <num> --merge --delete-branch   # integra e limpa a branch
git checkout main && git pull origin main   # sincroniza local
npm run deploy                              # build + publica no branch gh-pages
curl -I https://sousxa.github.io/linus-first/   # espera HTTP 200
```

## Notas
- O deploy do Pages é **a partir do branch `gh-pages`** (método legado), porque o token ativo
  não tem o escopo `workflow` pra GitHub Actions. Só exige escopo `repo`.
- O Pages pode levar ~1 min pra propagar a primeira vez.
- Se liberar `workflow` (`gh auth refresh -s workflow`), dá pra migrar pra CI em Actions.

## Regra
Só faça merge com tudo dos estágios anteriores ok. Depois do deploy, **confirme o link no ar**.
Ciclo concluído.
