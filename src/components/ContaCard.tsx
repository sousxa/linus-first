import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { MoneyInput } from './ui/MoneyInput'

export function ContaCard({ className }: { className?: string }) {
  const { data, update } = useData()
  return (
    <Card title="Conta (débito)" icon="🏦" className={className}>
      <MoneyInput
        label="Saldo atual em conta"
        value={data.saldoDebito}
        onValue={(n) => update((d) => ({ ...d, saldoDebito: n }))}
      />
      <p className="mt-2 text-[11px] text-muted">É o ponto de partida da sua previsão.</p>
    </Card>
  )
}
