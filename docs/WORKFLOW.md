# Trilha de trabalho (workflow) do `linus-first`

Toda mudança no projeto segue esta esteira, orquestrada pela skill **`ship-it`**
(`.claude/skills/ship-it/SKILL.md`). Cada estágio tem uma skill própria.

```
        ┌─────────┐
ideia → │ 0 Plan  │  classifica feat/fix, cria a branch
        └────┬────┘
             ▼
        ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────────┐
        │ 1 UX    │ → │ 2 UI    │ → │ 3 Tests │ → │ 4 Security   │
        │ux-review│   │ui-polish│   │  tests  │   │security-check│
        └─────────┘   └─────────┘   └─────────┘   └──────┬───────┘
                                                          ▼
                          ┌─────────┐   ┌─────────┐   ┌─────────┐
                          │ 7 Merge │ ← │ 6 PR    │ ← │ 5 QA    │
                          │merge-flow│  │ pr-flow │   │   qa    │
                          └────┬────┘   └─────────┘   └─────────┘
                               ▼
                       deploy → https://sousxa.github.io/linus-first/
```

## Estágios

| # | Estágio  | Skill            | Resultado |
|---|----------|------------------|-----------|
| 0 | Plan     | `ship-it`        | Pedido entendido, tipo (`feat`/`fix`) definido, branch criada |
| 1 | UX       | `ux-review`      | Fluxo simples, intuitivo, mobile e acessível |
| 2 | UI       | `ui-polish`      | Visual coeso com o design system |
| 3 | Tests    | `tests`          | Lógica financeira/cripto coberta e verde |
| 4 | Security | `security-check` | Sem segredos commitados; cripto sã |
| 5 | QA       | `qa`             | App validado ponta a ponta |
| 6 | PR       | `pr-flow`        | PR aberto, conventional commit, label `feature`/`fix` |
| 7 | Merge    | `merge-flow`     | Merge na `main` + deploy + URL conferida |

## Convenções
- Branches: `feat/<slug>` ou `fix/<slug>`.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Labels de PR: `feature` (azul) e `fix` (vermelho).
- Deploy: branch `gh-pages` (sem GitHub Actions, pois o token ativo não tem escopo `workflow`).

## Histórico de PRs (trilha)
A trilha de construção inicial está nos PRs do repositório — cada feature e cada fix entrou por
um PR classificado, do scaffold à tabela de previsibilidade.
