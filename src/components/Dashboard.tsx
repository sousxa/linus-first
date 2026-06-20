// O painel (estado desbloqueado). Cada feature da esteira adiciona sua seção aqui.

export function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-lg font-semibold">Cofre aberto 🔓</p>
        <p className="mt-1 text-sm text-muted">
          As seções (renda, saídas fixas, parcelas, cartões, calculadora e previsão) chegam pelos
          próximos PRs.
        </p>
      </div>
    </div>
  )
}
