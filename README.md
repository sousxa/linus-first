<div align="center">

# 💸 linus-first

**Dashboard financeiro pessoal — simples, rápido e intuitivo.**

🔗 **[sousxa.github.io/linus-first](https://sousxa.github.io/linus-first/)**

</div>

---

## O que é

Um painel pra organizar a vida financeira do mês sem planilha:

- 💰 **Renda mensal** (salário) e saldo em conta.
- 🔁 **Saídas fixas** (assinaturas, contas) com botão de "marcar como pago".
- 🧾 **Parcelas** com contador regressivo (ex: `3/12`).
- 💳 **Cartões** de crédito (limite/fatura) e débito (saldo).
- ➕➖ **Entradas e saídas avulsas**.
- 🧮 **Calculadora "e se eu gastar X"** — mostra como fica o saldo *antes* de gastar.
- 📅 **Tabela de previsibilidade** mês a mês: 🟢 sobra / 🟡 apertado / 🔴 vai zerar.

## Privacidade

100% no seu navegador. **Não tem servidor.** Os dados ficam **criptografados** (AES-GCM,
chave derivada da sua senha via PBKDF2) no `localStorage`. A senha **nunca** é salva nem enviada
pela rede — sem ela, os dados são ilegíveis.

> Sendo um site estático público, o código é aberto; a proteção real está em cifrar os **dados**,
> e é exatamente isso que o app faz.

## Rodando local

```bash
npm install
npm run dev
```

Outros comandos: `npm test`, `npm run typecheck`, `npm run build`, `npm run deploy`.

## Como o projeto é construído

Toda mudança passa pela esteira **`ship-it`** (UX → UI → Testes → Security → QA → PR → Merge).
Veja [`docs/WORKFLOW.md`](docs/WORKFLOW.md) e as skills em [`.claude/skills/`](.claude/skills/).

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Vitest · WebCrypto.

## Licença

MIT.
