---
name: security-check
description: Estágio 4 (Security) da esteira ship-it do linus-first. Verifica que nenhum segredo/senha foi commitado, que a criptografia local (WebCrypto AES-GCM + PBKDF2) está correta, e checa dependências. Acione depois de tests e antes de qa.
---

# security-check — estágio Security

O projeto é pessoal e público; a proteção real está em **cifrar os dados**, não em esconder código.

## Checklist
- [ ] **Nenhuma senha, chave ou dado financeiro** versionado no git (`git grep` por termos sensíveis).
- [ ] A senha do usuário **nunca** é salva em `localStorage`, cookie ou enviada pela rede.
- [ ] Cripto: `AES-GCM 256` com `IV` aleatório por gravação; chave derivada via `PBKDF2` (SHA-256, ≥150k iterações, `salt` aleatório persistido junto do ciphertext).
- [ ] Senha errada → `decrypt` lança erro (auth tag do GCM), sem vazar dados.
- [ ] A chave derivada vive só em memória (ref/estado), some ao recarregar/travar.
- [ ] Sem chamadas de rede com dados do usuário (app é 100% client-side).
- [ ] `npm audit` sem vulnerabilidade crítica conhecida nas deps de produção.

## Comandos
```bash
git grep -nEi "senha|password|secret|R\\$ ?[0-9]" -- ':!*.md' || echo "nada suspeito"
npm audit --omit=dev
```

## Regra
Achou segredo commitado? **Pare**, remova do histórico e troque a credencial antes de seguir.
Tudo ok → siga pro `qa`.
